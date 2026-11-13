import Image from 'next/image'
import Link from 'next/link'
import { formatRupiah } from '@/lib/format'
import { Store, MapPin, Image as ImageIcon, Layers } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    nama: string
    harga: number
    foto_url: string | null
    foto_urls?: string[] | null
    satuan?: string | null
    kondisi_stok?: 'ready_stock' | 'pre_order' | 'stok_terbatas' | string | null
    is_featured?: boolean
    alamat?: string | null
    category?: { nama: string } | null
    region?: { nama: string } | null
    seller?: { nama: string } | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const photoCount = product.foto_urls?.length || (product.foto_url ? 1 : 0)

  return (
    <Link href={`/produk/${product.id}`} className="group block h-full">
      <div className="h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#0d1612] flex flex-col transition-all duration-300 hover:border-[#186049]/40 dark:hover:border-white/30 hover:shadow-md active:scale-[0.98]">
        {/* Foto Produk */}
        <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          {product.foto_url ? (
            <Image
              src={product.foto_url}
              alt={product.nama}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400 dark:text-neutral-600">
              <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
          )}

          {/* Badge Unggulan */}
          {product.is_featured && (
            <div className="absolute left-2 top-2 sm:left-3 sm:top-3 flex items-center rounded-full bg-[#186049] px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white shadow-xs">
              Unggulan
            </div>
          )}

          {/* Badge Kategori */}
          {product.category && (
            <div className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-full bg-[#ECE8AF] dark:bg-neutral-900 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-[#186049] dark:text-[#ECE8AF] border border-[#186049]/15 shadow-xs max-w-[50%] truncate">
              {product.category.nama}
            </div>
          )}

          {/* Indikator Multi-Foto */}
          {photoCount > 1 && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-medium text-white shadow-xs">
              <Layers className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>{photoCount}</span>
            </div>
          )}

          {/* Badge Kondisi Stok (Pre-Order / Stok Terbatas) */}
          {product.kondisi_stok === 'pre_order' && (
            <div className="absolute bottom-2 left-2 rounded-md bg-orange-500 px-1.5 py-0.5 text-[9px] font-semibold text-white shadow-xs">
              Pre-Order
            </div>
          )}
          {product.kondisi_stok === 'stok_terbatas' && (
            <div className="absolute bottom-2 left-2 rounded-md bg-amber-600 px-1.5 py-0.5 text-[9px] font-semibold text-white shadow-xs">
              Stok Terbatas
            </div>
          )}
        </div>

        {/* Info Konten */}
        <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xs sm:text-base font-normal text-neutral-900 dark:text-white line-clamp-2 leading-tight sm:leading-snug group-hover:text-[#186049] dark:group-hover:text-[#ECE8AF] transition-colors">
              {product.nama}
            </h3>
            <div className="mt-1.5 sm:mt-2 flex items-baseline gap-1 flex-wrap">
              <span className="text-xs sm:text-base font-bold text-[#4A943E] dark:text-[#5ebd4f]">
                {formatRupiah(product.harga)}
              </span>
              {product.satuan && (
                <span className="text-[10px] sm:text-xs font-normal text-neutral-500 dark:text-neutral-400">
                  / {product.satuan}
                </span>
              )}
            </div>
          </div>

          {(product.seller || product.region || product.alamat) && (
            <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-neutral-100 dark:border-neutral-800/60 space-y-1 text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">
              {product.seller && (
                <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                  <Store className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                  <span className="truncate">{product.seller.nama}</span>
                </div>
              )}
              {(product.region || product.alamat) && (
                <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                  <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                  <span className="truncate">
                    {product.region
                      ? `${product.region.nama}${product.alamat ? ` (${product.alamat})` : ''}`
                      : product.alamat}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
