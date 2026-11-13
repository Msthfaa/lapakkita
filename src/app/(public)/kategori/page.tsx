import {
  getCategories,
  getRegions,
  getApprovedProducts,
} from '@/features/products/queries'
import { ProductCard } from '@/components/product-card'
import { CatalogFilters } from '@/components/catalog-filters'
import { Pagination } from '@/components/pagination'
import { Layers, PackageSearch, X } from 'lucide-react'
import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kategori & Pencarian Produk - LapakKita',
  description: 'Cari dan jelajahi produk UMKM lokal terverifikasi berdasarkan kategori dan daerah asal.',
}

interface PageProps {
  searchParams: Promise<{
    q?: string
    kategori?: string
    daerah?: string
    page?: string
  }>
}

async function KategoriResults({ searchParams }: PageProps) {
  const params = await searchParams
  const q = params.q || ''
  const categoryId = params.kategori ? parseInt(params.kategori, 10) : undefined
  const regionId = params.daerah ? parseInt(params.daerah, 10) : undefined
  const currentPage = params.page ? Math.max(1, parseInt(params.page, 10)) : 1

  const isFiltering = Boolean(q || categoryId || regionId)

  const [categories, regions, { products, total, totalPages }] = await Promise.all([
    getCategories(),
    getRegions(),
    getApprovedProducts({ query: q, categoryId, regionId, page: currentPage }),
  ])

  const activeCategory = categoryId
    ? categories.find((c) => c.id === categoryId)?.nama
    : null

  const activeRegion = regionId
    ? regions.find((r) => r.id === regionId)?.nama
    : null

  return (
    <>
      {/* Quick Category Chips Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar justify-start sm:justify-center flex-nowrap sm:flex-wrap">
          <Link
            href="/kategori"
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${
              !categoryId
                ? 'bg-[#186049] text-white shadow-xs font-semibold scale-105'
                : 'border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 hover:border-[#186049]/50'
            }`}
          >
            Semua Kategori
          </Link>

          {categories.map((cat) => {
            const isSelected = categoryId === cat.id
            const filterParams = new URLSearchParams()
            if (q) filterParams.set('q', q)
            if (!isSelected) filterParams.set('kategori', cat.id.toString())
            if (regionId) filterParams.set('daerah', regionId.toString())

            return (
              <Link
                key={cat.id}
                href={`/kategori?${filterParams.toString()}`}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#186049] text-white shadow-xs font-semibold scale-105'
                    : 'border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 hover:border-[#186049]/50'
                }`}
              >
                {cat.nama}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Filter Bar (Search Query, Category, Region) */}
      <div className="mx-auto max-w-4xl mb-10">
        <CatalogFilters categories={categories} regions={regions} />
      </div>

      {/* Active Filter Tags */}
      {isFiltering && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span>Filter Aktif:</span>
          {q && (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 font-medium text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
              Kata kunci: &ldquo;{q}&rdquo;
              <Link
                href={`/kategori?${new URLSearchParams({
                  ...(categoryId ? { kategori: categoryId.toString() } : {}),
                  ...(regionId ? { daerah: regionId.toString() } : {}),
                }).toString()}`}
                className="hover:text-rose-500"
              >
                <X className="h-3 w-3" />
              </Link>
            </span>
          )}
          {activeCategory && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#ECE8AF]/60 dark:bg-neutral-800 px-3 py-1 font-medium text-[#186049] dark:text-white border border-[#186049]/20 dark:border-neutral-700">
              Kategori: {activeCategory}
              <Link
                href={`/kategori?${new URLSearchParams({
                  ...(q ? { q } : {}),
                  ...(regionId ? { daerah: regionId.toString() } : {}),
                }).toString()}`}
                className="hover:text-rose-500"
              >
                <X className="h-3 w-3" />
              </Link>
            </span>
          )}
          {activeRegion && (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 font-medium text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
              Daerah: {activeRegion}
              <Link
                href={`/kategori?${new URLSearchParams({
                  ...(q ? { q } : {}),
                  ...(categoryId ? { kategori: categoryId.toString() } : {}),
                }).toString()}`}
                className="hover:text-rose-500"
              >
                <X className="h-3 w-3" />
              </Link>
            </span>
          )}

          <Link
            href="/kategori"
            className="text-xs font-semibold text-[#186049] dark:text-white hover:underline ml-1"
          >
            Hapus Semua Filter
          </Link>
        </div>
      )}

      {/* Section Header Produk */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-6">
        <h2 className="font-serif text-lg font-normal text-neutral-900 dark:text-white">
          {isFiltering ? 'Hasil Pencarian Produk' : 'Semua Produk'}
        </h2>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {total} produk ditemukan
        </span>
      </div>

      {/* Grid Produk atau Empty State */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 p-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-400 mb-4">
            <PackageSearch className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-serif font-normal text-neutral-800 dark:text-neutral-200">
            Tidak ada produk yang cocok
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mt-1">
            Coba ganti kata kunci pencarian atau pilih kategori / daerah lain yang tersedia.
          </p>
          <Link
            href="/kategori"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#186049] hover:bg-[#124b39] text-white px-4 py-2 text-xs font-medium transition-all shadow-xs"
          >
            Reset Filter &amp; Tampilkan Semua
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            q={q}
            kategori={params.kategori}
            daerah={params.daerah}
            basePath="/kategori"
          />
        </>
      )}
    </>
  )
}

function KategoriLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-center gap-2">
        <div className="h-8 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-8 w-28 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-8 w-20 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="mx-auto max-w-4xl h-16 rounded-2xl bg-neutral-200 dark:bg-neutral-900" />
      <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="aspect-square rounded-2xl bg-neutral-100 dark:bg-neutral-900" />
        ))}
      </div>
    </div>
  )
}

export default function KategoriPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300 pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Kategori & Pencarian */}
        <div className="mx-auto max-w-3xl text-center mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECE8AF]/60 dark:bg-neutral-900 border border-[#186049]/15 dark:border-white/10 px-3.5 py-1 text-xs font-semibold text-[#186049] dark:text-white mb-4 shadow-2xs">
            <Layers className="h-3.5 w-3.5 text-[#186049]" />
            <span>Pencarian &amp; Kategori UMKM</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-neutral-900 dark:text-white leading-tight">
            Katalog &amp; Kategori Produk
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            Temukan produk lokal pilihan langsung dari pelaku usaha terverifikasi berdasarkan kategori favorit dan daerah asal.
          </p>
        </div>

        {/* Dynamic Content Wrapped in Suspense */}
        <Suspense fallback={<KategoriLoadingSkeleton />}>
          <KategoriResults searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}
