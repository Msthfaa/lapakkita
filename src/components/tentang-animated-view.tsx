'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import {
  Store,
  ShieldCheck,
  HeartHandshake,
  ShoppingBag,
  BadgePercent,
  Users,
} from 'lucide-react'
import { TentangPanduanTabs } from '@/components/tentang-panduan-tabs'
import { TentangKebijakanInteractive } from '@/components/tentang-kebijakan-interactive'

export function TentangAnimatedView() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
      {/* 1. Header with Staggered Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto text-center space-y-4"
      >
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-neutral-900 dark:text-white leading-tight">
          Apa Sih LapakKita?
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto">
          Bukan sekadar marketplace biasa, melainkan panggung etalase digital karya anak bangsa yang menghubungkan pengrajin dan produsen UMKM lokal langsung ke pembeli tanpa komisi perantara.
        </p>
      </motion.div>

      {/* 2. Section 1: Manifesto & 3 Pillars (Scroll Reveal) */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Authentic Manifesto Story (Solid Pine Green, Tanpa Gradien) */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-5 rounded-3xl bg-[#186049] p-8 sm:p-10 text-white flex flex-col justify-between shadow-lg relative overflow-hidden"
          >
            <div className="space-y-4 relative z-10">
              <span className="text-xs font-semibold tracking-wider text-white/90 uppercase">
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
                <HeartHandshake className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white">Gerakan Mandiri UMKM</div>
                <div className="text-neutral-300">Menumbuhkan ekonomi kerakyatan Indonesia</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3 Distinct Core Value Rows */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            {/* Pillar 1 */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 sm:p-7 space-y-2 shadow-xs hover:border-[#186049]/40 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#186049] dark:text-white flex items-center justify-center shrink-0">
                  <BadgePercent className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white">
                  0% Komisi &amp; Bebas Biaya Aplikasi
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 pl-12 leading-relaxed">
                Tidak ada potongan admin transaksi. Pelaku usaha dapat menjaga margin keuntungan yang sehat tanpa harus menaikkan harga jual kepada pembeli.
              </p>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 sm:p-7 space-y-2 shadow-xs hover:border-[#186049]/40 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#186049] dark:text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white">
                  Kurasi &amp; Legalitas Resmi
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 pl-12 leading-relaxed">
                Setiap lapak dan produk melewati peninjauan administrasi. Kami memprioritaskan UMKM dengan izin edar P-IRT, Sertifikat Halal, atau NIB yang dapat dicek langsung oleh konsumen.
              </p>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 sm:p-7 space-y-2 shadow-xs hover:border-[#186049]/40 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#186049] dark:text-white flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white">
                  Hubungan Personal Langsung via WhatsApp
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 pl-12 leading-relaxed">
                Pembeli dapat bertanya langsung, meminta kustomisasi pesanan, atau memastikan ketersediaan barang segar secara real-time langsung ke WhatsApp resmi toko.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 3. Section 2: Cara Menggunakan LapakKita */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="space-y-8 pt-4"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-4xl font-normal text-neutral-900 dark:text-white">
            Cara Menggunakan LapakKita
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Pilih peran Anda untuk melihat langkah praktis bertransaksi atau mendaftarkan toko UMKM.
          </p>
        </div>

        <TentangPanduanTabs />
      </motion.section>

      {/* 4. Section 3: Kebijakan & Privasi */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="space-y-8 pt-4"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-4xl font-normal text-neutral-900 dark:text-white">
            Kebijakan &amp; Privasi Pengguna
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Prinsip integritas, keamanan data, dan keterbukaan layanan di ekosistem LapakKita.
          </p>
        </div>

        <TentangKebijakanInteractive />
      </motion.section>

      {/* 5. Section 4: Call to Action (Card Putih seperti Gambar 4) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-8 sm:p-12 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="max-w-2xl space-y-2 text-center md:text-left">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 dark:text-white leading-tight">
            Mari Bergerak Bersama Memajukan UMKM Indonesia
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Dukungan nyata bagi para pelaku usaha lokal dimulai dari pilihan konsumsi kita sehari-hari. Mulai jelajahi karya juara nusantara atau daftarkan toko Anda sekarang.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
            <Link
              href="/kategori"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#186049] hover:bg-[#124b39] text-white font-semibold px-6 py-3 text-xs sm:text-sm shadow-xs"
            >
              <ShoppingBag className="h-4 w-4 text-white" />
              <span>Jelajahi Produk Pilihan</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
            <Link
              href="/daftar"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-[#186049] dark:hover:border-white/30 font-semibold px-6 py-3 text-xs sm:text-sm"
            >
              <Store className="h-4 w-4" />
              <span>Buka Lapak UMKM Gratis</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
