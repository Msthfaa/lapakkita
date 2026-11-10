'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signOutAction } from '@/features/auth/actions'
import { Store, PlusCircle, ShieldCheck, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  user: { email?: string; id: string } | null
  profile: { nama: string; role: 'seller' | 'admin' } | null
}

export function Navbar({ user, profile }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isSeller = profile?.role === 'seller'
  const isAdmin = profile?.role === 'admin'

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" prefetch={true} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">
              Lapak<span className="text-emerald-600">Kita</span>
            </span>
            <span className="ml-1.5 hidden rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 sm:inline">
              UMKM
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-3 md:flex">
          <Link
            href="/"
            prefetch={true}
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
              pathname === '/' ? 'text-emerald-600' : 'text-neutral-600'
            }`}
          >
            Katalog Produk
          </Link>

          {user && (
            <>
              {isSeller && (
                <>
                  <Link
                    href="/dashboard"
                    prefetch={true}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-emerald-600 ${
                      pathname === '/dashboard' ? 'text-emerald-600' : 'text-neutral-600'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Button asChild size="sm" variant="outline" className="gap-1.5">
                    <Link href="/dashboard/produk/baru" prefetch={true}>
                      <PlusCircle className="h-4 w-4 text-emerald-600" />
                      Tambah Produk
                    </Link>
                  </Button>
                </>
              )}

              {isAdmin && (
                <div className="flex items-center gap-2 border-l border-neutral-200 pl-3">
                  <Link
                    href="/admin"
                    prefetch={true}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-emerald-600 ${
                      pathname === '/admin' ? 'text-emerald-600' : 'text-neutral-600'
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4 text-purple-600" />
                    Admin
                  </Link>
                  <Link
                    href="/admin/moderasi"
                    prefetch={true}
                    className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                      pathname === '/admin/moderasi' ? 'text-emerald-600' : 'text-neutral-600'
                    }`}
                  >
                    Moderasi
                  </Link>
                  <Link
                    href="/admin/master"
                    prefetch={true}
                    className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                      pathname === '/admin/master' ? 'text-emerald-600' : 'text-neutral-600'
                    }`}
                  >
                    Master Data
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-2 border-l border-neutral-200 pl-3">
                <span className="text-xs text-neutral-500 max-w-[120px] truncate">
                  {profile?.nama || user.email}
                </span>
                <form action={signOutAction}>
                  <Button type="submit" variant="ghost" size="sm" className="text-neutral-600 hover:text-rose-600">
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Keluar</span>
                  </Button>
                </form>
              </div>
            </>
          )}

          {!user && (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/masuk">Masuk</Link>
              </Button>
              <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/daftar">Daftar Jadi Penjual</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu navigasi"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-neutral-800"
            >
              Katalog Produk
            </Link>

            {user ? (
              <>
                <div className="border-t border-neutral-100 pt-2 text-xs text-neutral-500">
                  Login sebagai: <strong className="text-neutral-800">{profile?.nama || user.email}</strong>
                  {isAdmin && ' (Administrator)'}
                </div>

                {isSeller && (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium text-neutral-800"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard Saya
                    </Link>
                    <Link
                      href="/dashboard/produk/baru"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium text-emerald-700"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Tambah Produk Baru
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    <div className="border-t border-neutral-100 pt-2 text-xs font-semibold text-purple-700">
                      Menu Administrator
                    </div>
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-medium text-neutral-800"
                    >
                      Ringkasan Admin
                    </Link>
                    <Link
                      href="/admin/moderasi"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-medium text-neutral-800"
                    >
                      Moderasi Produk
                    </Link>
                    <Link
                      href="/admin/master"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-medium text-neutral-800"
                    >
                      Master Data (Kategori & Daerah)
                    </Link>
                  </>
                )}

                <div className="border-t border-neutral-100 pt-3">
                  <form action={signOutAction}>
                    <Button type="submit" variant="destructive" size="sm" className="w-full gap-2">
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/masuk" onClick={() => setMobileMenuOpen(false)}>
                    Masuk
                  </Link>
                </Button>
                <Button asChild size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/daftar" onClick={() => setMobileMenuOpen(false)}>
                    Daftar Jadi Penjual
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
