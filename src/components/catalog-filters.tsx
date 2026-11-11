'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { CustomDropdown } from '@/components/ui/custom-dropdown'
import { Search, X, Layers, MapPin } from 'lucide-react'

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
      router.push(`/kategori?${params.toString()}`, { scroll: false })
    })
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    applyFilters(q, kategori, daerah)
  }

  function handleCategoryChange(val: string) {
    setKategori(val)
    applyFilters(q, val, daerah)
  }

  function handleRegionChange(val: string) {
    setDaerah(val)
    applyFilters(q, kategori, val)
  }

  function handleReset() {
    setQ('')
    setKategori('')
    setDaerah('')
    startTransition(() => {
      router.push('/kategori', { scroll: false })
    })
  }

  const hasFilter = Boolean(currentQ || currentCategory || currentRegion)

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3 sm:p-4 shadow-xs transition-colors duration-300">
      <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Kolom Pencarian */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari produk UMKM..."
            className="h-11 rounded-xl pl-10 pr-9 border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600"
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

        {/* Dropdown Estetik Kategori */}
        <div id="kategori" className="w-full md:w-52 scroll-mt-24">
          <CustomDropdown
            value={kategori}
            onChange={handleCategoryChange}
            options={categories}
            placeholder="Pilih Kategori"
            allOptionLabel="Semua Kategori"
            icon={<Layers className="h-4 w-4" />}
          />
        </div>

        {/* Dropdown Estetik Daerah */}
        <div id="daerah" className="w-full md:w-52 scroll-mt-24">
          <CustomDropdown
            value={daerah}
            onChange={handleRegionChange}
            options={regions}
            placeholder="Pilih Daerah"
            allOptionLabel="Semua Daerah"
            icon={<MapPin className="h-4 w-4" />}
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-2 shrink-0">
          <button
            type="submit"
            disabled={isPending}
            className="h-11 px-6 rounded-xl bg-[#186049] hover:bg-[#124b39] text-white text-sm font-semibold transition-all hover:opacity-95 active:scale-95 disabled:opacity-50 shadow-xs cursor-pointer"
          >
            {isPending ? 'Mencari...' : 'Cari'}
          </button>

          {hasFilter && (
            <button
              type="button"
              onClick={handleReset}
              className="h-11 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
