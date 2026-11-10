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
      <h2 className="text-xl font-bold text-neutral-900">Terjadi Kendala Teknis</h2>
      <p className="mt-2 text-sm text-neutral-500 max-w-md">
        Kami mendapati sedikit gangguan saat memuat halaman ini. Silakan coba muat ulang atau kembali beberapa saat lagi.
      </p>
      <div className="mt-6">
        <Button onClick={() => reset()} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <RotateCcw className="h-4 w-4" /> Coba Muat Ulang
        </Button>
      </div>
    </div>
  )
}
