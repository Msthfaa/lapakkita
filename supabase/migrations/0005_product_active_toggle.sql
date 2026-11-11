-- =========================================================
-- LapakKita: Migrasi 0005 - Toggle Aktif / Nonaktif Produk
-- =========================================================

-- 1. Tambahkan kolom is_active pada tabel products
alter table public.products
  add column if not exists is_active boolean not null default true;

create index if not exists products_is_active_idx on public.products(is_active);

-- 2. Perbarui trigger guard_product_update:
-- Logika:
-- - Jika penjual HANYA mengubah status is_active (misal: mematikan sementara atau mengaktifkan kembali etalase),
--   maka status moderasi (status & alasan_tolak) TIDAK di-reset ke 'pending' (tetap approved/pending/rejected yang sudah ada).
-- - Jika penjual MENGUBAH konten produk (nama, deskripsi, harga, foto, kategori, daerah, varian, dll.),
--   maka status moderasi dikembalikan ke 'pending' agar admin dapat memverifikasi ulang perubahan konten.
create or replace function public.guard_product_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  is_content_changed boolean;
begin
  if public.is_admin() then
    return new;
  end if;

  -- Kunci kolom yang tidak boleh diubah langsung oleh penjual
  new.seller_id := old.seller_id;
  new.is_featured := old.is_featured;

  -- Cek apakah konten produk mengalami perubahan
  is_content_changed := (
    new.nama is distinct from old.nama or
    new.deskripsi is distinct from old.deskripsi or
    new.harga is distinct from old.harga or
    new.foto_url is distinct from old.foto_url or
    new.foto_urls is distinct from old.foto_urls or
    new.satuan is distinct from old.satuan or
    new.kondisi_stok is distinct from old.kondisi_stok or
    new.metode_pengiriman is distinct from old.metode_pengiriman or
    new.varian is distinct from old.varian or
    new.no_izin is distinct from old.no_izin or
    new.category_id is distinct from old.category_id or
    new.region_id is distinct from old.region_id or
    new.no_wa is distinct from old.no_wa or
    new.alamat is distinct from old.alamat
  );

  if is_content_changed then
    new.status := 'pending';
    new.alasan_tolak := null;
  else
    -- Jika hanya mengubah is_active, pertahankan status moderasi yang ada
    new.status := old.status;
    new.alasan_tolak := old.alasan_tolak;
  end if;

  return new;
end;
$$;
