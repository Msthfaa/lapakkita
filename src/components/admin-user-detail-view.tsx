'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatRupiah, formatTanggal } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StatusBadge } from '@/components/status-badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  adminUpdateUserAction,
  adminDeleteUserAction,
  approveProductAction,
  rejectProductAction,
} from '@/features/admin/actions'
import { swalDeleteConfirm, swalSuccess, swalError, swalConfirm } from '@/lib/sweetalert'
import { toast } from 'sonner'
import {
  Store,
  Shield,
  Calendar,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  MessageCircle,
  Edit2,
  Trash2,
  ArrowLeft,
  ExternalLink,
  MapPin,
  Tag,
  AlertTriangle,
  Loader2,
  Check,
  X,
  ImageIcon,
} from 'lucide-react'

interface ProductDetailItem {
  id: string
  nama: string
  deskripsi: string
  harga: number
  foto_url: string | null
  foto_urls?: string[] | null
  satuan?: string | null
  kondisi_stok?: string | null
  no_wa: string
  alamat: string | null
  status: 'pending' | 'approved' | 'rejected'
  alasan_tolak: string | null
  is_featured: boolean
  is_active?: boolean
  created_at: string
  category?: { id: number; nama: string } | null
  region?: { id: number; nama: string } | null
  wa_clicks_count: number
}

interface AdminUserDetailViewProps {
  user: {
    id: string
    nama: string
    role: 'seller' | 'admin'
    created_at: string
  }
  products: ProductDetailItem[]
  stats: {
    totalProducts: number
    approvedCount: number
    pendingCount: number
    rejectedCount: number
    totalClicks: number
  }
  currentUserId?: string
}

