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
import { swalDeleteConfirm, swalSuccess, swalError } from '@/lib/sweetalert'
import { Plus, Edit2, Trash2, Tag, MapPin, Loader2, AlertTriangle, Sparkles } from 'lucide-react'

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

  // Handle Tambah dengan SweetAlert
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
        await swalError({
          title: `Gagal Menambah ${activeTab === 'kategori' ? 'Kategori' : 'Daerah'}`,
          text: res.error || 'Terjadi kesalahan sistem.',
        })
      } else {
        const added = newName
        setAddDialogOpen(false)
        setNewName('')
        await swalSuccess({
          title: `${activeTab === 'kategori' ? 'Kategori' : 'Daerah'} Berhasil Ditambahkan!`,
          text: `"${added}" kini siap digunakan oleh mitra UMKM dan calon pembeli.`,
        })
      }
    } catch {
      await swalError({
        title: 'Terjadi Kendala',
        text: 'Tidak dapat menambahkan data saat ini.',
      })
    } finally {
      setSavingAdd(false)
    }
  }

  // Handle Edit dengan SweetAlert
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
        await swalError({
          title: 'Gagal Menyimpan Perubahan',
          text: res.error || 'Terjadi kesalahan sistem.',
        })
      } else {
        const updated = editName
        setEditItem(null)
        await swalSuccess({
          title: 'Perubahan Berhasil Disimpan!',
          text: `Nama telah diperbarui menjadi "${updated}".`,
        })
      }
    } catch {
      await swalError({
        title: 'Terjadi Kendala',
        text: 'Gagal memperbarui data.',
      })
    } finally {
      setSavingEdit(false)
    }
  }

  // Handle Delete Langsung dengan SweetAlert Interaktif
  async function handleDeletePrompt(item: ItemData) {
    const label = activeTab === 'kategori' ? 'Kategori' : 'Daerah'
    const confirmed = await swalDeleteConfirm({
      title: `Hapus ${label} "${item.nama}"?`,
      text: `Data ${label.toLowerCase()} ini akan dihapus permanen. Produk yang sudah ada tetap aman tetapi kategorinya perlu disesuaikan.`,
      confirmButtonText: 'Ya, Hapus Data',
      cancelButtonText: 'Batal',
    })

    if (!confirmed) return

    try {
      const res =
        activeTab === 'kategori'
          ? await deleteCategoryAction(item.id)
          : await deleteRegionAction(item.id)

      if (!res.success) {
        await swalError({
          title: `Gagal Menghapus ${label}`,
          text: res.error || `Terjadi kendala saat menghapus ${label.toLowerCase()}.`,
        })
      } else {
        await swalSuccess({
          title: `${label} Berhasil Dihapus!`,
          text: `Data "${item.nama}" telah berhasil dibersihkan dari sistem.`,
        })
      }
    } catch {
      await swalError({
        title: 'Terjadi Kendala',
        text: 'Tidak dapat menghapus data saat ini.',
      })
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
            <Tag className="h-4 w-4 text-[#4A943E]" />
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
            <MapPin className="h-4 w-4 text-[#D98327]" />
            <span>Daerah / Wilayah ({regions.length})</span>
          </button>
        </div>

        <Button
          onClick={() => {
            setNewName('')
            setAddDialogOpen(true)
          }}
          className="rounded-2xl bg-[#186049] hover:bg-[#124b39] text-white font-semibold text-xs sm:text-sm px-5 h-11 shadow-xs gap-2 self-start sm:self-auto transition-transform hover:scale-102"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah {activeTab === 'kategori' ? 'Kategori Baru' : 'Daerah Baru'}</span>
        </Button>
      </div>

      {activeTab === 'daerah' && regions.length === 0 && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-[#ECE8AF]/30 dark:bg-amber-950/40 p-4 text-xs sm:text-sm text-amber-900 dark:text-amber-300 space-y-1.5 shadow-xs">
          <p className="font-bold flex items-center gap-2 text-[#D98327]">
            <AlertTriangle className="h-4 w-4 text-[#D98327] shrink-0" />
            Tabel &quot;regions&quot; Belum Dibuat di Database Supabase
          </p>
          <p className="leading-relaxed">
            Untuk mengaktifkan pengelolaan daerah/wilayah, jalankan skrip migrasi{' '}
            <code className="rounded-md bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 font-mono font-semibold text-amber-950 dark:text-amber-200">
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
              className="flex items-center justify-between p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 shadow-2xs hover:border-[#4A943E]/50 dark:hover:border-[#4A943E]/40 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ECE8AF]/50 dark:bg-[#186049]/40 text-[#186049] dark:text-[#ECE8AF]">
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
                  className="h-8 w-8 p-0 rounded-lg text-neutral-400 hover:text-[#186049] dark:hover:text-[#4A943E]"
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
                  className="h-8 w-8 p-0 rounded-lg text-neutral-400 hover:text-[#D98327] dark:hover:text-[#D98327]"
                  onClick={() => handleDeletePrompt(item)}
                  title="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog Pop-Up Tambah Data (Palette: #186049, #4A943E, #D98327, #ECE8AF) */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="rounded-3xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-[#0c1611] p-6 sm:p-7 shadow-2xl max-w-md">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ECE8AF] text-[#186049] font-bold">
                  <Sparkles className="h-4 w-4" />
                </div>
                <DialogTitle className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white">
                  Tambah {activeTab === 'kategori' ? 'Kategori Produk' : 'Daerah Baru'}
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Masukkan nama {activeTab} baru yang akan langsung muncul di formulir pendaftaran produk dan filter katalog publik.
              </DialogDescription>
            </DialogHeader>

            <div className="my-5 space-y-2">
              <Label htmlFor="new-name" className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Nama {activeTab === 'kategori' ? 'Kategori' : 'Daerah'} *
              </Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={
                  activeTab === 'kategori'
                    ? 'Contoh: Kerajinan Anyaman, Kuliner Basah'
                    : 'Contoh: Banyuwangi, Malang'
                }
                autoFocus
                required
                disabled={savingAdd}
                className="h-12 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-sm focus-visible:ring-2 focus-visible:ring-[#4A943E]"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
                disabled={savingAdd}
                className="rounded-2xl h-11 px-5 border-neutral-200 dark:border-neutral-800 font-semibold text-xs sm:text-sm"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="rounded-2xl h-11 px-6 bg-[#186049] hover:bg-[#124b39] text-white font-bold text-xs sm:text-sm shadow-sm transition-transform hover:scale-102"
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

      {/* Dialog Pop-Up Edit Data */}
      <Dialog open={Boolean(editItem)} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="rounded-3xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-[#0c1611] p-6 sm:p-7 shadow-2xl max-w-md">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D98327]/20 text-[#D98327] font-bold">
                  <Edit2 className="h-4 w-4" />
                </div>
                <DialogTitle className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white">
                  Ubah Nama {activeTab === 'kategori' ? 'Kategori' : 'Daerah'}
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Perubahan nama ini akan langsung sinkron pada seluruh produk UMKM yang menggunakan {activeTab} ini.
              </DialogDescription>
            </DialogHeader>

            <div className="my-5 space-y-2">
              <Label htmlFor="edit-name" className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Nama {activeTab === 'kategori' ? 'Kategori' : 'Daerah'} *
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
                required
                disabled={savingEdit}
                className="h-12 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-sm focus-visible:ring-2 focus-visible:ring-[#4A943E]"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditItem(null)}
                disabled={savingEdit}
                className="rounded-2xl h-11 px-5 border-neutral-200 dark:border-neutral-800 font-semibold text-xs sm:text-sm"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="rounded-2xl h-11 px-6 bg-[#186049] hover:bg-[#124b39] text-white font-bold text-xs sm:text-sm shadow-sm transition-transform hover:scale-102"
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
    </div>
  )
}
