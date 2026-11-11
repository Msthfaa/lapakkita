-- =========================================================
-- LapakKita: Migrasi 0004 - Galeri Multi-Foto & Atribut Detail Produk
-- =========================================================

-- 1. Tambahkan kolom pendukung multi-foto dan atribut periklanan UMKM
alter table public.products
  add column if not exists foto_urls text[] not null default '{}',
  add column if not exists satuan text not null default 'Pcs',
  add column if not exists kondisi_stok text not null default 'ready_stock' check (kondisi_stok in ('ready_stock', 'pre_order', 'stok_terbatas')),
  add column if not exists metode_pengiriman text[] not null default '{"Lokal"}',
  add column if not exists varian text,
  add column if not exists no_izin text;

-- 2. Sinkronkan data produk lama agar foto_url masuk ke foto_urls
update public.products
set foto_urls = array[foto_url]
where (foto_urls is null or cardinality(foto_urls) = 0) and foto_url is not null;
