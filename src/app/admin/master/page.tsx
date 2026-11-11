import { getMasterData } from '@/features/admin/queries'
import { AdminMasterManager } from '@/components/admin-master-manager'

export const metadata = {
  title: 'Master Data Kategori & Daerah - LapakKita',
}

export default async function AdminMasterPage() {
  const { categories, regions } = await getMasterData()

  return (
    <div className="space-y-6 sm:space-y-7 w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Kelola Master Kategori &amp; Daerah
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Tambahkan atau sesuaikan daftar kategori usaha dan daerah operasional UMKM yang tersedia di platform LapakKita.
        </p>
      </div>

      <AdminMasterManager categories={categories} regions={regions} />
    </div>
  )
}
