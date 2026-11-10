'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatRupiah, formatTanggal } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  approveProductAction,
  rejectProductAction,
  toggleFeaturedAction,
} from '@/features/admin/actions'
import { toast } from 'sonner'
import {
  Check,
  X,
  Star,
  Store,
  MapPin,
  Phone,
  Calendar,
  ExternalLink,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react'

interface AdminModerationItemProps {
  product: {
    id: string
    nama: string
    deskripsi: string
    harga: number
    foto_url: string | null
    no_wa: string
    alamat: string | null
    status: 'pending' | 'approved' | 'rejected'
    alasan_tolak: string | null
    is_featured: boolean
    created_at: string
    category?: { nama: string } | null
    region?: { nama: string } | null
    seller?: { nama: string } | null
  }
}

export function AdminModerationItem({ product }: AdminModerationItemProps) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [alasan, setAlasan] = useState('')
  const [loadingApprove, setLoadingApprove] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)
  const [loadingFeatured, setLoadingFeatured] = useState(false)

  async function handleApprove() {
    setLoadingApprove(true)
    try {
      const res = await approveProductAction(product.id)
      if (!res.success) {
        toast.error(res.error || 'Gagal menyetujui produk')
      } else {
        toast.success(`Produk "${product.nama}" berhasil disetujui!`)
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyetujui produk')
    } finally {
      setLoadingApprove(false)
    }
  }

  async function handleRejectSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!alasan.trim() || alasan.trim().length < 3) {
      toast.error('Alasan penolakan wajib diisi minimal 3 karakter.')
      return
    }

    setLoadingReject(true)
    try {
      const res = await rejectProductAction(product.id, alasan)
      if (!res.success) {
        toast.error(res.error || 'Gagal menolak produk')
      } else {
        toast.success(`Produk "${product.nama}" telah ditolak dengan alasan yang dicatat.`)
        setRejectDialogOpen(false)
        setAlasan('')
      }
    } catch {
      toast.error('Terjadi kesalahan saat menolak produk')
    } finally {
      setLoadingReject(false)
    }
  }

  async function handleToggleFeatured() {
    setLoadingFeatured(true)
    try {
      const nextFeatured = !product.is_featured
      const res = await toggleFeaturedAction(product.id, nextFeatured)
      if (!res.success) {
        toast.error(res.error || 'Gagal mengubah status unggulan')
      } else {
        toast.success(
          nextFeatured
            ? `"${product.nama}" ditandai sebagai produk unggulan`
            : `"${product.nama}" dihapus dari produk unggulan`
        )
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengubah status unggulan')
    } finally {
      setLoadingFeatured(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-5 p-5 border border-neutral-200 rounded-xl bg-white shadow-xs">
      {/* Gambar Produk */}
      <div className="relative h-44 w-full md:w-44 shrink-0 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
        {product.foto_url ? (
          <Image
            src={product.foto_url}
            alt={product.nama}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
      </div>

      {/* Info Detail */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={product.status} />
            {product.category && (
              <span className="text-xs bg-neutral-100 text-neutral-700 font-medium px-2.5 py-0.5 rounded-full">
                {product.category.nama}
              </span>
            )}
            {product.region && (
              <span className="text-xs bg-purple-50 text-purple-700 font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {product.region.nama}
              </span>
            )}
            {product.is_featured && (
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                Unggulan
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-neutral-900">{product.nama}</h3>
          <p className="text-base font-extrabold text-emerald-600">
            {formatRupiah(product.harga)}
          </p>

          <p className="text-xs text-neutral-600 whitespace-pre-line line-clamp-3 bg-neutral-50 p-2.5 rounded-md border border-neutral-100">
            {product.deskripsi || 'Tidak ada deskripsi.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-500 pt-1">
            <div className="flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <span>Penjual: <strong>{product.seller?.nama || 'Anonim'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <span>WA: +{product.no_wa}</span>
            </div>
            {product.alamat && (
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                <span>Lokasi: {product.alamat}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 sm:col-span-2 text-neutral-400">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>Diajukan: {formatTanggal(product.created_at)}</span>
            </div>
          </div>

          {product.status === 'rejected' && product.alasan_tolak && (
            <div className="rounded-md bg-rose-50 p-2.5 text-xs text-rose-800 border border-rose-200 mt-2">
              <strong>Alasan ditolak:</strong> {product.alasan_tolak}
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-2">
          {/* Tombol Setujui */}
          {product.status !== 'approved' && (
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1"
              disabled={loadingApprove}
              onClick={handleApprove}
            >
              {loadingApprove ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Setujui Produk
            </Button>
          )}

          {/* Tombol Tolak */}
          {product.status !== 'rejected' && (
            <Button
              size="sm"
              variant="destructive"
              className="font-medium gap-1"
              disabled={loadingReject}
              onClick={() => setRejectDialogOpen(true)}
            >
              <X className="h-3.5 w-3.5" />
              Tolak Produk
            </Button>
          )}

          {/* Toggle Unggulan (hanya untuk approved) */}
          {product.status === 'approved' && (
            <Button
              size="sm"
              variant={product.is_featured ? 'secondary' : 'outline'}
              className="gap-1.5 font-medium"
              disabled={loadingFeatured}
              onClick={handleToggleFeatured}
            >
              <Star
                className={`h-3.5 w-3.5 ${
                  product.is_featured
                    ? 'fill-amber-500 text-amber-500'
                    : 'text-neutral-400'
                }`}
              />
              {product.is_featured ? 'Hapus Unggulan' : 'Jadikan Unggulan'}
            </Button>
          )}

          {/* Lihat Pratinjau Publik */}
          <Button asChild size="sm" variant="ghost" className="ml-auto text-xs text-neutral-500">
            <Link href={`/produk/${product.id}`} target="_blank">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Lihat Detail
            </Link>
          </Button>
        </div>
      </div>

      {/* Dialog Alasan Tolak */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <form onSubmit={handleRejectSubmit}>
            <DialogHeader>
              <DialogTitle>Tolak Produk: {product.nama}</DialogTitle>
              <DialogDescription>
                Tuliskan alasan penolakan secara jelas agar penjual tahu bagian mana yang perlu diperbaiki sebelum produk dapat disetujui.
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 space-y-2">
              <Label htmlFor="alasan">Alasan Penolakan (Wajib diisi) *</Label>
              <Textarea
                id="alasan"
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder="Contoh: Foto produk buram, mohon unggah foto produk asli yang jelas dan terang..."
                rows={3}
                required
                disabled={loadingReject}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectDialogOpen(false)}
                disabled={loadingReject}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={loadingReject}
              >
                {loadingReject ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Konfirmasi Tolak'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
