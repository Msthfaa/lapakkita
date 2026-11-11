import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Store,
  ShieldCheck,
  HeartHandshake,
  ShoppingBag,
  Lock,
  FileText,
  HelpCircle,
  BadgePercent,
  CheckCircle2,
  Users,
} from 'lucide-react'
import { TentangPanduanTabs } from '@/components/tentang-panduan-tabs'

export const metadata: Metadata = {
  title: 'Tentang Kami - LapakKita | Etalase Digital UMKM Lokal',
  description:
    'Mengenal LapakKita, platform etalase karya anak bangsa yang menghubungkan pelaku UMKM lokal langsung dengan pembeli tanpa komisi perantara.',
}

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300 pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        
        {/* ========================================================= */}
        {/* HEADER SECTION (CLEAN & DIRECT - NO SLOP BADGES/PILLS)   */}
        {/* ========================================================= */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-neutral-900 dark:text-white leading-tight">
            Apa Sih LapakKita?
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            Bukan sekadar marketplace biasa, melainkan panggung etalase digital karya anak bangsa yang menghubungkan pengrajin dan produsen UMKM lokal langsung ke pembeli tanpa komisi perantara.
          </p>
        </div>

        {/* ========================================================= */}
        {/* SECTION 1: MANIFESTO & 3 PILAR NILAI (ASYMMETRIC LAYOUT)  */}
        {/* ========================================================= */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Authentic Manifesto Story (Rich Pine Accent) */}
            <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#186049] via-[#1b6b52] to-[#124b39] p-8 sm:p-10 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                <span className="text-xs font-semibold tracking-wider text-[#ECE8AF] uppercase">
                  Filosofi Kami
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium leading-snug">
                  Setiap Rupiah Kembali Utuh ke Tangan Pelaku Usaha
                </h2>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                  Pasar online konvensional kerap memotong 10% hingga 25% hasil keringat pengrajin untuk biaya komisi. LapakKita didirikan dengan komitmen <strong>0% biaya komisi perantara</strong>.
                </p>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                  Seluruh uang transaksi mengalir langsung kepada pelaku UMKM lokal, sehingga konsumen mendapatkan kualitas juara dengan harga yang paling bersahaja.
                </p>
              </div>

              <div className="pt-8 border-t border-white/15 mt-8 flex items-center gap-3 relative z-10">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <HeartHandshake className="h-5 w-5 text-[#ECE8AF]" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-white">Gerakan Mandiri UMKM</div>
                  <div className="text-neutral-300">Menumbuhkan ekonomi kerakyatan Indonesia</div>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Distinct Core Value Rows */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-4">
              {/* Pillar 1 */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 sm:p-7 space-y-2 shadow-xs hover:border-[#186049]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#186049] dark:text-[#ECE8AF] flex items-center justify-center shrink-0">
                    <BadgePercent className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white">
                    0% Komisi &amp; Bebas Biaya Aplikasi
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 pl-12 leading-relaxed">
                  Tidak ada potongan admin transaksi. Pelaku usaha dapat menjaga margin keuntungan yang sehat tanpa harus menaikkan harga jual kepada pembeli.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 sm:p-7 space-y-2 shadow-xs hover:border-[#186049]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#186049] dark:text-[#ECE8AF] flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white">
                    Kurasi &amp; Legalitas Resmi
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 pl-12 leading-relaxed">
                  Setiap lapak dan produk melewati peninjauan administrasi. Kami memprioritaskan UMKM dengan izin edar P-IRT, Sertifikat Halal, atau NIB yang dapat dicek langsung oleh konsumen.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 sm:p-7 space-y-2 shadow-xs hover:border-[#186049]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#186049] dark:text-[#ECE8AF] flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white">
                    Hubungan Personal Langsung via WhatsApp
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 pl-12 leading-relaxed">
                  Pembeli dapat bertanya langsung, meminta kustomisasi pesanan, atau memastikan ketersediaan barang segar secara real-time langsung ke WhatsApp resmi toko.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: CARA MENGGUNAKAN LAPAKKITA (INTERACTIVE TABS)  */}
        {/* ========================================================= */}
        <section className="space-y-8 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-neutral-900 dark:text-white">
              Cara Menggunakan LapakKita
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Pilih peran Anda untuk melihat langkah praktis bertransaksi atau mendaftarkan toko UMKM.
            </p>
          </div>

          <TentangPanduanTabs />
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: KEBIJAKAN & PRIVASI (STRUCTURED EDITORIAL)     */}
        {/* ========================================================= */}
        <section className="space-y-8 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-neutral-900 dark:text-white">
              Kebijakan &amp; Privasi Pengguna
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Prinsip integritas, keamanan data, dan keterbukaan layanan di ekosistem LapakKita.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 divide-y divide-neutral-200 dark:divide-neutral-800 shadow-xs overflow-hidden">
            
            {/* Rule 1 */}
            <div className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-[#186049] dark:text-[#ECE8AF] flex items-center justify-center shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
                  1. Perlindungan &amp; Privasi Data Pribadi
                </h3>
              </div>
              <div className="pl-11 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                <p>
                  Kami hanya menyimpan data penting yang dibutuhkan untuk operasional akun (alamat email, nama usaha, dan nomor WhatsApp kontak publik).
                </p>
                <p>
                  LapakKita menjamin kerahasiaan informasi Anda dan <strong>tidak akan pernah</strong> menjual, menyewakan, atau membagikan nomor kontak pengguna kepada pihak ketiga manapun untuk keperluan spam atau iklan komersial.
                </p>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-[#186049] dark:text-[#ECE8AF] flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
                  2. Ketentuan Transaksi Langsung (P2P via WhatsApp)
                </h3>
              </div>
              <div className="pl-11 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                <p>
                  LapakKita berfungsi sebagai etalase digital promosi dan direktori UMKM terkurasi, bukan rekening bersama (escrow).
                </p>
                <p>
                  Pembayaran, detail ongkos kirim, dan pemilihan kurir disepakati secara langsung antara pembeli dan pemilik toko via WhatsApp resmi yang terdaftar. Pastikan selalu mengonfirmasi rincian pesanan dan total harga sebelum mentransfer pembayaran.
                </p>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-[#186049] dark:text-[#ECE8AF] flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
                  3. Standar Kualitas Produk &amp; Larangan Etalase
                </h3>
              </div>
              <div className="pl-11 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                <p>
                  LapakKita melarang keras penayangan produk tiruan ilegal, barang bajakan, narkotika, obat terlarang, senjata, atau barang lain yang dilarang undang-undang Republik Indonesia.
                </p>
                <p>
                  Foto produk dan deskripsi harus orisinal dan sesuai dengan kondisi fisik barang yang sebenarnya. Tim kurasi berhak menonaktifkan produk atau menutup toko yang melanggar ketentuan etalase.
                </p>
              </div>
            </div>

            {/* Rule 4 */}
            <div className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-[#186049] dark:text-[#ECE8AF] flex items-center justify-center shrink-0">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
                  4. Bantuan Pengaduan &amp; Verifikasi Ulang
                </h3>
              </div>
              <div className="pl-11 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                <p>
                  Apabila pembeli menemukan toko dengan informasi palsu atau mengalami kendala komunikasi dengan penjual terdaftar, laporan dapat disampaikan kepada admin LapakKita untuk ditindaklanjuti dengan verifikasi ulang atau pencabutan akun.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: CALL TO ACTION (PURPOSEFUL & HIGH CONTRAST)    */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-gradient-to-r from-[#186049] via-[#1b6b52] to-[#4A943E] p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-serif text-2xl sm:text-4xl font-normal leading-tight">
              Mari Bergerak Bersama Memajukan UMKM Indonesia
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Dukungan nyata bagi para pelaku usaha lokal dimulai dari pilihan konsumsi kita sehari-hari. Mulai jelajahi karya juara nusantara atau daftarkan toko Anda sekarang.
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
              <span>Buka Lapak UMKM Gratis</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
