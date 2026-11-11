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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. KARTU FOKAL UTAMA: Menunggu Moderasi (Palette: #186049, #ECE8AF, #D98327) */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#186049] via-[#1e6f56] to-[#247d62] p-6 sm:p-7 text-white shadow-md flex flex-col justify-between min-h-[175px]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#ECE8AF]">
              Antrean Moderasi
            </span>
            {stats.pendingCount > 0 && (
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#D98327] animate-ping" />
            )}
          </div>
          <Link
            href="/admin/moderasi"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all group-hover:scale-110"
            title="Buka Halaman Moderasi"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="my-2">
          <div className="text-5xl sm:text-6xl font-black font-sans tracking-tight text-white drop-shadow-xs">
            {stats.pendingCount}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#ECE8AF]/20 px-2.5 py-1 text-xs font-semibold text-[#ECE8AF] backdrop-blur-xs">
            {stats.pendingCount > 0 ? (
              <>
                <Clock className="h-3.5 w-3.5 text-[#D98327]" /> Butuh Tindakan
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-[#4A943E]" /> Antrean Bersih
              </>
            )}
          </span>
          <span className="text-xs text-white/70">
            {stats.pendingCount > 0 ? 'prioritas utama' : 'seluruh produk terkurasi'}
          </span>
        </div>

        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[#4A943E]/20 blur-2xl pointer-events-none" />
      </motion.div>

      {/* 2. Produk Disetujui (Aktif di Etalase) */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="group rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-6 sm:p-7 shadow-2xs flex flex-col justify-between min-h-[175px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
            Produk Disetujui
          </span>
          <Link
            href="/admin/moderasi?status=approved"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all group-hover:scale-110"
            title="Lihat Produk Disetujui"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="my-2">
          <div className="text-5xl sm:text-6xl font-black font-sans tracking-tight text-neutral-900 dark:text-white">
            {stats.approvedCount}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Live
          </span>
          <span className="text-xs">Tampil aktif di katalog publik</span>
        </div>
      </motion.div>

      {/* 3. Total Penjual UMKM */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="group rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-6 sm:p-7 shadow-2xs flex flex-col justify-between min-h-[175px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
            Penjual UMKM
          </span>
          <Link
            href="/admin/users"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all group-hover:scale-110"
            title="Kelola Data Penjual"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="my-2">
          <div className="text-5xl sm:text-6xl font-black font-sans tracking-tight text-neutral-900 dark:text-white">
            {stats.sellersCount}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
            <Users className="h-3.5 w-3.5" /> Terverifikasi
          </span>
          <span className="text-xs">Pelaku usaha lokal binaan</span>
        </div>
      </motion.div>

      {/* 4. Produk Ditolak / Butuh Revisi */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="group rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-6 sm:p-7 shadow-2xs flex flex-col justify-between min-h-[175px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
            Produk Ditolak
          </span>
          <Link
            href="/admin/moderasi?status=rejected"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all group-hover:scale-110"
            title="Lihat Produk Ditolak"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="my-2">
          <div className="text-5xl sm:text-6xl font-black font-sans tracking-tight text-neutral-900 dark:text-white">
            {stats.rejectedCount}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#D98327]/15 dark:bg-[#D98327]/25 border border-[#D98327]/30 px-2.5 py-1 text-xs font-semibold text-[#D98327]">
            <AlertOctagon className="h-3.5 w-3.5" /> Butuh Revisi
          </span>
          <span className="text-xs">Menunggu perbaikan seller</span>
        </div>
      </motion.div>
    </div>
  )
}
