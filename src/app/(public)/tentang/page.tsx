import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Store,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Lock,
  FileText,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  UserCheck,
  MessageSquare,
  Award,
  BadgePercent,
  Compass,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tentang Kami - LapakKita | Etalase Digital UMKM Lokal',
  description:
    'Pelajari apa itu LapakKita, visi misi mengangkat karya anak bangsa, cara bertransaksi langsung via WhatsApp, serta kebijakan privasi kami.',
}

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300 pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* ========================================================= */}
        {/* BREADCRUMB & HEADER SECTION                                */}
        {/* ========================================================= */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          {/* Breadcrumb Pill */}
          <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 rounded-full glass-pill px-4 py-1.5 text-xs text-neutral-600 dark:text-neutral-300 shadow-2xs">
            <Link href="/" className="hover:text-[#186049] dark:hover:text-white transition-colors">
              Beranda
            </Link>
            <ChevronRight className="h-3 w-3 text-neutral-400" />
            <span className="font-semibold text-[#186049] dark:text-[#ECE8AF]">
              Tentang Kami
            </span>
          </nav>

          {/* Slogan Pill */}
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECE8AF]/60 dark:bg-white/10 border border-[#186049]/15 dark:border-white/10 px-4 py-1 text-xs font-semibold text-[#186049] dark:text-[#ECE8AF] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#186049] dark:text-[#ECE8AF]" />
              <span>Etalase Produk Nusantara Terpercaya</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-neutral-900 dark:text-white leading-[1.2]">
            Karya Anak Bangsa,
            <br />
            Kualitas Juara,
            <br />
            <span className="text-[#186049] dark:text-[#ECE8AF] font-medium">Harga Bersahaja</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            LapakKita hadir sebagai jembatan langsung antara pengrajin &amp; pelaku UMKM lokal terpilih di seluruh Nusantara dengan konsumen yang mencintai produk otentik berstandar juara.
          </p>
        </div>

        {/* ========================================================= */}
        {/* SECTION 1: APA SIH LAPAKKITA?                             */}
        {/* ========================================================= */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#186049] dark:text-[#ECE8AF]">
              Mengenal Platform
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-neutral-900 dark:text-white mt-1">
              Apa Sih LapakKita?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Bukan sekadar marketplace biasa, melainkan panggung kehormatan bagi produk lokal Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: 0% Komisi */}
            <div className="group rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md p-6 sm:p-8 space-y-4 shadow-xs transition-all hover:border-[#186049]/40 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#186049] to-[#4A943E] text-white shadow-xs">
                <BadgePercent className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-neutral-900 dark:text-white">
                0% Biaya Komisi &amp; Perantara
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                100% uang pembelian diterima langsung oleh pelaku UMKM. Tanpa potongan komisi aplikasi yang mencekik, sehingga penjual dapat menawarkan harga yang paling bersahaja bagi pembeli.
              </p>
            </div>

            {/* Card 2: Kurasi Terverifikasi */}
            <div className="group rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md p-6 sm:p-8 space-y-4 shadow-xs transition-all hover:border-[#186049]/40 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#186049] to-[#257d5a] text-white shadow-xs">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-neutral-900 dark:text-white">
                Kurasi &amp; Legalitas Resmi
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Setiap lapak dan produk melewati peninjauan ketat oleh kurator kami. Kami memprioritaskan UMKM yang memiliki legalitas jelas seperti nomor izin edar P-IRT, Sertifikat Halal, maupun NIB resmi.
              </p>
            </div>

            {/* Card 3: Direct to WhatsApp */}
            <div className="group rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md p-6 sm:p-8 space-y-4 shadow-xs transition-all hover:border-[#186049]/40 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4A943E] to-[#2a7a58] text-white shadow-xs">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-neutral-900 dark:text-white">
                Komunikasi Personal &amp; Ramah
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Menghubungkan pembeli langsung ke pemilik UMKM via WhatsApp dengan satu ketukan. Anda bisa bertanya kustomisasi pesanan, stok segar harian, hingga menjalin relasi langganan yang hangat.
              </p>
            </div>
          </div>

          {/* Visi Misi Banner */}
          <div className="rounded-3xl border border-[#186049]/20 dark:border-neutral-800 bg-gradient-to-br from-[#186049]/10 via-[#ECE8AF]/20 to-transparent dark:from-[#186049]/30 dark:via-neutral-900/40 dark:to-neutral-900 p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#186049] text-white px-3 py-1 text-xs font-semibold">
                  <Award className="h-3.5 w-3.5" />
                  <span>Visi Mulia Kami</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-900 dark:text-white">
                  Mengangkat Derajat Produk Lokal ke Kancah Nasional
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Kami percaya bahwa karya tangan anak bangsa—dari racikan kopi dataran tinggi Gayo, kue lapis legit legendaris, hingga tenun dan kriya nusantara—memiliki kualitas yang tidak kalah dengan brand internasional. LapakKita didesain modern untuk memberikan panggung digital yang setara bagi mereka.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/80 dark:bg-neutral-900/80 p-5 border border-neutral-200/80 dark:border-neutral-800">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#186049] dark:text-[#ECE8AF]">100%</span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">Produk Asli UMKM Indonesia</p>
                </div>
                <div className="rounded-2xl bg-white/80 dark:bg-neutral-900/80 p-5 border border-neutral-200/80 dark:border-neutral-800">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#186049] dark:text-[#ECE8AF]">0%</span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">Potongan Komisi Transaksi</p>
                </div>
                <div className="rounded-2xl bg-white/80 dark:bg-neutral-900/80 p-5 border border-neutral-200/80 dark:border-neutral-800">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#186049] dark:text-[#ECE8AF]">Terverifikasi</span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">Kurasi P-IRT &amp; Izin Usaha</p>
                </div>
                <div className="rounded-2xl bg-white/80 dark:bg-neutral-900/80 p-5 border border-neutral-200/80 dark:border-neutral-800">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#186049] dark:text-[#ECE8AF]">Direct P2P</span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">Langsung ke Kontak Pemilik</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: CARA MENGGUNAKAN LAPAKKITA                     */}
        {/* ========================================================= */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#186049] dark:text-[#ECE8AF]">
              Panduan Praktis
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-neutral-900 dark:text-white mt-1">
              Cara Menggunakan LapakKita
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Alur yang sangat mudah, cepat, dan transparan bagi pembeli maupun pelaku UMKM.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PANDUAN UNTUK PEMBELI */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md p-6 sm:p-10 space-y-6 shadow-xs">
              <div className="flex items-center gap-3 border-b border-neutral-200/70 dark:border-neutral-800 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#186049] text-white">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-neutral-900 dark:text-white">
                    Panduan untuk Pembeli
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Beli produk favorit langsung dari penjualnya dalam 4 langkah
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Step 1 */}
                <div className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#186049]/10 text-[#186049] dark:bg-white/10 dark:text-[#ECE8AF] font-bold text-xs">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Jelajahi Katalog &amp; Pilih Produk
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Temukan aneka produk lokal berkualitas lewat menu <strong>Kategori</strong>, fitur pencarian cepat, atau telusuri produk terpopuler di halaman <strong>Unggulan</strong>.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#186049]/10 text-[#186049] dark:bg-white/10 dark:text-[#ECE8AF] font-bold text-xs">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Cek Spesifikasi &amp; Lokasi Toko
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Lihat galeri foto resolusi tinggi, pilih varian rasa/ukuran, cek sertifikasi legalitas (P-IRT/Halal), serta peta titik lokasi toko penjual.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#186049]/10 text-[#186049] dark:bg-white/10 dark:text-[#ECE8AF] font-bold text-xs">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Ketuk &ldquo;Hubungi via WhatsApp&rdquo;
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Sistem kami secara otomatis menyusun draf pesan pemesanan lengkap dengan nama produk dan varian ke nomor WhatsApp resmi penjual.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#186049]/10 text-[#186049] dark:bg-white/10 dark:text-[#ECE8AF] font-bold text-xs">
                    4
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Sepakati Pengiriman &amp; Terima Barang
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Pilih metode pengiriman yang didukung (Kurir Instan, Ekspedisi Luar Kota, atau Ambil di Tempat). Pembayaran dilakukan langsung ke rekening penjual.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/kategori"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#186049] hover:bg-[#124b39] text-white py-3 text-xs font-semibold shadow-xs transition-transform hover:scale-[1.01]"
                >
                  <Compass className="h-4 w-4" />
                  <span>Mulai Cari Produk Lokal Sekarang</span>
                </Link>
              </div>
            </div>

            {/* PANDUAN UNTUK PENJUAL UMKM */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md p-6 sm:p-10 space-y-6 shadow-xs">
              <div className="flex items-center gap-3 border-b border-neutral-200/70 dark:border-neutral-800 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4A943E] text-white">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-neutral-900 dark:text-white">
                    Panduan untuk Pelaku UMKM
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Buka etalase digital tanpa biaya pendaftaran &amp; komisi
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Step 1 */}
                <div className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4A943E]/10 text-[#4A943E] dark:bg-white/10 dark:text-[#ECE8AF] font-bold text-xs">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Daftar Akun Gratis
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Klik tombol <strong>Daftar</strong> di navigasi atas. Masukkan email, nama toko, dan nomor WhatsApp bisnis aktif yang siap melayani pesanan pelanggan.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4A943E]/10 text-[#4A943E] dark:bg-white/10 dark:text-[#ECE8AF] font-bold text-xs">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Lengkapi Profil &amp; Legalitas
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Tambahkan alamat toko, deskripsi profil usaha, dan nomor izin usaha (P-IRT/Halal/NIB) untuk mendapatkan lencana status <em>Terverifikasi</em>.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4A943E]/10 text-[#4A943E] dark:bg-white/10 dark:text-[#ECE8AF] font-bold text-xs">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Pasang Produk Unggulan Anda
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Unggah foto produk terbaik, tentukan harga, varian, stok, serta deskripsi keunggulan produk. Produk masuk antrean moderasi secara otomatis.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4A943E]/10 text-[#4A943E] dark:bg-white/10 dark:text-[#ECE8AF] font-bold text-xs">
                    4
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Terima Orderan Masuk via WhatsApp
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Setelah disetujui, produk Anda langsung tayang di katalog publik. Calon pembeli dari seluruh Indonesia akan langsung menghubungi nomor WhatsApp Anda.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/daftar"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#186049] to-[#4A943E] hover:opacity-95 text-white py-3 text-xs font-semibold shadow-xs transition-transform hover:scale-[1.01]"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Daftarkan Usaha Anda Sekarang (Gratis)</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: KEBIJAKAN & PRIVASI                            */}
        {/* ========================================================= */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#186049] dark:text-[#ECE8AF]">
              Keamanan &amp; Perlindungan
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-neutral-900 dark:text-white mt-1">
              Kebijakan &amp; Privasi Pengguna
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Komitmen kami dalam menjaga kenyamanan, keamanan data, dan transparansi di LapakKita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Perlindungan Data Pribadi */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md p-6 sm:p-8 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <Lock className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white">
                  1. Perlindungan &amp; Privasi Data
                </h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed list-disc list-inside">
                <li>Kami hanya mengumpulkan data identitas yang esensial (nama, email, nomor WhatsApp kontak publik, dan profil toko).</li>
                <li>LapakKita <strong>tidak pernah</strong> memperjualbelikan nomor kontak atau data pribadi pengguna kepada pihak ketiga untuk kepentingan spam atau periklanan luar.</li>
                <li>Kerahasiaan akun dilindungi enkripsi standar industri melalui arsitektur keamanan terintegrasi.</li>
              </ul>
            </div>

            {/* Box 2: Model Transaksi Peer-to-Peer */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md p-6 sm:p-8 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white">
                  2. Ketentuan Transaksi Langsung (P2P)
                </h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed list-disc list-inside">
                <li>LapakKita berfungsi sebagai <strong>etalase digital &amp; direktori kurasi</strong>, bukan penyelenggara sistem pembayaran berkas (escrow).</li>
                <li>Kesepakatan harga, pembayaran transfer, dan metode kurir disepakati secara langsung antara pembeli dan pemilik toko via WhatsApp.</li>
                <li>Pastikan untuk selalu mengonfirmasi ketersediaan stok, biaya ongkos kirim, dan nomor resi pengiriman kepada penjual sebelum menyelesaikan transfer dana.</li>
              </ul>
            </div>

            {/* Box 3: Standar Kualitas & Larangan Barang */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md p-6 sm:p-8 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <FileText className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white">
                  3. Standar Etalase &amp; Larangan Produk
                </h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed list-disc list-inside">
                <li>Dilarang keras memajang produk bajakan, barang tiruan ilegal, senjata, zat terlarang, atau barang berbahaya lain sesuai undang-undang Republik Indonesia.</li>
                <li>Informasi produk, komposisi, harga, dan foto harus jujur serta merepresentasikan produk fisik yang sebenarnya.</li>
                <li>Tim pengawas LapakKita berhak menolak, mencabut status terverifikasi, atau menghapus toko yang melanggar aturan etalase.</li>
              </ul>
            </div>

            {/* Box 4: Kebijakan Komplain & Bantuan */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md p-6 sm:p-8 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white">
                  4. Penanganan Aduan &amp; Bantuan
                </h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed list-disc list-inside">
                <li>Apabila terdapat ketidaksesuaian pesanan atau kerusakan paket, pembeli disarankan menyertakan video unboxing saat menghubungi penjual.</li>
                <li>Jika ditemukan indikasi kecurangan atau penyalahgunaan akun toko, laporkan segera ke tim moderasi LapakKita agar kami dapat mengambil tindakan verifikasi ulang.</li>
                <li>Kami terus memperkuat fitur reputasi toko agar ekosistem UMKM Indonesia tetap sehat, aman, dan berintegritas.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BOTTOM CALL TO ACTION                                     */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-gradient-to-r from-[#186049] via-[#236e54] to-[#4A943E] p-8 sm:p-14 text-white text-center space-y-6 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-serif text-2xl sm:text-4xl font-normal leading-tight">
              Mari Bergerak Bersama Memajukan UMKM Indonesia
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Dukungan nyata bagi para pelaku usaha lokal dimulai dari pilihan konsumsi kita sehari-hari. Jelajahi ragam produk unggulan atau daftarkan karya terbaik Anda di LapakKita.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/kategori"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#186049] font-bold px-6 py-3 text-xs sm:text-sm transition-transform hover:scale-105 shadow-md"
            >
              <ShoppingBag className="h-4 w-4 text-[#186049]" />
              <span>Jelajahi Produk Pilihan</span>
            </Link>
            <Link
              href="/daftar"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#186049]/40 hover:bg-[#186049]/60 border border-white/30 text-white font-semibold px-6 py-3 text-xs sm:text-sm transition-transform hover:scale-105"
            >
              <Store className="h-4 w-4" />
              <span>Daftarkan Toko UMKM</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
