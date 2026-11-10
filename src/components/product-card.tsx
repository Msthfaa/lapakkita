import Image from 'next/image'
import Link from 'next/link'
import { formatRupiah } from '@/lib/format'
import { Card } from '@/components/ui/card'
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
      <Card className="h-full overflow-hidden border border-neutral-200 bg-white transition-all duration-200 hover:border-emerald-500 hover:shadow-md flex flex-col">
        {/* Foto Produk */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
          {product.foto_url ? (
            <Image
              src={product.foto_url}
              alt={product.nama}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-300">
              <ImageIcon className="h-12 w-12" />
            </div>
          )}

          {/* Badge Unggulan */}
          {product.is_featured && (
            <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow">
              <Sparkles className="h-3 w-3" />
              Unggulan
            </div>
          )}

          {/* Badge Kategori */}
          {product.category && (
            <div className="absolute right-2.5 top-2.5 rounded-md bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[11px] font-medium text-neutral-700 shadow-xs">
              {product.category.nama}
            </div>
          )}
        </div>

        {/* Info Konten */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-neutral-900 group-hover:text-emerald-700 line-clamp-2 text-sm leading-snug">
              {product.nama}
            </h3>
            <p className="mt-2 text-base font-bold text-emerald-600">
              {formatRupiah(product.harga)}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-100 space-y-1 text-xs text-neutral-500">
            {product.seller && (
              <div className="flex items-center gap-1.5 truncate">
                <Store className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                <span className="truncate">{product.seller.nama}</span>
              </div>
            )}
            {(product.region || product.alamat) && (
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                <span className="truncate">
                  {product.region
                    ? `${product.region.nama}${product.alamat ? ` (${product.alamat})` : ''}`
                    : product.alamat}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
