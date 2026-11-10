-- =========================================================
-- LapakKita: Migrasi 0003 - Manajemen Pengguna oleh Admin
-- =========================================================

-- 1. Berikan hak akses DELETE dan UPDATE pada tabel profiles untuk admin
drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update" on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "profiles_admin_delete" on public.profiles;
create policy "profiles_admin_delete" on public.profiles
  for delete to authenticated
  using (public.is_admin());

grant delete on public.profiles to authenticated;
grant update (nama, role) on public.profiles to authenticated;

-- 2. Fungsi membaca daftar pengguna beserta email dan jumlah produk
create or replace function public.admin_get_users()
returns table (
  id uuid,
  email text,
  nama text,
  role text,
  created_at timestamptz,
  product_count bigint
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'Akses ditolak: hanya administrator yang memiliki izin.';
  end if;

  return query
  select 
    p.id,
    coalesce(u.email::text, '-'),
    p.nama,
    p.role,
    p.created_at,
    count(pr.id)::bigint as product_count
  from public.profiles p
  left join auth.users u on u.id = p.id
  left join public.products pr on pr.seller_id = p.id
  group by p.id, u.email, p.nama, p.role, p.created_at
  order by p.created_at desc;
end;
$$;

-- 3. Fungsi memperbarui nama dan role pengguna oleh admin
create or replace function public.admin_update_user(
  target_user_id uuid,
  target_nama text,
  target_role text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Akses ditolak: hanya administrator yang memiliki izin.';
  end if;

  if target_role not in ('seller', 'admin') then
    raise exception 'Role pengguna tidak valid.';
  end if;

  update public.profiles
  set nama = trim(target_nama),
      role = target_role
  where id = target_user_id;
end;
$$;

-- 4. Fungsi menghapus pengguna beserta seluruh produk jualan miliknya
create or replace function public.admin_delete_user(target_user_id uuid)
returns json
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  deleted_products_count int;
begin
  if not public.is_admin() then
    raise exception 'Akses ditolak: hanya administrator yang memiliki izin.';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'Admin tidak dapat menghapus akunnya sendiri saat sedang login.';
  end if;

  -- Hitung produk yang akan dihapus
  select count(*) into deleted_products_count
  from public.products
  where seller_id = target_user_id;

  -- Hapus produk secara eksplisit (akan cascade wa_clicks)
  delete from public.products
  where seller_id = target_user_id;

  -- Hapus profile
  delete from public.profiles
  where id = target_user_id;

  -- Hapus dari auth.users agar user tidak bisa login lagi
  delete from auth.users
  where id = target_user_id;

  return json_build_object(
    'success', true,
    'deleted_products_count', deleted_products_count
  );
end;
$$;
