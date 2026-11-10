-- =========================================================
-- LapakKita: Tambah Master Daerah (Regions) & Kolom region_id
-- =========================================================

-- 1. Buat Tabel Master Daerah
create table if not exists public.regions (
  id serial primary key,
  nama text not null unique
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.regions enable row level security;

-- Publik bisa melihat daftar daerah
drop policy if exists "regions_select_all" on public.regions;
create policy "regions_select_all" on public.regions
  for select using (true);

-- Hanya admin yang bisa menambah, mengubah, dan menghapus daerah
drop policy if exists "regions_admin_write" on public.regions;
create policy "regions_admin_write" on public.regions
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 3. Tambahkan kolom region_id ke tabel products
alter table public.products
  add column if not exists region_id int references public.regions(id) on delete set null;

create index if not exists products_region_idx on public.products(region_id);

-- 4. Dummy / Seed Data Awal Daerah
insert into public.regions (nama) values
  ('Surabaya'),
  ('Malang'),
  ('Sidoarjo'),
  ('DKI Jakarta'),
  ('Bandung'),
  ('Semarang'),
  ('D.I. Yogyakarta'),
  ('Surakarta (Solo)'),
  ('Denpasar (Bali)'),
  ('Medan'),
  ('Makassar')
on conflict (nama) do nothing;
