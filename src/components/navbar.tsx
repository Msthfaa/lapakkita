'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/features/auth/actions'
import {
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Store,
  Home,
  Flame,
  Layers,
  Info,
  Sun,
  Moon,
  LogIn,
  UserPlus,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'motion/react'

interface NavbarProps {
  user: { email?: string; id: string } | null
  profile: { nama: string; role: 'seller' | 'admin' } | null
}

const NAV_ITEMS = [
  { id: 'beranda', label: 'Beranda', href: '/', icon: Home },
  { id: 'unggulan', label: 'Unggulan', href: '/#unggulan', icon: Flame },
  { id: 'kategori', label: 'Kategori', href: '/kategori', icon: Layers },
  { id: 'tentang', label: 'Tentang Kami', href: '/tentang', icon: Info },
]

export function Navbar({ user, profile }: NavbarProps) {
  const pathname = usePathname()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

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

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark')
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

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

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

  return (
    <header className="fixed top-4 sm:top-6 inset-x-0 z-50 px-4 sm:px-8 lg:px-12 pointer-events-none">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 h-11">
        {/* ========================================================= */}
        {/* 1. BAGIAN KIRI: HANYA LOGO LAPAKKITA                     */}
        {/* ========================================================= */}
        <div className="pointer-events-auto flex items-center shrink-0 z-10">
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
        </div>

        {/* ========================================================= */}
        {/* 2. BAGIAN TENGAH: NAVBAR LENGKAP PADA LAYAR BESAR (DESKTOP) */}
        {/* ========================================================= */}
        <div className="pointer-events-auto hidden lg:flex absolute left-1/2 -translate-x-1/2 top-0 items-center justify-center z-10">
          <nav className="flex h-11 items-center rounded-full glass-pill p-1.5 gap-1 shadow-2xl">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id
              const isHashOnHome = isHomePage && (item.href === '/' || item.href === '/#unggulan')

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
        {/* 3. BAGIAN KANAN: THEME TOGGLE, AUTH, & BURGER BUTTON      */}
        {/* ========================================================= */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 shrink-0 z-10 ml-auto">
          {/* Fitur Lightmode / Darkmode: Berpindah ke kanan menggantikan tombol Search */}
          <ThemeToggle />

          {/* User Logged In State (Tampilan Tablet / Desktop) */}
          {user ? (
            <div className="hidden sm:flex h-11 items-center gap-1.5 rounded-full glass-pill p-1.5">
              {isSeller && (
                <Link
                  href="/dashboard"
                  prefetch={true}
                  className="flex h-8 items-center gap-1.5 text-xs font-semibold text-neutral-800 hover:text-[#186049] dark:text-neutral-200 dark:hover:text-white transition-colors px-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  prefetch={true}
                  className="flex h-8 items-center gap-1 text-xs font-bold text-[#186049] dark:text-white bg-[#186049]/15 dark:bg-white/10 border border-[#186049]/20 dark:border-white/20 transition-colors px-3 rounded-full hover:scale-105"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-[#186049] dark:text-white" />
                  <span className="hidden md:inline">Admin</span>
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
            /* User Not Logged In State (Tampilan Tablet / Desktop) */
            <div className="hidden sm:flex h-11 items-center gap-1 rounded-full glass-pill p-1.5">
              <Link
                href="/masuk"
                className={`h-8 px-3.5 flex items-center justify-center text-xs font-semibold rounded-full transition-colors ${
                  pathname === '/masuk'
                    ? 'bg-[#186049]/15 text-[#186049] dark:text-white font-bold'
                    : 'text-neutral-800 hover:text-[#186049] dark:text-neutral-200 dark:hover:text-white'
                }`}
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className={`flex h-8 px-4 items-center justify-center rounded-full text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 ${
                  pathname === '/daftar'
                    ? 'bg-[#186049] text-white ring-2 ring-[#4A943E]'
                    : 'bg-[#186049] hover:bg-[#124b39] text-white'
                }`}
              >
                Daftar
              </Link>
            </div>
          )}

          {/* Tombol Burger: Selalu responsif di mobile & tablet (< lg) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full glass-btn text-neutral-800 dark:text-neutral-200 hover:text-[#186049] dark:hover:text-white transition-all cursor-pointer active:scale-95 shadow-xs"
            aria-label="Buka menu navigasi"
            title="Menu Navigasi"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MODAL / DRAWER BURGER MENU LENGKAP                     */}
      {/* ========================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Latar Belakang Redup / Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/55 backdrop-blur-xs z-40 pointer-events-auto lg:hidden"
            />

            {/* Panel Kartu Burger Menu */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.97 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="pointer-events-auto absolute top-16 inset-x-4 sm:inset-x-8 max-w-md mx-auto z-50 rounded-3xl glass-pill p-5 lg:hidden shadow-2xl border border-neutral-200/80 dark:border-white/10 select-none"
            >
              <div className="flex flex-col space-y-4">
                {/* Header Menu */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200/70 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#186049] via-[#2a7a58] to-[#4A943E] text-white shadow-xs font-serif font-bold text-xs">
                      <Store className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="font-serif text-base font-semibold tracking-tight text-[#186049] dark:text-white">
                      Lapak<span className="text-[#4A943E] dark:text-[#5ebd4f]">Kita</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Tutup menu"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* 1. Navigasi Menu Lengkap */}
                <div className="flex flex-col space-y-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 py-1">
                    Navigasi Halaman
                  </div>
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.id
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => handleNavClick(item.id, item.href)}
                        className={`flex items-center justify-between text-sm py-2.5 px-3.5 rounded-xl transition-all cursor-pointer font-semibold ${
                          isActive
                            ? 'bg-gradient-to-r from-[#186049] to-[#257d5a] text-white shadow-md'
                            : 'text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`} />
                          <span>{item.label}</span>
                        </span>
                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </Link>
                    )
                  })}
                </div>

                {/* 2. Fitur Lightmode & Darkmode di Dalam Burger Menu */}
                <div className="rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                    <span className="flex items-center gap-1.5">
                      {isDark ? <Moon className="h-3.5 w-3.5 text-white" /> : <Sun className="h-3.5 w-3.5 text-amber-500" />}
                      <span>Tema Tampilan</span>
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                      {isDark ? 'Mode Gelap' : 'Mode Terang'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/80 text-xs">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                        !isDark
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <Sun className="h-3.5 w-3.5 text-amber-500" />
                      <span>Terang</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                        isDark
                          ? 'bg-[#186049] text-white shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <Moon className="h-3.5 w-3.5 text-white" />
                      <span>Gelap</span>
                    </button>
                  </div>
                </div>

                {/* 3. Masuk dan Daftar (atau Profil Pengguna) di Dalam Burger Menu */}
                <div className="pt-1">
                  {user ? (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between rounded-xl bg-black/[0.03] dark:bg-white/[0.05] p-3 text-xs">
                        <div className="truncate pr-2">
                          <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                            Akun Masuk
                          </div>
                          <div className="font-bold text-[#186049] dark:text-white truncate">
                            {profile?.nama || user.email}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-md bg-[#186049]/15 dark:bg-[#4A943E]/20 text-[#186049] dark:text-[#5ebd4f] text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                          {isAdmin ? 'Admin' : isSeller ? 'Penjual' : 'Member'}
                        </span>
                      </div>

                      {isSeller && (
                        <Link
                          href="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex h-10 items-center justify-center gap-2 rounded-xl glass-btn text-xs font-semibold text-neutral-800 dark:text-white hover:text-[#186049] transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Buka Dashboard Penjual</span>
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#186049] text-white text-xs font-bold hover:bg-[#124b39] transition-colors shadow-xs"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          <span>Buka Panel Administrator</span>
                        </Link>
                      )}

                      <form action={signOutAction} className="pt-1">
                        <button
                          type="submit"
                          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-300 text-xs font-semibold hover:bg-rose-500/20 transition-colors cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Keluar dari Akun</span>
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/masuk"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl glass-btn text-xs font-bold text-neutral-800 dark:text-white border border-neutral-200 dark:border-white/10 hover:border-[#186049]/40 transition-all cursor-pointer"
                      >
                        <LogIn className="h-4 w-4 text-[#186049] dark:text-white" />
                        <span>Masuk ke Akun</span>
                      </Link>
                      <Link
                        href="/daftar"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#186049] to-[#257d5a] hover:opacity-95 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
                      >
                        <UserPlus className="h-4 w-4 text-white" />
                        <span>Daftar Penjual UMKM</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
