import { getModerationProducts } from '@/features/admin/queries'
import { AdminModerationItem } from '@/components/admin-moderation-item'
import Link from 'next/link'
import { Inbox } from 'lucide-react'

interface ModerasiPageProps {
  searchParams: Promise<{
    status?: string
  }>
}

export default async function AdminModerasiPage({ searchParams }: ModerasiPageProps) {
  const params = await searchParams
  const validStatus = ['pending', 'approved', 'rejected'] as const
  type StatusType = (typeof validStatus)[number]

  const status: StatusType = validStatus.includes(params.status as StatusType)
    ? (params.status as StatusType)
    : 'pending'

  const products = await getModerationProducts(status).catch(() => [])

  return (
    <div className="space-y-6 sm:space-y-7 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Moderasi Produk UMKM
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Tinjau kelayakan foto, izin edar, varian, dan deskripsi produk sebelum tampil di katalog publik.
        </p>
      </div>

      {/* Tab Filter Status (Donezo Pill Style) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 w-fit">
        <Link
          href="/admin/moderasi?status=pending"
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
            status === 'pending'
              ? 'bg-white dark:bg-neutral-800 text-amber-700 dark:text-amber-300 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <span>Menunggu Moderasi</span>
        </Link>
        <Link
          href="/admin/moderasi?status=approved"
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
            status === 'approved'
              ? 'bg-white dark:bg-neutral-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <span>Disetujui</span>
        </Link>
        <Link
          href="/admin/moderasi?status=rejected"
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
            status === 'rejected'
              ? 'bg-white dark:bg-neutral-800 text-rose-700 dark:text-rose-300 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <span>Ditolak / Perlu Revisi</span>
        </Link>
      </div>

      {/* Daftar Produk */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-12 sm:p-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 mb-4">
            <Inbox className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Tidak Ada Produk Berstatus &quot;{status}&quot;
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-md">
            Semua antrean moderasi pada kategori status ini telah diproses atau belum ada produk baru yang diajukan.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Menampilkan total <strong className="text-neutral-900 dark:text-white font-bold">{products.length}</strong> produk dalam status {status}
          </p>
          <div className="grid grid-cols-1 gap-5">
            {products.map((product) => (
              <AdminModerationItem key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
