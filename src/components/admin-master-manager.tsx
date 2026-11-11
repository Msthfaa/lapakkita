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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('kategori')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'kategori'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            <Tag className="h-4 w-4" />
            Kategori Produk ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('daerah')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'daerah'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            <MapPin className="h-4 w-4" />
            Daerah / Wilayah ({regions.length})
          </button>
        </div>

        <Button
          onClick={() => {
            setNewName('')
            setAddDialogOpen(true)
          }}
          className="bg-[#186049] hover:bg-[#124b39] text-[#ECE8AF] border border-[#ECE8AF]/20 gap-1.5 self-start sm:self-auto font-medium"
        >
          <Plus className="h-4 w-4" />
          Tambah {activeTab === 'kategori' ? 'Kategori Baru' : 'Daerah Baru'}
        </Button>
      </div>

      {activeTab === 'daerah' && regions.length === 0 && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30 p-4 text-xs text-amber-900 dark:text-amber-200 space-y-1.5 shadow-xs">
          <p className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            Tabel &quot;regions&quot; Belum Dibuat di Database Supabase
          </p>
          <p className="leading-relaxed">
            Untuk mengaktifkan pengelolaan daerah/wilayah, jalankan skrip migrasi{' '}
            <code className="rounded bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 font-mono font-semibold text-amber-950 dark:text-amber-200">
              supabase/migrations/0002_add_regions.sql
            </code>{' '}
            di <strong>Supabase Dashboard &gt; SQL Editor</strong>.
          </p>
        </div>
      )}

      {/* Grid Kartu Master Data */}
      {items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900/60">
          Belum ada {activeTab} yang didaftarkan. Klik tombol di atas untuk menambah data baru.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                  {activeTab === 'kategori' ? (
                    <Tag className="h-3.5 w-3.5" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5" />
                  )}
                </div>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm truncate">
                  {item.nama}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-neutral-500 dark:text-neutral-400 hover:text-purple-600 dark:hover:text-purple-400"
                  onClick={() => {
                    setEditItem(item)
                    setEditName(item.nama)
                  }}
                  title="Ubah nama"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-neutral-500 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400"
                  onClick={() => setDeleteItem(item)}
                  title="Hapus"
                >
                  <Trash2 className="h-3.5 w-3.5" />
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
                className="bg-[#186049] hover:bg-[#124b39] text-[#ECE8AF] border border-[#ECE8AF]/20 font-medium"
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
