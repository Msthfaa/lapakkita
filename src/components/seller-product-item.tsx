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
  MessageCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Layers,
  CheckCircle2,
  Clock,
  Power,
  MapPin,
  Tag,
  ExternalLink,
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
    <div
      className={`group flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
        product.is_active
          ? 'border-[#186049]/15 dark:border-[#186049]/30 bg-white dark:bg-[#0d1612] shadow-2xs hover:border-[#186049]/40 dark:hover:border-[#186049]/50 dark:hover:bg-[#101b16]'
          : 'border-neutral-200/70 dark:border-white/[0.05] bg-neutral-50/50 dark:bg-[#0a0f0d] opacity-80 border-dashed'
      }`}
    >
      {/* Gambar Thumbnail */}
      <div className="relative h-32 w-full sm:w-36 sm:h-36 shrink-0 rounded-xl overflow-hidden bg-neutral-100 dark:bg-white/[0.03] border border-[#186049]/10 dark:border-[#186049]/25">
        {product.foto_url ? (
          <Image
            src={product.foto_url}
            alt={product.nama}
            fill
            sizes="(max-width: 640px) 100vw, 144px"
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              !product.is_active ? 'grayscale-[35%] opacity-85' : ''
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400 dark:text-neutral-500">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}

        {photoCount > 1 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
            <Layers className="h-3 w-3" />
            {photoCount}
          </div>
        )}

        {!product.is_active && (
          <div className="absolute top-2 left-2 rounded-md bg-[#186049]/90 px-2 py-0.5 text-[10px] font-medium text-[#ECE8AF] backdrop-blur-xs border border-[#ECE8AF]/20">
            Nonaktif
          </div>
        )}
      </div>

      {/* Info Produk */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Baris Badge Harmonis */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <StatusBadge status={product.status} />

            {/* Status Tayang Etalase */}
            {product.is_active ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-[#4A943E]/15 text-[#4A943E] dark:text-[#6ec961] border border-[#4A943E]/30 px-2.5 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4A943E] animate-pulse" />
                Aktif di Etalase
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-neutral-100 dark:bg-white/[0.05] text-neutral-600 dark:text-neutral-400 border border-neutral-200/80 dark:border-white/[0.07] px-2.5 py-0.5 rounded-full">
                Dinonaktifkan
              </span>
            )}

            {/* Status Stok */}
            {product.kondisi_stok === 'ready_stock' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#4A943E]/10 text-[#4A943E] dark:text-[#6ec961] border border-[#4A943E]/25 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3 text-[#4A943E]" />
                Ready
              </span>
            )}
            {product.kondisi_stok === 'pre_order' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#D98327]/15 text-[#D98327] dark:text-[#f7a348] border border-[#D98327]/30 px-2.5 py-0.5 rounded-full">
                <Clock className="h-3 w-3" />
                PO
              </span>
            )}
            {product.kondisi_stok === 'stok_terbatas' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#D98327]/15 text-[#D98327] dark:text-[#f7a348] border border-[#D98327]/30 px-2.5 py-0.5 rounded-full">
                <AlertCircle className="h-3 w-3" />
                Stok Terbatas
              </span>
            )}

            {/* Kategori */}
            {product.category && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#ECE8AF]/30 dark:bg-[#186049]/25 text-[#186049] dark:text-white border border-[#186049]/15 dark:border-[#186049]/30 px-2.5 py-0.5 rounded-full">
                <Tag className="h-2.5 w-2.5 opacity-70" />
                {product.category.nama}
              </span>
            )}

            {/* Daerah */}
            {product.region && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#ECE8AF]/30 dark:bg-[#186049]/25 text-[#186049] dark:text-white border border-[#186049]/15 dark:border-[#186049]/30 px-2.5 py-0.5 rounded-full">
                <MapPin className="h-2.5 w-2.5 text-[#D98327]" />
                {product.region.nama}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-neutral-900 dark:text-[#f4f5ef] text-base sm:text-lg tracking-tight group-hover:text-[#186049] dark:group-hover:text-white transition-colors">
            {product.nama}
          </h3>

          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base sm:text-lg font-bold text-[#4A943E] dark:text-[#6ec961] font-mono tracking-tight">
              {formatRupiah(product.harga)}
            </span>
            {product.satuan && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                / {product.satuan}
              </span>
            )}
          </div>

          {/* Klik WA Chip */}
          <div className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#186049]/10 dark:bg-[#186049]/25 text-[#186049] dark:text-white border border-[#186049]/25">
            <MessageCircle className="h-3.5 w-3.5 text-[#4A943E]" />
            <span>{product.total_clicks} kali diklik pembeli via WhatsApp</span>
          </div>

          {/* Peringatan Informatif jika status Disetujui tapi Dinonaktifkan */}
          {product.status === 'approved' && !product.is_active && (
            <div className="mt-3 rounded-xl bg-[#D98327]/10 p-3 text-xs text-[#D98327] dark:text-[#f7a348] border border-[#D98327]/25 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#D98327] mt-0.5" />
              <div>
                <p className="font-semibold text-[#D98327]">Produk Disetujui, Namun Sedang Dinonaktifkan</p>
                <p className="text-neutral-600 dark:text-neutral-300 mt-0.5">
                  Produk ini aman &amp; telah disetujui, tetapi saat ini disembunyikan dari katalog publik (misal stok kosong/libur). Klik tombol <strong>Aktifkan di Etalase</strong> kapan pun siap dijual kembali.
                </p>
              </div>
            </div>
          )}

          {/* Peringatan Informatif jika status Pending dan Dinonaktifkan */}
          {product.status === 'pending' && !product.is_active && (
            <div className="mt-3 rounded-xl bg-neutral-100 dark:bg-white/[0.04] p-3 text-xs text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/[0.08] flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
              <span>
                Produk sedang dalam antrean verifikasi admin dalam status <strong>Nonaktif</strong>.
              </span>
            </div>
          )}

          {/* Alert jika ditolak */}
          {product.status === 'rejected' && product.alasan_tolak && (
            <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-rose-500/10 p-3 text-xs text-rose-800 dark:text-rose-200 border border-rose-500/20">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <div>
                <p className="font-semibold text-rose-900 dark:text-rose-100">Alasan penolakan dari admin:</p>
                <p className="mt-0.5">{product.alasan_tolak}</p>
              </div>
            </div>
          )}
        </div>

        {/* Baris Tombol Aksi */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3.5 border-t border-[#186049]/10 dark:border-[#186049]/20">
          {/* Tombol Edit */}
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-8 px-3 text-xs font-medium gap-1.5 rounded-lg border-[#186049]/25 dark:border-[#186049]/40 bg-white/80 dark:bg-[#0f1915] hover:bg-[#186049]/10 text-[#186049] dark:text-white"
          >
            <Link href={`/dashboard/produk/${product.id}/ubah`}>
              <Edit className="h-3.5 w-3.5 text-[#186049] dark:text-white" />
              Edit
            </Link>
          </Button>

          {/* Tombol Toggle Aktif / Nonaktif */}
          <Button
            type="button"
            size="sm"
            disabled={togglingActive}
            onClick={handleToggleActive}
            className={`gap-1.5 h-8 px-3 text-xs font-medium rounded-lg cursor-pointer transition-all ${
              product.is_active
                ? 'border border-[#186049]/25 dark:border-[#186049]/40 bg-white/80 dark:bg-[#0f1915] hover:bg-[#186049]/10 text-neutral-700 dark:text-neutral-300'
                : 'bg-[#186049] hover:bg-[#124b39] text-[#ECE8AF] border border-[#ECE8AF]/20 shadow-2xs'
            }`}
          >
            {togglingActive ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : product.is_active ? (
              <>
                <Power className="h-3.5 w-3.5 text-neutral-400" />
                Nonaktifkan
              </>
            ) : (
              <>
                <Power className="h-3.5 w-3.5 text-[#ECE8AF]" />
                Aktifkan di Etalase
              </>
            )}
          </Button>

          {/* Tombol Lihat Pratinjau / Publik */}
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="h-8 px-3 text-xs font-medium gap-1.5 rounded-lg text-neutral-600 hover:text-[#186049] dark:text-neutral-400 dark:hover:text-white hover:bg-[#186049]/10"
          >
            <Link href={`/produk/${product.id}`} target="_blank">
              <ExternalLink className="h-3.5 w-3.5" />
              {product.is_active ? 'Lihat di Etalase' : 'Pratinjau'}
            </Link>
          </Button>

          {/* Tombol Hapus */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDeleteOpen(true)}
            className="gap-1.5 h-8 px-2.5 text-xs font-medium text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 ml-auto rounded-lg transition-colors cursor-pointer"
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
