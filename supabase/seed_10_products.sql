-- =========================================================
-- LapakKita: Seed 10 Produk Dummy Realistis UMKM
-- =========================================================

do $$
declare
  seller_uuid uuid;
  cat_makanan int;
  cat_minuman int;
  cat_kerajinan int;
  cat_pertanian int;
  reg_surabaya int;
  reg_malang int;
  reg_sidoarjo int;
  reg_jakarta int;
  reg_bandung int;
  reg_semarang int;
  reg_jogja int;
  reg_solo int;
begin
  -- Dapatkan seller
  select id into seller_uuid from public.profiles where role = 'seller' order by created_at asc limit 1;
  if seller_uuid is null then
    select id into seller_uuid from public.profiles limit 1;
  end if;

  -- Kategori
  select id into cat_makanan from public.categories where nama = 'Makanan' limit 1;
  select id into cat_minuman from public.categories where nama = 'Minuman' limit 1;
  select id into cat_kerajinan from public.categories where nama = 'Kerajinan' limit 1;
  select id into cat_pertanian from public.categories where nama = 'Pertanian' limit 1;

  -- Daerah
  select id into reg_surabaya from public.regions where nama = 'Surabaya' limit 1;
  select id into reg_malang from public.regions where nama = 'Malang' limit 1;
  select id into reg_sidoarjo from public.regions where nama = 'Sidoarjo' limit 1;
  select id into reg_jakarta from public.regions where nama = 'DKI Jakarta' limit 1;
  select id into reg_bandung from public.regions where nama = 'Bandung' limit 1;
  select id into reg_semarang from public.regions where nama = 'Semarang' limit 1;
  select id into reg_jogja from public.regions where nama = 'D.I. Yogyakarta' limit 1;
  select id into reg_solo from public.regions where nama = 'Surakarta (Solo)' limit 1;

  -- 1. Sambal Cumi Asin
  insert into public.products (seller_id, category_id, region_id, nama, deskripsi, harga, satuan, kondisi_stok, metode_pengiriman, varian, no_izin, no_wa, alamat, foto_url, foto_urls, status, is_featured, is_active)
  values (
    seller_uuid, cat_makanan, reg_surabaya,
    'Sambal Cumi Asin Cabe Ijo Dapur Bu Siti',
    'Sambal cumi asin cabe ijo khas buatan rumah dengan potongan cumi asin segar yang melimpah dan tidak alot. Diracik dengan cabai hijau pilihan dan rempah alami tanpa bahan pengawet kimia.',
    35000, 'Botol', 'ready_stock',
    array['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Khusus Area Lokal (Kurir Instan / Sameday)', 'Bisa COD (Bayar di Tempat)'],
    'Sedang, Pedas Nampol, Ekstra Pedas', 'P-IRT 2093578010452-27, Halal ID3511000189234',
    '6281234567890', 'Jl. Rungkut Madya No. 45, Rungkut, Surabaya',
    'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    array['https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'],
    'approved', true, true
  );

  -- 2. Keripik Tempe
  insert into public.products (seller_id, category_id, region_id, nama, deskripsi, harga, satuan, kondisi_stok, metode_pengiriman, varian, no_izin, no_wa, alamat, foto_url, foto_urls, status, is_featured, is_active)
  values (
    seller_uuid, cat_makanan, reg_malang,
    'Keripik Tempe Renyah Gurih Mas Budi',
    'Keripik tempe khas sentra Sanan Malang dengan irisan tipis dan taburan bumbu daun jeruk purut yang harum. Digoreng dengan minyak nabati berkualitas, renyah kriuk tahan lama dan tidak tengik.',
    18000, 'Pack / Bungkus', 'ready_stock',
    array['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa Ambil di Tempat (Self Pick-up)'],
    'Original Jeruk Purut, Balado Pedas Manis, Keju Gurih', 'P-IRT 2153507021190-26',
    '6281298765432', 'Jl. Sanan No. 88, Blimbing, Kota Malang',
    'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80',
    array['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1621996346565-e3d5d628169e?w=800&auto=format&fit=crop&q=80'],
    'approved', true, true
  );

  -- 3. Kopi Arabika Gayo
  insert into public.products (seller_id, category_id, region_id, nama, deskripsi, harga, satuan, kondisi_stok, metode_pengiriman, varian, no_izin, no_wa, alamat, foto_url, foto_urls, status, is_featured, is_active)
  values (
    seller_uuid, cat_minuman, reg_bandung,
    'Kopi Arabika Gayo Single Origin 250gr',
    'Kopi Arabika murni dari dataran tinggi Takengon Aceh Gayo dengan proses full-washed. Memiliki aroma buah segar (fruity) yang kaya, keasaman lembut yang seimbang, serta aftertaste manis karamel.',
    65000, 'Pack / Bungkus', 'ready_stock',
    array['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Khusus Area Lokal (Kurir Instan / Sameday)'],
    'Biji Sangrai, Giling Halus, Giling Kasar', 'P-IRT 5103273010892-28, Halal ID3211000045612',
    '6285678901234', 'Jl. Cihampelas No. 120, Sukajadi, Bandung',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    array['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80'],
    'approved', true, true
  );

  -- 4. Tas Anyaman
  insert into public.products (seller_id, category_id, region_id, nama, deskripsi, harga, satuan, kondisi_stok, metode_pengiriman, varian, no_izin, no_wa, alamat, foto_url, foto_urls, status, is_featured, is_active)
  values (
    seller_uuid, cat_kerajinan, reg_jogja,
    'Tas Anyaman Pandan Etnik Ramah Lingkungan',
    'Tas jinjing wanita buatan tangan pengrajin lokal menggunakan serat daun pandan kering pilihan. Ringan, kokoh, dan berkarakter khas etnik modern.',
    85000, 'Pcs / Buah', 'ready_stock',
    array['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    'Natural Cokelat, Kombinasi Hitam Minimalis', 'NIB 1204230048123',
    '6287712345678', 'Desa Wisata Kerajinan Kasongan, Bantul, D.I. Yogyakarta',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    array['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80'],
    'approved', false, true
  );

  -- 5. Batik Tulis Solo
  insert into public.products (seller_id, category_id, region_id, nama, deskripsi, harga, satuan, kondisi_stok, metode_pengiriman, varian, no_izin, no_wa, alamat, foto_url, foto_urls, status, is_featured, is_active)
  values (
    seller_uuid, cat_kerajinan, reg_solo,
    'Kain Batik Tulis Motif Parang Barong Klasik',
    'Kain batik tulis canting malam asli di atas katun primissima super halus. Dibuat secara teliti oleh pembatik lokal dengan proses pewarnaan alami.',
    275000, 'Pasang / Set', 'pre_order',
    array['Bisa Kirim Seluruh Indonesia (Ekspedisi)'],
    'Sogan Tradisional Solo, Indigofera', 'Sertifikasi Batikmark No. 042/BM-SL/2025',
    '6281324567801', 'Kampung Batik Laweyan, Solo',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    array['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'],
    'approved', false, true
  );

  -- 6. Madu Hutan
  insert into public.products (seller_id, category_id, region_id, nama, deskripsi, harga, satuan, kondisi_stok, metode_pengiriman, varian, no_izin, no_wa, alamat, foto_url, foto_urls, status, is_featured, is_active)
  values (
    seller_uuid, cat_pertanian, reg_sidoarjo,
    'Madu Hutan Murni Liar Sumbawa 500ml',
    'Madu mentah alami langsung dipanen dari lebah pohon hutan tanpa proses pasteurisasi maupun penambahan gula. Menjaga enzim alami dan antioksidan utuh.',
    110000, 'Botol / Cup', 'ready_stock',
    array['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Khusus Area Lokal (Kurir Instan / Sameday)'],
    'Madu Randu, Madu Hitam Pahit', 'P-IRT 1093515010043-29, Halal ID3511000078129',
    '6282134567891', 'Perumahan Pondok Jati Blok AC-14, Sidoarjo',
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
    array['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&auto=format&fit=crop&q=80'],
    'approved', false, true
  );

  -- 7. Lapis Legit
  insert into public.products (seller_id, category_id, region_id, nama, deskripsi, harga, satuan, kondisi_stok, metode_pengiriman, varian, no_izin, no_wa, alamat, foto_url, foto_urls, status, is_featured, is_active)
  values (
    seller_uuid, cat_makanan, reg_jakarta,
    'Kue Lapis Legit Prunes Tradisional Wisman',
    'Lapis legit resep kuno keluarga menggunakan 30 butir kuning telur dan 100% mentega Wijsman murni. Setiap lapisannya dipanggang sabar menghasilkan tekstur sangat lembut.',
    175000, 'Box / Kotak', 'pre_order',
    array['Khusus Area Lokal (Kurir Instan / Sameday)', 'Bisa Ambil di Tempat (Self Pick-up)'],
    'Original Butter Wisman, Prunes Premium, Keju Edam', 'P-IRT 2063174010321-26',
    '6281198765432', 'Jl. Tebet Barat Dalam Raya No. 24, Jakarta Selatan',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    array['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'],
    'approved', false, true
  );

  -- 8. Sirup Bunga Telang
  insert into public.products (seller_id, category_id, region_id, nama, deskripsi, harga, satuan, kondisi_stok, metode_pengiriman, varian, no_izin, no_wa, alamat, foto_url, foto_urls, status, is_featured, is_active)
  values (
    seller_uuid, cat_minuman, reg_semarang,
    'Sirup Bunga Telang Segar Herbal 350ml',
    'Sirup konsentrat bunga telang organik kaya antioksidan antosianin. Cukup campur 3 sendok makan sirup dengan air es dan perasan jeruk nipis untuk minuman biru segar eksotis.',
    28000, 'Botol / Cup', 'ready_stock',
    array['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Khusus Area Lokal (Kurir Instan / Sameday)'],
    'Original Telang Lemon, Telang Mint Segar', 'P-IRT 2133374010543-27',
    '6285712349876', 'Jl. Pandanaran No. 56, Semarang Tengah',
    'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&auto=format&fit=crop&q=80',
    array['https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80'],
    'approved', false, true
  );

  -- 9. Keripik Brownies
  insert into public.products (seller_id, category_id, region_id, nama, deskripsi, harga, satuan, kondisi_stok, metode_pengiriman, varian, no_izin, no_wa, alamat, foto_url, foto_urls, status, is_featured, is_active)
  values (
    seller_uuid, cat_makanan, reg_surabaya,
    'Keripik Brownies Kering Crispy Choco Bites',
    'Sensasi makan bagian renyah kerak brownies yang paling dicari. Tekstur tipis garing berpadu rasa cokelat Belgia pekat yang tidak terlalu manis.',
    22000, 'Pack / Bungkus', 'stok_terbatas',
    array['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    'Choco Chips, Almond Topping, Keju Parut', 'P-IRT 2063578010889-28',
    '6281234567890', 'Jl. Manyar Kertoarjo No. 18, Gubeng, Surabaya',
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    array['https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=800&auto=format&fit=crop&q=80'],
    'approved', false, true
  );

  -- 10. Beras Merah Organik
  insert into public.products (seller_id, category_id, region_id, nama, deskripsi, harga, satuan, kondisi_stok, metode_pengiriman, varian, no_izin, no_wa, alamat, foto_url, foto_urls, status, is_featured, is_active)
  values (
    seller_uuid, cat_pertanian, reg_malang,
    'Beras Merah Organik Pulen Sehat 2kg',
    'Beras merah organik hasil tani lereng Gunung Bromo yang dibudidayakan tanpa pestisida kimia. Tekstur pulen tidak pera dan harum saat dimasak.',
    45000, 'Pack / Bungkus', 'ready_stock',
    array['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    'Kemasan Vacuum 2 Kg, Kemasan 5 Kg', 'Kementan RI PD-35.07-A.I.000-01-00213',
    '6281298765432', 'Dusun Boro, Tumpang, Kab. Malang',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    array['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop&q=80'],
    'approved', false, true
  );
end;
$$;
