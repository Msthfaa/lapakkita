'use client'

import Link from 'next/link'
import { Store, ArrowUpRight, Package, MessageCircle } from 'lucide-react'
import { motion } from 'motion/react'

interface SellerItem {
  id: string
  nama: string
  created_at: string
  product_count: number
  alamat?: string | null
}

interface AdminRecentSellersProps {
  sellers: SellerItem[]
}

const AVATAR_COLORS = [
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
]

export function AdminRecentSellers({ sellers }: AdminRecentSellersProps) {
  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-5 sm:p-6 shadow-2xs transition-all duration-300 flex flex-col justify-between">
      {/* Header with Title & Action Button (Donezo + Add Member style) */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Penjual UMKM Terbaru
          </h3>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
            Pelaku usaha yang baru mendaftar
          </p>
        </div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-105 active:scale-95"
        >
          <span>Semua Penjual</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Seller List Items */}
      <div className="space-y-2 my-2">
        {sellers.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-600">
            Belum ada penjual terdaftar.
          </div>
        ) : (
          sellers.slice(0, 4).map((seller, idx) => {
            const initials = seller.nama
              ? seller.nama
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              : 'UM'
            const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length]

            return (
              <motion.div
                key={seller.id}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  href={`/admin/users/${seller.id}`}
                  className="group flex items-center justify-between p-2 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl font-bold text-xs ${colorClass}`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {seller.nama}
                      </p>
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate flex items-center gap-1 mt-0.5">
                        <Store className="h-3 w-3 shrink-0" />
                        <span className="truncate">
                          {seller.alamat ? seller.alamat.split(',')[0] : 'Lokasi belum disetel'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Badge Status / Product Count */}
                  <div className="shrink-0 pl-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        seller.product_count > 0
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400'
                      }`}
                    >
                      <Package className="h-2.5 w-2.5" />
                      {seller.product_count} Produk
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Footer link */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900 text-right">
        <Link
          href="/admin/users"
          className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Lihat direktori pengguna &rarr;
        </Link>
      </div>
    </div>
  )
}
