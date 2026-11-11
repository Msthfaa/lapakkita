import Link from 'next/link'
import { Layers, ArrowUpRight, FolderTree, Tag } from 'lucide-react'

interface CategoryStat {
  nama: string
  count: number
  color: string
}

interface AdminMasterOverviewProps {
  categories: CategoryStat[]
}

export function AdminMasterOverview({ categories }: AdminMasterOverviewProps) {
  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-6 shadow-2xs transition-all duration-300 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Kategori Teratas
          </h3>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
            Distribusi produk per bidang UMKM
          </p>
        </div>
        <Link
          href="/admin/master"
          className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60 px-3 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-105 active:scale-95"
        >
          <span>+ Master Data</span>
        </Link>
      </div>

      {/* List (Donezo Project list replica) */}
      <div className="space-y-2.5 my-2">
        {categories.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-400">
            Belum ada kategori data.
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.nama}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  className="flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs shrink-0"
                >
                  <Tag className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                    {cat.nama}
                  </p>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                    Sektor Bisnis Lokal
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-neutral-100 dark:bg-neutral-900 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                {cat.count} Produk
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900 text-right">
        <Link
          href="/admin/master"
          className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Kelola kategori &amp; daerah &rarr;
        </Link>
      </div>
    </div>
  )
}
