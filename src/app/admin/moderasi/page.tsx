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

  const products = await getModerationProducts(status)

  return (
    <div className="space-y-6">
      {/* Tab Filter Status */}
      <div className="flex border-b border-neutral-200">
        <Link
          href="/admin/moderasi?status=pending"
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
            status === 'pending'
              ? 'border-amber-600 text-amber-700 bg-amber-50/50'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>Menunggu Moderasi (Pending)</span>
        </Link>
        <Link
          href="/admin/moderasi?status=approved"
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
            status === 'approved'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>Disetujui (Approved)</span>
        </Link>
        <Link
          href="/admin/moderasi?status=rejected"
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
            status === 'rejected'
              ? 'border-rose-600 text-rose-700 bg-rose-50/50'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>Ditolak (Rejected)</span>
        </Link>
      </div>

      {/* Daftar Produk */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 mb-3">
            <Inbox className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-neutral-800">
            Tidak Ada Produk Berstatus &quot;{status}&quot;
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm">
            Semua antrean moderasi pada kategori ini telah diproses atau belum ada produk baru yang masuk.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-medium text-neutral-500">
            Menampilkan total {products.length} produk dalam status {status}
          </p>
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <AdminModerationItem key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
