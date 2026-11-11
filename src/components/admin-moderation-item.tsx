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
import { swalConfirm, swalSuccess, swalError } from '@/lib/sweetalert'
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
    const confirmed = await swalConfirm({
      title: 'Setujui Produk Ini?',
      text: `Produk "${product.nama}" akan disetujui dan langsung siap tampil di etalase katalog publik LapakKita.`,
      confirmButtonText: 'Ya, Setujui Sekarang',
      cancelButtonText: 'Periksa Lagi',
      icon: 'question',
    })

    if (!confirmed) return

    setLoadingApprove(true)
    try {
      const res = await approveProductAction(product.id)
      if (!res.success) {
        await swalError({
          title: 'Gagal Menyetujui Produk',
          text: res.error || 'Terjadi kesalahan sistem.',
        })
      } else {
        await swalSuccess({
          title: 'Produk Berhasil Disetujui!',
          text: `"${product.nama}" kini berstatus disetujui dan aktif.`,
        })
      }
    } catch {
      await swalError({
        title: 'Terjadi Kendala',
        text: 'Tidak dapat memproses persetujuan produk saat ini.',
      })
    } finally {
      setLoadingApprove(false)
    }
  }

  async function handleRejectSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!alasan.trim() || alasan.trim().length < 3) {
      await swalError({
        title: 'Alasan Belum Lengkap',
        text: 'Alasan penolakan wajib diisi minimal 3 karakter agar penjual dapat memperbaiki produknya.',
      })
      return
    }

    setLoadingReject(true)
    try {
      const res = await rejectProductAction(product.id, alasan.trim())
      if (!res.success) {
        await swalError({
          title: 'Gagal Menolak Produk',
          text: res.error || 'Terjadi kesalahan sistem.',
        })
      } else {
        setRejectDialogOpen(false)
        setAlasan('')
        await swalSuccess({
          title: 'Produk Telah Ditolak',
          text: `Catatan revisi telah dikirimkan untuk diperbaiki oleh penjual.`,
        })
      }
    } catch {
      await swalError({
        title: 'Terjadi Kendala',
        text: 'Tidak dapat memproses penolakan produk.',
      })
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
        await swalError({
          title: 'Gagal Mengubah Status',
          text: res.error || 'Terjadi kesalahan sistem.',
        })
      } else {
        await swalSuccess({
          title: nextFeatured ? 'Produk Dijadikan Unggulan!' : 'Dihapus dari Unggulan',
          text: nextFeatured
            ? `"${product.nama}" kini tampil di bagian produk unggulan rekomendasi.`
            : `"${product.nama}" kembali ke etalase biasa.`,
        })
      }
    } catch {
      await swalError({
        title: 'Terjadi Kendala',
        text: 'Tidak dapat mengubah status produk unggulan.',
      })
    } finally {
      setLoadingFeatured(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-5 sm:gap-6 p-6 border border-neutral-200/80 dark:border-neutral-900 rounded-3xl bg-white dark:bg-neutral-950 shadow-2xs transition-colors">
      {/* Kolom Gambar Produk & Thumbnail Multi-Foto */}
      <div className="flex flex-col gap-2.5 w-full md:w-52 shrink-0">
        <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
          {currentPhoto ? (
            <Image
              src={currentPhoto}
              alt={product.nama}
              fill
              className="object-cover transition-all"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              <ImageIcon className="h-10 w-10" />
            </div>
          )}

          {allImages.length > 1 && (
            <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-xs">
              {activePhotoIdx + 1} / {allImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail multi-foto jika lebih dari 1 */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhotoIdx(idx)}
                className={`relative h-12 w-12 shrink-0 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                  activePhotoIdx === idx
                    ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                    : 'border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info Detail */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge status={product.status} />

            {/* Status Etalase (Aktif vs Nonaktif) */}
            {!product.is_active ? (
              <span className="text-xs bg-neutral-800 text-white font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                ⏸️ Nonaktif oleh Penjual
              </span>
            ) : (
              <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                🟢 Aktif
              </span>
            )}

            {/* Status Stok */}
            {product.kondisi_stok === 'ready_stock' && (
              <span className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Ready
              </span>
            )}
            {product.kondisi_stok === 'pre_order' && (
              <span className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                PO
              </span>
            )}
            {product.kondisi_stok === 'stok_terbatas' && (
              <span className="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Stok Terbatas
              </span>
            )}

            {product.category && (
              <span className="text-xs bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-medium px-2.5 py-1 rounded-full">
                {product.category.nama}
              </span>
            )}
            {product.region && (
              <span className="text-xs bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {product.region.nama}
              </span>
            )}
            {product.is_featured && (
              <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                Unggulan
              </span>
            )}
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">{product.nama}</h3>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
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
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 px-2.5 py-1 text-neutral-700 dark:text-neutral-300">
                  <Layers className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Varian: <strong>{product.varian}</strong></span>
                </div>
              )}
              {product.no_izin && (
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  <FileCheck2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Izin: <strong>{product.no_izin}</strong></span>
                </div>
              )}
              {product.metode_pengiriman && product.metode_pengiriman.length > 0 && (
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 px-2.5 py-1 text-neutral-700 dark:text-neutral-300">
                  <Truck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Kirim: {product.metode_pengiriman.map((k) => SHIPPING_LABELS[k] || k).join(', ')}</span>
                </div>
              )}
            </div>
          )}

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line line-clamp-3 bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-2xl border border-neutral-100 dark:border-neutral-900">
            {product.deskripsi || 'Tidak ada deskripsi.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Store className="h-4 w-4 text-neutral-400 shrink-0" />
              <span>Penjual: <strong className="text-neutral-800 dark:text-neutral-200">{product.seller?.nama || 'Anonim'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-neutral-400 shrink-0" />
              <span>WA: +{product.no_wa}</span>
            </div>
            {product.alamat && (
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <MapPin className="h-4 w-4 text-neutral-400 shrink-0" />
                <span>Lokasi: {product.alamat}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 sm:col-span-2 text-neutral-400">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Diajukan: {formatTanggal(product.created_at)}</span>
            </div>
          </div>

          {!product.is_active && (
            <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-3 text-xs sm:text-sm text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 mt-2">
              <strong>ℹ️ Catatan Moderasi:</strong> Produk ini sedang disetel <strong>Nonaktif</strong> oleh penjual. Jika Anda menyetujui, statusnya menjadi Disetujui tetapi produk <strong>tetap tidak tampil di katalog publik</strong> sampai penjual mengaktifkannya sendiri di dashboard.
            </div>
          )}

          {product.status === 'rejected' && product.alasan_tolak && (
            <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-3 text-xs sm:text-sm text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 mt-2">
              <strong>Alasan ditolak:</strong> {product.alasan_tolak}
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-neutral-900 flex flex-wrap items-center gap-2.5">
          {/* Tombol Setujui */}
          {product.status !== 'approved' && (
            <Button
              size="sm"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm gap-1.5 px-4 h-10 shadow-xs"
              disabled={loadingApprove}
              onClick={handleApprove}
            >
              {loadingApprove ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Setujui Produk
            </Button>
          )}

          {/* Tombol Tolak */}
          {product.status !== 'rejected' && (
            <Button
              size="sm"
              variant="destructive"
              className="rounded-xl font-semibold text-xs sm:text-sm gap-1.5 px-4 h-10 shadow-xs"
              disabled={loadingReject}
              onClick={() => setRejectDialogOpen(true)}
            >
              <X className="h-4 w-4" />
              Tolak Produk
            </Button>
          )}

          {/* Toggle Unggulan */}
          {product.status === 'approved' && (
            <Button
              size="sm"
              variant={product.is_featured ? 'secondary' : 'outline'}
              className="rounded-xl gap-2 font-semibold text-xs sm:text-sm px-4 h-10 border-neutral-200 dark:border-neutral-800"
              disabled={loadingFeatured}
              onClick={handleToggleFeatured}
            >
              <Star
                className={`h-4 w-4 ${
                  product.is_featured
                    ? 'fill-amber-500 text-amber-500'
                    : 'text-neutral-400'
                }`}
              />
              {product.is_featured ? 'Hapus Unggulan' : 'Jadikan Unggulan'}
            </Button>
          )}

          {/* Lihat Pratinjau Publik */}
          <Button asChild size="sm" variant="ghost" className="rounded-xl ml-auto text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white h-10">
            <Link href={`/produk/${product.id}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Lihat Detail
            </Link>
          </Button>
        </div>
      </div>

      {/* Dialog Pop-up Tolak Produk (Palette: #D98327, #186049, #ECE8AF) */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="rounded-3xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-[#0c1611] p-6 sm:p-7 shadow-2xl max-w-lg">
          <form onSubmit={handleRejectSubmit}>
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#D98327]/20 text-[#D98327] font-bold">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <DialogTitle className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white">
                  Tolak Produk: {product.nama}
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Tuliskan alasan penolakan secara jelas dan ramah agar penjual tahu bagian mana yang perlu diperbaiki sebelum produk dapat disetujui.
              </DialogDescription>
            </DialogHeader>

            <div className="my-5 space-y-2">
              <Label htmlFor="alasan" className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Alasan Penolakan / Catatan Perbaikan (Wajib diisi) *
              </Label>
              <Textarea
                id="alasan"
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder="Contoh: Foto produk tampak buram, mohon unggah ulang foto asli dengan pencahayaan terang dan sertakan izin usaha PIRT/BPOM jika ada..."
                rows={3}
                required
                disabled={loadingReject}
                className="rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-sm focus-visible:ring-2 focus-visible:ring-[#D98327] resize-none"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectDialogOpen(false)}
                disabled={loadingReject}
                className="rounded-2xl h-11 px-5 border-neutral-200 dark:border-neutral-800 font-semibold text-xs sm:text-sm"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="rounded-2xl h-11 px-6 bg-[#D98327] hover:bg-[#bd6e1b] text-white font-bold text-xs sm:text-sm shadow-sm transition-transform hover:scale-102"
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