export function AdminUserDetailView({
  user,
  products,
  stats,
  currentUserId,
}: AdminUserDetailViewProps) {
  const router = useRouter()
  const isCurrent = user.id === currentUserId
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all')

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false)
  const [editNama, setEditNama] = useState(user.nama)
  const [editRole, setEditRole] = useState<'seller' | 'admin'>(user.role)
  const [isUpdating, setIsUpdating] = useState(false)

  // Direct Moderation State
  const [rejectDialogProduct, setRejectDialogProduct] = useState<ProductDetailItem | null>(null)
  const [alasanTolak, setAlasanTolak] = useState('')
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null)

  // Filter Produk
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true
    return p.status === activeTab
  })

  // Simpan Edit User dengan SweetAlert
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editNama.trim() || editNama.trim().length < 2) {
      await swalError({
        title: 'Nama Kurang Lengkap',
        text: 'Nama pengguna atau usaha minimal 2 karakter.',
      })
      return
    }

    setIsUpdating(true)
    try {
      const res = await adminUpdateUserAction(user.id, {
        nama: editNama.trim(),
        role: editRole,
      })

      if (!res.success) {
        await swalError({
          title: 'Gagal Menyimpan Data',
          text: res.error || 'Terjadi kesalahan sistem.',
        })
      } else {
        const saved = editNama.trim()
        setEditOpen(false)
        await swalSuccess({
          title: 'Akun Berhasil Diperbarui!',
          text: `Data akun "${saved}" telah berhasil disimpan.`,
        })
        router.refresh()
      }
    } catch {
      await swalError({
        title: 'Terjadi Kendala',
        text: 'Gagal menyimpan perubahan pengguna.',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Hapus User Langsung dengan SweetAlert
  async function handleDeletePrompt() {
    if (isCurrent) {
      await swalError({
        title: 'Aksi Tidak Diizinkan',
        text: 'Anda tidak dapat menghapus akun Anda sendiri demi keamanan sistem.',
      })
      return
    }

    const hasProducts = stats.totalProducts > 0
    const confirmed = await swalDeleteConfirm({
      title: `Hapus Akun "${user.nama}"?`,
      text: hasProducts
        ? `Perhatian: Mitra ini memiliki ${stats.totalProducts} produk jualan. Seluruh produk dan riwayat WhatsApp akan otomatis dihapus permanen.`
        : `Akun ini akan dihapus permanen dari sistem LapakKita.`,
      confirmButtonText: hasProducts ? 'Ya, Hapus Akun & Produk' : 'Ya, Hapus Akun',
      cancelButtonText: 'Batal',
    })

    if (!confirmed) return

    try {
      const res = await adminDeleteUserAction(user.id)
      if (!res.success) {
        await swalError({
          title: 'Gagal Menghapus Akun',
          text: res.error || 'Terjadi kesalahan sistem saat menghapus data.',
        })
      } else {
        await swalSuccess({
          title: 'Akun Berhasil Dihapus!',
          text: `Akun "${user.nama}" telah berhasil dibersihkan dari sistem.`,
        })
        router.push('/admin/users')
      }
    } catch {
      await swalError({
        title: 'Terjadi Kendala',
        text: 'Gagal memproses penghapusan akun.',
      })
    }
  }

  // Cepat Approve Produk dengan SweetAlert
  async function handleApprove(productId: string, productName?: string) {
    const confirmed = await swalConfirm({
      title: 'Setujui Produk Ini?',
      text: `Produk "${productName || 'terpilih'}" akan diverifikasi dan tampil aktif di katalog publik LapakKita.`,
      confirmButtonText: 'Ya, Setujui Sekarang',
      cancelButtonText: 'Batal',
      icon: 'question',
    })

    if (!confirmed) return

    setLoadingActionId(productId)
    try {
      const res = await approveProductAction(productId)
      if (!res.success) {
        await swalError({
          title: 'Gagal Menyetujui Produk',
          text: res.error || 'Terjadi kesalahan sistem.',
        })
      } else {
        await swalSuccess({
          title: 'Produk Disetujui!',
          text: `Produk "${productName || 'terpilih'}" berhasil disetujui & tayang ke etalase publik!`,
        })
        router.refresh()
      }
    } catch {
      await swalError({
        title: 'Terjadi Kendala',
        text: 'Tidak dapat memproses persetujuan saat ini.',
      })
    } finally {
      setLoadingActionId(null)
    }
  }

  // Cepat Tolak Produk dari Halaman Ini
  async function handleRejectConfirm() {
    if (!rejectDialogProduct) return
    if (!alasanTolak.trim() || alasanTolak.trim().length < 3) {
      await swalError({
        title: 'Alasan Belum Lengkap',
        text: 'Alasan penolakan minimal 3 karakter agar penjual tahu bagian mana yang harus diperbaiki.',
      })
      return
    }

    setLoadingActionId(rejectDialogProduct.id)
    try {
      const res = await rejectProductAction(rejectDialogProduct.id, alasanTolak.trim())
      if (!res.success) {
        await swalError({
          title: 'Gagal Menolak Produk',
          text: res.error || 'Terjadi kesalahan sistem.',
        })
      } else {
        setRejectDialogProduct(null)
        setAlasanTolak('')
        await swalSuccess({
          title: 'Produk Telah Ditolak',
          text: 'Catatan alasan perbaikan telah dikirim ke penjual.',
        })
        router.refresh()
      }
    } catch {
      await swalError({
        title: 'Terjadi Kendala',
        text: 'Tidak dapat memproses penolakan produk.',
      })
    } finally {
      setLoadingActionId(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Tombol Kembali & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-neutral-600 hover:text-neutral-900 gap-1.5"
        >
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Pengguna
          </Link>
        </Button>
      </div>

      {/* Kartu Profil Pengguna */}
      <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold shadow-xs ${
                user.role === 'admin'
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
              }`}
            >
              {user.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{user.nama}</h1>
                {user.role === 'admin' ? (
                  <Badge className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60 gap-1 font-semibold rounded-full px-3 py-0.5">
                    <Shield className="h-3 w-3" />
                    Administrator
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 gap-1 font-semibold rounded-full px-3 py-0.5">
                    <Store className="h-3 w-3" />
                    Penjual UMKM
                  </Badge>
                )}
                {isCurrent && (
                  <span className="rounded-full bg-neutral-200 dark:bg-neutral-800 px-2.5 py-0.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Akun Anda
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 pt-1">
                <div className="flex items-center gap-1 font-mono">
                  <span>ID:</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{user.id}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Bergabung {formatTanggal(user.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Aksi Profil */}
          <div className="flex items-center gap-2.5 self-start md:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditNama(user.nama)
                setEditRole(user.role)
                setEditOpen(true)
              }}
              className="rounded-2xl h-10 px-4 font-semibold text-xs sm:text-sm border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 gap-2"
            >
              <Edit2 className="h-4 w-4 text-[#186049] dark:text-[#4A943E]" />
              <span>Edit Pengguna</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isCurrent}
              onClick={handleDeletePrompt}
              title={isCurrent ? 'Tidak bisa menghapus akun sendiri' : 'Hapus pengguna'}
              className="rounded-2xl h-10 px-4 font-semibold text-xs sm:text-sm border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-40 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Hapus Pengguna</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Konten Berdasarkan Role: Admin vs Penjual UMKM */}
      {user.role === 'admin' ? (
        /* ================= TAMPILAN KHUSUS ADMINISTRATOR ================= */
        <div className="space-y-6">
          <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                <Shield className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-purple-950">
                  Akun Administrator Sistem
                </h3>
                <p className="text-sm text-purple-900/80 leading-relaxed max-w-3xl">
                  Pengguna ini memegang hak akses administrator platform. <strong>Akun administrator tidak memiliki katalog produk, iklan, ataupun aktivitas jual-beli.</strong> Seluruh transaksi dan pendaftaran produk UMKM hanya dilakukan oleh akun dengan peran <strong>Penjual UMKM</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Kartu Ringkasan Otoritas & Tanggung Jawab */}
          <div>
            <h3 className="text-base font-bold text-neutral-900 mb-3">
              Otoritas & Hak Akses Administrator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-sm">
                  01
                </div>
                <h4 className="font-bold text-neutral-900 text-sm">Moderasi & Kurasi Produk</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Meninjau seluruh pengajuan produk UMKM, menyetujui produk layak tayang ke publik, atau menolak dengan catatan alasan perbaikan bagi penjual.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-sm">
                  02
                </div>
                <h4 className="font-bold text-neutral-900 text-sm">Master Kategori & Daerah</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Mengelola dan memperbarui daftar kategori usaha serta wilayah/daerah operasional UMKM yang tersedia untuk calon pembeli.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700 font-bold text-sm">
                  03
                </div>
                <h4 className="font-bold text-neutral-900 text-sm">Manajemen Pengguna</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Memantau seluruh akun pengguna terdaftar, mengubah role hak akses, serta menghapus akun yang tidak aktif atau menyalahi aturan.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= TAMPILAN KHUSUS PENJUAL UMKM ================= */
        <>
          {/* 5 Kartu Metrik Jualan Penjual */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500">Total Produk</span>
                <Package className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-neutral-900">{stats.totalProducts}</div>
              <p className="mt-0.5 text-[11px] text-neutral-400">Semua jualan</p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800">Disetujui</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-950">{stats.approvedCount}</div>
              <p className="mt-0.5 text-[11px] text-emerald-700">Tampil di publik</p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-800">Menunggu</span>
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-amber-950">{stats.pendingCount}</div>
              <p className="mt-0.5 text-[11px] text-amber-700">Perlu ditinjau</p>
            </div>

            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-800">Ditolak</span>
                <XCircle className="h-4 w-4 text-rose-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-rose-950">{stats.rejectedCount}</div>
              <p className="mt-0.5 text-[11px] text-rose-700">Revisi penjual</p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl border border-blue-200 bg-blue-50/40 p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-800">Klik WhatsApp</span>
                <MessageCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-blue-950">{stats.totalClicks}</div>
              <p className="mt-0.5 text-[11px] text-blue-700">Total minat pembeli</p>
            </div>
          </div>

          {/* Bagian Daftar Produk Jualan Penjual */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  Daftar Produk Jualan Milik {user.nama}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Pantau seluruh produk yang didaftarkan oleh penjual ini beserta status moderasi dan performanya.
                </p>
              </div>

              {/* Filter Tab Status Produk */}
              <div className="flex items-center gap-1.5 rounded-lg bg-neutral-100 p-1 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Semua ({stats.totalProducts})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('approved')}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'approved'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Disetujui ({stats.approvedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('pending')}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'pending'
                      ? 'bg-white text-amber-800 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Pending ({stats.pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('rejected')}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'rejected'
                      ? 'bg-white text-rose-800 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Ditolak ({stats.rejectedCount})
                </button>
              </div>
            </div>

            {/* Empty State Produk */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-neutral-800">
                  Tidak Ada Produk pada Kategori Ini
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {stats.totalProducts === 0
                    ? 'Penjual ini belum mendaftarkan produk apapun di LapakKita.'
                    : 'Tidak ada produk yang memiliki status ini.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredProducts.map((product) => {
                  const isLoading = loadingActionId === product.id
                  return (
                    <div
                      key={product.id}
                      className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-neutral-300 transition-all"
                    >
                      <div className="flex gap-4">
                        {/* Foto Produk */}
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100 border border-neutral-200">
                          {product.foto_url ? (
                            <Image
                              src={product.foto_url}
                              alt={product.nama}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-neutral-400">
                              <ImageIcon className="h-8 w-8" />
                            </div>
                          )}
                        </div>

                        {/* Informasi Produk */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <StatusBadge status={product.status} />
                              {product.is_active === false && (
                                <span className="text-[10px] bg-neutral-800 text-white px-1.5 py-0.5 rounded font-medium">
                                  Nonaktif
                                </span>
                              )}
                              {product.kondisi_stok === 'pre_order' && (
                                <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                                  PO
                                </span>
                              )}
                              {product.kondisi_stok === 'stok_terbatas' && (
                                <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                                  Stok Terbatas
                                </span>
                              )}
                            </div>
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                              <MessageCircle className="h-3 w-3" />
                              {product.wa_clicks_count} klik
                            </span>
                          </div>

                          <h3 className="mt-1.5 font-bold text-neutral-900 truncate" title={product.nama}>
                            {product.nama}
                          </h3>

                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-base font-extrabold text-emerald-700">
                              {formatRupiah(product.harga)}
                            </span>
                            {product.satuan && (
                              <span className="text-xs font-normal text-neutral-500">
                                / {product.satuan}
                              </span>
                            )}
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                            {product.category && (
                              <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-1.5 py-0.5">
                                <Tag className="h-3 w-3 text-neutral-400" />
                                {product.category.nama}
                              </span>
                            )}
                            {product.region && (
                              <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-1.5 py-0.5">
                                <MapPin className="h-3 w-3 text-neutral-400" />
                                {product.region.nama}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Alasan Tolak jika Rejected */}
                      {product.status === 'rejected' && product.alasan_tolak && (
                        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-900">
                          <span className="font-semibold">Alasan Penolakan: </span>
                          {product.alasan_tolak}
                        </div>
                      )}

                      {/* Footer Aksi Produk */}
                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-xs text-neutral-600 hover:text-neutral-900 h-8 px-2"
                        >
                          <Link href={`/produk/${product.id}`} target="_blank">
                            Lihat di Etalase
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>

                        {/* Quick Moderasi jika pending */}
                        {product.status === 'pending' && (
                          <div className="flex items-center gap-1.5">
                            <Button
                              type="button"
                              size="sm"
                              disabled={isLoading}
                              onClick={() => {
                                setRejectDialogProduct(product)
                                setAlasanTolak('')
                              }}
                              className="h-8 text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                            >
                              <X className="mr-1 h-3.5 w-3.5" />
                              Tolak
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              disabled={isLoading}
                              onClick={() => handleApprove(product.id, product.nama)}
                              className="h-8 text-xs bg-[#186049] hover:bg-[#124b39] text-white rounded-xl"
                            >
                              {isLoading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <Check className="mr-1 h-3.5 w-3.5" />
                                  Setujui
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ================= MODAL EDIT PENGGUNA (Palette: #186049, #4A943E, #D98327, #ECE8AF) ================= */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="rounded-3xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-[#0c1611] p-6 sm:p-7 shadow-2xl max-w-md">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ECE8AF] text-[#186049] font-bold">
                <Edit2 className="h-4 w-4" />
              </div>
              <DialogTitle className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white">
                Edit Data Pengguna
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Ubah nama tampilan atau hak akses role akun {user.nama}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="detail-edit-nama" className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Nama Pengguna / Usaha *
              </Label>
              <Input
                id="detail-edit-nama"
                value={editNama}
                onChange={(e) => setEditNama(e.target.value)}
                placeholder="Nama pengguna"
                disabled={isUpdating}
                required
                className="h-12 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-sm focus-visible:ring-2 focus-visible:ring-[#4A943E]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="detail-edit-role" className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Peran (Role)
              </Label>
              <select
                id="detail-edit-role"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as 'seller' | 'admin')}
                disabled={isUpdating || isCurrent}
                className="w-full h-12 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-900 dark:text-white shadow-2xs focus:ring-2 focus:ring-[#4A943E] disabled:bg-neutral-100 dark:disabled:bg-neutral-800/40 disabled:cursor-not-allowed"
              >
                <option value="seller">Penjual UMKM (seller)</option>
                <option value="admin">Administrator (admin)</option>
              </select>
              {isCurrent && (
                <p className="text-xs text-[#D98327]">
                  Role akun Anda sendiri tidak dapat diubah demi keamanan sesi.
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={isUpdating}
                className="rounded-2xl h-11 px-5 border-neutral-200 dark:border-neutral-800 font-semibold text-xs sm:text-sm"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="rounded-2xl h-11 px-6 bg-[#186049] hover:bg-[#124b39] text-white font-bold text-xs sm:text-sm shadow-sm transition-transform hover:scale-102"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL ALASAN PENOLAKAN PRODUK (Palette: #D98327, #186049) ================= */}
      <Dialog
        open={!!rejectDialogProduct}
        onOpenChange={(open) => !open && setRejectDialogProduct(null)}
      >
        <DialogContent className="rounded-3xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-[#0c1611] p-6 sm:p-7 shadow-2xl max-w-md">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#D98327]/20 text-[#D98327] font-bold">
                <XCircle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white">
                Tolak Produk: {rejectDialogProduct?.nama}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Tuliskan alasan penolakan secara jelas dan ramah agar penjual dapat memperbaiki informasinya.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="alasan-tolak-detail" className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Alasan Penolakan / Catatan Revisi *
              </Label>
              <Textarea
                id="alasan-tolak-detail"
                value={alasanTolak}
                onChange={(e) => setAlasanTolak(e.target.value)}
                placeholder="Contoh: Foto produk buram, nomor WhatsApp tidak aktif, atau deskripsi kurang lengkap."
                rows={3}
                className="rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-sm focus-visible:ring-2 focus-visible:ring-[#D98327] resize-none"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectDialogProduct(null)}
                disabled={loadingActionId === rejectDialogProduct?.id}
                className="rounded-2xl h-11 px-5 border-neutral-200 dark:border-neutral-800 font-semibold text-xs sm:text-sm"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleRejectConfirm}
                disabled={
                  loadingActionId === rejectDialogProduct?.id ||
                  alasanTolak.trim().length < 3
                }
                className="rounded-2xl h-11 px-6 bg-[#D98327] hover:bg-[#bd6e1b] text-white font-bold text-xs sm:text-sm shadow-sm transition-transform hover:scale-102"
              >
                {loadingActionId === rejectDialogProduct?.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Konfirmasi Tolak'
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
