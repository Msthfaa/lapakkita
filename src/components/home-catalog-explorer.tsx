'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/product-card'
import { Sparkles, ArrowRight, PackageSearch, SlidersHorizontal } from 'lucide-react'

interface HomeCatalogExplorerProps {
  categories: { id: number; nama: string }[]
  products: any[]
  totalCount: number
}

export function HomeCatalogExplorer({
  categories,
  products,
  totalCount,
}: HomeCatalogExplorerProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  // Filter produk secara instan di sisi klien
  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === null) return products
    return products.filter((prod) => {
      const catId = prod.category_id ?? prod.category?.id
      return catId === selectedCategoryId
    })
  }, [products, selectedCategoryId])

  const activeCategory =
    selectedCategoryId !== null
      ? categories.find((c) => c.id === selectedCategoryId)
      : null

  return (
    <section
      id="etalase-katalog"
      className="scroll-mt-24 border-t border-neutral-200/50 dark:border-neutral-800/60 bg-transparent py-10 sm:py-16 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/80 dark:border-neutral-800 pb-5 sm:pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#186049]/10 dark:bg-white/10 px-3 py-1 text-xs font-semibold text-[#186049] dark:text-[#ECE8AF]">
                <Sparkles className="h-3.5 w-3.5 text-[#4A943E] dark:text-[#ECE8AF]" />
                Etalase Ragam Produk
              </span>
              <span className="inline-flex items-center rounded-full bg-[#ECE8AF]/60 dark:bg-[#186049]/40 border border-[#186049]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#186049] dark:text-[#ECE8AF]">
                {totalCount}+ Produk Terdaftar
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-900 dark:text-white tracking-tight">
              Jelajahi Ragam Karya UMKM
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Koleksi produk terkurasi dari berbagai kategori UMKM di seluruh Indonesia
            </p>
          </div>

          <Link
            href="/kategori"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#186049] dark:text-[#ECE8AF] hover:text-[#4A943E] dark:hover:text-white transition-colors self-start md:self-auto shrink-0 group"
          >
            <span>Buka Katalog Lengkap</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Quick Category Tabs (horizontal scroll di mobile dengan -mx-4 px-4, flex-wrap di desktop) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Tab "Semua" */}
          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              selectedCategoryId === null
                ? 'bg-[#186049] text-white shadow-xs'
                : 'border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 hover:bg-[#ECE8AF]/40 hover:border-[#186049]/30'
            }`}
          >
            <span>Semua</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                selectedCategoryId === null
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {products.length}
            </span>
          </button>

          {/* Individual Category Pills */}
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id
            const count = products.filter(
              (p) => (p.category_id ?? p.category?.id) === cat.id
            ).length

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#186049] text-white shadow-xs'
                    : 'border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 hover:bg-[#ECE8AF]/40 hover:border-[#186049]/30'
                }`}
              >
                <span>{cat.nama}</span>
                {count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-10 sm:p-14 text-center">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#ECE8AF]/60 dark:bg-white/10 text-[#186049] dark:text-[#ECE8AF] mb-3">
              <PackageSearch className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-normal text-neutral-900 dark:text-white">
              Belum ada produk untuk kategori {activeCategory?.nama || 'ini'} di etalase beranda
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
              Koleksi lebih banyak dapat ditemukan melalui filter dan pencarian lengkap di halaman katalog.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedCategoryId(null)}
                className="rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Tampilkan Semua Kategori
              </button>
              {selectedCategoryId !== null && (
                <Link
                  href={`/kategori?kategori=${selectedCategoryId}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#186049] px-4 py-2 text-xs font-semibold text-white hover:bg-[#124b39] transition-colors shadow-xs"
                >
                  <span>Cari Kategori Ini di Katalog Lengkap</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 via-white to-[#ECE8AF]/20 dark:from-neutral-900/90 dark:via-[#0d1612] dark:to-neutral-900/60 p-6 sm:p-8 md:p-10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#186049]/10 dark:bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#186049] dark:text-[#ECE8AF]">
                <SlidersHorizontal className="h-3 w-3 text-[#4A943E] dark:text-[#ECE8AF]" />
                <span>Filter &amp; Pencarian Wilayah</span>
              </div>
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Menampilkan {filteredProducts.length} dari {totalCount} produk terdaftar
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-neutral-900 dark:text-white">
              Ingin Menjelajahi Seluruh Pilihan Produk?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Tersedia fitur pencarian kata kunci, filter rentang harga, pilihan kota dan provinsi, serta navigasi halaman lengkap di katalog.
            </p>
          </div>

          <Link
            href={selectedCategoryId !== null ? `/kategori?kategori=${selectedCategoryId}` : '/kategori'}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#186049] hover:bg-[#124b39] text-white px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md group w-full md:w-auto text-center"
          >
            <span>
              Buka Katalog Lengkap &amp; Filter Wilayah ({totalCount} Produk)
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
