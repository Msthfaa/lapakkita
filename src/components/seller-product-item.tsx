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
import { deleteProductAction, toggleProductActiveAction } from '@/features/products/actions'
import { toast } from 'sonner'
import {
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Layers,
  CheckCircle2,
  Clock,
  Power,
} from 'lucide-react'

interface SellerProductItemProps {
  product: {
    id: string
    nama: string
    deskripsi: string
    harga: number
    foto_url: string | null
    foto_urls?: string[] | null
    satuan?: string | null
    kondisi_stok?: 'ready_stock' | 'pre_order' | 'stok_terbatas' | null
    is_active: boolean
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
  const [togglingActive, setTogglingActive] = useState(false)

  const photoCount = product.foto_urls?.length || (product.foto_url ? 1 : 0)

  async function handleToggleActive() {
    setTogglingActive(true)
    const nextState = !product.is_active
    try {
      const res = await toggleProductActiveAction(product.id, nextState)
      if (!res.success) {
        toast.error(res.error || 'Gagal mengubah status etalase')
      } else {
        toast.success(
          nextState
            ? `Produk "${product.nama}" berhasil diaktifkan kembali di etalase!`
            : `Produk "${product.nama}" dinonaktifkan sementara dari etalase.`
        )
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengubah status produk')
    } finally {
      setTogglingActive(false)
    }
  }

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
    <div className={`flex flex-col sm:flex-row gap-4 p-4 border rounded-xl bg-white shadow-xs transition-all ${
      product.is_active ? 'border-neutral-200 hover:border-neutral-300' : 'border-neutral-200/70 bg-neutral-50/40 opacity-90'
    }`}>
      {/* Gambar */}
      <div className="relative h-32 w-full sm:w-32 shrink-0 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-100">
        {product.foto_url ? (
          <Image
            src={product.foto_url}
            alt={product.nama}
            fill
            className={`object-cover ${!product.is_active ? 'grayscale-[40%]' : ''}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}

        {photoCount > 1 && (
          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
            <Layers className="h-3 w-3" />
            {photoCount}
          </div>
        )}

        {!product.is_active && (
          <div className="absolute top-1.5 left-1.5 rounded bg-neutral-900/80 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
            Nonaktif
          </div>
        )}
      </div>

      {/* Info Produk */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <StatusBadge status={product.status} />

            {/* Status Tayang Etalase (Aktif vs Nonaktif) */}
            {product.is_active ? (
              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Aktif di Etalase
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-semibold">
                ⏸️ Dinonaktifkan
              </span>
            )}

            {/* Status Stok */}
            {product.kondisi_stok === 'pre_order' && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                <Clock className="h-3 w-3" />
                PO
              </span>
            )}
            {product.kondisi_stok === 'stok_terbatas' && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                <AlertCircle className="h-3 w-3" />
                Stok Terbatas
              </span>
            )}
            {product.kondisi_stok === 'ready_stock' && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle2 className="h-3 w-3" />
                Ready
              </span>
            )}

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
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-sm font-bold text-emerald-700">
              {formatRupiah(product.harga)}
            </span>
            {product.satuan && (
              <span className="text-xs font-normal text-neutral-500">
                / {product.satuan}
              </span>
            )}
          </div>

          {/* Klik WA counter */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-600 font-medium bg-emerald-50 text-emerald-800 w-fit px-2.5 py-1 rounded-md">
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>Produkmu diklik {product.total_clicks} kali via WhatsApp</span>
          </div>

          {/* Peringatan Informatif jika status Disetujui tapi Dinonaktifkan */}
          {product.status === 'approved' && !product.is_active && (
            <div className="mt-2.5 rounded-lg bg-amber-50/90 p-2.5 text-xs text-amber-900 border border-amber-200 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold">Produk Disetujui, Namun Sedang Dinonaktifkan</p>
                <p className="text-amber-800 mt-0.5">
                  Produk ini aman &amp; telah disetujui, tetapi saat ini Anda sembunyikan dari etalase publik (misal stok kosong/libur). Klik tombol <strong>Aktifkan</strong> di bawah kapan pun Anda siap menjualnya kembali.
                </p>
              </div>
            </div>
          )}

          {/* Peringatan Informatif jika status Pending dan Dinonaktifkan */}
          {product.status === 'pending' && !product.is_active && (
            <div className="mt-2.5 rounded-lg bg-neutral-100/90 p-2 text-xs text-neutral-700 border border-neutral-200 flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
              <span>
                Produk sedang dalam antrean verifikasi admin dalam status <strong>Nonaktif</strong>.
              </span>
            </div>
          )}

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

        {/* Baris Tombol Aksi */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-neutral-100">
          {/* Tombol Edit */}
          <Button asChild size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
            <Link href={`/dashboard/produk/${product.id}/ubah`}>
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>

          {/* Tombol Toggle Aktif / Nonaktif */}
          <Button
            type="button"
            size="sm"
            variant={product.is_active ? 'outline' : 'default'}
            disabled={togglingActive}
            onClick={handleToggleActive}
            className={`gap-1.5 h-8 text-xs font-medium cursor-pointer ${
              !product.is_active
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {togglingActive ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : product.is_active ? (
              <>
                <Power className="h-3.5 w-3.5 text-neutral-500" />
                Nonaktifkan
              </>
            ) : (
              <>
                <Power className="h-3.5 w-3.5 text-white" />
                Aktifkan
              </>
            )}
          </Button>

          {/* Tombol Lihat Pratinjau / Publik */}
          <Button asChild size="sm" variant="ghost" className="gap-1.5 h-8 text-xs text-neutral-600">
            <Link href={`/produk/${product.id}`} target="_blank">
              <Eye className="h-3.5 w-3.5" />
              {product.is_active ? 'Lihat di Publik' : 'Pratinjau'}
            </Link>
          </Button>

          {/* Tombol Hapus */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDeleteOpen(true)}
            className="gap-1.5 h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 ml-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus
          </Button>
        </div>
      </div>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Produk</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus produk <strong>&ldquo;{product.nama}&rdquo;</strong>? Tindakan ini tidak dapat dibatalkan dan semua data produk termasuk statistik klik WhatsApp akan dihapus permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() => setDeleteOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
              className="gap-2"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Ya, Hapus Produk'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
