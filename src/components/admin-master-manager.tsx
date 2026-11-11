'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  createRegionAction,
  updateRegionAction,
  deleteRegionAction,
} from '@/features/admin/actions'
import { toast } from 'sonner'
import { Plus, Edit2, Trash2, Tag, MapPin, Loader2, AlertTriangle } from 'lucide-react'

interface ItemData {
  id: number
  nama: string
}

interface AdminMasterManagerProps {
  categories: ItemData[]
  regions: ItemData[]
}

export function AdminMasterManager({ categories, regions }: AdminMasterManagerProps) {
  const [activeTab, setActiveTab] = useState<'kategori' | 'daerah'>('kategori')

  // State Dialog Tambah
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [savingAdd, setSavingAdd] = useState(false)

  // State Dialog Edit
  const [editItem, setEditItem] = useState<ItemData | null>(null)
  const [editName, setEditName] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  // State Dialog Delete
  const [deleteItem, setDeleteItem] = useState<ItemData | null>(null)
  const [savingDelete, setSavingDelete] = useState(false)

  // Handle Tambah
  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return

    setSavingAdd(true)
    try {
      const res =
        activeTab === 'kategori'
          ? await createCategoryAction(newName)
          : await createRegionAction(newName)

      if (!res.success) {
        toast.error(res.error || `Gagal menambah ${activeTab}`)
      } else {
        toast.success(
          `${activeTab === 'kategori' ? 'Kategori' : 'Daerah'} "${newName}" berhasil ditambahkan!`
        )
        setAddDialogOpen(false)
        setNewName('')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setSavingAdd(false)
    }
  }

  // Handle Edit
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editItem || !editName.trim()) return

    setSavingEdit(true)
    try {
      const res =
        activeTab === 'kategori'
          ? await updateCategoryAction(editItem.id, editName)
          : await updateRegionAction(editItem.id, editName)

      if (!res.success) {
        toast.error(res.error || `Gagal mengubah ${activeTab}`)
      } else {
        toast.success(`Data berhasil diubah menjadi "${editName}"`)
        setEditItem(null)
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setSavingEdit(false)
    }
  }

  // Handle Delete
  async function handleDeleteConfirm() {
    if (!deleteItem) return

    setSavingDelete(true)
    try {
      const res =
        activeTab === 'kategori'
          ? await deleteCategoryAction(deleteItem.id)
          : await deleteRegionAction(deleteItem.id)

      if (!res.success) {
        toast.error(res.error || `Gagal menghapus ${activeTab}`)
      } else {
        toast.success(`"${deleteItem.nama}" berhasil dihapus`)
        setDeleteItem(null)
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setSavingDelete(false)
    }
  }

  const items = activeTab === 'kategori' ? categories : regions

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Tombol Tambah */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 w-fit">
          <button
            onClick={() => setActiveTab('kategori')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'kategori'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Tag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Kategori Produk ({categories.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('daerah')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'daerah'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Daerah / Wilayah ({regions.length})</span>
          </button>
        </div>

        <Button
          onClick={() => {
            setNewName('')
            setAddDialogOpen(true)
          }}
          className="rounded-2xl bg-[#0B3B2C] hover:bg-[#0D4433] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-5 h-11 shadow-xs gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah {activeTab === 'kategori' ? 'Kategori Baru' : 'Daerah Baru'}</span>
        </Button>
      </div>

      {activeTab === 'daerah' && regions.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 space-y-1.5 shadow-xs">
          <p className="font-bold flex items-center gap-1.5 text-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            Tabel &quot;regions&quot; Belum Dibuat di Database Supabase
          </p>
          <p className="leading-relaxed">
            Untuk mengaktifkan pengelolaan daerah/wilayah, jalankan skrip migrasi{' '}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono font-semibold text-amber-950">
              supabase/migrations/0002_add_regions.sql
            </code>{' '}
            di <strong>Supabase Dashboard &gt; SQL Editor</strong>.
          </p>
        </div>
      )}

      {/* Grid Kartu Master Data */}
      {items.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center text-sm text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-950">
          Belum ada {activeTab} yang didaftarkan. Klik tombol di atas untuk menambah data baru.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  {activeTab === 'kategori' ? (
                    <Tag className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </div>
                <span className="font-bold text-neutral-900 dark:text-white text-sm truncate">
                  {item.nama}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-lg text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  onClick={() => {
                    setEditItem(item)
                    setEditName(item.nama)
                  }}
                  title="Ubah nama"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-lg text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400"
                  onClick={() => setDeleteItem(item)}
                  title="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog Tambah Data */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle>
                Tambah {activeTab === 'kategori' ? 'Kategori Produk' : 'Daerah Baru'}
              </DialogTitle>
              <DialogDescription>
                Masukkan nama {activeTab} baru yang akan langsung muncul di formulir produk dan filter pencarian.
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 space-y-2">
              <Label htmlFor="new-name">
                Nama {activeTab === 'kategori' ? 'Kategori' : 'Daerah'} *
              </Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={
                  activeTab === 'kategori'
                    ? 'Contoh: Elektronik / Gadget'
                    : 'Contoh: Banyuwangi'
                }
                autoFocus
                required
                disabled={savingAdd}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
                disabled={savingAdd}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                disabled={savingAdd}
              >
                {savingAdd ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Data'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Data */}
      <Dialog open={Boolean(editItem)} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Ubah Nama {activeTab === 'kategori' ? 'Kategori' : 'Daerah'}</DialogTitle>
              <DialogDescription>
                Perubahan ini akan langsung berlaku pada seluruh produk terkait.
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 space-y-2">
              <Label htmlFor="edit-name">Nama {activeTab === 'kategori' ? 'Kategori' : 'Daerah'} *</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
                required
                disabled={savingEdit}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditItem(null)}
                disabled={savingEdit}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
                disabled={savingEdit}
              >
                {savingEdit ? (
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

      {/* Dialog Hapus Konfirmasi */}
      <Dialog open={Boolean(deleteItem)} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus {activeTab === 'kategori' ? 'Kategori' : 'Daerah'}?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <strong>&quot;{deleteItem?.nama}&quot;</strong>? Produk yang menggunakan {activeTab} ini akan tetap tersimpan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteItem(null)}
              disabled={savingDelete}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={savingDelete}
            >
              {savingDelete ? (
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
