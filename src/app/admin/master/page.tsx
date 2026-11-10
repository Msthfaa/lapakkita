import { getMasterData } from '@/features/admin/queries'
import { AdminMasterManager } from '@/components/admin-master-manager'

export const metadata = {
  title: 'Master Data Kategori & Daerah - LapakKita',
}

export default async function AdminMasterPage() {
  const { categories, regions } = await getMasterData()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">
          Kelola Master Kategori & Daerah
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Tambahkan atau sesuaikan daftar kategori usaha dan daerah operasional UMKM yang tersedia di platform LapakKita.
        </p>
      </div>

      <AdminMasterManager categories={categories} regions={regions} />
    </div>
  )
}
