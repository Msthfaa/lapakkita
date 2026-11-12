'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/features/auth/actions'
import { ShieldCheck, LogOut, LayoutDashboard, Menu, X, Search, Store } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'

interface NavbarProps {
  user: { email?: string; id: string } | null
  profile: { nama: string; role: 'seller' | 'admin' } | null
}

const NAV_ITEMS = [
  { id: 'beranda', label: 'Beranda', href: '/' },
  { id: 'unggulan', label: 'Unggulan', href: '/#unggulan' },
  { id: 'kategori', label: 'Kategori', href: '/kategori' },
  { id: 'tentang', label: 'Tentang Kami', href: '/tentang' },
]

export function Navbar({ user, profile }: NavbarProps) {
  const pathname = usePathname()

  // Sembunyikan navbar di halaman admin
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const isHomePage = pathname === '/'
  const isKategoriPage = pathname?.startsWith('/kategori')
  const isTentangPage = pathname?.startsWith('/tentang')

  const [activeTab, setActiveTab] = useState<string>(
    isTentangPage ? 'tentang' : isKategoriPage ? 'kategori' : isHomePage ? 'beranda' : ''
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Di rute Panel Admin, sembunyikan navbar publik agar tidak tumpang tindih
  if (pathname.startsWith('/admin')) {
    return null
  }

  const isSeller = profile?.role === 'seller'
  const isAdmin = profile?.role === 'admin'

  // Update active tab based on route changes
  useEffect(() => {
    if (isTentangPage) {
      setActiveTab('tentang')
    } else if (isKategoriPage) {
      setActiveTab('kategori')
    } else if (isHomePage) {
      if (typeof window !== 'undefined' && window.location.hash === '#unggulan') {
        setActiveTab('unggulan')
      } else {
        setActiveTab('beranda')
      }
    } else {
      setActiveTab('')
    }
  }, [pathname, isHomePage, isKategoriPage, isTentangPage])

  // Scroll spy to automatically update active pill on homepage
  useEffect(() => {
    if (!isHomePage) return

    const handleScroll = () => {
      const unggulanEl = document.getElementById('unggulan')
      if (unggulanEl && unggulanEl.offsetTop <= window.scrollY + 240) {
        setActiveTab('unggulan')
      } else {
        setActiveTab('beranda')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  // Handle clicking navigation item
  const handleNavClick = (id: string, href: string) => {
    setActiveTab(id)
    setMobileMenuOpen(false)

    if (isHomePage) {
      if (href === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (href === '/#unggulan') {
        const targetEl = document.getElementById('unggulan')
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        return
      }
    }
  }

  const handleSearchClick = () => {
    window.location.href = '/kategori'
  }

  return (
    <header className="fixed top-4 sm:top-6 inset-x-0 z-50 px-4 sm:px-8 lg:px-12 pointer-events-none">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 h-11">
        
        {/* ========================================================= */}
        {/* 1. BAGIAN KIRI: LOGO + THEME TOGGLE                       */}
        {/* ========================================================= */}
        <div className="pointer-events-auto flex items-center gap-2.5 shrink-0 z-10">
          {/* Logo Brand with Golden Emblem */}
          <Link
            href="/"
            prefetch={true}
            title="LapakKita - Karya Anak Bangsa, Kualitas Juara, Harga Bersahaja"
            onClick={() => {
              if (isHomePage) {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setActiveTab('beranda')
              }
            }}
            className="group flex h-11 items-center gap-2.5 rounded-full glass-pill px-4 transition-transform duration-200 hover:scale-[1.02] active:scale-95"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#186049] via-[#2a7a58] to-[#4A943E] text-white shadow-xs font-serif font-bold text-xs shrink-0">
              <Store className="h-4 w-4 text-white drop-shadow-xs" />
            </div>
            <span className="font-serif text-base font-semibold tracking-tight text-[#186049] dark:text-white transition-colors select-none">
              Lapak<span className="text-[#4A943E] dark:text-[#5ebd4f] font-bold">Kita</span>
            </span>
          </Link>

          {/* Dark / Light Mode Button beside logo */}
          <ThemeToggle />
        </div>

        {/* ========================================================= */}
        {/* 2. BAGIAN TENGAH: PERSIS DI TENGAH HORIZONTAL & VERTIKAL  */}
        {/* ========================================================= */}
        <div className="pointer-events-auto hidden md:flex absolute left-1/2 -translate-x-1/2 top-0 items-center justify-center z-10">
          <nav className="flex h-11 items-center rounded-full glass-pill p-1.5 gap-1 shadow-2xl">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id
              const isHashOnHome = isHomePage && (item.href === '/' || item.href === '/#unggulan')

              // High-contrast text: white on active green pill, high-contrast dark/light on inactive
              const buttonClass = `h-8 px-4 flex items-center justify-center text-xs sm:text-sm rounded-full transition-all duration-200 cursor-pointer select-none leading-none ${
                isActive
                  ? 'bg-gradient-to-r from-[#186049] to-[#257d5a] !text-white font-bold shadow-md'
                  : 'text-neutral-800 hover:text-[#186049] dark:text-neutral-200 dark:hover:text-white font-semibold hover:bg-black/5 dark:hover:bg-white/10'
              }`

              if (isHashOnHome) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id, item.href)}
                    className={buttonClass}
                  >
                    <span className={isActive ? 'text-white font-bold' : ''}>{item.label}</span>
                  </button>
                )
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => handleNavClick(item.id, item.href)}
                  className={buttonClass}
                >
                  <span className={isActive ? 'text-white font-bold' : ''}>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* ========================================================= */}
        {/* 3. BAGIAN KANAN: CARI & LOGIN / DAFTAR                    */}
        {/* ========================================================= */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 shrink-0 z-10 ml-auto">
          {/* Quick Search Button: Navigates to Kategori & Search page */}
          <button
            type="button"
            onClick={handleSearchClick}
            className="flex h-11 w-11 items-center justify-center rounded-full glass-btn text-neutral-800 dark:text-neutral-200 hover:text-[#186049] dark:hover:text-[#4A943E] cursor-pointer active:scale-95"
            title="Cari Produk di Tab Kategori"
            aria-label="Cari Produk"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* User Logged In State */}
          {user ? (
            <div className="flex h-11 items-center gap-1.5 rounded-full glass-pill p-1.5">
              {isSeller && (
                <Link
                  href="/dashboard"
                  prefetch={true}
                  className="flex h-8 items-center gap-1.5 text-xs font-semibold text-neutral-800 hover:text-[#186049] dark:text-neutral-200 dark:hover:text-white transition-colors px-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  prefetch={true}
                  className="flex h-8 items-center gap-1 text-xs font-bold text-[#186049] dark:text-white bg-[#ECE8AF]/70 dark:bg-white/10 border border-[#186049]/20 dark:border-white/20 transition-colors px-3 rounded-full hover:scale-105"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-[#186049] dark:text-white" />
                  <span className="hidden lg:inline">Admin</span>
                </Link>
              )}

              <form action={signOutAction} className="inline-flex items-center">
                <button
                  type="submit"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : (
            /* User Not Logged In State (Login & Register Pill) */
            <div className="flex h-11 items-center gap-1 rounded-full glass-pill p-1.5">
              <Link
                href="/masuk"
                className={`h-8 px-3.5 flex items-center justify-center text-xs font-semibold rounded-full transition-colors ${
                  pathname === '/masuk'
                    ? 'bg-[#186049]/15 text-[#186049] dark:text-[#ECE8AF] font-bold'
                    : 'text-neutral-800 hover:text-[#186049] dark:text-neutral-200 dark:hover:text-white'
                }`}
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className={`flex h-8 px-4 items-center justify-center rounded-full text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 ${
                  pathname === '/daftar'
                    ? 'bg-[#186049] text-[#ECE8AF] ring-2 ring-[#4A943E]'
                    : 'bg-[#186049] hover:bg-[#124b39] text-white'
                }`}
              >
                Daftar
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-full glass-btn text-neutral-800 dark:text-neutral-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Floating Mobile Dropdown Menu with Glassmorphism */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto mt-3 rounded-3xl glass-pill p-5 md:hidden transition-all duration-200 animate-in fade-in slide-in-from-top-3">
          <div className="flex flex-col space-y-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  setActiveTab(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`text-left text-sm py-2 px-3.5 rounded-xl transition-colors cursor-pointer font-bold ${
                  activeTab === item.id
                    ? 'glass-active-pill !text-black shadow-sm'
                    : 'text-neutral-800 hover:bg-[#186049]/10 dark:text-neutral-200 dark:hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t border-neutral-200 dark:border-white/15 pt-3">
              {user ? (
                <div className="space-y-2">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    Akun: <strong className="text-[#186049] dark:text-white">{profile?.nama || user.email}</strong>
                  </div>
                  {isSeller && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm py-1.5 text-neutral-800 dark:text-neutral-200 hover:text-[#186049] dark:hover:text-white font-medium"
                    >
                      Dashboard Penjual
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm py-1.5 text-[#186049] dark:text-white font-bold"
                    >
                      Panel Admin
                    </Link>
                  )}
                  <form action={signOutAction} className="pt-2">
                    <button
                      type="submit"
                      className="w-full text-center text-xs py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-300 font-semibold hover:bg-rose-500/20"
                    >
                      Keluar
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link
                    href="/masuk"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs rounded-xl glass-btn text-neutral-800 dark:text-white font-semibold"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/daftar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs rounded-xl bg-[#186049] hover:bg-[#124b39] text-white font-bold"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
