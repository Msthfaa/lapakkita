'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'

interface OptionItem {
  id: number
  nama: string
}

interface CatalogFiltersProps {
  categories: OptionItem[]
  regions: OptionItem[]
}

export function CatalogFilters({ categories, regions }: CatalogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentQ = searchParams.get('q') || ''
  const currentCategory = searchParams.get('kategori') || ''
  const currentRegion = searchParams.get('daerah') || ''

  const [q, setQ] = useState(currentQ)
  const [kategori, setKategori] = useState(currentCategory)
  const [daerah, setDaerah] = useState(currentRegion)

  function applyFilters(newQ: string, newKategori: string, newDaerah: string) {
    const params = new URLSearchParams()
    if (newQ.trim()) params.set('q', newQ.trim())
    if (newKategori) params.set('kategori', newKategori)
    if (newDaerah) params.set('daerah', newDaerah)
    params.set('page', '1')

    startTransition(() => {
      router.push(`/?${params.toString()}#katalog`, { scroll: false })
    })
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    applyFilters(q, kategori, daerah)
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    setKategori(val)
    applyFilters(q, val, daerah)
  }

  function handleRegionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    setDaerah(val)
    applyFilters(q, kategori, val)
  }

  function handleReset() {
    setQ('')
    setKategori('')
    setDaerah('')
    startTransition(() => {
      router.push('/', { scroll: false })
    })
  }

  const hasFilter = Boolean(currentQ || currentCategory || currentRegion)

  return (
    <div className="rounded-2xl border border-[#186049]/15 dark:border-[#186049]/30 bg-white/90 dark:bg-[#0d1612] p-3 sm:p-4 shadow-sm transition-colors duration-300">
      <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
        {/* Kolom Pencarian */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#186049]/60 dark:text-[#ECE8AF]/60" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari produk UMKM..."
            className="h-11 rounded-xl pl-10 pr-9 border-neutral-200 dark:border-white/[0.08] bg-neutral-50/50 dark:bg-white/[0.03] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-[#4A943E]"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ('')
                applyFilters('', kategori, daerah)
              }}
              className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdown Kategori */}
        <div className="w-full md:w-48 flex items-center">
          <select
            value={kategori}
            onChange={handleCategoryChange}
            className="flex h-11 w-full rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-neutral-50/50 dark:bg-[#0f1915] px-3.5 py-2 text-sm text-neutral-800 dark:text-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4A943E] cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Daerah */}
        <div className="w-full md:w-48 flex items-center">
          <select
            value={daerah}
            onChange={handleRegionChange}
            className="flex h-11 w-full rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-neutral-50/50 dark:bg-[#0f1915] px-3.5 py-2 text-sm text-neutral-800 dark:text-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4A943E] cursor-pointer"
          >
            <option value="">Semua Daerah</option>
            {regions.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {reg.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="h-11 px-6 rounded-xl bg-[#186049] hover:bg-[#124b39] text-[#ECE8AF] border border-[#ECE8AF]/20 text-sm font-medium transition-all hover:opacity-95 active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            {isPending ? 'Mencari...' : 'Cari'}
          </button>

          {hasFilter && (
            <button
              type="button"
              onClick={handleReset}
              className="h-11 px-4 rounded-xl border border-[#186049]/20 dark:border-[#186049]/35 text-[#186049] dark:text-[#ECE8AF] text-sm hover:bg-[#186049]/10 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
