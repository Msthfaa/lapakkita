import {
  getCategories,
  getFeaturedProducts,
  getPopularProducts,
  getApprovedProducts,
} from '@/features/products/queries'
import { ProductCard } from '@/components/product-card'
import { HeroCarousel } from '@/components/hero-carousel'
import { HomeCatalogExplorer } from '@/components/home-catalog-explorer'
import { ArrowDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function HomePage() {
  // Fetch data for homepage
  const [
    categories,
    featuredProducts,
    popularProducts,
    { products: latestProducts, total: totalCount },
  ] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getPopularProducts(14),
    getApprovedProducts({ page: 1 }),
  ])

  // Products prioritized for the 3D hero carousel
  const heroProducts = popularProducts.length > 0 ? popularProducts : featuredProducts

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      {/* ===== HERO SECTION - SPOTLIGHT AURA DI BELAKANG JUDUL & CAROUSEL ===== */}
      <section className="relative overflow-hidden bg-transparent pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Center Editorial Headline in Serif font - 2 baris pas tanpa terpotong (Ukuran tetap terjaga sesuai permintaan) */}
          <div className="mx-auto max-w-5xl text-center mb-10 sm:mb-14 px-2">
            <h1 className="font-serif text-[23px] sm:text-[33px] md:text-[39px] lg:text-[47px] xl:text-[51px] font-normal tracking-tight text-neutral-900 dark:text-white leading-tight sm:leading-[1.12]">
              <span className="block">Karya Anak Bangsa, Kualitas Juara,</span>
              <span className="block mt-1 sm:mt-1.5">Harga Bersahaja</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base tracking-normal text-neutral-600 dark:text-neutral-400 font-medium">
              Produk Pilihan &amp; Terpopuler dari UMKM Lokal Terverifikasi
            </p>
          </div>

          {/* 3D Cylindrical Curved Carousel */}
          <div className="mx-auto max-w-6xl">
            <HeroCarousel products={heroProducts} />
          </div>

          {/* Subtle scroll down indicator */}
          <div className="mt-14 text-center">
            <a
              href="#unggulan"
              className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-[#186049] dark:hover:text-white transition-colors"
            >
              <span>Lihat Produk Unggulan</span>
              <ArrowDown className="h-3.5 w-3.5 animate-bounce text-[#4A943E]" />
            </a>
          </div>
        </div>
      </section>

      {/* ===== SECTION PRODUK UNGGULAN KURASI ===== */}
      <section
        id="unggulan"
        className="scroll-mt-24 border-t border-neutral-200/50 dark:border-neutral-800/60 bg-transparent py-10 sm:py-16 transition-colors duration-300"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white">
                Produk Unggulan Kurasi
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Produk UMKM pilihan dengan kualitas terverifikasi dan siap dihubungi langsung
              </p>
            </div>

            <Link
              href="/kategori"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#186049] dark:text-white hover:text-[#4A943E] transition-colors self-start sm:self-auto"
            >
              <span>Buka Semua Kategori &amp; Pencarian</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Grid Produk Unggulan */}
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-neutral-400">
              Belum ada produk yang ditandai sebagai unggulan.
            </div>
          )}
        </div>
      </section>

      {/* ===== SECTION ETALASE RAGAM PRODUK (KATALOG EXPLORER) ===== */}
      <HomeCatalogExplorer
        categories={categories}
        products={latestProducts}
        totalCount={totalCount}
      />
    </div>
  )
}
