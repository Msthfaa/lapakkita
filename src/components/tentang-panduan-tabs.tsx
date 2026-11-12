'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  ShoppingBag,
  Store,
  Compass,
  UserCheck,
  ShieldCheck,
  MessageCircle,
  Truck,
  UploadCloud,
  FileCheck2,
} from 'lucide-react'

export function TentangPanduanTabs() {
  const [activeTab, setActiveTab] = useState<'pembeli' | 'penjual'>('pembeli')

  return (
    <div className="space-y-8">
      {/* Tab Switcher - Warna Selaras Tanpa Gradien */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 shadow-xs">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('pembeli')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'pembeli'
                ? 'bg-[#186049] text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Panduan untuk Pembeli</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('penjual')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'penjual'
                ? 'bg-[#186049] text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Store className="h-4 w-4" />
            <span>Panduan untuk Pelaku UMKM</span>
          </motion.button>
        </div>
      </div>

      {/* Tab Content with AnimatePresence */}
      <AnimatePresence mode="wait">
        {activeTab === 'pembeli' ? (
          <motion.div
            key="pembeli"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 space-y-4 shadow-xs hover:border-[#186049]/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#186049]/10 dark:bg-[#186049]/30 text-[#186049] dark:text-white font-bold text-xs">
                    01
                  </span>
                  <Compass className="h-5 w-5 text-[#186049] dark:text-white" />
                </div>
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  Pilih Produk Lokal
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Jelajahi etalase berdasarkan kategori atau daerah asal. Setiap produk memajang foto asli dan cerita karya lokal.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.12 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 space-y-4 shadow-xs hover:border-[#186049]/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#186049]/10 dark:bg-[#186049]/30 text-[#186049] dark:text-white font-bold text-xs">
                    02
                  </span>
                  <ShieldCheck className="h-5 w-5 text-[#186049] dark:text-white" />
                </div>
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  Periksa Legalitas Toko
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Cek sertifikasi resmi seperti izin edar P-IRT, Sertifikat Halal, serta alamat fisik toko penjual sebelum memesan.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.19 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 space-y-4 shadow-xs hover:border-[#186049]/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#186049]/10 dark:bg-[#186049]/30 text-[#186049] dark:text-white font-bold text-xs">
                    03
                  </span>
                  <MessageCircle className="h-5 w-5 text-[#186049] dark:text-white" />
                </div>
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  Pesan via WhatsApp
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Klik tombol WhatsApp di halaman produk. Draf format pesanan telah otomatis terisi sehingga Anda tinggal mengirimnya.
                </p>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.26 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 space-y-4 shadow-xs hover:border-[#186049]/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#186049]/10 dark:bg-[#186049]/30 text-[#186049] dark:text-white font-bold text-xs">
                    04
                  </span>
                  <Truck className="h-5 w-5 text-[#186049] dark:text-white" />
                </div>
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  Sepakati Pengiriman
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Tentukan kurir lokal, ekspedisi paket, atau ambil langsung di lokasi. Tanpa potongan biaya komisi perantara.
                </p>
              </motion.div>
            </div>

            <div className="text-center pt-2">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href="/kategori"
                  className="inline-flex items-center gap-2 rounded-full bg-[#186049] hover:bg-[#124b39] text-white px-6 py-3 text-xs sm:text-sm font-semibold shadow-xs"
                >
                  <Compass className="h-4 w-4" />
                  <span>Mulai Jelajahi Katalog Produk Sekarang</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="penjual"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 space-y-4 shadow-xs hover:border-[#186049]/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#186049]/10 dark:bg-[#186049]/30 text-[#186049] dark:text-white font-bold text-xs">
                    01
                  </span>
                  <UserCheck className="h-5 w-5 text-[#186049] dark:text-white" />
                </div>
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  Buka Akun Gratis
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Daftarkan akun penjual dengan email dan nomor WhatsApp bisnis aktif. Proses cepat tanpa dipungut biaya registrasi.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.12 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 space-y-4 shadow-xs hover:border-[#186049]/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#186049]/10 dark:bg-[#186049]/30 text-[#186049] dark:text-white font-bold text-xs">
                    02
                  </span>
                  <FileCheck2 className="h-5 w-5 text-[#186049] dark:text-white" />
                </div>
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  Lengkapi Profil Usaha
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Masukkan nama toko, alamat lengkap, dan nomor legalitas resmi (P-IRT/Halal/NIB) agar toko Anda terverifikasi.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.19 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 space-y-4 shadow-xs hover:border-[#186049]/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#186049]/10 dark:bg-[#186049]/30 text-[#186049] dark:text-white font-bold text-xs">
                    03
                  </span>
                  <UploadCloud className="h-5 w-5 text-[#186049] dark:text-white" />
                </div>
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  Pasang Foto &amp; Varian
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Unggah foto produk resolusi tinggi, tulis deskripsi keunggulan produk, tentukan harga, dan varian yang tersedia.
                </p>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.26 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 space-y-4 shadow-xs hover:border-[#186049]/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#186049]/10 dark:bg-[#186049]/30 text-[#186049] dark:text-white font-bold text-xs">
                    04
                  </span>
                  <MessageCircle className="h-5 w-5 text-[#186049] dark:text-white" />
                </div>
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  Terima Orderan Langsung
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Setelah moderasi disetujui, pembeli dari seluruh Indonesia langsung menghubungi WhatsApp Anda dengan 0% potongan komisi.
                </p>
              </motion.div>
            </div>

            <div className="text-center pt-2">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href="/daftar"
                  className="inline-flex items-center gap-2 rounded-full bg-[#186049] hover:bg-[#124b39] text-white px-6 py-3 text-xs sm:text-sm font-semibold shadow-xs"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Daftarkan Usaha Anda Sekarang (Gratis)</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
