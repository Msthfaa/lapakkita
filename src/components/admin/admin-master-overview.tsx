import Link from 'next/link'
import { Tag, ArrowUpRight } from 'lucide-react'

interface CategoryStat {
  nama: string
  count: number
  color: string
}

interface AdminMasterOverviewProps {
  categories: CategoryStat[]
}

export function AdminMasterOverview({ categories }: AdminMasterOverviewProps) {
  const maxCount = Math.max(1, ...categories.map((c) => c.count))

  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-5 sm:p-6 shadow-2xs transition-all duration-300 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Kategori Teratas
          </h3>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
            Distribusi sektor produk UMKM
          </p>
        </div>
        <Link
          href="/admin/master"
          className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-105 active:scale-95"
        >
          <span>Kelola Master</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {/* List with Mini Progress Bars */}
      <div className="space-y-2.5 my-2">
        {categories.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-400">
            Belum ada kategori data.
          </div>
        ) : (
          categories.slice(0, 5).map((cat) => {
            const barWidth = Math.max(15, Math.round((cat.count / maxCount) * 100))

            return (
              <div
                key={cat.nama}
                className="group p-2 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                      className="flex h-7 w-7 items-center justify-center rounded-xl font-bold text-xs shrink-0"
                    >
                      <Tag className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                      {cat.nama}
                    </span>
                  </div>

                  <span className="rounded-full bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                    {cat.count} Item
                  </span>
                </div>

                {/* Progress bar tipis */}
                <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${barWidth}%`, backgroundColor: cat.color }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900 text-right">
        <Link
          href="/admin/master"
          className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Lihat semua kategori &amp; daerah &rarr;
        </Link>
      </div>
    </div>
  )
}
