'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { StatusBadge } from '@/components/status-badge'
import { formatRupiah } from '@/lib/format'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { deleteProductAction } from '@/features/products/actions'
import { toast } from 'sonner'
import { Edit, Trash2, Eye, MessageCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react'

interface SellerProductItemProps {
  product: {
    id: string
    nama: string
    deskripsi: string
    harga: number
    foto_url: string | null
    status: 'pending' | 'approved' | 'rejected'
    alasan_tolak: string | null
    total_clicks: number
    category?: { nama: string } | null
    region?: { nama: string } | null
  }
}

export function SellerProductItem({ product }: SellerProductItemProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await deleteProductAction(product.id)
      if (!res.success) {
        toast.error(res.error || 'Gagal menghapus produk')
      } else {
        toast.success('Produk berhasil dihapus')
        setDeleteOpen(false)
      }
    } catch {
      toast.error('Terjadi kesalahan saat menghapus produk')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border border-neutral-200 rounded-xl bg-white shadow-sm hover:border-neutral-300 transition-all">
      {/* Gambar */}
      <div className="relative h-32 w-full sm:w-32 shrink-0 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-100">
        {product.foto_url ? (
          <Image
            src={product.foto_url}
            alt={product.nama}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* Info Produk */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <StatusBadge status={product.status} />
            {product.category && (
              <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium">
                {product.category.nama}
              </span>
            )}
            {product.region && (
              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                📍 {product.region.nama}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-neutral-900 text-base">{product.nama}</h3>
          <p className="text-sm font-bold text-emerald-700 mt-1">
            {formatRupiah(product.harga)}
          </p>

          {/* Klik WA counter */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-600 font-medium bg-emerald-50 text-emerald-800 w-fit px-2.5 py-1 rounded-md">
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>Produkmu diklik {product.total_clicks} kali via WhatsApp</span>
          </div>

          {/* Alert jika ditolak */}
          {product.status === 'rejected' && product.alasan_tolak && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-semibold text-rose-900">Alasan penolakan dari admin:</p>
                <p className="mt-0.5">{product.alasan_tolak}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-neutral-100">
          {product.status === 'approved' && (
            <Button asChild size="sm" variant="ghost" className="h-8 text-neutral-600">
              <Link href={`/produk/${product.id}`} target="_blank">
                <Eye className="h-3.5 w-3.5 mr-1" /> Lihat Publik
              </Link>
            </Button>
          )}

          <Button asChild size="sm" variant={product.status === 'rejected' ? 'default' : 'outline'} className={product.status === 'rejected' ? 'bg-amber-600 hover:bg-amber-700 text-white h-8' : 'h-8'}>
            <Link href={`/dashboard/produk/${product.id}/ubah`}>
              <Edit className="h-3.5 w-3.5 mr-1" />
              {product.status === 'rejected' ? 'Perbaiki Produk' : 'Ubah'}
            </Link>
          </Button>

          <Button
            size="sm"
            variant="destructive"
            className="h-8 ml-auto"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Produk Ini?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus produk <strong>&quot;{product.nama}&quot;</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Ya, Hapus'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
