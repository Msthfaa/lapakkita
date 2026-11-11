import Link from 'next/link'
import Image from 'next/image'
import { CheckSquare, ArrowRight, Clock, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react'
import { formatRupiah } from '@/lib/format'

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
    <div className="rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-6 shadow-2xs transition-all duration-300 flex flex-col justify-between">
      {/* Header Label */}
      <div className="flex items-center justify-between pb-2">
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
              <ShieldCheck className="h-3 w-3" /> Aman
            </>
          )}
        </span>
      </div>

      {/* Main Content (Donezo Meeting Card Replica) */}
      <div className="my-3 space-y-2">
        {pendingCount > 0 && latestPending ? (
          <div>
            <h4 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white leading-snug line-clamp-2">
              Verifikasi Produk: {latestPending.nama}
            </h4>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(latestPending.harga)}
              </span>
              <span>&bull;</span>
              <span className="truncate max-w-[150px]">
                {latestPending.seller?.nama || 'Penjual UMKM'}
              </span>
            </div>
            {latestPending.category && (
              <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                Kategori: {latestPending.category.nama}
              </p>
            )}
          </div>
        ) : (
          <div>
            <h4 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white leading-snug">
              Semua Produk Terverifikasi
            </h4>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Tidak ada produk yang menunggu persetujuan. Seluruh katalog UMKM dalam kondisi bersih &amp; terkurasi.
            </p>
          </div>
        )}
      </div>

      {/* Prominent Action Button (Donezo Start Meeting Button Replica) */}
      <div className="pt-2">
        {pendingCount > 0 ? (
          <Link
            href="/admin/moderasi"
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0B3B2C] hover:bg-[#0D4433] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-xs py-3 px-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <CheckSquare className="h-4 w-4" />
            <span>Mulai Moderasi Produk</span>
            <ArrowRight className="h-3.5 w-3.5 ml-auto" />
          </Link>
        ) : (
          <Link
            href="/admin/moderasi"
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs py-3 px-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Kelola Riwayat Moderasi</span>
            <ArrowRight className="h-3.5 w-3.5 ml-auto" />
          </Link>
        )}
      </div>
    </div>
  )
}
