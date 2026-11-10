'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
      router.push(`/?${params.toString()}`, { scroll: false })
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
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
      <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
        {/* Kolom Pencarian */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari produk UMKM (nama atau deskripsi)..."
            className="pl-9 pr-9"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ('')
                applyFilters('', kategori, daerah)
              }}
              className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
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
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
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
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <option value="">Semua Daerah</option>
            {regions.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {reg.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Tombol Cari */}
        <div className="flex gap-2">
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 font-medium"
            disabled={isPending}
          >
            Cari
          </Button>

          {hasFilter && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="text-neutral-600"
            >
              Reset
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
