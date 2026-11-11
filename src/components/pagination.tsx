import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  q?: string
  kategori?: string
  daerah?: string
  basePath?: string
}

export function Pagination({
  currentPage,
  totalPages,
  q,
  kategori,
  daerah,
  basePath = '/kategori',
}: PaginationProps) {
  if (totalPages <= 1) return null

  function buildUrl(page: number) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (kategori) params.set('kategori', kategori)
    if (daerah) params.set('daerah', daerah)
    params.set('page', page.toString())
    return `${basePath}?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-center gap-3 pt-10">
      {/* Tombol Sebelumnya */}
      {currentPage > 1 ? (
        <Button asChild variant="outline" size="sm" className="gap-1 rounded-xl dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900">
          <Link href={buildUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled className="gap-1 rounded-xl dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-600">
          <ChevronLeft className="h-4 w-4" />
          Sebelumnya
        </Button>
      )}

      {/* Indikator Halaman */}
      <div className="flex items-center gap-1.5 px-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-light">
        Halaman <span className="font-semibold text-neutral-900 dark:text-white">{currentPage}</span> dari{' '}
        <span className="font-semibold text-neutral-900 dark:text-white">{totalPages}</span>
      </div>

      {/* Tombol Selanjutnya */}
      {currentPage < totalPages ? (
        <Button asChild variant="outline" size="sm" className="gap-1 rounded-xl dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900">
          <Link href={buildUrl(currentPage + 1)}>
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled className="gap-1 rounded-xl dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-600">
          Selanjutnya
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
