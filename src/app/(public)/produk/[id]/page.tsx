import { getProductDetail, getProductsBySeller, getRelatedProducts } from '@/features/products/queries'
import { ProductGallery } from '@/components/product-gallery'
import { ProductDetailInfo } from '@/components/product-detail-info'
import { ProductTabs } from '@/components/product-tabs'
import { ProductCard } from '@/components/product-card'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronRight, EyeOff, Store } from 'lucide-react'
import type { Metadata } from 'next'

interface DetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProductDetail(id)
  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan - LapakKita',
    }
  }

  return {
    title: `${product.nama} - LapakKita`,
    description: product.deskripsi ? product.deskripsi.slice(0, 160) : `Beli ${product.nama} di LapakKita`,
  }
}

export default async function ProductDetailPage({ params }: DetailPageProps) {
  const { id } = await params
  const product = await getProductDetail(id)

  if (!product) {
    notFound()
  }

  // Cek apakah pengunjung adalah pemilik produk atau admin
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isOwner = user?.id === product.seller_id

  // Siapkan daftar gambar galeri
  const images =
    product.foto_urls && product.foto_urls.length > 0
      ? product.foto_urls
      : product.foto_url
        ? [product.foto_url]
        : []

  // Ambil produk lain yang dijual oleh toko / penjual ini
  const rawSellerName = product.seller?.nama || 'Toko Ini'
  const cleanSellerName = rawSellerName.replace(/\s*\(Penjual\)\s*/gi, '').trim() || rawSellerName
  const sellerProducts = await getProductsBySeller(product.seller_id, product.id, 4)

  // Jika produk dari penjual ini kurang dari 4, lengkapi dengan produk terkait dari kategori yang sama
  let displayProducts = sellerProducts
  if (displayProducts.length < 4) {
    const fallbackProducts = await getRelatedProducts(
      product.category_id,
      product.id,
      4 - displayProducts.length
    )
    const existingIds = new Set(displayProducts.map((p) => p.id))
    const extra = fallbackProducts.filter((p) => !existingIds.has(p.id))
    displayProducts = [...displayProducts, ...extra]
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 sm:pt-28 pb-20 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
      {/* 1. Tombol Kembali ke Katalog */}
      <div className="flex items-center justify-start text-xs">
        <Link
          href="/kategori"
          className="inline-flex items-center gap-2 rounded-full glass-btn px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-[#186049] dark:hover:text-white transition-all shadow-xs group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Katalog</span>
        </Link>
      </div>

      {/* 2. Banner Peringatan Jika Produk Dinonaktifkan */}
      {!product.is_active && (
        <div
          className={`rounded-2xl border p-4 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
            isOwner
              ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
              : 'border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-850 text-neutral-800 dark:text-neutral-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <EyeOff className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <h3 className="font-bold">
                {isOwner
                  ? 'Mode Pratinjau: Produk Sedang Anda Nonaktifkan'
                  : 'Produk Sedang Dinonaktifkan Sementara'}
              </h3>
              <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                {isOwner
                  ? 'Produk ini disembunyikan dari etalase publik. Anda dapat mengaktifkannya kapan saja di Dashboard Penjual.'
                  : 'Penjual sedang menonaktifkan produk ini sementara (stok habis atau toko libur).'}
              </p>
            </div>
          </div>

          {isOwner && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="shrink-0 bg-white dark:bg-neutral-800 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-neutral-700"
            >
              <Link href="/dashboard">Buka Dashboard Penjual</Link>
            </Button>
          )}
        </div>
      )}

      {/* 3. Hero Grid Produk: Kiri Foto Galeri (5 kolom), Kanan Detail & Aksi (7 kolom) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
        {/* Kolom Kiri: Galeri Foto */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <ProductGallery
            images={images}
            nama={product.nama}
            isFeatured={product.is_featured}
          />
        </div>

        {/* Kolom Kanan: Detail Produk Bersih & Tombol Aksi */}
        <div className="lg:col-span-7 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-6 sm:p-8 shadow-xs">
          <ProductDetailInfo product={product} isOwner={isOwner} />
        </div>
      </div>

      {/* 4. Bagian Tab Informasi Detail (Deskripsi, Informasi & Pengiriman, Profil & Lokasi Toko) */}
      <ProductTabs product={product} />

      {/* 5. Bagian Bawah: Produk Lain dari Toko Ini */}
      <section className="pt-6 border-t border-neutral-200/60 dark:border-neutral-800/80">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#186049] dark:text-white uppercase tracking-wider mb-1">
              <Store className="h-3.5 w-3.5 text-[#186049]" />
              <span>Etalase Toko</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-neutral-900 dark:text-white">
              {sellerProducts.length > 0
                ? `Produk Lain dari ${cleanSellerName}`
                : `Rekomendasi Produk Pilihan`}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              {sellerProducts.length > 0
                ? `Jelajahi produk UMKM unggulan lainnya yang dijual oleh toko ${cleanSellerName}`
                : `Jelajahi produk UMKM lokal pilihan lainnya di LapakKita`}
            </p>
          </div>

          <Link
            href="/kategori"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#186049] dark:text-white hover:underline shrink-0"
          >
            <span>Lihat Semua Katalog</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-neutral-500 text-sm">
            Belum ada produk lain yang terdaftar dari toko ini.
          </div>
        )}
      </section>
    </div>
  )
}
