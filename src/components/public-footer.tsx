'use client'

import { usePathname } from 'next/navigation'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants'

export function PublicFooter() {
  const pathname = usePathname()

  // Sembunyikan footer di panel admin agar area admin menjadi full layout mandiri
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="border-t border-[#186049]/10 dark:border-[#186049]/20 bg-transparent py-8 text-center text-xs text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p>
          &copy; 2026 <strong className="font-semibold text-[#186049] dark:text-white">{SITE_NAME}</strong> &mdash; {SITE_TAGLINE}. Platform etalase promosi UMKM lokal.
        </p>
      </div>
    </footer>
  )
}
