'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell, ShieldCheck, CheckSquare, Sparkles, User, ExternalLink } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

interface AdminHeaderProps {
  user: { email?: string; id: string } | null
  profile: { nama: string; role: 'seller' | 'admin' } | null
  pendingCount?: number
}

export function AdminHeader({ user, profile, pendingCount = 0 }: AdminHeaderProps) {
  const router = useRouter()
  const [searchVal, setSearchVal] = useState('')

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!searchVal.trim()) return
    router.push(`/admin/moderasi?q=${encodeURIComponent(searchVal.trim())}`)
  }

  const initials = profile?.nama
    ? profile.nama
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AD'

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200/80 dark:border-neutral-900 transition-colors duration-300">
      {/* Search Input Bar (Donezo style with shortcut hint) */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Cari produk, penjual, daerah, atau kategori..."
          className="w-full h-11 pl-10 pr-12 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="hidden sm:inline-flex items-center rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 dark:text-neutral-500 shadow-xs">
            Enter ↵
          </kbd>
        </div>
      </form>

      {/* Right Controls: Notifications, Links & Admin Profile Card */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Tombol Antrean Moderasi Cepat */}
        <Link
          href="/admin/moderasi"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 shadow-2xs transition-all hover:scale-105"
          title={pendingCount > 0 ? `${pendingCount} produk butuh verifikasi` : 'Semua produk terverifikasi'}
        >
          <Bell className="h-4 w-4" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-neutral-950 animate-pulse">
              {pendingCount}
            </span>
          )}
        </Link>

        {/* Theme Switcher */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>

        {/* Admin Profile Chip (Gaya Donezo) */}
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 py-1.5 pl-2 pr-4 shadow-2xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-bold text-xs shadow-xs">
            {initials}
          </div>
          <div className="text-left hidden xs:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white leading-tight">
                {profile?.nama || 'Administrator'}
              </span>
              <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono leading-tight truncate max-w-[140px]">
              {user?.email || 'admin@lapakkita.id'}
            </p>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Quick Navigation Tabs (Hanya muncul di layar ponsel < md) */}
    <div className="md:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 -mt-2">
      <Link
        href="/admin"
        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shrink-0 shadow-xs"
      >
        Dashboard
      </Link>
      <Link
        href="/admin/moderasi"
        className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0 flex items-center gap-1"
      >
        <span>Moderasi</span>
        {pendingCount > 0 && (
          <span className="rounded-full bg-rose-500 text-white px-1.5 py-0.2 text-[9px] font-bold">
            {pendingCount}
          </span>
        )}
      </Link>
      <Link
        href="/admin/master"
        className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0"
      >
        Master Data
      </Link>
      <Link
        href="/admin/users"
        className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0"
      >
        Pengguna
      </Link>
      <Link
        href="/"
        target="_blank"
        className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 shrink-0 flex items-center gap-1"
      >
        <span>Katalog</span>
        <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
    </>
  )
}
