'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signOutAction } from '@/features/auth/actions'
import { PlusCircle, ShieldCheck, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'

interface NavbarProps {
  user: { email?: string; id: string } | null
  profile: { nama: string; role: 'seller' | 'admin' } | null
}

export function Navbar({ user, profile }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Di rute Panel Admin, sembunyikan navbar publik agar tidak tumpang tindih
  if (pathname.startsWith('/admin')) {
    return null
  }

  const isSeller = profile?.role === 'seller'
  const isAdmin = profile?.role === 'admin'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-transparent dark:border-neutral-900 bg-white/90 dark:bg-black/90 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Brand - exactly matching "Voyager2 —" minimalist editorial aesthetic */}
        <Link href="/" prefetch={true} className="flex items-center gap-2 group">
          <span className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 dark:text-white transition-opacity group-hover:opacity-80">
            LapakKita
          </span>
          <span className="text-xl sm:text-2xl font-light text-neutral-400 dark:text-neutral-500">
            &mdash;
          </span>
        </Link>

        {/* Desktop Nav - Clean, spaced text links like the reference */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            prefetch={true}
            className={`text-sm font-light transition-colors hover:text-black dark:hover:text-white ${
              pathname === '/'
                ? 'text-neutral-900 dark:text-white font-normal'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            Katalog
          </Link>

          <a
            href="#unggulan"
            className="text-sm font-light text-neutral-500 dark:text-neutral-400 transition-colors hover:text-black dark:hover:text-white"
          >
            Unggulan
          </a>

          <a
            href="#kategori"
            className="text-sm font-light text-neutral-500 dark:text-neutral-400 transition-colors hover:text-black dark:hover:text-white"
          >
            Kategori
          </a>

          <a
            href="#daerah"
            className="text-sm font-light text-neutral-500 dark:text-neutral-400 transition-colors hover:text-black dark:hover:text-white"
          >
            Daerah
          </a>

          {user && (
            <>
              {isSeller && (
                <>
                  <Link
                    href="/dashboard"
                    prefetch={true}
                    className={`flex items-center gap-1.5 text-sm font-light transition-colors hover:text-black dark:hover:text-white ${
                      pathname === '/dashboard'
                        ? 'text-neutral-900 dark:text-white font-normal'
                        : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </Link>
                  <Button asChild size="sm" variant="outline" className="h-8 rounded-full text-xs font-normal border-neutral-300 dark:border-neutral-800 dark:text-neutral-200">
                    <Link href="/dashboard/produk/baru" prefetch={true}>
                      <PlusCircle className="h-3.5 w-3.5 mr-1" />
                      Tambah
                    </Link>
                  </Button>
                </>
              )}

              {isAdmin && (
                <div className="flex items-center gap-4 border-l border-neutral-200 dark:border-neutral-800 pl-4">
                  <Link
                    href="/admin"
                    prefetch={true}
                    className="flex items-center gap-1 text-sm font-light text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Admin
                  </Link>
                  <Link
                    href="/admin/moderasi"
                    prefetch={true}
                    className="text-sm font-light text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  >
                    Moderasi
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-3 border-l border-neutral-200 dark:border-neutral-800 pl-4">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[100px] truncate">
                  {profile?.nama || user.email}
                </span>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="text-neutral-400 hover:text-rose-500 transition-colors"
                    title="Keluar"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Keluar</span>
                  </button>
                </form>
              </div>
            </>
          )}

          {!user && (
            <div className="flex items-center gap-3">
              <Link
                href="/masuk"
                className="text-sm font-light text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="rounded-full bg-neutral-900 dark:bg-white px-4 py-1.5 text-xs font-medium text-white dark:text-black transition-all hover:opacity-90 shadow-sm"
              >
                Daftar Penjual
              </Link>
            </div>
          )}

          {/* Theme Toggle Button */}
          <ThemeToggle />
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-neutral-700 dark:text-neutral-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 px-6 py-6 md:hidden backdrop-blur-lg">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-light text-neutral-800 dark:text-neutral-200"
            >
              Katalog Produk
            </Link>

            {user ? (
              <>
                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 text-xs text-neutral-500 dark:text-neutral-400">
                  Login: <strong className="text-neutral-900 dark:text-white">{profile?.nama || user.email}</strong>
                  {isAdmin && ' (Admin)'}
                </div>

                {isSeller && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-light text-neutral-800 dark:text-neutral-200"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard Penjual
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-light text-neutral-800 dark:text-neutral-200"
                  >
                    Panel Admin
                  </Link>
                )}

                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3">
                  <form action={signOutAction}>
                    <Button type="submit" variant="destructive" size="sm" className="w-full">
                      Keluar
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Button asChild variant="outline" size="sm" className="w-full dark:border-neutral-800">
                  <Link href="/masuk" onClick={() => setMobileMenuOpen(false)}>
                    Masuk
                  </Link>
                </Button>
                <Button asChild size="sm" className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black">
                  <Link href="/daftar" onClick={() => setMobileMenuOpen(false)}>
                    Daftar Penjual
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
