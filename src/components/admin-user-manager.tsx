'use client'

import { useState, useMemo, useEffect } from 'react'
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
import { swalDeleteConfirm, swalSuccess, swalError } from '@/lib/sweetalert'
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
  Loader2,
} from 'lucide-react'

interface AdminUserManagerProps {
  users: AdminUserItem[]
  currentUserId?: string
}

export function AdminUserManager({ users, currentUserId }: AdminUserManagerProps) {
  const router = useRouter()
  const [localUsers, setLocalUsers] = useState<AdminUserItem[]>(users)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'seller' | 'admin'>('all')

  useEffect(() => {
    setLocalUsers(users)
  }, [users])

  // State untuk Dialog Edit
  const [editUser, setEditUser] = useState<AdminUserItem | null>(null)
  const [editNama, setEditNama] = useState('')
  const [editRole, setEditRole] = useState<'seller' | 'admin'>('seller')
  const [isUpdating, setIsUpdating] = useState(false)

  // Filter Pengguna dari reactive localUsers
  const filteredUsers = useMemo(() => {
    return localUsers.filter((u) => {
      const matchSearch =
        u.nama.toLowerCase().includes(search.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      return matchSearch && matchRole
    })
  }, [localUsers, search, roleFilter])

  // Hitung ringkasan
  const totalUsers = localUsers.length
  const totalSellers = localUsers.filter((u) => u.role === 'seller').length
  const totalAdmins = localUsers.filter((u) => u.role === 'admin').length

  // Buka Dialog Edit
  function handleOpenEdit(user: AdminUserItem) {
    setEditUser(user)
    setEditNama(user.nama)
    setEditRole(user.role)
  }

  // Simpan Perubahan Pengguna dengan SweetAlert
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editUser) return

    if (!editNama.trim() || editNama.trim().length < 2) {
      await swalError({
        title: 'Nama Kurang Lengkap',
        text: 'Nama pengguna atau usaha minimal 2 karakter.',
      })
      return
    }

    setIsUpdating(true)
    try {
      const res = await adminUpdateUserAction(editUser.id, {
        nama: editNama.trim(),
        role: editRole,
      })

      if (!res.success) {
        await swalError({
          title: 'Gagal Menyimpan Akun',
          text: res.error || 'Terjadi kesalahan sistem.',
        })
      } else {
        const savedName = editNama.trim()
        setLocalUsers((prev) =>
          prev.map((u) => (u.id === editUser.id ? { ...u, nama: savedName, role: editRole } : u))
        )
        setEditUser(null)
        router.refresh()

        swalSuccess({
          title: 'Akun Berhasil Diperbarui!',
          text: `Data akun "${savedName}" telah berhasil disimpan.`,
        })
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

  // Hapus Pengguna Langsung dengan SweetAlert & Instant Auto-Reload
  async function handleDeleteUserPrompt(targetUser: AdminUserItem) {
    if (targetUser.id === currentUserId) {
      await swalError({
        title: 'Aksi Tidak Diizinkan',
        text: 'Anda tidak dapat menghapus akun Anda sendiri demi keamanan sesi.',
      })
      return
    }

    const hasProducts = targetUser.product_count > 0
    const confirmed = await swalDeleteConfirm({
      title: `Hapus Akun "${targetUser.nama}"?`,
      text: hasProducts
        ? `Perhatian: Mitra ini memiliki ${targetUser.product_count} produk. Menghapus akun ini akan otomatis membersihkan seluruh produk miliknya secara permanen.`
        : `Akun ${targetUser.role === 'admin' ? 'administrator' : 'penjual'} ini akan dihapus permanen dari sistem LapakKita.`,
      confirmButtonText: hasProducts ? 'Ya, Hapus Akun & Produk' : 'Ya, Hapus Akun',
      cancelButtonText: 'Batal',
    })

    if (!confirmed) return

    try {
      const res = await adminDeleteUserAction(targetUser.id)
      if (!res.success) {
        await swalError({
          title: 'Gagal Menghapus Pengguna',
          text: res.error || 'Terjadi kesalahan sistem saat menghapus akun.',
        })
      } else {
        // Hapus dari state lokal secara seketika (Instant Optimistic Update)
        setLocalUsers((prev) => prev.filter((u) => u.id !== targetUser.id))
        router.refresh()

        swalSuccess({
          title: 'Akun Berhasil Dihapus!',
          text: `Akun "${targetUser.nama}" ${hasProducts ? `dan ${res.deletedProductsCount} produk jualan miliknya` : ''} telah dibersihkan.`,
        })
      }
    } catch {
      await swalError({
        title: 'Terjadi Kendala',
        text: 'Gagal menghapus pengguna saat ini.',
      })
    }
  }

  return (
    <div className="space-y-6 sm:space-y-7 w-full">
      {/* Kartu Ringkasan Akun (Palette: #186049, #4A943E, #D98327, #ECE8AF) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECE8AF]/60 text-[#186049] dark:bg-[#186049]/40 dark:text-[#ECE8AF]">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">{totalUsers}</div>
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">Total Akun Terdaftar</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#4A943E]">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">{totalSellers}</div>
            <div className="text-xs sm:text-sm text-[#4A943E] font-medium">Penjual Mitra UMKM</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D98327]/15 text-[#D98327]">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">{totalAdmins}</div>
            <div className="text-xs sm:text-sm text-[#D98327] font-medium">Administrator Sistem</div>
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
            className="pl-10 h-11 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 text-sm focus-visible:ring-2 focus-visible:ring-[#4A943E]"
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
                ? 'bg-white dark:bg-neutral-800 text-[#186049] dark:text-[#4A943E] shadow-xs'
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
                ? 'bg-white dark:bg-neutral-800 text-[#D98327] shadow-xs'
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
                                ? 'bg-[#D98327]/15 text-[#D98327] border border-[#D98327]/30'
                                : 'bg-[#ECE8AF]/60 text-[#186049] border border-[#186049]/20'
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
                          <Badge className="bg-[#D98327]/15 text-[#D98327] border-[#D98327]/30 gap-1.5 font-semibold rounded-full px-3 py-1">
                            <Shield className="h-3 w-3" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge className="bg-[#186049]/10 text-[#186049] dark:bg-[#186049]/30 dark:text-emerald-300 border-[#186049]/20 gap-1.5 font-semibold rounded-full px-3 py-1">
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
                        <div className="flex items-center justify-end gap-2">
                          {/* Tombol Lihat Detail */}
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-9 px-3 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                          >
                            <Link href={`/admin/users/${user.id}`}>
                              <Eye className="mr-1.5 h-3.5 w-3.5 text-neutral-500" />
                              <span>Detail</span>
                            </Link>
                          </Button>

                          {/* Tombol Edit Pengguna */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(user)}
                            className="h-9 w-9 p-0 rounded-xl text-neutral-500 hover:text-[#186049] dark:hover:text-[#4A943E] hover:bg-neutral-100 dark:hover:bg-neutral-900"
                            title="Edit akun"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          {/* Tombol Hapus Pengguna (SweetAlert) */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={isCurrent}
                            onClick={() => handleDeleteUserPrompt(user)}
                            title={isCurrent ? 'Anda tidak bisa menghapus akun sendiri' : 'Hapus pengguna'}
                            className="h-9 w-9 p-0 rounded-xl text-neutral-400 hover:text-[#D98327] hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* ================= MODAL EDIT PENGGUNA (Palette: #186049, #4A943E, #D98327, #ECE8AF) ================= */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
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
              Ubah nama tampilan atau hak akses peran pengguna ini di sistem LapakKita.
            </DialogDescription>
          </DialogHeader>

          {editUser && (
            <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
              <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 p-3.5 border border-neutral-200/80 dark:border-neutral-800 text-xs space-y-1">
                <div className="text-neutral-400">ID Pengguna:</div>
                <div className="font-mono text-neutral-800 dark:text-neutral-200 break-all">{editUser.id}</div>
                {editUser.email !== '-' && (
                  <>
                    <div className="text-neutral-400 pt-1">Email:</div>
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">{editUser.email}</div>
                  </>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-nama" className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Nama Pengguna / Nama Usaha *
                </Label>
                <Input
                  id="edit-nama"
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  placeholder="Nama penjual atau admin"
                  disabled={isUpdating}
                  required
                  className="h-12 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-sm focus-visible:ring-2 focus-visible:ring-[#4A943E]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-role" className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Peran Akun (Role)
                </Label>
                <select
                  id="edit-role"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as 'seller' | 'admin')}
                  disabled={isUpdating || editUser.id === currentUserId}
                  className="w-full h-12 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-900 dark:text-white shadow-2xs focus:ring-2 focus:ring-[#4A943E] disabled:bg-neutral-100 dark:disabled:bg-neutral-800/40 disabled:cursor-not-allowed"
                >
                  <option value="seller">Penjual UMKM (seller)</option>
                  <option value="admin">Administrator (admin)</option>
                </select>
                {editUser.id === currentUserId && (
                  <p className="text-xs text-[#D98327]">
                    Role akun Anda sendiri terkunci demi keamanan sistem.
                  </p>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditUser(null)}
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
