import Link from 'next/link'
import { ArrowUpRight, Clock, CheckCircle2, Users, AlertOctagon, Sparkles } from 'lucide-react'

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
      {/* 1. KARTU UTAMA FOKAL: Menunggu Moderasi (Forest Green - Donezo Hero Style) */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B3B2C] via-[#0D4433] to-[#12533F] p-6 text-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between min-h-[170px]">
        {/* Top Label & Action Arrow */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-300 tracking-wide">
              Menunggu Moderasi
            </span>
            {stats.pendingCount > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-rose-400 animate-ping" />
            )}
          </div>
          <Link
            href="/admin/moderasi"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all duration-200 group-hover:scale-110"
            title="Buka Halaman Moderasi"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Big Number Display */}
        <div className="my-2">
          <div className="text-4xl sm:text-5xl font-bold font-sans tracking-tight text-white drop-shadow-xs">
            {stats.pendingCount}
          </div>
        </div>

        {/* Bottom Subtitle / Badge */}
        <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-200 backdrop-blur-xs">
            {stats.pendingCount > 0 ? (
              <>
                <Clock className="h-3 w-3" /> Butuh Tindakan
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3" /> Antrean Bersih
              </>
            )}
          </span>
          <span className="text-[11px] text-white/70">
            {stats.pendingCount > 0 ? 'prioritas utama' : 'semua ditinjau'}
          </span>
        </div>

        {/* Decorative subtle ambient circle glow */}
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none" />
      </div>

      {/* 2. Produk Disetujui (Aktif di Etalase) */}
      <div className="group rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-6 shadow-2xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between min-h-[170px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Produk Disetujui
          </span>
          <Link
            href="/admin/moderasi"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all duration-200 group-hover:scale-110"
            title="Lihat Produk Disetujui"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="my-2">
          <div className="text-4xl sm:text-5xl font-bold font-sans tracking-tight text-neutral-900 dark:text-white">
            {stats.approvedCount}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Live
          </span>
          <span className="text-[11px]">Tampil di etalase publik</span>
        </div>
      </div>

      {/* 3. Total Penjual UMKM */}
      <div className="group rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-6 shadow-2xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between min-h-[170px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Penjual UMKM
          </span>
          <Link
            href="/admin/users"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all duration-200 group-hover:scale-110"
            title="Kelola Data Penjual"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="my-2">
          <div className="text-4xl sm:text-5xl font-bold font-sans tracking-tight text-neutral-900 dark:text-white">
            {stats.sellersCount}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
            <Users className="h-3 w-3" /> Terdaftar
          </span>
          <span className="text-[11px]">Pelaku usaha lokal</span>
        </div>
      </div>

      {/* 4. Produk Ditolak / Butuh Revisi */}
      <div className="group rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-6 shadow-2xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between min-h-[170px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Produk Ditolak
          </span>
          <Link
            href="/admin/moderasi"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all duration-200 group-hover:scale-110"
            title="Lihat Produk Ditolak"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="my-2">
          <div className="text-4xl sm:text-5xl font-bold font-sans tracking-tight text-neutral-900 dark:text-white">
            {stats.rejectedCount}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:text-rose-400">
            <AlertOctagon className="h-3 w-3" /> Revisi
          </span>
          <span className="text-[11px]">Menunggu perbaikan seller</span>
        </div>
      </div>
    </div>
  )
}
