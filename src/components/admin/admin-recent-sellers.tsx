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
    <div className="rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-6 sm:p-7 shadow-2xs transition-all duration-300 flex flex-col justify-between">
      {/* Header with Title & Action Button */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
            Penjual UMKM Terbaru
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium mt-0.5">
            Pelaku usaha yang baru mendaftar di platform
          </p>
        </div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-105 active:scale-95"
        >
          <span>Semua Penjual</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Seller List Items */}
      <div className="space-y-2.5 my-2">
        {sellers.length === 0 ? (
          <div className="py-10 text-center text-sm text-neutral-400 dark:text-neutral-600">
            Belum ada penjual terdaftar.
          </div>
        ) : (
          sellers.slice(0, 5).map((seller, idx) => {
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
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  href={`/admin/users/${seller.id}`}
                  className="group flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-bold text-sm ${colorClass}`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-neutral-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {seller.nama}
                      </p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate flex items-center gap-1.5 mt-0.5">
                        <Store className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {seller.alamat ? seller.alamat.split(',')[0] : 'Lokasi belum disetel'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Badge Status / Product Count */}
                  <div className="shrink-0 pl-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        seller.product_count > 0
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400'
                      }`}
                    >
                      <Package className="h-3 w-3" />
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
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-900 text-right">
        <Link
          href="/admin/users"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Lihat direktori pengguna &rarr;
        </Link>
      </div>
    </div>
  )
}
