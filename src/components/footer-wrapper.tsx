'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants'

export interface FooterWrapperProps {
  children?: React.ReactNode
}

export function FooterWrapper({ children }: FooterWrapperProps) {
  const pathname = usePathname()

  // 1. Admin routes: Suppress consumer footer completely
  if (pathname?.startsWith('/admin')) {
    return null
  }

  // 2. Auth routes (/masuk, /daftar): High-contrast crisp styling on top of scenic deep pine green background
  const isAuthRoute =
    pathname === '/masuk' ||
    pathname === '/daftar' ||
    pathname?.startsWith('/masuk/') ||
    pathname?.startsWith('/daftar/')

  if (isAuthRoute) {
    return (
      <footer className="relative z-10 border-t border-white/15 bg-transparent py-6 text-center text-xs text-white/80 dark:text-white/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="tracking-wide">
            &copy; 2026{' '}
            <strong className="text-[#ECE8AF] font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              {SITE_NAME}
            </strong>{' '}
            &mdash; {SITE_TAGLINE}. Platform etalase promosi UMKM lokal.
          </p>
        </div>
      </footer>
    )
  }

  // 3. Standard public / user routes: render standard clean footer
  if (children) {
    return <>{children}</>
  }

  return (
    <footer className="relative z-10 border-t border-neutral-200/50 dark:border-neutral-800/60 bg-transparent py-8 text-center text-xs text-neutral-600 dark:text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p>
          &copy; 2026{' '}
          <strong className="text-neutral-900 dark:text-neutral-200">{SITE_NAME}</strong>{' '}
          &mdash; {SITE_TAGLINE}. Platform etalase promosi UMKM lokal.
        </p>
      </div>
    </footer>
  )
}
