'use client'

import { usePathname } from 'next/navigation'

export function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Suppress both the navbar and its suspense fallback completely inside Admin panel
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return <>{children}</>
}
