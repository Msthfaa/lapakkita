-- =========================================================
-- LapakKita: Seed Data Contoh Demo Lengkap
-- =========================================================
-- Petunjuk Penggunaan:
-- Jalankan skrip ini di Supabase SQL Editor SETELAH tabel
-- dan migrasi 0001_init.sql & 0002_add_regions.sql dijalankan.

do $$
declare
  seller1_id uuid;
  seller2_id uuid;
  cat_makanan int;
  cat_minuman int;
  cat_fashion int;
  cat_kerajinan int;
  cat_pertanian int;
  reg_surabaya int;
  reg_malang int;
  reg_jogja int;
  reg_solo int;
  reg_semarang int;
begin
  -- Cari penjual pertama dan kedua dari tabel profiles
  select id into seller1_id from public.profiles order by created_at asc limit 1;
  select id into seller2_id from public.profiles order by created_at desc limit 1;

  if seller1_id is null then
    raise notice 'Belum ada akun terdaftar. Silakan daftar minimal 1 akun di halaman /daftar sebelum menjalankan seed.';
    return;
  end if;

  if seller2_id is null then
    seller2_id := seller1_id;
  end if;

  -- Dapatkan id kategori
  select id into cat_makanan from public.categories where nama = 'Makanan' limit 1;
  select id into cat_minuman from public.categories where nama = 'Minuman' limit 1;
  select id into cat_fashion from public.categories where nama = 'Fashion' limit 1;
  select id into cat_kerajinan from public.categories where nama = 'Kerajinan' limit 1;
  select id into cat_pertanian from public.categories where nama = 'Pertanian' limit 1;

  -- Dapatkan id daerah
  select id into reg_surabaya from public.regions where nama = 'Surabaya' limit 1;
  select id into reg_malang from public.regions where nama = 'Malang' limit 1;
  select id into reg_jogja from public.regions where nama = 'D.I. Yogyakarta' limit 1;
  select id into reg_solo from public.regions where nama = 'Surakarta (Solo)' limit 1;
  select id into reg_semarang from public.regions where nama = 'Semarang' limit 1;

  -- 1. Produk Approved (Beberapa Unggulan)
  insert into public.products (seller_id, category_id, region_id, nama, deskripsi, harga, foto_url, no_wa, alamat, status, is_featured)
  values
  (
    seller1_id,
    cat_makanan,
    reg_surabaya,
    'Keripik Pisang Cokelat Lumer 250gr',
    'Keripik pisang renyah berbalut cokelat premium lumer. Menggunakan pisang kepok pilihan khas Lampung, tanpa pemanis buatan dan tanpa bahan pengawet. Cocok untuk camilan santai keluarga.',
    25000,
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80',
    '6281234567890',
    'Kec. Sukolilo',
    'approved',
    true
  ),
  (
    seller1_id,
    cat_minuman,
    reg_malang,
    'Kopi Robusta Dampit Asli 200gr',
    'Biji kopi petik merah dari lereng Gunung Semeru Dampit, dipanggang dengan profil medium dark roast. Aroma cokelat dan karamel yang pekat dengan crema tebal alami.',
    38000,
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    '6281234567890',
    'Kec. Dampit',
    'approved',
    true
  ),
  (
    seller2_id,
    cat_kerajinan,
    reg_jogja,
    'Tas Anyaman Bambu Tradisional',
    'Tas kerajinan tangan dari anyaman bambu alami yang dihaluskan. Kuat, ramah lingkungan, dan modis untuk belanja atau jalan santai. Tersedia variasi warna natural.',
    65000,
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    '6281298765432',
    'Kec. Kasihan, Bantul',
    'approved',
    true
  ),
  (
    seller2_id,
    cat_fashion,
    reg_solo,
    'Batik Cap Motif Parang Klasik',
    'Kain katun primissima halus ukuran 2 x 1.15 meter dengan pewarnaan cap tradisional tahan luntur. Adem di kulit dan cocok dibuat kemeja atau dress formal.',
    120000,
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
    '6281298765432',
    'Kampung Batik Laweyan',
    'approved',
    true
  ),
  (
    seller1_id,
    cat_makanan,
    reg_malang,
    'Sambal Bawang Cumi Asin Pedas 150gr',
    'Sambal racikan cabai rawit segar dengan potongan cumi asin gurih melimpah. Dimasak tanak tahan hingga 1 bulan di suhu ruang sebelum kemasan dibuka.',
    28000,
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80',
    '6281234567890',
    'Kec. Lowokwaru',
    'approved',
    false
  ),
  (
    seller2_id,
    cat_pertanian,
    reg_semarang,
    'Madu Hutan Randu Murni 500ml',
    'Madu asli panen lebah madu dari perkebunan bunga randu. Tanpa proses pemanasan atau campuran gula, menjaga enzim alami dan khasiat untuk daya tahan tubuh.',
    85000,
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
    '6281298765432',
    'Kawasan Pegunungan Ungaran',
    'approved',
    false
  ),
  (
    seller1_id,
    cat_minuman,
    reg_jogja,
    'Wedang Uwuh Herbal Komplit 10 Sachet',
    'Minuman rempah khas Imogiri dengan campuran secang, jahe, cengkeh, kayu manis, dan gula batu. Menghangatkan tenggorokan dan menyegarkan badan.',
    22000,
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    '6281234567890',
    'Kec. Imogiri',
    'approved',
    false
  ),
  (
    seller2_id,
    cat_kerajinan,
    reg_semarang,
    'Piring Kayu Jati Solid Food Grade',
    'Piring makan estetik berdiameter 20 cm terbuat dari kayu jati perhutani tua dengan finishing beeswax aman untuk makanan.',
    45000,
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    '6281298765432',
    'Sentra Ukir & Kayu',
    'approved',
    false
  ),
  -- 2. Produk Pending (untuk demo moderasi / ACC admin)
  (
    seller1_id,
    cat_makanan,
    reg_malang,
    'Roti Sobek Keju Susu Homemade',
    'Roti sobek empuk tekstur lembut dengan isian parutan keju cheddar melimpah dan susu manis gurih. Dibuat fresh setiap pagi berdasarkan pesanan.',
    20000,
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    '6281234567890',
    'Kec. Klojen',
    'pending',
    false
  ),
  (
    seller2_id,
    cat_fashion,
    reg_surabaya,
    'Sandal Kulit Pria Asli Handcrafted',
    'Sandal slip-on kasual dari kulit sapi asli dengan sol karet anti-slip empuk dan awet dipakai bertahun-tahun.',
    95000,
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
    '6281298765432',
    'Kec. Wonokromo',
    'pending',
    false
  ),
  -- 3. Produk Rejected (untuk demo penolakan & fitur perbaiki penjual)
  (
    seller1_id,
    cat_makanan,
    reg_surabaya,
    'Basreng Pedas Daun Jeruk 500gr',
    'Bakso goreng stik renyah berbalut bumbu cabai pedas ekstra dan aroma harum daun jeruk segar.',
    30000,
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
    '6281234567890',
    'Kec. Rungkut',
    'rejected',
    false
  );

  -- Set alasan tolak untuk produk rejected
  update public.products
  set alasan_tolak = 'Foto produk buram dan deskripsi belum mencantumkan tanggal masa kedaluwarsa atau izin PIRT. Mohon perbaiki dan lengkapi informasinya.'
  where nama = 'Basreng Pedas Daun Jeruk 500gr';

  raise notice 'Seed data 11 produk LapakKita dengan kategori dan daerah berhasil dimasukkan.';
end $$;
