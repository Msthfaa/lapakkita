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
  no_wa: string
  alamat: string | null
  status: 'pending' | 'approved' | 'rejected'
  alasan_tolak: string | null
  is_featured: boolean
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

  // Delete Modal State
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Direct Moderation State
  const [rejectDialogProduct, setRejectDialogProduct] = useState<ProductDetailItem | null>(null)
  const [alasanTolak, setAlasanTolak] = useState('')
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null)

  // Filter Produk
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true
    return p.status === activeTab
  })

  // Simpan Edit User
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editNama.trim() || editNama.trim().length < 2) {
      toast.error('Nama minimal 2 karakter')
      return
    }

    setIsUpdating(true)
    try {
      const res = await adminUpdateUserAction(user.id, {
        nama: editNama.trim(),
        role: editRole,
      })

      if (!res.success) {
        toast.error(res.error || 'Gagal mengubah data pengguna')
      } else {
        toast.success('Data pengguna berhasil diperbarui!')
        setEditOpen(false)
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyimpan')
    } finally {
      setIsUpdating(false)
    }
  }

  // Hapus User & Seluruh Produknya
  async function handleConfirmDelete() {
    if (isCurrent) {
      toast.error('Anda tidak dapat menghapus akun Anda sendiri.')
      return
    }

    setIsDeleting(true)
    try {
      const res = await adminDeleteUserAction(user.id)

      if (!res.success) {
        toast.error(res.error || 'Gagal menghapus pengguna')
      } else {
        toast.success(
          `Pengguna "${user.nama}" dan ${res.deletedProductsCount} produk jualan miliknya berhasil dihapus!`
        )
        setDeleteOpen(false)
        router.push('/admin/users')
      }
    } catch {
      toast.error('Terjadi kesalahan saat menghapus')
    } finally {
      setIsDeleting(false)
    }
  }

  // Cepat Approve Produk dari Halaman Ini
  async function handleApprove(productId: string) {
    setLoadingActionId(productId)
    try {
      const res = await approveProductAction(productId)
      if (!res.success) {
        toast.error(res.error || 'Gagal menyetujui produk')
      } else {
        toast.success('Produk berhasil disetujui & tayang ke publik!')
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoadingActionId(null)
    }
  }

  // Cepat Tolak Produk dari Halaman Ini
  async function handleRejectConfirm() {
    if (!rejectDialogProduct) return
    if (!alasanTolak.trim() || alasanTolak.trim().length < 3) {
      toast.error('Alasan penolakan minimal 3 karakter')
      return
    }

    setLoadingActionId(rejectDialogProduct.id)
    try {
      const res = await rejectProductAction(rejectDialogProduct.id, alasanTolak.trim())
      if (!res.success) {
        toast.error(res.error || 'Gagal menolak produk')
      } else {
        toast.success('Produk ditolak dengan alasan yang tercatat')
        setRejectDialogProduct(null)
        setAlasanTolak('')
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan')
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
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold shadow-xs ${
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}
            >
              {user.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-neutral-900">{user.nama}</h1>
                {user.role === 'admin' ? (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 gap-1 font-semibold">
                    <Shield className="h-3 w-3" />
                    Administrator
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 gap-1 font-semibold">
                    <Store className="h-3 w-3" />
                    Penjual UMKM
                  </Badge>
                )}
                {isCurrent && (
                  <span className="rounded bg-neutral-200 px-2 py-0.5 text-xs font-semibold text-neutral-700">
                    Akun Anda
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-1">
                <div className="flex items-center gap-1 font-mono">
                  <span>ID:</span>
                  <span className="text-neutral-700">{user.id}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Bergabung {formatTanggal(user.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Aksi Profil */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditNama(user.nama)
                setEditRole(user.role)
                setEditOpen(true)
              }}
              className="gap-1.5 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              <Edit2 className="h-4 w-4" />
              Edit Pengguna
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isCurrent}
              onClick={() => setDeleteOpen(true)}
              title={isCurrent ? 'Tidak bisa menghapus akun sendiri' : 'Hapus pengguna'}
              className="gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
              Hapus Pengguna
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
                            <StatusBadge status={product.status} />
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                              <MessageCircle className="h-3 w-3" />
                              {product.wa_clicks_count} klik
                            </span>
                          </div>

                          <h3 className="mt-1.5 font-bold text-neutral-900 truncate" title={product.nama}>
                            {product.nama}
                          </h3>

                          <div className="mt-1 text-base font-extrabold text-emerald-700">
                            {formatRupiah(product.harga)}
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
                              onClick={() => handleApprove(product.id)}
                              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
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

      {/* ================= MODAL EDIT PENGGUNA ================= */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-neutral-900">
              <Edit2 className="h-5 w-5 text-blue-600" />
              Edit Data Pengguna
            </DialogTitle>
            <DialogDescription>
              Ubah nama tampilan atau hak akses role akun {user.nama}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="detail-edit-nama">Nama Pengguna / Usaha</Label>
              <Input
                id="detail-edit-nama"
                value={editNama}
                onChange={(e) => setEditNama(e.target.value)}
                placeholder="Nama pengguna"
                disabled={isUpdating}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="detail-edit-role">Peran (Role)</Label>
              <select
                id="detail-edit-role"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as 'seller' | 'admin')}
                disabled={isUpdating || isCurrent}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
              >
                <option value="seller">Penjual UMKM (seller)</option>
                <option value="admin">Administrator (admin)</option>
              </select>
              {isCurrent && (
                <p className="text-xs text-amber-600">
                  Role akun Anda sendiri tidak dapat diubah demi keamanan sesi.
                </p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={isUpdating}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
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

      {/* ================= MODAL KONFIRMASI HAPUS PENGGUNA ================= */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-lg border-rose-200">
          <DialogHeader>
            <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-rose-950">
              Konfirmasi Hapus Akun {user.nama}
            </DialogTitle>
            <DialogDescription className="text-neutral-600">
              Apakah Anda yakin ingin menghapus akun ini secara permanen dari sistem?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {user.role === 'admin' ? (
              <div className="rounded-lg border border-purple-200 bg-purple-50/70 p-3.5 text-xs text-purple-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-purple-800">
                  <Shield className="h-4 w-4 shrink-0 text-purple-600" />
                  Penghapusan Akun Administrator
                </div>
                <p className="leading-relaxed">
                  Akun ini bertindak sebagai administrator sistem dan <strong>tidak memiliki katalog produk/iklan jualan</strong>. Menghapus akun ini hanya akan mencabut akses admin.
                </p>
              </div>
            ) : stats.totalProducts > 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                  Peringatan: Ada {stats.totalProducts} Produk Jualan Terkait!
                </div>
                <p className="leading-relaxed">
                  Pengguna ini adalah penjual dengan <strong>{stats.totalProducts} produk jualan</strong> yang
                  saat ini tersimpan di platform LapakKita.
                </p>
                <p className="leading-relaxed font-semibold text-amber-950">
                  Menghapus akun ini akan <u>otomatis menghapus seluruh {stats.totalProducts} produk jualan</u> dan
                  riwayat klik WhatsApp miliknya secara bersih (cascading) agar data tidak rusak dan tidak terjadi error di etalase.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Penjual ini belum memiliki produk jualan yang terdaftar.</span>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white font-medium gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sedang Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Hapus Akun {user.role === 'seller' && stats.totalProducts > 0 ? `& ${stats.totalProducts} Produk` : ''}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL ALASAN PENOLAKAN PRODUK ================= */}
      <Dialog
        open={!!rejectDialogProduct}
        onOpenChange={(open) => !open && setRejectDialogProduct(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-900 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-rose-600" />
              Tolak Produk: {rejectDialogProduct?.nama}
            </DialogTitle>
            <DialogDescription>
              Tuliskan alasan penolakan secara jelas agar penjual dapat memperbaiki informasinya.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="alasan-tolak-detail">Alasan Penolakan</Label>
              <Textarea
                id="alasan-tolak-detail"
                value={alasanTolak}
                onChange={(e) => setAlasanTolak(e.target.value)}
                placeholder="Contoh: Foto produk buram, nomor WhatsApp tidak aktif, atau deskripsi kurang lengkap."
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectDialogProduct(null)}
                disabled={loadingActionId === rejectDialogProduct?.id}
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
                className="bg-rose-600 hover:bg-rose-700 text-white font-medium"
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
