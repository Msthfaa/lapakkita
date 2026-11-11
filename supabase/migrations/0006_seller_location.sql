-- =========================================================
-- LapakKita: Migrasi 0006 - Lokasi & Koordinat Peta Penjual
-- =========================================================

-- 1. Tambahkan kolom lokasi & kontak pada tabel public.profiles
alter table public.profiles
  add column if not exists region_id integer references public.regions(id) on delete set null,
  add column if not exists alamat text,
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists no_wa text,
  add column if not exists deskripsi_toko text;

-- 2. Tambahkan kolom koordinat peta pada tabel public.products
alter table public.products
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

-- 3. Berikan hak update untuk kolom baru pada tabel profiles ke authenticated users
grant update (nama, region_id, alamat, latitude, longitude, no_wa, deskripsi_toko) on public.profiles to authenticated;

-- 4. Perbarui fungsi handle_new_user agar membaca metadata lokasi saat registrasi
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_region_id int;
  v_lat double precision;
  v_lng double precision;
begin
  v_region_id := nullif(new.raw_user_meta_data->>'region_id', '')::int;
  v_lat := nullif(new.raw_user_meta_data->>'latitude', '')::double precision;
  v_lng := nullif(new.raw_user_meta_data->>'longitude', '')::double precision;

  insert into public.profiles (id, nama, role, region_id, alamat, latitude, longitude, no_wa)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'nama', ''), 'Penjual'),
    'seller',
    v_region_id,
    nullif(new.raw_user_meta_data->>'alamat', ''),
    v_lat,
    v_lng,
    nullif(new.raw_user_meta_data->>'no_wa', '')
  );
  return new;
end;
$$;
