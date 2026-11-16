'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell, ShieldCheck, ArrowRight } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

interface AdminHeaderProps {
  user: { email?: string; id: string } | null
  profile: { nama: string; role: 'seller' | 'admin' } | null
  pendingCount?: number
}

export function AdminHeader({ user, profile, pendingCount = 0 }: AdminHeaderProps) {
  const router = useRouter()
  const [searchVal, setSearchVal] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!searchVal.trim()) return
    router.push(`/admin/moderasi?q=${encodeURIComponent(searchVal.trim())}`)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = profile?.nama
    ? profile.nama
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AD'

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-neutral-200/80 dark:border-neutral-900 transition-colors duration-300">
      {/* Mobile Top Row / Desktop Right Controls */}
      <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-3 w-full lg:w-auto lg:order-2">
        {/* Brand Indicator (< lg) */}
        <Link
          href="/admin"
          className="flex lg:hidden items-center gap-2 rounded-full bg-[#186049]/10 dark:bg-white/10 px-3 py-1 text-xs font-bold text-[#186049] dark:text-[#4A943E] border border-[#186049]/20 hover:opacity-90 transition-opacity shrink-0"
        >
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#186049] dark:text-[#4A943E]" />
          <span>Admin LapakKita</span>
        </Link>

        {/* Quick Actions: Notification Bell, ThemeToggle, Profile Chip */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Lonceng Notifikasi */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 shadow-2xs transition-all hover:scale-105 cursor-pointer"
              title="Notifikasi Antrean Moderasi"
              aria-label="Notifikasi Antrean Moderasi"
            >
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-neutral-950 animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Flyout Notifikasi */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-neutral-900">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    Notifikasi Antrean
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {pendingCount} Pending
                  </span>
                </div>
                <div className="py-3">
                  {pendingCount > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
                        Ada <strong>{pendingCount} produk UMKM</strong> baru yang menunggu tindakan verifikasi Anda.
                      </p>
                      <Link
                        href="/admin/moderasi"
                        onClick={() => setNotifOpen(false)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
                      >
                        <span>Buka Halaman Moderasi</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      🎉 Tidak ada antrean pending. Seluruh produk telah diverifikasi bersih.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* Profil Chip Administrator */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-1 sm:py-1.5 sm:pl-2 sm:pr-4 shadow-2xs h-11 sm:h-12"
            title={profile?.nama || 'Administrator'}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#186049] to-[#4A943E] text-white font-bold text-xs shadow-xs shrink-0">
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white leading-tight">
                  {profile?.nama || 'Admin'}
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono leading-tight mt-0.5 truncate max-w-[120px] lg:max-w-[140px]">
                {user?.email || 'admin@lapakkita.id'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input: Full-width on mobile (< lg), max-w-xl on desktop (lg:order-1) */}
      <form onSubmit={handleSearchSubmit} className="relative w-full lg:flex-1 lg:max-w-xl lg:order-1">
        <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-neutral-400 dark:text-neutral-500" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Cari produk, penjual UMKM, kategori, izin..."
          className="w-full h-11 sm:h-12 pl-10 sm:pl-11 pr-12 sm:pr-14 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#4A943E]/20 focus:border-[#186049] dark:focus:border-[#4A943E] transition-all"
        />
        <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="hidden sm:inline-flex items-center rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
            ↵ Cari
          </kbd>
        </div>
      </form>
    </header>
  )
}
