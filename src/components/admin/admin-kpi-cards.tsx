'use client'

import Link from 'next/link'
import { ArrowUpRight, Clock, CheckCircle2, Users, AlertOctagon, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

interface AdminKpiCardsProps {
  stats: {
    pendingCount: number
    approvedCount: number
    rejectedCount: number
    sellersCount: number
  }
}

export function AdminKpiCards({ stats }: AdminKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. KARTU FOKAL UTAMA: Menunggu Moderasi (Donezo Hero Green Card) */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B3B2C] via-[#0D4433] to-[#12533F] p-5 text-white shadow-md flex flex-col justify-between min-h-[155px]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-emerald-300">
              Antrean Moderasi
            </span>
            {stats.pendingCount > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-rose-400 animate-ping" />
            )}
          </div>
          <Link
            href="/admin/moderasi"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all group-hover:scale-110"
            title="Buka Halaman Moderasi"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="my-1.5">
          <div className="text-4xl sm:text-5xl font-bold font-sans tracking-tight text-white drop-shadow-xs">
            {stats.pendingCount}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-200 backdrop-blur-xs">
            {stats.pendingCount > 0 ? (
              <>
                <Clock className="h-3 w-3 text-rose-300" /> Butuh Aksi
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-300" /> Antrean Bersih
              </>
            )}
          </span>
          <span className="text-[10px] text-white/70">
            {stats.pendingCount > 0 ? 'prioritas utama' : 'seluruh produk aman'}
          </span>
        </div>

        <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none" />
      </motion.div>

      {/* 2. Produk Disetujui (Aktif di Etalase) */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="group rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-5 shadow-2xs flex flex-col justify-between min-h-[155px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Produk Disetujui
          </span>
          <Link
            href="/admin/moderasi?status=approved"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all group-hover:scale-110"
            title="Lihat Produk Disetujui"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="my-1.5">
          <div className="text-4xl sm:text-5xl font-bold font-sans tracking-tight text-neutral-900 dark:text-white">
            {stats.approvedCount}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Live
          </span>
          <span className="text-[10px]">Tampil di etalase publik</span>
        </div>
      </motion.div>

      {/* 3. Total Penjual UMKM */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="group rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-5 shadow-2xs flex flex-col justify-between min-h-[155px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Penjual UMKM
          </span>
          <Link
            href="/admin/users"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all group-hover:scale-110"
            title="Kelola Data Penjual"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="my-1.5">
          <div className="text-4xl sm:text-5xl font-bold font-sans tracking-tight text-neutral-900 dark:text-white">
            {stats.sellersCount}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-400">
            <Users className="h-3 w-3" /> Terverifikasi
          </span>
          <span className="text-[10px]">Pelaku usaha lokal</span>
        </div>
      </motion.div>

      {/* 4. Produk Ditolak / Butuh Revisi */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="group rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-5 shadow-2xs flex flex-col justify-between min-h-[155px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Produk Ditolak
          </span>
          <Link
            href="/admin/moderasi?status=rejected"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all group-hover:scale-110"
            title="Lihat Produk Ditolak"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="my-1.5">
          <div className="text-4xl sm:text-5xl font-bold font-sans tracking-tight text-neutral-900 dark:text-white">
            {stats.rejectedCount}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-400">
            <AlertOctagon className="h-3 w-3" /> Revisi
          </span>
          <span className="text-[10px]">Menunggu perbaikan seller</span>
        </div>
      </motion.div>
    </div>
  )
}
