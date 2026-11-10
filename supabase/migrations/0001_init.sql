-- =========================================================
-- LapakKita: skema awal
-- =========================================================

-- ---------- TABEL ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null default 'Penjual',
  role text not null default 'seller' check (role in ('seller', 'admin')),
  created_at timestamptz not null default now()
);

create table public.categories (
  id serial primary key,
  nama text not null unique
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  category_id int references public.categories(id) on delete set null,
  nama text not null check (char_length(nama) between 3 and 100),
  deskripsi text not null default '' check (char_length(deskripsi) <= 2000),
  harga int not null check (harga >= 0),
  foto_url text,
  no_wa text not null check (no_wa ~ '^62[0-9]{8,13}$'),
  alamat text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  alasan_tolak text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.wa_clicks (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index products_status_idx on public.products(status);
create index products_seller_idx on public.products(seller_id);
create index products_category_idx on public.products(category_id);
create index wa_clicks_product_idx on public.wa_clicks(product_id);

-- ---------- FUNGSI BANTU ----------
-- security definer agar tidak terjadi rekursi RLS saat cek role
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- Buat profil otomatis saat user mendaftar (role SELALU 'seller')
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nama, role)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'nama', ''), 'Penjual'), 'seller');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Penjaga update produk: non-admin tidak boleh mengubah status/unggulan/pemilik.
-- Setiap edit oleh penjual otomatis mengembalikan produk ke 'pending'.
create or replace function public.guard_product_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  new.seller_id := old.seller_id;
  new.is_featured := false;
  new.status := 'pending';
  new.alasan_tolak := null;
  return new;
end;
$$;

create trigger products_guard_update
  before update on public.products
  for each row execute function public.guard_product_update();

-- ---------- RLS ----------
alter table public.profiles   enable row level security;
alter table public.categories enable row level security;
alter table public.products   enable row level security;
alter table public.wa_clicks  enable row level security;

-- profiles
create policy "profiles_select_all" on public.profiles
  for select using (true);
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
-- role tidak boleh diubah lewat API: hanya kolom nama yang boleh diupdate
revoke update on public.profiles from anon, authenticated;
grant update (nama) on public.profiles to authenticated;

-- categories: publik baca, hanya admin tulis
create policy "categories_select_all" on public.categories
  for select using (true);
create policy "categories_admin_write" on public.categories
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- products
create policy "products_select" on public.products
  for select using (
    status = 'approved'
    or seller_id = (select auth.uid())
    or public.is_admin()
  );
create policy "products_insert_own" on public.products
  for insert to authenticated
  with check (
    seller_id = (select auth.uid())
    and status = 'pending'
    and is_featured = false
  );
create policy "products_update_own" on public.products
  for update to authenticated
  using (seller_id = (select auth.uid()))
  with check (seller_id = (select auth.uid()));
create policy "products_update_admin" on public.products
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "products_delete_own_or_admin" on public.products
  for delete to authenticated
  using (seller_id = (select auth.uid()) or public.is_admin());

-- wa_clicks: siapa pun boleh mencatat klik pada produk approved; penjual/admin boleh membaca
create policy "wa_clicks_insert_public" on public.wa_clicks
  for insert to anon, authenticated
  with check (exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'approved'
  ));
create policy "wa_clicks_select_owner_or_admin" on public.wa_clicks
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p
      where p.id = product_id and p.seller_id = (select auth.uid())
    )
  );

-- ---------- STORAGE ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images', 'product-images', true, 2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "product_images_insert_own_folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "product_images_update_own_folder" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "product_images_delete_own_folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- ---------- DATA AWAL ----------
insert into public.categories (nama) values
  ('Makanan'), ('Minuman'), ('Fashion'), ('Kerajinan'),
  ('Pertanian'), ('Jasa'), ('Lainnya')
on conflict (nama) do nothing;
