import { getProductDetail } from '@/features/products/queries'
import { formatRupiah, formatTanggal } from '@/lib/format'
import { WaButton } from '@/components/wa-button'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import {
  ArrowLeft,
  Store,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react'
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
    description: product.deskripsi.slice(0, 160) || `Beli ${product.nama} di LapakKita`,
  }
}

export default async function ProductDetailPage({ params }: DetailPageProps) {
  const { id } = await params
  const product = await getProductDetail(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Tombol Kembali */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-neutral-600">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Katalog
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gambar Produk */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs">
          {product.foto_url ? (
            <Image
              src={product.foto_url}
              alt={product.nama}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-300 bg-neutral-50">
              <ImageIcon className="h-20 w-20" />
            </div>
          )}

          {product.is_featured && (
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-md">
              <Sparkles className="h-4 w-4" />
              Produk Pilihan
            </div>
          )}
        </div>

        {/* Informasi Detail Produk */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            {/* Kategori & Status (jika bukan approved, tampilkan badge status) */}
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {product.category.nama}
                </span>
              )}

              {product.status !== 'approved' && (
                <StatusBadge status={product.status} />
              )}
            </div>

            {/* Judul & Harga */}
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">
                {product.nama}
              </h1>
              <p className="mt-3 text-3xl font-black text-emerald-600">
                {formatRupiah(product.harga)}
              </p>
            </div>

            {/* Informasi Penjual & Lokasi */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-2.5 text-sm">
              <div className="flex items-center gap-2 font-medium text-neutral-800">
                <Store className="h-4 w-4 text-emerald-600" />
                <span>
                  Penjual: <strong>{product.seller?.nama || 'Penjual LapakKita'}</strong>
                </span>
              </div>

              {(product.region || product.alamat) && (
                <div className="flex items-center gap-2 text-neutral-600">
                  <MapPin className="h-4 w-4 text-neutral-400" />
                  <span>
                    {product.region
                      ? `${product.region.nama}${product.alamat ? ` - ${product.alamat}` : ''}`
                      : product.alamat}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>Dipasang pada {formatTanggal(product.created_at)}</span>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                Deskripsi Produk
              </h2>
              <div className="prose prose-neutral max-w-none text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
                {product.deskripsi || 'Tidak ada deskripsi rinci untuk produk ini.'}
              </div>
            </div>
          </div>

          {/* Bagian Tombol Aksi WhatsApp */}
          <div className="mt-8 border-t border-neutral-200 pt-6 space-y-3">
            <WaButton
              productId={product.id}
              noWa={product.no_wa}
              namaProduk={product.nama}
              className="w-full text-base py-6 shadow-md"
            />
            <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>
                Transaksi dilakukan langsung ke penjual via WhatsApp. Pastikan konfirmasi ketersediaan barang.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
