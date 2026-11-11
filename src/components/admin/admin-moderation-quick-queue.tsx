'use client'

import Link from 'next/link'
import { CheckSquare, ArrowRight, Clock, ShieldCheck, Sparkles } from 'lucide-react'
import { formatRupiah } from '@/lib/format'
import { motion } from 'motion/react'

interface PendingProduct {
  id: string
  nama: string
  harga: number
  foto_url: string | null
  created_at: string
  category: { nama: string } | null
  seller: { nama: string } | null
}

interface AdminModerationQuickQueueProps {
  pendingCount: number
  pendingProducts: PendingProduct[]
}

export function AdminModerationQuickQueue({
  pendingCount,
  pendingProducts,
}: AdminModerationQuickQueueProps) {
  const latestPending = pendingProducts[0]

  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-6 sm:p-7 shadow-2xs transition-all duration-300 flex flex-col justify-between">
      {/* Header Label */}
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Aksi Prioritas
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            pendingCount > 0
              ? 'bg-[#D98327]/15 text-[#D98327] dark:bg-[#D98327]/25 animate-pulse'
              : 'bg-[#ECE8AF]/60 text-[#186049] dark:bg-[#186049]/40 dark:text-[#ECE8AF]'
          }`}
        >
          {pendingCount > 0 ? (
            <>
              <Clock className="h-3.5 w-3.5" /> {pendingCount} Pending
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-[#4A943E]" /> Terkendali
            </>
          )}
        </span>
      </div>

      {/* Main Content (Donezo Reminders / Meeting replica) */}
      <div className="my-3 space-y-2">
        {pendingCount > 0 && latestPending ? (
          <div>
            <h4 className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white leading-snug line-clamp-2">
              Verifikasi: {latestPending.nama}
            </h4>
            <div className="mt-1.5 flex items-center gap-2.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              <span className="font-bold text-[#186049] dark:text-[#4A943E] text-sm sm:text-base">
                {formatRupiah(latestPending.harga)}
              </span>
              <span>&bull;</span>
              <span className="truncate max-w-[160px] font-medium">
                {latestPending.seller?.nama || 'Penjual UMKM'}
              </span>
            </div>
            {latestPending.category && (
              <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                Sektor Kategori: <strong className="text-neutral-700 dark:text-neutral-300 font-semibold">{latestPending.category.nama}</strong>
              </p>
            )}
          </div>
        ) : (
          <div>
            <h4 className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white leading-snug">
              Semua Produk Terverifikasi
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Tidak ada produk yang menunggu persetujuan. Seluruh katalog UMKM dalam kondisi bersih &amp; terkurasi.
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {pendingCount > 0 ? (
            <Link
              href="/admin/moderasi"
              className="w-full h-12 flex items-center justify-center gap-2.5 rounded-2xl bg-[#186049] hover:bg-[#124b39] text-white font-semibold text-sm px-5 shadow-sm transition-colors"
            >
              <CheckSquare className="h-4.5 w-4.5" />
              <span>Mulai Moderasi Produk</span>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Link>
          ) : (
            <Link
              href="/admin/moderasi"
              className="w-full h-12 flex items-center justify-center gap-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-sm px-5 transition-colors"
            >
              <ShieldCheck className="h-4.5 w-4.5 text-[#4A943E]" />
              <span>Kelola Riwayat Moderasi</span>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  )
}
