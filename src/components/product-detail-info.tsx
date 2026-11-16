'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatRupiah } from '@/lib/format'
import { buildWhatsappLink } from '@/lib/whatsapp'
import { recordWaClickAction } from '@/features/products/actions'
import { StatusBadge } from '@/components/status-badge'
import {
  Star,
  ShieldCheck,
  Truck,
  Layers,
  Clock,
  AlertCircle,
  MessageCircle,
  Check,
  Store,
} from 'lucide-react'

interface ProductDetailInfoProps {
  product: {
    id: string
    nama: string
    harga: number
    satuan?: string | null
    kondisi_stok?: string | null
    deskripsi?: string | null
    varian?: string | null
    no_izin?: string | null
    metode_pengiriman?: string[] | null
    no_wa: string
    is_active: boolean
    status: 'pending' | 'approved' | 'rejected' | string
    is_featured?: boolean
    created_at: string
    latitude?: number | null
    longitude?: number | null
    alamat?: string | null
    category?: { id: number; nama: string } | null
    region?: { id: number; nama: string } | null
    seller?: {
      id: string
      nama: string
      region_id?: number | null
      alamat?: string | null
    } | null
  }
  isOwner?: boolean
}

export function ProductDetailInfo({ product, isOwner }: ProductDetailInfoProps) {
  // Parse varian produk
  const parsedVariants = product.varian
    ? product.varian
        .split(/[,;\n]+/)
        .map((v) => v.trim())
        .filter(Boolean)
    : []

  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    parsedVariants.length > 0 ? parsedVariants[0] : null
  )

  const kondisiStok = product.kondisi_stok || 'ready_stock'

  // Bersihkan label (Penjual)
  const rawSellerName = product.seller?.nama || 'Penjual LapakKita'
  const cleanSellerName = rawSellerName.replace(/\s*\(Penjual\)\s*/gi, '').trim() || rawSellerName

  // Link WhatsApp yang ramah dan siap kirim
  const waUrl = buildWhatsappLink(product.no_wa, product.nama, {
    harga: product.harga,
    satuan: product.satuan || undefined,
    kondisiStok: product.kondisi_stok || undefined,
    varian: selectedVariant || undefined,
  })

  function handleOrderClick() {
    recordWaClickAction(product.id).catch((err) => {
      console.warn('Gagal mencatat statistik klik WA:', err)
    })
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  // Format satuan mengalir alami (misal "per Box / Kotak" -> "box")
  const formattedSatuan = product.satuan
    ? product.satuan.toLowerCase().startsWith('per ')
      ? product.satuan.slice(4)
      : product.satuan
    : null

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* 1. Baris Badge Kategori & Kondisi Stok */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {product.category && (
          <span className="inline-flex items-center rounded-full bg-[#186049]/10 dark:bg-[#186049]/25 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-[#186049] dark:text-[#7ed870]">
            {product.category.nama}
          </span>
        )}

        {kondisiStok === 'ready_stock' && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 dark:border-emerald-900/50 bg-emerald-50/90 dark:bg-emerald-950/40 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Ready Stock
          </span>
        )}

        {kondisiStok === 'pre_order' && (
          <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-orange-200/70 dark:border-orange-900/50 bg-orange-50/90 dark:bg-orange-950/40 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-medium text-orange-700 dark:text-orange-300">
            <Clock className="h-3 w-3" />
            Pre-Order (PO)
          </span>
        )}

        {kondisiStok === 'stok_terbatas' && (
          <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-amber-200/70 dark:border-amber-900/50 bg-amber-50/90 dark:bg-amber-950/40 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-medium text-amber-700 dark:text-amber-300">
            <AlertCircle className="h-3 w-3" />
            Stok Terbatas
          </span>
        )}

        {product.is_featured && (
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#186049] to-[#257d5a] text-white px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-medium shadow-2xs">
            Produk Pilihan
          </span>
        )}

        {product.status !== 'approved' &&
          (product.status === 'pending' || product.status === 'rejected') && (
            <StatusBadge status={product.status} />
          )}
      </div>

      {/* 2. Judul Produk */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-snug sm:leading-tight">
        {product.nama}
      </h1>

      {/* 3. Rating & Info Verifikasi Toko */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center text-amber-500">
          <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
          <span className="ml-1 font-bold text-neutral-900 dark:text-white">5.0</span>
          <span className="ml-1 text-neutral-400 text-[11px] sm:text-xs">(Produk UMKM Terverifikasi)</span>
        </div>
        <span className="text-neutral-300 dark:text-neutral-700">•</span>
        <div className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
          <Store className="h-3.5 w-3.5 text-[#186049] dark:text-[#4A943E]" />
          {product.seller?.id ? (
            <Link
              href={`/toko/${product.seller.id}`}
              className="hover:underline hover:text-[#186049] transition-colors"
            >
              {cleanSellerName}
            </Link>
          ) : (
            <span>{cleanSellerName}</span>
          )}
        </div>
      </div>

      {/* 4. Harga Produk & Satuan */}
      <div className="flex items-baseline gap-2 pt-1 border-t border-neutral-200/60 dark:border-neutral-800/80">
        <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#186049] dark:text-[#5ebd4f]">
          {formatRupiah(product.harga)}
        </span>
        {formattedSatuan && (
          <span className="text-xs sm:text-sm font-normal text-neutral-500 dark:text-neutral-400">
            / {formattedSatuan}
          </span>
        )}
      </div>

      {/* 5. Sekilas Produk / Deskripsi Ringkas */}
      {product.deskripsi && (
        <div className="rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800/80 p-3 sm:p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Sekilas Produk
            </span>
          </div>
          <p className="line-clamp-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {product.deskripsi}
          </p>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('product-tabs')
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#186049] dark:text-[#7ed870] hover:underline cursor-pointer pt-0.5"
          >
            <span>Baca Deskripsi Lengkap &amp; Spesifikasi ↓</span>
          </button>
        </div>
      )}

      {/* 6. Pilihan Varian */}
      {parsedVariants.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-[#186049] dark:text-[#4A943E]" />
              Pilihan Varian:
            </span>
            {selectedVariant && (
              <span className="font-medium text-[#186049] dark:text-[#7ed870]">
                {selectedVariant}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {parsedVariants.map((varian) => {
              const isSelected = selectedVariant === varian
              return (
                <button
                  key={varian}
                  type="button"
                  onClick={() => setSelectedVariant(varian)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'border-2 border-[#186049] bg-[#186049]/10 dark:bg-[#186049]/30 text-[#186049] dark:text-[#7ed870] font-semibold shadow-2xs'
                      : 'border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                  <span>{varian}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 7. Informasi Ketersediaan Singkat */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-neutral-500 dark:text-neutral-400">
        <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
          <Truck className="h-3.5 w-3.5 shrink-0" />
          <span>Pengiriman langsung dari toko</span>
        </span>
        <span className="text-neutral-400">
          {product.region ? `Wilayah ${product.region.nama}` : 'Area Nasional'}
        </span>
      </div>

      {/* 8. Tombol Aksi Utama (Pesan via WhatsApp Hijau Solid Lebar) */}
      {!product.is_active && !isOwner ? (
        <div className="rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3.5 sm:p-4 text-center space-y-1">
          <p className="font-semibold text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm">
            Pemesanan Ditutup Sementara
          </p>
          <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">
            Penjual sedang menonaktifkan produk ini sementara waktu.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleOrderClick}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-6 rounded-2xl bg-[#186049] hover:bg-[#124d3a] text-white font-semibold text-sm sm:text-base shadow-md shadow-[#186049]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Pesan via WhatsApp</span>
        </button>
      )}

      {/* 9. Tiga Trust Badges Sejajar */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 text-center text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 p-2 sm:p-2.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
          <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#186049] dark:text-[#4A943E] shrink-0" />
          <span className="font-medium leading-tight">100% UMKM Asli</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 p-2 sm:p-2.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
          <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#186049] dark:text-[#4A943E] shrink-0" />
          <span className="font-medium leading-tight">Kirim Fleksibel</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 p-2 sm:p-2.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
          <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#186049] dark:text-[#4A943E] shrink-0" />
          <span className="font-medium leading-tight">Tanpa Biaya Admin</span>
        </div>
      </div>
    </div>
  )
}
