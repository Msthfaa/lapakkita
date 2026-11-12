'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'

interface KebijakanItem {
  id: number
  title: string
  paragraphs: string[]
}

const KEBIJAKAN_ITEMS: KebijakanItem[] = [
  {
    id: 1,
    title: '1. Perlindungan & Privasi Data Pribadi',
    paragraphs: [
      'Kami hanya menyimpan data penting yang dibutuhkan untuk operasional akun (alamat email, nama usaha, dan nomor WhatsApp kontak publik).',
      'LapakKita menjamin kerahasiaan informasi Anda dan tidak akan pernah menjual, menyewakan, atau membagikan nomor kontak pengguna kepada pihak ketiga manapun untuk keperluan spam atau iklan komersial.',
    ],
  },
  {
    id: 2,
    title: '2. Ketentuan Transaksi Langsung (P2P via WhatsApp)',
    paragraphs: [
      'LapakKita berfungsi sebagai etalase digital promosi dan direktori UMKM terkurasi, bukan rekening bersama (escrow).',
      'Pembayaran, detail ongkos kirim, dan pemilihan kurir disepakati secara langsung antara pembeli dan pemilik toko via WhatsApp resmi yang terdaftar. Pastikan selalu mengonfirmasi rincian pesanan dan total harga sebelum mentransfer pembayaran.',
    ],
  },
  {
    id: 3,
    title: '3. Standar Kualitas Produk & Larangan Etalase',
    paragraphs: [
      'LapakKita melarang keras penayangan produk tiruan ilegal, barang bajakan, narkotika, obat terlarang, senjata, atau barang lain yang dilarang undang-undang Republik Indonesia.',
      'Foto produk dan deskripsi harus orisinal dan sesuai dengan kondisi fisik barang yang sebenarnya. Tim kurasi berhak menonaktifkan produk atau menutup toko yang melanggar ketentuan etalase.',
    ],
  },
  {
    id: 4,
    title: '4. Bantuan Pengaduan & Verifikasi Ulang',
    paragraphs: [
      'Apabila pembeli menemukan toko dengan informasi palsu atau mengalami kendala komunikasi dengan penjual terdaftar, laporan dapat disampaikan kepada admin LapakKita untuk ditindaklanjuti dengan verifikasi ulang atau pencabutan akun.',
    ],
  },
]

export function TentangKebijakanInteractive() {
  const [activeId, setActiveId] = useState<number | null>(1)

  return (
    <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 divide-y divide-neutral-200 dark:divide-neutral-800 shadow-xs overflow-hidden">
      {KEBIJAKAN_ITEMS.map((item) => {
        const isOpen = activeId === item.id

        return (
          <div
            key={item.id}
            onMouseEnter={() => setActiveId(item.id)}
            onClick={() => setActiveId(isOpen ? null : item.id)}
            className={`transition-colors duration-200 cursor-pointer ${
              isOpen
                ? 'bg-neutral-50/70 dark:bg-neutral-800/40'
                : 'hover:bg-neutral-50/40 dark:hover:bg-neutral-800/20'
            }`}
          >
            {/* Header Judul (Tanpa Ikon sesuai permintaan user) */}
            <div className="p-6 sm:p-7 flex items-center justify-between gap-4">
              <h3
                className={`font-serif text-base sm:text-lg font-semibold transition-colors ${
                  isOpen
                    ? 'text-[#186049] dark:text-white'
                    : 'text-neutral-900 dark:text-white'
                }`}
              >
                {item.title}
              </h3>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  isOpen
                    ? 'bg-[#186049]/10 text-[#186049] dark:bg-white/10 dark:text-white'
                    : 'text-neutral-400'
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </div>

            {/* Konten Detail: Animasi Slide & Fade Halus */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                    {item.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
