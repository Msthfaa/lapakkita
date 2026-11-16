const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jbgrmwulatkwvyklcipu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f3jKUYuZ_CaDwPZd4-N_Pw_T63Q3gta';

const SELLER_ID = 'ccb57097-8821-41ff-ae3f-a09959d51ead'; // Dapur Bu Siti

const productsData = [
  // 1. Sambal Cumi Asin
  {
    nama: 'Sambal Cumi Asin Cabe Ijo Dapur Bu Siti',
    deskripsi: 'Sambal cumi asin cabe ijo khas buatan rumah dengan potongan cumi asin segar yang melimpah dan tidak alot. Diracik dengan cabai hijau pilihan dan rempah alami tanpa bahan pengawet kimia. Siap santap sebagai lauk nasi hangat.',
    harga: 35000,
    satuan: 'Botol',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Khusus Area Lokal (Kurir Instan / Sameday)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Original Gurih, Pedas Sedang, Pedas Nampol',
    no_izin: 'P-IRT 2093578010452-27, Halal ID3511000189234',
    no_wa: '6281234567890',
    alamat: 'Jl. Rungkut Madya No. 45, Rungkut Kidul, Surabaya',
    latitude: -7.3197,
    longitude: 112.7845,
    category_id: 1, // Makanan
    region_id: 1,   // Surabaya
    foto_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: true
  },
  // 2. Keripik Tempe
  {
    nama: 'Keripik Tempe Renyah Daun Jeruk Sanan',
    deskripsi: 'Keripik tempe khas sentra industri Sanan Malang dengan irisan tipis presisi dan taburan bumbu daun jeruk purut harum. Digoreng dengan minyak nabati berkualitas, renyah gurih tahan lama dan tidak mudah tengik.',
    harga: 18000,
    satuan: 'Pack / Bungkus',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa Ambil di Tempat (Self Pick-up)'],
    varian: 'Original Daun Jeruk, Balado Pedas Manis, Keju Bakar Gurih',
    no_izin: 'P-IRT 2153507021190-26, Halal ID3511000082711',
    no_wa: '6281298765432',
    alamat: 'Jl. Sanan No. 88, Purwantoro, Blimbing, Kota Malang',
    latitude: -7.9666,
    longitude: 112.6326,
    category_id: 1, // Makanan
    region_id: 2,   // Malang
    foto_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621996346565-e3d5d628169e?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: true
  },
  // 3. Kue Lapis Legit Prunes
  {
    nama: 'Kue Lapis Legit Spesial Prunes Wijsman',
    deskripsi: 'Lapis legit panggang berlapis rapi menggunakan 100% butter Wijsman murni dan buah prunes asam-manis segar. Tekstur sangat basah, legit lembut, beraroma rempah kapulaga dan kayu manis harum mewah.',
    harga: 175000,
    satuan: 'Box / Kotak',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Khusus Area Lokal (Kurir Instan / Sameday)'],
    varian: 'Prunes Premium 20x20cm, Keju Cheddar 20x20cm, Original Butter',
    no_izin: 'P-IRT 3063174010882-27, Halal ID3111000092143',
    no_wa: '6281398765432',
    alamat: 'Jl. Kemang Raya No. 18, Mampang Prapatan, Jakarta Selatan',
    latitude: -6.2608,
    longitude: 106.8156,
    category_id: 1, // Makanan
    region_id: 4,   // DKI Jakarta
    foto_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: true
  },
  // 4. Keripik Pisang Cokelat Lumer
  {
    nama: 'Keripik Pisang Cokelat Lumer Khas Lampung 250gr',
    deskripsi: 'Keripik pisang kepok pilihan dengan teknik penggorengan vacum sehingga renyah maksimal, lalu disiram saus dark chocolate lumer premium. Perpaduan manis legit dan kriuk gurih yang bikin ketagihan.',
    harga: 25000,
    satuan: 'Pack / Bungkus',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Dark Chocolate Lumer, Matcha Green Tea, Tiramisu Creamy',
    no_izin: 'P-IRT 2141871010321-25, Halal ID1811000023412',
    no_wa: '6285712345678',
    alamat: 'Jl. Ir. H. Juanda No. 84, Dago, Bandung',
    latitude: -6.8856,
    longitude: 107.6138,
    category_id: 1, // Makanan
    region_id: 5,   // Bandung
    foto_url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 5. Bakpia Kukus Tugu
  {
    nama: 'Bakpia Kukus Isi Cokelat Keju Lembut 10 Pcs',
    deskripsi: 'Bakpia modern dengan adonan kue bolu kukus lembut bertekstur kapas. Isian pasta cokelat Belgia lumer dan parutan keju gurih melimpah di setiap gigitan. Cocok sebagai oleh-oleh khas Yogyakarta.',
    harga: 42000,
    satuan: 'Box / Kotak',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Khusus Area Lokal (Kurir Instan / Sameday)'],
    varian: 'Original Cokelat, Brownies Keju, Kacang Merah Tradisional',
    no_izin: 'P-IRT 2063471010512-26, Halal ID3411000011823',
    no_wa: '6287712345678',
    alamat: 'Jl. Malioboro No. 56, Danurejan, D.I. Yogyakarta',
    latitude: -7.7928,
    longitude: 110.3658,
    category_id: 1, // Makanan
    region_id: 7,   // Yogyakarta
    foto_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: true
  },
  // 6. Abon Sapi Asli Solo
  {
    nama: 'Abon Sapi Asli Cap Gunung Solo Gurih 250gr',
    deskripsi: 'Abon sapi berkualitas super yang terbuat dari 100% serat daging sapi bagian paha belakang tanpa campuran kelapa atau tepung. Diracik bumbu rempah ketumbar dan gula kelapa alami, harum dan berserat lembut.',
    harga: 65000,
    satuan: 'Pack / Bungkus',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Manis Gurih, Pedas Renyah',
    no_izin: 'P-IRT 2013372010198-28, Halal MUI 1501004812300',
    no_wa: '6281234567890',
    alamat: 'Jl. Slamet Riyadi No. 230, Sriwedari, Laweyan, Surakarta',
    latitude: -7.5684,
    longitude: 110.8123,
    category_id: 1, // Makanan
    region_id: 8,   // Solo
    foto_url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 7. Bandeng Asap Sidoarjo
  {
    nama: 'Bandeng Asap Presto Tanpa Duri Khas Sidoarjo',
    deskripsi: 'Ikan bandeng segar pilihan dari tambak lokal pesisir Sidoarjo. Diasap secara perlahan menggunakan tempurung kelapa sehingga aroma asapnya wangi meresap ke dalam daging yang gurih dan lembut bebas duri.',
    harga: 55000,
    satuan: 'Pcs / Buah',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Khusus Area Lokal (Kurir Instan / Sameday)', 'Bisa Kirim Seluruh Indonesia (Ekspedisi)'],
    varian: 'Dilengkapi Sambal Petis Khas Sidoarjo',
    no_izin: 'P-IRT 2023515010642-27, Halal ID3511000039218',
    no_wa: '6289511112222',
    alamat: 'Jl. Gajah Mada No. 12, Pucang, Sidoarjo',
    latitude: -7.4478,
    longitude: 112.7183,
    category_id: 1, // Makanan
    region_id: 3,   // Sidoarjo
    foto_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 8. Kacang Disco Bali
  {
    nama: 'Kacang Disco Bali Renyah Bumbu Rempah 250gr',
    deskripsi: 'Kacang tanah pilihan berbalut adonan tepung renyah berempah ketumbar, bawang putih, dan cabai merah. Digoreng garing renyah sempurna, cocok untuk teman minum teh atau camilan saat bepergian.',
    harga: 28000,
    satuan: 'Pack / Bungkus',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Original Bawang, Ekstra Pedas Manis, Keju Asin',
    no_izin: 'P-IRT 2155171010214-25, Halal ID5111000091823',
    no_wa: '6281298765432',
    alamat: 'Jl. Teuku Umar No. 89, Dauh Puri Klod, Denpasar Barat',
    latitude: -8.6785,
    longitude: 115.2078,
    category_id: 1, // Makanan
    region_id: 9,   // Denpasar
    foto_url: 'https://images.unsplash.com/photo-1536591375315-1b836890ba4e?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1536591375315-1b836890ba4e?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 9. Kopi Arabika Gayo
  {
    nama: 'Kopi Arabika Gayo Single Origin Full Washed 250gr',
    deskripsi: 'Biji kopi arabika petik merah dari lereng dataran tinggi Takengon Aceh Gayo berketinggian 1.400 mdpl. Profil sangrai medium roast dengan citarasa fruity segar, keasaman lembut elegan, dan aftertaste manis karamel yang panjang.',
    harga: 75000,
    satuan: 'Pack / Bungkus',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Khusus Area Lokal (Kurir Instan / Sameday)'],
    varian: 'Biji Utuh Sangrai, Gilingan Kasar (French Press/V60), Gilingan Halus (Tubruk)',
    no_izin: 'P-IRT 5103273010892-28, Halal ID1111000045612',
    no_wa: '6285678901234',
    alamat: 'Jl. Cihampelas No. 120, Sukajadi, Bandung',
    latitude: -6.8923,
    longitude: 107.6045,
    category_id: 2, // Minuman
    region_id: 5,   // Bandung
    foto_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: true
  },
  // 10. Kopi Robusta Dampit
  {
    nama: 'Kopi Robusta Dampit Malang Petik Merah 250gr',
    deskripsi: 'Kopi robusta legendaris dari perkebunan lereng Gunung Semeru Selatan, Dampit Malang. Bodi tebal pekat dengan aroma dark chocolate khas dan crema tebal alami. Sangat cocok diseduh tubruk kental atau bahan dasar es kopi susu.',
    harga: 45000,
    satuan: 'Pack / Bungkus',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Biji Sangrai, Bubuk Halus Murni',
    no_izin: 'P-IRT 5103507010218-27, Halal ID3511000019234',
    no_wa: '6285712345678',
    alamat: 'Desa Wisata Kopi Dampit, Tirtoyudo, Malang',
    latitude: -8.2125,
    longitude: 112.7841,
    category_id: 2, // Minuman
    region_id: 2,   // Malang
    foto_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 11. Sirup Bunga Telang
  {
    nama: 'Sirup Bunga Telang Segar Herbal Alami 350ml',
    deskripsi: 'Sirup konsentrat murni sari bunga telang (Clitoria ternatea) organik yang diperkaya sari lemon segar dan daun pandan wangi. Kaya antioksidan alami antosianin, menyegarkan tubuh, dan memiliki gradasi warna biru keunguan yang memukau.',
    harga: 32000,
    satuan: 'Botol',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Khusus Area Lokal (Kurir Instan / Sameday)'],
    varian: 'Telang Lemon Segar, Telang Serai Madu',
    no_izin: 'P-IRT 2093471010419-27, Halal ID3411000088192',
    no_wa: '6287712345678',
    alamat: 'Jl. Kaliurang KM 8, Sinduharjo, Sleman, D.I. Yogyakarta',
    latitude: -7.7289,
    longitude: 110.3994,
    category_id: 2, // Minuman
    region_id: 7,   // Yogyakarta
    foto_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 12. Wedang Uwuh Rempah Imogiri
  {
    nama: 'Wedang Uwuh Komplit Rempah Imogiri Asli 10 Sachet',
    deskripsi: 'Minuman herbal tradisional khas makam raja-raja Imogiri Yogyakarta. Perpaduan daun kayu manis, daun pala, daun cengkeh, jahe emprit bakar, serutan kayu secang merah, dan gula batu. Berkhasiat menghangatkan badan dan melancarkan peredaran darah.',
    harga: 22000,
    satuan: 'Pack / Bungkus',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Dengan Gula Batu Kristal, Tanpa Gula (Original Herb)',
    no_izin: 'P-IRT 2133402010881-26, Halal ID3411000049210',
    no_wa: '6281234567890',
    alamat: 'Pasar Tradisional Imogiri, Bantul, D.I. Yogyakarta',
    latitude: -7.9234,
    longitude: 110.4289,
    category_id: 2, // Minuman
    region_id: 7,   // Yogyakarta
    foto_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 13. Teh Hitam Pagilaran
  {
    nama: 'Teh Hitam Celup Pagilaran Asli 25 Kantong',
    deskripsi: 'Teh hitam orthodox kualitas ekspor dari perkebunan lereng Gunung Kamulyan Batang, Jawa Tengah. Memiliki aroma floral alami khas dataran tinggi dengan warna seduhan merah keemasan yang jernih dan nikmat menyegarkan.',
    harga: 19500,
    satuan: 'Box / Kotak',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa Ambil di Tempat (Self Pick-up)'],
    varian: 'Classic Black Tea, Melati Jasmine Wangi',
    no_izin: 'P-IRT 2103325010112-25, Halal ID3311000018273',
    no_wa: '6281398765432',
    alamat: 'Jl. Pandanaran No. 45, Mugassari, Semarang Selatan',
    latitude: -6.9882,
    longitude: 110.4192,
    category_id: 2, // Minuman
    region_id: 6,   // Semarang
    foto_url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 14. Cokelat Seduh Bali
  {
    nama: 'Cokelat Seduh Artisan Kakao Bali Murni 200gr',
    deskripsi: 'Bubuk kakao murni hasil fermentasi buah kakao petani lokal Tabanan Bali. Dipadukan dengan gula kelapa organik rendah glikemik. Menghasilkan minuman cokelat seduh pekat, creamy, dan menenangkan hati tanpa susu hewani (vegan friendly).',
    harga: 48000,
    satuan: 'Pack / Bungkus',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Khusus Area Lokal (Kurir Instan / Sameday)'],
    varian: 'Dark 70% Creamy, Pure Unsweetened 100%',
    no_izin: 'P-IRT 5135102010331-28, Halal ID5111000031823',
    no_wa: '6281298765432',
    alamat: 'Jl. Raya Ubud No. 34, Ubud, Gianyar, Bali',
    latitude: -8.5069,
    longitude: 115.2625,
    category_id: 2, // Minuman
    region_id: 9,   // Denpasar
    foto_url: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: true
  },
  // 15. Tas Anyaman Pandan
  {
    nama: 'Tas Anyaman Pandan Etnik Ramah Lingkungan',
    deskripsi: 'Tas jinjing wanita buatan tangan pengrajin lokal menggunakan serat daun pandan kering pilihan. Dilengkapi furing kain blacu halus dan ritsleting kuat. Ringan, kokoh, berkarakter khas etnik modern, dan ramah lingkungan.',
    harga: 85000,
    satuan: 'Pcs / Buah',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Natural Cokelat, Kombinasi Hitam Minimalis, Etnik Merah Bata',
    no_izin: 'NIB 1204230048123, Hak Cipta Desain Industri Kemenkumham',
    no_wa: '6287712345678',
    alamat: 'Desa Wisata Kerajinan Kasongan, Bantul, D.I. Yogyakarta',
    latitude: -7.8423,
    longitude: 110.3392,
    category_id: 4, // Kerajinan
    region_id: 7,   // Yogyakarta
    foto_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: true
  },
  // 16. Dompet Kulit Sapi Tanggulangin
  {
    nama: 'Dompet Kulit Sapi Asli Pull-Up Bifold Tanggulangin',
    deskripsi: 'Dompet pria berbahan kulit sapi asli jenis Crazy Horse / Pull-Up kualitas ekspor dari sentra industri kulit Tanggulangin Sidoarjo. Dijahit tangan dengan benang wax nylon kokoh, bertekstur vintage yang semakin mengkilap seiring pemakaian.',
    harga: 125000,
    satuan: 'Pcs / Buah',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Vintage Havana Brown, Classic Black Matte, Dark Tan',
    no_izin: 'NIB 8120300192841, Standar Mutu SNI Kerajinan Kulit',
    no_wa: '6289511112222',
    alamat: 'Kawasan Industri Kulit Tanggulangin, Jl. Raya Kluda No. 45, Sidoarjo',
    latitude: -7.507699,
    longitude: 112.707521,
    category_id: 4, // Kerajinan
    region_id: 3,   // Sidoarjo
    foto_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: true
  },
  // 17. Cangkir Keramik Kasongan
  {
    nama: 'Cangkir Keramik Stoneware Kasongan Handmade 200ml',
    deskripsi: 'Cangkir kopi keramik buatan tangan seniman keramik Kasongan Bantul. Dibakar pada suhu tinggi 1250°C menghasilkan keramik padat food grade, tahan microwave dan mesin cuci piring. Tekstur tanah liat berbutir pasir alami memberikan sentuhan rustic hangat.',
    harga: 58000,
    satuan: 'Pcs / Buah',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi Ekstra Bubble Wrap)', 'Bisa Ambil di Tempat (Self Pick-up)'],
    varian: 'Matcha Moss Glaze, Sand Speckled Cream, Terra Cotta Rust',
    no_izin: 'Sertifikat Kriya Tradisional Dewan Kerajinan DIY',
    no_wa: '6287712345678',
    alamat: 'Jl. Kasongan No. 102, Bangunjiwo, Kasihan, Bantul',
    latitude: -7.8465,
    longitude: 110.3341,
    category_id: 4, // Kerajinan
    region_id: 7,   // Yogyakarta
    foto_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 18. Talenan Kayu Jati
  {
    nama: 'Talenan Kayu Jati Solid Food Grade Natural Beewax',
    deskripsi: 'Talenan dapur kayu jati perhutani asli tanpa sambungan (single wood piece). Difinishing menggunakan natural beeswax dan mineral oil bersertifikat food-grade, aman untuk memotong bahan makanan basah maupun sebagai papan saji (serving board) keju dan roti.',
    harga: 45000,
    satuan: 'Pcs / Buah',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Persegi Handle 32x18 cm, Bulat Pizza Handle 28 cm',
    no_izin: 'NIB 9120200481921, Sertifikat Legalitas Kayu SVLK',
    no_wa: '6281398765432',
    alamat: 'Jl. Slamet Riyadi No. 112, Kerten, Laweyan, Surakarta',
    latitude: -7.5612,
    longitude: 110.7984,
    category_id: 4, // Kerajinan
    region_id: 8,   // Solo
    foto_url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 19. Tempat Tisu Rotan
  {
    nama: 'Tempat Tisu Anyaman Rotan Alami Aesthetic Bohemi',
    deskripsi: 'Kotak wadah tisu dari anyaman rotan alam yang dihaluskan dan diberi lapisan vernis ramah lingkungan. Menambah estetika hangat bertema Skandinavia atau Bohemian di ruang tamu, meja kerja, dan ruang makan Anda.',
    harga: 35000,
    satuan: 'Pcs / Buah',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Khusus Area Lokal (Kurir Instan / Sameday)'],
    varian: 'Kotak Persegi 13x13 cm, Persegi Panjang Standar 23x13 cm',
    no_izin: 'Binaan Dekranasda Kota Surabaya',
    no_wa: '6281234567890',
    alamat: 'Sentra Kriya Rungkut Menanggal, Rungkut, Surabaya',
    latitude: -7.3245,
    longitude: 112.7712,
    category_id: 4, // Kerajinan
    region_id: 1,   // Surabaya
    foto_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 20. Lilin Aromaterapi
  {
    nama: 'Lilin Aromaterapi Soy Wax Minyak Atsiri Cendana Bali',
    deskripsi: 'Lilin aromaterapi berbahan 100% soy wax alami (kedelai) dengan sumbu kapas bebas timbal. Menggunakan minyak atsiri murni kayu cendana Bali dan vanila. Memberikan suasana relaksasi mendalam, meredakan stres, dan membersihkan udara ruangan.',
    harga: 39000,
    satuan: 'Jar / Toples',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Sandalwood Bali, French Lavender, Lemongrass Mint',
    no_izin: 'NIB 0220300192842',
    no_wa: '6281298765432',
    alamat: 'Jl. Danau Tamblingan No. 78, Sanur, Denpasar Selatan',
    latitude: -8.7012,
    longitude: 115.2612,
    category_id: 4, // Kerajinan
    region_id: 9,   // Denpasar
    foto_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 21. Kain Batik Tulis Parang
  {
    nama: 'Kain Batik Tulis Canting Motif Parang Kusumo Halus',
    deskripsi: 'Kain batik tulis tradisional karya pembatik sepuh Laweyan Solo di atas katun primissima mori senur halus 240 x 115 cm. Menggunakan teknik canting malam dingin dan pewarnaan alam wedel soga tahan luntur puluhan tahun.',
    harga: 350000,
    satuan: 'Lembar',
    kondisi_stok: 'stok_terbatas',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi Asuransi)', 'Bisa Ambil di Tempat (Self Pick-up)'],
    varian: 'Sogan Klasik Cokelat Tua, Indigofera Biru Natural',
    no_izin: 'Sertifikat Batikmark Indonesia SNI Batik Tulis No. 0812-BT',
    no_wa: '6281398765432',
    alamat: 'Kampung Wisata Batik Laweyan, Jl. Dr. Rajiman No. 512, Solo',
    latitude: -7.5755,
    longitude: 110.8243,
    category_id: 12, // Fashion
    region_id: 8,    // Solo
    foto_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: true
  },
  // 22. Kemeja Pria Batik
  {
    nama: 'Kemeja Batik Pria Katun Primissima Lengan Pendek Modern',
    deskripsi: 'Kemeja batik pria potongan slim fit modern dengan motif kontemporer Jawa. Dilapisi furing trikot tipis adem, jahitan tindas rapi, dan motif simetris depan-belakang. Sangat elegan untuk menghadiri acara formal, kantor, dan resepsi.',
    harga: 145000,
    satuan: 'Pcs / Buah',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Size M (LD 104cm), Size L (LD 108cm), Size XL (LD 112cm), Size XXL (LD 116cm)',
    no_izin: 'NIB 1204200192834, Sertifikat SNI Pakaian Batik Pria',
    no_wa: '6281398765432',
    alamat: 'Jl. Veteran No. 89, Serengan, Surakarta, Jawa Tengah',
    latitude: -7.5812,
    longitude: 110.8291,
    category_id: 12, // Fashion
    region_id: 8,    // Solo
    foto_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 23. Sandal Kulit Garut
  {
    nama: 'Sandal Selop Kulit Sapi Asli Anyaman Garut Pria',
    deskripsi: 'Sandal kulit selop santai pria buatan tangan pengrajin Sukaregang Garut. Menggunakan kulit sapi nubuck lembut anti lecet dengan sol karet TPR bergerigi anti licin. Ringan dan sangat nyaman untuk penggunaan harian.',
    harga: 115000,
    satuan: 'Pcs / Buah',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Ukuran 39, 40, 41, 42, 43 (Warna Cokelat Kopi & Hitam)',
    no_izin: 'NIB 0220100481920, Binaan Sentra Industri Kulit Jawa Barat',
    no_wa: '6285678901234',
    alamat: 'Jl. Riau No. 145, Cihapit, Bandung Wetan, Bandung',
    latitude: -6.9082,
    longitude: 107.6214,
    category_id: 12, // Fashion
    region_id: 5,    // Bandung
    foto_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 24. Syal Tenun Troso
  {
    nama: 'Syal Selendang Tenun Ikat Tradisional Troso Jepara',
    deskripsi: 'Syal tenun tangan Alat Tenun Bukan Mesin (ATBM) khas desa Troso Jepara. Menggunakan benang katun pintal halus dengan pewarnaan yang tidak mudah luntur. Cocok digunakan sebagai aksesoris leher formal maupun penghangat saat traveling.',
    harga: 65000,
    satuan: 'Pcs / Buah',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Motif Etnik NTT Merah Marun, Etnik Toraja Biru Navy',
    no_izin: 'Binaan Klaster Tenun Nusantara Dekranasda Jawa Tengah',
    no_wa: '6281398765432',
    alamat: 'Jl. Pemuda No. 142, Sekayu, Semarang Tengah, Semarang',
    latitude: -6.9812,
    longitude: 110.4123,
    category_id: 12, // Fashion
    region_id: 6,    // Semarang
    foto_url: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 25. Outer Kimono Tenun
  {
    nama: 'Outer Kimono Kardigan Tenun Etnik Blanket Katun Halus',
    deskripsi: 'Outerwear model kimono unisex berbahan kain tenun blanket tebal namun berpori adem di kulit. Dilengkapi saku samping fungsional dan tali pengikat pinggang lepas-pasang. Sangat fotogenik untuk gaya kasual modern nusantara.',
    harga: 135000,
    satuan: 'Pcs / Buah',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'All Size Oversize Fit to XL (Lingkar Dada 118 cm)',
    no_izin: 'NIB 0220200381920',
    no_wa: '6287712345678',
    alamat: 'Jl. Prawirotaman No. 24, Brontokusuman, Mergangsan, Yogyakarta',
    latitude: -7.8185,
    longitude: 110.3698,
    category_id: 12, // Fashion
    region_id: 7,    // Yogyakarta
    foto_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 26. Madu Hutan Liar Murni
  {
    nama: 'Madu Hutan Liar Murni Riau 500ml Raw Honey Super',
    deskripsi: 'Madu murni mentah (raw honey) hasil panen sarang lebah raksasa Apis dorsata di pedalaman pohon sialang hutan tropis Riau. Tanpa pasteurisasi pemanasan, tanpa gula sintetis tambahan, kaya enzim diastase aktif, bee pollen, dan propolis alami.',
    harga: 88000,
    satuan: 'Botol',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Kemasan Botol Segel & Bubblewrap Tebal)', 'Khusus Area Lokal (Kurir Instan / Sameday)'],
    varian: 'Madu Sialang Multiflora Emas, Madu Akasia Hitam',
    no_izin: 'P-IRT 2091471010319-26, Hasil Uji Laboratorium Kemurnian 100%',
    no_wa: '6281234567890',
    alamat: 'Jl. Dharmawangsa No. 34, Airlangga, Gubeng, Surabaya',
    latitude: -7.2756,
    longitude: 112.7567,
    category_id: 13, // Pertanian
    region_id: 1,    // Surabaya
    foto_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: true
  },
  // 27. Beras Merah Organik
  {
    nama: 'Beras Merah Organik Pulen Sehat Kemasan Vakum 2kg',
    deskripsi: 'Beras merah varietas lokal lereng pegunungan Anjasmoro Malang yang dibudidayakan secara organik tanpa pupuk sintetis maupun pestisida kimia. Tekstur setelah ditanak empuk pulen berserat tinggi, sangat ideal untuk penderita diabetes dan program diet sehat.',
    harga: 39000,
    satuan: 'Pack / Bungkus',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Beras Merah Pecah Kulit 2kg, Beras Hitam Organik 2kg',
    no_izin: 'KEMTAN RI PD 35.15-II.I.00-01-00214-08/21, Sertifikat Organik INOFICE',
    no_wa: '6281298765432',
    alamat: 'Jl. Raya Tlogomas No. 88, Lowokwaru, Malang',
    latitude: -7.9312,
    longitude: 112.6045,
    category_id: 13, // Pertanian
    region_id: 2,    // Malang
    foto_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 28. Minyak Kelapa Murni (VCO)
  {
    nama: 'Minyak Kelapa Murni (VCO) Cold Pressed Organik 250ml',
    deskripsi: 'Extra Virgin Coconut Oil diekstrak dari santan kelapa hijau segar melalui metode dingin (cold pressed centrifuged) tanpa bahan kimia dan tanpa pemanasan suhu tinggi. Bening jernih seperti air, beraroma kelapa segar alami, kaya asam laurat.',
    harga: 42000,
    satuan: 'Botol',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Khusus Area Lokal (Kurir Instan / Sameday)'],
    varian: 'Kemasan Botol Kaca 250ml, Botol Ekonomis 500ml',
    no_izin: 'P-IRT 2073578010192-26, Halal ID3511000049182',
    no_wa: '6289511112222',
    alamat: 'Jl. Ahmad Yani No. 15, Waru, Sidoarjo',
    latitude: -7.3541,
    longitude: 112.7321,
    category_id: 13, // Pertanian
    region_id: 3,   // Sidoarjo
    foto_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: false
  },
  // 29. Rendang Sapi Kaleng
  {
    nama: 'Rendang Daging Sapi Suwir Kemasan Kaleng Steril 200gr',
    deskripsi: 'Rendang daging sapi khas Minangkabau yang dimasak tradisional dengan kayu bakar selama 8 jam hingga bumbu karamelisasi menghitam gurih. Disterilisasi dalam kemasan kaleng kedap udara, awet hingga 1 tahun tanpa pengawet kimia. Praktis untuk bekal perjalanan dan oleh-oleh.',
    harga: 58000,
    satuan: 'Pcs / Buah',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Khusus Area Lokal (Kurir Instan / Sameday)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Rendang Potong Basah, Rendang Suwir Kering Krispi',
    no_izin: 'BPOM RI MD 539503001234, Halal ID0041000021941',
    no_wa: '6281234567890',
    alamat: 'Jl. Raya Manyar No. 72, Menur Pumpungan, Sukolilo, Surabaya',
    latitude: -7.2882,
    longitude: 112.7684,
    category_id: 1, // Makanan
    region_id: 1,   // Surabaya
    foto_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: true
  },
  // 30. Jasa Hampers Parcel UMKM
  {
    nama: 'Paket Parsel Hampers Produk UMKM Pilihan Nusantara',
    deskripsi: 'Layanan jasa pembuatan bingkisan kado dan parcel hari raya / corporate gift custom menggunakan aneka produk kurasi UMKM lokal binaan (kopi gayo, keripik tempe, madu hutan, lilin aromaterapi, dan mug keramik). Dikemas cantik dalam keranjang anyaman bambu rotan ramah lingkungan.',
    harga: 185000,
    satuan: 'Box / Kotak',
    kondisi_stok: 'pre_order',
    metode_pengiriman: ['Khusus Area Lokal (Kurir Instan / Sameday)', 'Bisa Kirim Seluruh Indonesia (Ekspedisi Cargo)'],
    varian: 'Paket Sahaja (3 Produk), Paket Juara Eksklusif (5 Produk + Kartu Ucapan)',
    no_izin: 'NIB 1204200192841, Anggota Asosiasi Pengrajin Parsel Nusantara',
    no_wa: '6281234567890',
    alamat: 'Jl. Jemursari No. 110, Wonocolo, Surabaya',
    latitude: -7.3175,
    longitude: 112.7485,
    category_id: 6, // Jasa
    region_id: 1,   // Surabaya
    foto_url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'approved',
    target_featured: true
  },
  // 31. Pending Item 1 for Admin Moderation
  {
    nama: 'Keripik Tempe Sagu Krispi Gurih Renyah Bawang 150gr',
    deskripsi: 'Inovasi olahan keripik tempe yang dipadukan dengan tepung sagu renyah ringan. Menggunakan resep bumbu bawang putih goreng gurih dan ketumbar sangrai. Tidak keras, sangat renyah, dan cocok untuk segala usia.',
    harga: 16000,
    satuan: 'Pack / Bungkus',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Bisa COD (Bayar di Tempat)'],
    varian: 'Original Gurih Bawang, Balado Pedas Daun Jeruk',
    no_izin: 'P-IRT Sedang Proses Uji Laboratorium Dinkes',
    no_wa: '6285712345678',
    alamat: 'Jl. Cikutra No. 89, Cibeunying Kidul, Bandung',
    latitude: -6.8978,
    longitude: 107.6385,
    category_id: 1, // Makanan
    region_id: 5,   // Bandung
    foto_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d628169e?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1621996346565-e3d5d628169e?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'pending',
    target_featured: false
  },
  // 32. Pending Item 2 for Admin Moderation
  {
    nama: 'Sambal Andaliman Pedas Getir Khas Danau Toba 200gr',
    deskripsi: 'Sambal rempah eksotis khas tanah Batang Toba menggunakan merica andaliman (Sichuan pepper nusantara) segar. Menghasilkan sensasi pedas getir, kebas lidah yang unik, dan aroma citrus yang menggugah selera makan daging atau ikan bakar.',
    harga: 38000,
    satuan: 'Botol',
    kondisi_stok: 'ready_stock',
    metode_pengiriman: ['Bisa Kirim Seluruh Indonesia (Ekspedisi)', 'Khusus Area Lokal (Kurir Instan / Sameday)'],
    varian: 'Pedas Getir Mantap, Ekstra Jeruk Jungga',
    no_izin: 'P-IRT 2091212010041-27',
    no_wa: '6281398765432',
    alamat: 'Jl. Sisingamangaraja No. 88, Teladan, Medan Kota, Medan',
    latitude: 3.5684,
    longitude: 98.6912,
    category_id: 1, // Makanan
    region_id: 10,  // Medan
    foto_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    foto_urls: [
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80'
    ],
    target_status: 'pending',
    target_featured: false
  }
];

async function runSeed() {
  console.log('1. Logging in as Penjual (seller) to insert products under valid RLS policy...');
  const sellerClient = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: sellerAuth, error: sellerAuthErr } = await sellerClient.auth.signInWithPassword({
    email: 'penjual@gmail.com',
    password: '123456'
  });
  if (sellerAuthErr) {
    console.error('Seller login error:', sellerAuthErr);
    process.exit(1);
  }
  const sellerUid = sellerAuth.user.id;
  console.log('Logged in as seller UID:', sellerUid);

  console.log('2. Inserting products with status=pending & is_featured=false...');
  const insertedIds = [];

  for (let i = 0; i < productsData.length; i++) {
    const item = productsData[i];
    const payload = {
      nama: item.nama,
      deskripsi: item.deskripsi,
      harga: item.harga,
      satuan: item.satuan,
      kondisi_stok: item.kondisi_stok,
      metode_pengiriman: item.metode_pengiriman,
      varian: item.varian,
      no_izin: item.no_izin,
      no_wa: item.no_wa,
      alamat: item.alamat,
      latitude: item.latitude,
      longitude: item.longitude,
      category_id: item.category_id,
      region_id: item.region_id,
      foto_url: item.foto_url,
      foto_urls: item.foto_urls,
      seller_id: sellerUid,
      status: 'pending',
      is_featured: false,
      is_active: true
    };

    const { data: inserted, error: insErr } = await sellerClient
      .from('products')
      .insert(payload)
      .select('id, nama');

    if (insErr) {
      console.error(`Failed to insert [${i + 1}/${productsData.length}] "${item.nama}":`, insErr.message);
    } else {
      const prodId = inserted[0].id;
      insertedIds.push({ id: prodId, target_status: item.target_status, target_featured: item.target_featured });
      console.log(`[${i + 1}/${productsData.length}] Inserted: ${item.nama}`);
    }
  }

  console.log(`\n3. Logging in as Admin to approve and feature selected products...`);
  const adminClient = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { error: adminAuthErr } = await adminClient.auth.signInWithPassword({
    email: 'admin@gmail.com',
    password: '123456'
  });
  if (adminAuthErr) {
    console.error('Admin login error:', adminAuthErr);
    process.exit(1);
  }
  console.log('Logged in as admin successfully.');

  let approvedCount = 0;
  let featuredCount = 0;
  for (const item of insertedIds) {
    if (item.target_status === 'approved') {
      const { error: updErr } = await adminClient
        .from('products')
        .update({
          status: 'approved',
          is_featured: item.target_featured
        })
        .eq('id', item.id);

      if (updErr) {
        console.error(`Failed to approve ${item.id}:`, updErr.message);
      } else {
        approvedCount++;
        if (item.target_featured) featuredCount++;
      }
    }
  }

  console.log(`\n🎉 SEED SUCCESS!`);
  console.log(`- Total inserted: ${insertedIds.length}`);
  console.log(`- Approved by Admin: ${approvedCount}`);
  console.log(`- Featured (Unggulan): ${featuredCount}`);
  console.log(`- Pending in Moderation: ${insertedIds.length - approvedCount}`);

  const { count } = await adminClient.from('products').select('*', { count: 'exact', head: true });
  console.log(`Total verified products in database: ${count}`);
}

runSeed();
