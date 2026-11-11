import {
  getCategories,
  getRegions,
  getFeaturedProducts,
  getApprovedProducts,
  getPopularProducts,
} from '@/features/products/queries'
import { ProductCard } from '@/components/product-card'
import { CatalogFilters } from '@/components/catalog-filters'
import { Pagination } from '@/components/pagination'
import { HeroCarousel } from '@/components/hero-carousel'
import { Sparkles, PackageSearch, ArrowDown } from 'lucide-react'
import { Suspense } from 'react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{
    q?: string
    kategori?: string
    daerah?: string
    page?: string
  }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams
  const q = params.q || ''
  const categoryId = params.kategori ? parseInt(params.kategori, 10) : undefined
  const regionId = params.daerah ? parseInt(params.daerah, 10) : undefined
  const currentPage = params.page ? Math.max(1, parseInt(params.page, 10)) : 1

  const isFiltering = Boolean(q || categoryId || regionId)

  // Fetch data
  const [categories, regions, featuredProducts, popularProducts, { products, total, totalPages }] =
    await Promise.all([
      getCategories(),
      getRegions(),
      !isFiltering ? getFeaturedProducts() : Promise.resolve([]),
      !isFiltering ? getPopularProducts(14) : Promise.resolve([]),
      getApprovedProducts({ query: q, categoryId, regionId, page: currentPage }),
    ])

  // Products prioritized for the 3D hero carousel
  const heroProducts = popularProducts.length > 0 ? popularProducts : featuredProducts

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* ===== HERO SECTION - EXACT REPLICA OF THE IMAGE ===== */}
      {!isFiltering && (
        <section className="relative overflow-hidden bg-white dark:bg-black pt-12 pb-16 sm:pt-16 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Center Editorial Headline in Serif font - 3 lines matching the reference */}
            <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
                Selected and popular
                <br />
                products on the social
                <br />
                right now
              </h1>
              <p className="mt-4 text-xs sm:text-sm tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
                Produk Pilihan &amp; Terpopuler Dari UMKM Lokal Terverifikasi
              </p>
            </div>

            {/* 3D Cylindrical Curved Carousel */}
            <div className="mx-auto max-w-6xl">
              <HeroCarousel products={heroProducts} />
            </div>

            {/* Subtle scroll down indicator */}
            <div className="mt-14 text-center">
              <a
                href="#katalog"
                className="inline-flex items-center gap-2 text-xs font-light text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
              >
                <span>Jelajahi Semua Produk</span>
                <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ===== CATALOG SEARCH & FILTER SECTION ===== */}
      <section
        id="katalog"
        className="border-t border-neutral-200 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/50 py-12 transition-colors duration-300"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-4 mb-10">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-neutral-900 dark:text-white">
                {isFiltering ? 'Hasil Pencarian Produk' : 'Katalog UMKM Terverifikasi'}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Hubungi langsung penjual via WhatsApp resmi tanpa perantara
              </p>
            </div>

            <Suspense
              fallback={
                <div className="h-16 w-full animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-900" />
              }
            >
              <CatalogFilters categories={categories} regions={regions} />
            </Suspense>
          </div>

          {/* Featured showcase if not filtering */}
          {!isFiltering && featuredProducts.length > 0 && (
            <div id="unggulan" className="mb-14 space-y-6">
              <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h3 className="font-serif text-lg font-normal text-neutral-900 dark:text-white">
                  Produk Unggulan Kurasi
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* All Catalog Products */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="font-serif text-lg font-normal text-neutral-900 dark:text-white">
                {isFiltering ? 'Semua Hasil' : 'Koleksi Produk'}
              </h3>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {total} produk terdaftar
              </span>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-400 mb-4">
                  <PackageSearch className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-serif font-normal text-neutral-800 dark:text-neutral-200">
                  {isFiltering
                    ? 'Tidak ada produk yang cocok'
                    : 'Belum ada produk yang disetujui'}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mt-1">
                  {isFiltering
                    ? 'Coba ganti kata kunci atau pilih filter kategori / daerah yang berbeda.'
                    : 'Produk sedang dalam proses moderasi admin.'}
                </p>
                {isFiltering && (
                  <Link
                    href="/"
                    className="mt-4 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Kembali ke Beranda &rarr;
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
