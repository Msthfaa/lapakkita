import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  q?: string
  kategori?: string
  daerah?: string
}

export function Pagination({ currentPage, totalPages, q, kategori, daerah }: PaginationProps) {
  if (totalPages <= 1) return null

  function buildUrl(page: number) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (kategori) params.set('kategori', kategori)
    if (daerah) params.set('daerah', daerah)
    params.set('page', page.toString())
    return `/?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      {/* Tombol Sebelumnya */}
      {currentPage > 1 ? (
        <Button asChild variant="outline" size="sm" className="gap-1">
          <Link href={buildUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Sebelumnya
        </Button>
      )}

      {/* Indikator Halaman */}
      <div className="flex items-center gap-1 px-2 text-sm text-neutral-600 font-medium">
        Halaman <span className="font-bold text-neutral-900">{currentPage}</span> dari{' '}
        <span className="font-bold text-neutral-900">{totalPages}</span>
      </div>

      {/* Tombol Selanjutnya */}
      {currentPage < totalPages ? (
        <Button asChild variant="outline" size="sm" className="gap-1">
          <Link href={buildUrl(currentPage + 1)}>
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled className="gap-1">
          Selanjutnya
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
