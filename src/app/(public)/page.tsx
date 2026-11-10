import { getCategories, getRegions, getFeaturedProducts, getApprovedProducts } from '@/features/products/queries'
import { ProductCard } from '@/components/product-card'
import { CatalogFilters } from '@/components/catalog-filters'
import { Pagination } from '@/components/pagination'
import { Sparkles, PackageSearch, ShieldCheck } from 'lucide-react'
import { Suspense } from 'react'

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
  const [categories, regions, featuredProducts, { products, total, totalPages }] =
    await Promise.all([
      getCategories(),
      getRegions(),
      // Hanya tampilkan produk unggulan jika pengguna tidak sedang melakukan pencarian/filter spesifik
      !isFiltering ? getFeaturedProducts() : Promise.resolve([]),
      getApprovedProducts({ query: q, categoryId, regionId, page: currentPage }),
    ])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-neutral-50 border-b border-neutral-200/80 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-xs mb-4">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>Etalase UMKM Terverifikasi & Bebas Penipuan</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
              Dukung Produk UMKM Lokal,{' '}
              <span className="text-emerald-600">Langsung ke Penjual</span>
            </h1>
            <p className="mt-4 text-base text-neutral-600 sm:text-lg">
              Temukan produk berkualitas dari pelaku usaha lokal. Tanpa perantara dan tanpa ribet, langsung hubungi penjual via WhatsApp.
            </p>
          </div>

          {/* Baris Filter & Cari */}
          <div className="mt-8 mx-auto max-w-4xl">
            <Suspense fallback={<div className="h-16 w-full animate-pulse rounded-xl bg-white border border-neutral-200" />}>
              <CatalogFilters categories={categories} regions={regions} />
            </Suspense>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        {/* Bagian Produk Unggulan */}
        {!isFiltering && featuredProducts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900">
                Produk Pilihan & Unggulan
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Semua Produk / Hasil Pencarian */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">
                {isFiltering ? 'Hasil Pencarian Produk' : 'Semua Produk UMKM'}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Menampilkan total {total} produk terverifikasi
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 mb-4">
                <PackageSearch className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-800">
                {isFiltering
                  ? 'Tidak Ada Produk yang Cocok'
                  : 'Belum Ada Produk Tersedia'}
              </h3>
              <p className="text-sm text-neutral-500 max-w-md mt-1">
                {isFiltering
                  ? 'Coba gunakan kata kunci lain atau pilih kategori/daerah yang berbeda.'
                  : 'Produk sedang dalam proses moderasi atau belum ditambahkan oleh penjual.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                q={q}
                kategori={params.kategori}
                daerah={params.daerah}
              />
            </>
          )}
        </section>
      </div>
    </div>
  )
}
