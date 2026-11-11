import Image from 'next/image'
import Link from 'next/link'
import { formatRupiah } from '@/lib/format'
import { Store, MapPin, Sparkles, Image as ImageIcon } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    nama: string
    harga: number
    foto_url: string | null
    is_featured?: boolean
    alamat?: string | null
    category?: { nama: string } | null
    region?: { nama: string } | null
    seller?: { nama: string } | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/produk/${product.id}`} className="group block h-full">
      <div className="h-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 transition-all duration-300 hover:border-neutral-400 dark:hover:border-neutral-700 hover:shadow-xl flex flex-col">
        {/* Foto Produk */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          {product.foto_url ? (
            <Image
              src={product.foto_url}
              alt={product.nama}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400 dark:text-neutral-600">
              <ImageIcon className="h-10 w-10" />
            </div>
          )}

          {/* Badge Unggulan */}
          {product.is_featured && (
            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-white shadow">
              <Sparkles className="h-3 w-3" />
              Unggulan
            </div>
          )}

          {/* Badge Kategori */}
          {product.category && (
            <div className="absolute right-3 top-3 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-neutral-800 dark:text-neutral-200 shadow-sm border border-neutral-200/50 dark:border-white/10">
              {product.category.nama}
            </div>
          )}
        </div>

        {/* Info Konten */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-base font-normal text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2 leading-snug">
              {product.nama}
            </h3>
            <p className="mt-2 text-base font-medium text-emerald-600 dark:text-emerald-400">
              {formatRupiah(product.harga)}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-900 space-y-1 text-xs text-neutral-500 dark:text-neutral-400">
            {product.seller && (
              <div className="flex items-center gap-1.5 truncate">
                <Store className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                <span className="truncate">{product.seller.nama}</span>
              </div>
            )}
            {(product.region || product.alamat) && (
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                <span className="truncate">
                  {product.region
                    ? `${product.region.nama}${product.alamat ? ` (${product.alamat})` : ''}`
                    : product.alamat}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
