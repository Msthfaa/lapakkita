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
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Layers,
  FileCheck2,
} from 'lucide-react'

interface AdminModerationItemProps {
  product: {
    id: string
    nama: string
    deskripsi: string
    harga: number
    foto_url: string | null
    foto_urls?: string[] | null
    satuan?: string | null
    kondisi_stok?: 'ready_stock' | 'pre_order' | 'stok_terbatas' | null
    metode_pengiriman?: string[] | null
    varian?: string | null
    no_izin?: string | null
    no_wa: string
    alamat: string | null
    status: 'pending' | 'approved' | 'rejected'
    alasan_tolak: string | null
    is_featured: boolean
    is_active: boolean
    created_at: string
    category?: { nama: string } | null
    region?: { nama: string } | null
    seller?: { nama: string } | null
  }
}

const SHIPPING_LABELS: Record<string, string> = {
  ambil_di_tempat: 'Ambil di Tempat',
  cod: 'COD',
  kurir_instan: 'Kurir Instan',
  kurir_ekspedisi: 'Ekspedisi (JNE/J&T)',
}

export function AdminModerationItem({ product }: AdminModerationItemProps) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [alasan, setAlasan] = useState('')
  const [loadingApprove, setLoadingApprove] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)
  const [loadingFeatured, setLoadingFeatured] = useState(false)

  // Galeri foto untuk admin
  const allImages =
    product.foto_urls && product.foto_urls.length > 0
      ? product.foto_urls
      : product.foto_url
        ? [product.foto_url]
        : []
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
  const currentPhoto = allImages[activePhotoIdx] || product.foto_url

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
    <div className="flex flex-col md:flex-row gap-5 p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900/80 shadow-xs">
      {/* Kolom Gambar Produk & Thumbnail Multi-Foto */}
      <div className="flex flex-col gap-2 w-full md:w-48 shrink-0">
        <div className="relative h-44 w-full rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          {currentPhoto ? (
            <Image
              src={currentPhoto}
              alt={product.nama}
              fill
              className="object-cover transition-all"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400 dark:text-neutral-500">
              <ImageIcon className="h-10 w-10" />
            </div>
          )}

          {allImages.length > 1 && (
            <div className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
              {activePhotoIdx + 1} / {allImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail multi-foto jika lebih dari 1 */}
        {allImages.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhotoIdx(idx)}
                className={`relative h-11 w-11 shrink-0 rounded-md overflow-hidden border-2 transition cursor-pointer ${
                  activePhotoIdx === idx
                    ? 'border-emerald-600 ring-1 ring-emerald-500'
                    : 'border-neutral-200 dark:border-neutral-700 opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info Detail */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge status={product.status} />

            {/* Status Etalase (Aktif vs Nonaktif) */}
            {!product.is_active ? (
              <span className="text-xs bg-neutral-800 dark:bg-neutral-700 text-white font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                ⏸️ Nonaktif oleh Penjual
              </span>
            ) : (
              <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/50 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                🟢 Aktif
              </span>
            )}

            {/* Status Stok */}
            {product.kondisi_stok === 'ready_stock' && (
              <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/50 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Ready
              </span>
            )}
            {product.kondisi_stok === 'pre_order' && (
              <span className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border dark:border-blue-800/50 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="h-3 w-3" />
                PO
              </span>
            )}
            {product.kondisi_stok === 'stok_terbatas' && (
              <span className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 dark:border dark:border-amber-800/50 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Stok Terbatas
              </span>
            )}

            {product.category && (
              <span className="text-xs bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 font-medium px-2.5 py-0.5 rounded-full">
                {product.category.nama}
              </span>
            )}
            {product.region && (
              <span className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 dark:border dark:border-purple-800/50 font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {product.region.nama}
              </span>
            )}
            {product.is_featured && (
              <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border dark:border-amber-800/50 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                Unggulan
              </span>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{product.nama}</h3>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(product.harga)}
              </span>
              {product.satuan && (
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  / {product.satuan}
                </span>
              )}
            </div>
          </div>

          {/* Atribut Detail: Varian, Izin Usaha, Pengiriman */}
          {(product.varian || product.no_izin || (product.metode_pengiriman && product.metode_pengiriman.length > 0)) && (
            <div className="flex flex-wrap gap-2 text-xs">
              {product.varian && (
                <div className="inline-flex items-center gap-1 rounded bg-neutral-100 dark:bg-neutral-800 px-2 py-1 text-neutral-700 dark:text-neutral-300">
                  <Layers className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Varian: <strong>{product.varian}</strong></span>
                </div>
              )}
              {product.no_izin && (
                <div className="inline-flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                  <FileCheck2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Izin: <strong>{product.no_izin}</strong></span>
                </div>
              )}
              {product.metode_pengiriman && product.metode_pengiriman.length > 0 && (
                <div className="inline-flex items-center gap-1 rounded bg-neutral-100 dark:bg-neutral-800 px-2 py-1 text-neutral-700 dark:text-neutral-300">
                  <Truck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Kirim: {product.metode_pengiriman.map((k) => SHIPPING_LABELS[k] || k).join(', ')}</span>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-neutral-600 dark:text-neutral-300 whitespace-pre-line line-clamp-3 bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-md border border-neutral-100 dark:border-neutral-800">
            {product.deskripsi || 'Tidak ada deskripsi.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-500 dark:text-neutral-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
              <span>Penjual: <strong className="text-neutral-800 dark:text-neutral-200">{product.seller?.nama || 'Anonim'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
              <span>WA: +{product.no_wa}</span>
            </div>
            {product.alamat && (
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <MapPin className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
                <span>Lokasi: {product.alamat}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 sm:col-span-2 text-neutral-400 dark:text-neutral-500">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>Diajukan: {formatTanggal(product.created_at)}</span>
            </div>
          </div>

          {!product.is_active && (
            <div className="rounded-md bg-amber-50 dark:bg-amber-950/40 p-2.5 text-xs text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 mt-2">
              <strong>ℹ️ Catatan Moderasi:</strong> Produk ini sedang disetel <strong>Nonaktif</strong> oleh penjual. Jika Anda menyetujui, statusnya menjadi Disetujui tetapi produk <strong>tetap tidak tampil di katalog publik</strong> sampai penjual mengaktifkannya sendiri di dashboard.
            </div>
          )}

          {product.status === 'rejected' && product.alasan_tolak && (
            <div className="rounded-md bg-rose-50 dark:bg-rose-950/40 p-2.5 text-xs text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800/60 mt-2">
              <strong>Alasan ditolak:</strong> {product.alasan_tolak}
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-2">
          {/* Tombol Setujui */}
          {product.status !== 'approved' && (
            <Button
              size="sm"
              className="bg-[#186049] hover:bg-[#124b39] text-[#ECE8AF] border border-[#ECE8AF]/20 font-medium gap-1"
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
              className="gap-1.5 font-medium border-neutral-300 dark:border-neutral-700"
              disabled={loadingFeatured}
              onClick={handleToggleFeatured}
            >
              <Star
                className={`h-3.5 w-3.5 ${
                  product.is_featured
                    ? 'fill-amber-500 text-amber-500'
                    : 'text-neutral-400 dark:text-neutral-500'
                }`}
              />
              {product.is_featured ? 'Hapus Unggulan' : 'Jadikan Unggulan'}
            </Button>
          )}

          {/* Lihat Pratinjau Publik */}
          <Button asChild size="sm" variant="ghost" className="ml-auto text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
            <Link href={`/produk/${product.id}`} target="_blank">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Lihat Detail
            </Link>
          </Button>
        </div>
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
