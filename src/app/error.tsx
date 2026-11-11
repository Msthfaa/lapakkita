'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Terjadi Kendala Teknis</h2>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
        Kami mendapati sedikit gangguan saat memuat halaman ini. Silakan coba muat ulang atau kembali beberapa saat lagi.
      </p>

      {/* Tampilkan detail error di development agar mudah diketahui penyebabnya */}
      {error && (
        <div className="mt-4 max-w-lg rounded-xl border border-rose-200 bg-rose-50 p-4 text-left text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
          <p className="font-semibold text-rose-900 dark:text-rose-100 mb-1">Detail Error:</p>
          <p className="font-mono break-all">{error.message || 'Unknown error'}</p>
          {error.digest && (
            <p className="mt-1 font-mono text-[10px] text-rose-600 dark:text-rose-400">
              Digest: {error.digest}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={() => reset()} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
          <RotateCcw className="h-4 w-4" /> Coba Muat Ulang
        </Button>
        <Button asChild variant="outline">
          <a href="/">Ke Beranda</a>
        </Button>
      </div>
    </div>
  )
}
