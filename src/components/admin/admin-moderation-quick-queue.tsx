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
    <div className="rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-5 sm:p-6 shadow-2xs transition-all duration-300 flex flex-col justify-between">
      {/* Header Label */}
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          Aksi Prioritas
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            pendingCount > 0
              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 animate-pulse'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
          }`}
        >
          {pendingCount > 0 ? (
            <>
              <Clock className="h-3 w-3" /> {pendingCount} Pending
            </>
          ) : (
            <>
              <ShieldCheck className="h-3 w-3" /> Terkendali
            </>
          )}
        </span>
      </div>

      {/* Main Content (Donezo Reminders / Meeting replica) */}
      <div className="my-2 space-y-1.5">
        {pendingCount > 0 && latestPending ? (
          <div>
            <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-snug line-clamp-2">
              Verifikasi: {latestPending.nama}
            </h4>
            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(latestPending.harga)}
              </span>
              <span>&bull;</span>
              <span className="truncate max-w-[140px]">
                {latestPending.seller?.nama || 'Penjual UMKM'}
              </span>
            </div>
            {latestPending.category && (
              <p className="mt-0.5 text-[10px] text-neutral-400 dark:text-neutral-500">
                Sektor: {latestPending.category.nama}
              </p>
            )}
          </div>
        ) : (
          <div>
            <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-snug">
              Semua Produk Terverifikasi
            </h4>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Tidak ada produk yang menunggu persetujuan. Seluruh katalog UMKM dalam kondisi bersih &amp; terkurasi.
            </p>
          </div>
        )}
      </div>

      {/* Action Button (Donezo Start Meeting Button replica) */}
      <div className="pt-2">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {pendingCount > 0 ? (
            <Link
              href="/admin/moderasi"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0B3B2C] hover:bg-[#0D4433] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 shadow-xs transition-colors"
            >
              <CheckSquare className="h-4 w-4" />
              <span>Mulai Moderasi Produk</span>
              <ArrowRight className="h-3.5 w-3.5 ml-auto" />
            </Link>
          ) : (
            <Link
              href="/admin/moderasi"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs py-2.5 px-4 transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Kelola Riwayat Moderasi</span>
              <ArrowRight className="h-3.5 w-3.5 ml-auto" />
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  )
}
