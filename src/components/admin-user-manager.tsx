'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatTanggal } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { adminUpdateUserAction, adminDeleteUserAction } from '@/features/admin/actions'
import { type AdminUserItem } from '@/features/admin/queries'
import { toast } from 'sonner'
import {
  Users,
  Search,
  Shield,
  Store,
  Calendar,
  Package,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from 'lucide-react'

interface AdminUserManagerProps {
  users: AdminUserItem[]
  currentUserId?: string
}

export function AdminUserManager({ users, currentUserId }: AdminUserManagerProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'seller' | 'admin'>('all')

  // State untuk Dialog Edit
  const [editUser, setEditUser] = useState<AdminUserItem | null>(null)
  const [editNama, setEditNama] = useState('')
  const [editRole, setEditRole] = useState<'seller' | 'admin'>('seller')
  const [isUpdating, setIsUpdating] = useState(false)

  // State untuk Dialog Hapus
  const [deleteUser, setDeleteUser] = useState<AdminUserItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter Pengguna
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.nama.toLowerCase().includes(search.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      return matchSearch && matchRole
    })
  }, [users, search, roleFilter])

  // Hitung ringkasan
  const totalUsers = users.length
  const totalSellers = users.filter((u) => u.role === 'seller').length
  const totalAdmins = users.filter((u) => u.role === 'admin').length

  // Buka Dialog Edit
  function handleOpenEdit(user: AdminUserItem) {
    setEditUser(user)
    setEditNama(user.nama)
    setEditRole(user.role)
  }

  // Simpan Perubahan Pengguna
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editUser) return

    if (!editNama.trim() || editNama.trim().length < 2) {
      toast.error('Nama minimal 2 karakter')
      return
    }

    setIsUpdating(true)
    try {
      const res = await adminUpdateUserAction(editUser.id, {
        nama: editNama.trim(),
        role: editRole,
      })

      if (!res.success) {
        toast.error(res.error || 'Gagal mengubah data pengguna')
      } else {
        toast.success(`Data pengguna "${editNama.trim()}" berhasil diperbarui!`)
        setEditUser(null)
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyimpan perubahan')
    } finally {
      setIsUpdating(false)
    }
  }

  // Hapus Pengguna & Seluruh Produknya
  async function handleConfirmDelete() {
    if (!deleteUser) return

    if (deleteUser.id === currentUserId) {
      toast.error('Anda tidak dapat menghapus akun Anda sendiri.')
      return
    }

    setIsDeleting(true)
    try {
      const res = await adminDeleteUserAction(deleteUser.id)

      if (!res.success) {
        toast.error(res.error || 'Gagal menghapus pengguna')
      } else {
        toast.success(
          `Pengguna "${deleteUser.nama}" dan ${res.deletedProductsCount} produk jualan miliknya berhasil dihapus!`
        )
        setDeleteUser(null)
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan saat menghapus pengguna')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-7 w-full">
      {/* Kartu Ringkasan Akun */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">{totalUsers}</div>
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">Total Akun Terdaftar</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-900 dark:text-emerald-300">{totalSellers}</div>
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">Penjual UMKM</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-900 dark:text-purple-300">{totalAdmins}</div>
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">Administrator</div>
          </div>
        </div>
      </div>

      {/* Filter & Pencarian Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-5 shadow-2xs">
        {/* Input Cari */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email pengguna..."
            className="pl-10 h-11 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 text-sm"
          />
        </div>

        {/* Filter Role */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setRoleFilter('all')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === 'all'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Semua ({totalUsers})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('seller')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === 'seller'
                ? 'bg-white dark:bg-neutral-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Penjual ({totalSellers})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('admin')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === 'admin'
                ? 'bg-white dark:bg-neutral-800 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Admin ({totalAdmins})
          </button>
        </div>
      </div>

      {/* Daftar Pengguna */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 text-neutral-400">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-white">
            Tidak Ada Pengguna Ditemukan
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {search
              ? `Tidak ada hasil yang cocok dengan kata kunci "${search}".`
              : 'Belum ada pengguna pada kategori ini.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700 dark:text-neutral-300">
              <thead className="border-b border-neutral-200/80 dark:border-neutral-900 bg-neutral-50/80 dark:bg-neutral-900/60 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Pengguna
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Role
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Jumlah Produk
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Bergabung
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-900">
                {filteredUsers.map((user) => {
                  const isCurrent = user.id === currentUserId
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40 transition-colors"
                    >
                      {/* Kolom Profil Pengguna */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-bold text-sm ${
                              user.role === 'admin'
                                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                            }`}
                          >
                            {user.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white truncate">
                              <span>{user.nama}</span>
                              {isCurrent && (
                                <span className="rounded-full bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-semibold text-neutral-700 dark:text-neutral-300">
                                  Anda
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                              {user.email !== '-' ? user.email : 'ID: ' + user.id.slice(0, 8) + '...'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Kolom Role */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {user.role === 'admin' ? (
                          <Badge className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60 gap-1.5 font-semibold rounded-full px-3 py-1">
                            <Shield className="h-3 w-3" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 gap-1.5 font-semibold rounded-full px-3 py-1">
                            <Store className="h-3 w-3" />
                            Penjual UMKM
                          </Badge>
                        )}
                      </td>

                      {/* Kolom Produk */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center text-xs text-neutral-400 italic">
                            Bukan Penjual
                          </span>
                        ) : (
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
                          >
                            <Package className="h-3.5 w-3.5 text-neutral-500" />
                            <span>{user.product_count} Produk</span>
                          </Link>
                        )}
                      </td>

                      {/* Kolom Tanggal */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                          <span>{formatTanggal(user.created_at)}</span>
                        </div>
                      </td>

                      {/* Kolom Aksi */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Tombol Lihat Detail */}
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-medium border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                          >
                            <Link href={`/admin/users/${user.id}`}>
                              <Eye className="mr-1.5 h-3.5 w-3.5 text-neutral-500" />
                              {user.role === 'admin' ? 'Detail Akun' : 'Detail & Jualan'}
                            </Link>
                          </Button>

                          {/* Tombol Edit Pengguna */}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(user)}
                            className="h-8 text-xs font-medium border-neutral-200 text-blue-700 hover:bg-blue-50 hover:border-blue-200"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:ml-1.5">Edit</span>
                          </Button>

                          {/* Tombol Hapus Pengguna */}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isCurrent}
                            onClick={() => setDeleteUser(user)}
                            title={isCurrent ? 'Anda tidak bisa menghapus akun sendiri' : 'Hapus pengguna'}
                            className="h-8 text-xs font-medium border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:ml-1.5">Hapus</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL EDIT PENGGUNA ================= */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-neutral-900">
              <Edit2 className="h-5 w-5 text-blue-600" />
              Edit Data Pengguna
            </DialogTitle>
            <DialogDescription>
              Ubah nama tampilan atau hak akses role pengguna ini di sistem LapakKita.
            </DialogDescription>
          </DialogHeader>

          {editUser && (
            <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
              <div className="rounded-lg bg-neutral-50 p-3 border border-neutral-200 text-xs space-y-1">
                <div className="text-neutral-500">ID Pengguna:</div>
                <div className="font-mono text-neutral-800 break-all">{editUser.id}</div>
                {editUser.email !== '-' && (
                  <>
                    <div className="text-neutral-500 pt-1">Email:</div>
                    <div className="font-semibold text-neutral-800">{editUser.email}</div>
                  </>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-nama">Nama Pengguna / Usaha</Label>
                <Input
                  id="edit-nama"
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  placeholder="Nama penjual atau admin"
                  disabled={isUpdating}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-role">Peran (Role)</Label>
                <select
                  id="edit-role"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as 'seller' | 'admin')}
                  disabled={isUpdating || editUser.id === currentUserId}
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                >
                  <option value="seller">Penjual UMKM (seller)</option>
                  <option value="admin">Administrator (admin)</option>
                </select>
                {editUser.id === currentUserId && (
                  <p className="text-xs text-amber-600">
                    Role akun Anda sendiri tidak dapat diubah dari sini demi keamanan.
                  </p>
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditUser(null)}
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
          )}
        </DialogContent>
      </Dialog>

      {/* ================= MODAL KONFIRMASI HAPUS PENGGUNA ================= */}
      <Dialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <DialogContent className="sm:max-w-lg border-rose-200">
          <DialogHeader>
            <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-rose-950">
              Konfirmasi Hapus Pengguna
            </DialogTitle>
            <DialogDescription className="text-neutral-600">
              Apakah Anda yakin ingin menghapus akun ini secara permanen dari sistem?
            </DialogDescription>
          </DialogHeader>

          {deleteUser && (
            <div className="space-y-4 py-2">
              {/* Profil Target */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 space-y-1.5 text-sm">
                <div className="font-bold text-neutral-900 flex items-center justify-between">
                  <span>{deleteUser.nama}</span>
                  <Badge
                    variant={deleteUser.role === 'admin' ? 'outline' : 'default'}
                    className={
                      deleteUser.role === 'admin'
                        ? 'border-purple-300 text-purple-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }
                  >
                    {deleteUser.role === 'admin' ? 'Admin' : 'Penjual'}
                  </Badge>
                </div>
                {deleteUser.email !== '-' && (
                  <div className="text-xs text-neutral-500">{deleteUser.email}</div>
                )}
              </div>

              {/* Peringatan Bahaya & Pembersihan Produk */}
              {deleteUser.role === 'admin' ? (
                <div className="rounded-lg border border-purple-200 bg-purple-50/70 p-3.5 text-xs text-purple-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-purple-800">
                    <Shield className="h-4 w-4 shrink-0 text-purple-600" />
                    Penghapusan Akun Administrator
                  </div>
                  <p className="leading-relaxed">
                    Akun ini bertindak sebagai administrator sistem dan <strong>tidak memiliki katalog produk/iklan jualan</strong>. Menghapus akun ini hanya akan menghapus akses admin.
                  </p>
                </div>
              ) : deleteUser.product_count > 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                    Peringatan: Ada {deleteUser.product_count} Produk Jualan Terkait!
                  </div>
                  <p className="leading-relaxed">
                    Pengguna ini adalah penjual dengan <strong>{deleteUser.product_count} produk</strong> yang
                    saat ini terdaftar di platform LapakKita.
                  </p>
                  <p className="leading-relaxed font-semibold text-amber-950">
                    Menghapus pengguna ini akan <u>otomatis menghapus seluruh produk jualan</u> dan
                    riwayat klik WhatsApp miliknya secara bersih (cascading) agar tidak terjadi
                    error data rusak / orphan di etalase.
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
                  onClick={() => setDeleteUser(null)}
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
                      Hapus Akun {deleteUser.product_count > 0 ? '& Seluruh Produk' : ''}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
