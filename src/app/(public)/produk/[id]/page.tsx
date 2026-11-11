import { getProductDetail } from '@/features/products/queries'
import { formatRupiah, formatTanggal } from '@/lib/format'
import { WaButton } from '@/components/wa-button'
import { ProductGallery } from '@/components/product-gallery'
import { MiniMap } from '@/components/mini-map'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import {
  ArrowLeft,
  Store,
  MapPin,
  Calendar,
  ShieldCheck,
  Truck,
  Layers,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  EyeOff,
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

const SHIPPING_LABELS: Record<string, string> = {
  ambil_di_tempat: 'Ambil di Tempat (Pick Up)',
  cod: 'COD (Bayar di Tempat)',
  kurir_instan: 'Kurir Instan (Gojek / Grab / Maxim)',
  kurir_ekspedisi: 'Kurir Ekspedisi (JNE / J&T / SiCepat)',
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

  // Siapkan daftar gambar galeri (utamakan array foto_urls, fallback ke foto_url)
  const images =
    product.foto_urls && product.foto_urls.length > 0
      ? product.foto_urls
      : product.foto_url
        ? [product.foto_url]
        : []

  const kondisiStok = product.kondisi_stok || 'ready_stock'

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

      {/* Banner Peringatan Jika Produk Dinonaktifkan */}
      {!product.is_active && (
        <div
          className={`mb-6 rounded-xl border p-4 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
            isOwner
              ? 'border-amber-300 bg-amber-50 text-amber-900'
              : 'border-neutral-300 bg-neutral-100 text-neutral-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <EyeOff className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <h3 className="font-bold">
                {isOwner
                  ? 'Mode Pratinjau: Produk Sedang Anda Nonaktifkan'
                  : 'Produk Sedang Dinonaktifkan Sementara'}
              </h3>
              <p className="mt-0.5 text-xs text-neutral-600">
                {isOwner
                  ? 'Produk ini disembunyikan dari etalase publik. Anda dapat mengaktifkannya kapan saja di Dashboard Penjual.'
                  : 'Penjual sedang menonaktifkan produk ini sementara (stok habis atau toko libur). Pemesanan via WhatsApp ditutup sementara.'}
              </p>
            </div>
          </div>

          {isOwner && (
            <Button asChild size="sm" variant="outline" className="shrink-0 bg-white border-amber-300 text-amber-900 hover:bg-amber-100">
              <Link href="/dashboard">Buka Dashboard Penjual</Link>
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Galeri Gambar Interaktif */}
        <div>
          <ProductGallery
            images={images}
            nama={product.nama}
            isFeatured={product.is_featured}
          />
        </div>

        {/* Informasi Detail Produk */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            {/* Kategori, Status Moderasi, Status Etalase, & Status Stok */}
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {product.category.nama}
                </span>
              )}

              {/* Status Etalase jika Nonaktif */}
              {!product.is_active && (
                <span className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-neutral-200 px-2.5 py-1 text-xs font-semibold text-neutral-700">
                  <EyeOff className="h-3.5 w-3.5" />
                  Nonaktif di Etalase
                </span>
              )}

              {/* Badge Kondisi Stok */}
              {kondisiStok === 'ready_stock' && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Ready Stock
                </span>
              )}
              {kondisiStok === 'pre_order' && (
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  <Clock className="h-3.5 w-3.5" />
                  Pre-Order (PO)
                </span>
              )}
              {kondisiStok === 'stok_terbatas' && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Stok Terbatas
                </span>
              )}

              {product.status !== 'approved' && (
                <StatusBadge status={product.status} />
              )}
            </div>

            {/* Judul & Harga (dengan Satuan) */}
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">
                {product.nama}
              </h1>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-emerald-600">
                  {formatRupiah(product.harga)}
                </span>
                {product.satuan && (
                  <span className="text-base font-medium text-neutral-500">
                    / {product.satuan}
                  </span>
                )}
              </div>
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

            {/* Peta Mini Interaktif Lokasi Toko */}
            <MiniMap
              lat={product.latitude}
              lng={product.longitude}
              nama={product.seller?.nama || product.nama}
              alamat={product.alamat}
              daerah={product.region?.nama}
            />

            {/* Atribut Tambahan: Varian, Izin Usaha, Metode Pengiriman */}
            <div className="space-y-3">
              {/* Opsi Varian */}
              {product.varian && (
                <div className="rounded-lg border border-neutral-200 bg-white p-3 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-neutral-700 mb-1">
                    <Layers className="h-4 w-4 text-emerald-600" />
                    <span>Pilihan Varian / Rasa / Ukuran:</span>
                  </div>
                  <p className="text-neutral-600 text-xs sm:text-sm pl-6">
                    {product.varian}
                  </p>
                </div>
              )}

              {/* No Izin / Sertifikasi */}
              {product.no_izin && (
                <div className="rounded-lg border border-neutral-200 bg-emerald-50/50 p-3 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-emerald-900 mb-1">
                    <FileCheck2 className="h-4 w-4 text-emerald-600" />
                    <span>Legalitas & Sertifikasi:</span>
                  </div>
                  <p className="text-emerald-800 text-xs sm:text-sm pl-6 font-medium">
                    {product.no_izin}
                  </p>
                </div>
              )}

              {/* Metode Pengiriman */}
              {product.metode_pengiriman && product.metode_pengiriman.length > 0 && (
                <div className="rounded-lg border border-neutral-200 bg-white p-3 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-neutral-700 mb-2">
                    <Truck className="h-4 w-4 text-emerald-600" />
                    <span>Pilihan Metode Pengiriman:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-6">
                    {product.metode_pengiriman.map((key) => (
                      <span
                        key={key}
                        className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700"
                      >
                        {SHIPPING_LABELS[key] || key}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
            {!product.is_active && !isOwner ? (
              <div className="rounded-xl border border-neutral-200 bg-neutral-100 p-4 text-center space-y-1">
                <p className="font-semibold text-neutral-800 text-sm">
                  Pemesanan Ditutup Sementara
                </p>
                <p className="text-xs text-neutral-500">
                  Penjual sedang menonaktifkan produk ini. Silakan kunjungi kembali nanti untuk melakukan pemesanan.
                </p>
              </div>
            ) : (
              <WaButton
                productId={product.id}
                noWa={product.no_wa}
                namaProduk={product.nama}
                details={{
                  harga: product.harga,
                  satuan: product.satuan,
                  kondisiStok: product.kondisi_stok,
                }}
                className="w-full text-base py-6 shadow-md"
              />
            )}

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
