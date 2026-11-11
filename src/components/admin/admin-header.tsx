'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell, ShieldCheck, CheckSquare, Sparkles, User, ExternalLink, X, ArrowRight } from 'lucide-react'
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
    <>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200/80 dark:border-neutral-900 transition-colors duration-300">
        {/* Bilah Pencarian Cerdas (Scaled up to h-12) */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md lg:max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Cari produk, penjual UMKM, kategori, nomor izin..."
            className="w-full h-12 pl-11 pr-14 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#4A943E]/20 focus:border-[#186049] dark:focus:border-[#4A943E] transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex items-center rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
              ↵ Cari
            </kbd>
          </div>
        </form>

        {/* Kontrol Kanan: Lonceng Notifikasi, Mode Tema, dan Profil Chip */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Lonceng Notifikasi */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 shadow-2xs transition-all hover:scale-105 cursor-pointer"
              title="Notifikasi Antrean Moderasi"
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
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
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
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 py-1.5 pl-2 pr-4 shadow-2xs h-12">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#186049] to-[#4A943E] text-white font-bold text-xs shadow-xs">
              {initials}
            </div>
            <div className="text-left hidden xs:block">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white leading-tight">
                  {profile?.nama || 'Admin'}
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono leading-tight mt-0.5 truncate max-w-[140px]">
                {user?.email || 'admin@lapakkita.id'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigasi Layar Ponsel (< lg) */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar py-2 -mt-3 mb-3">
        <Link
          href="/admin"
          className="px-3.5 py-2 rounded-full text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shrink-0 shadow-xs"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/moderasi"
          className="px-3.5 py-2 rounded-full text-xs font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0 flex items-center gap-1.5"
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
          className="px-3.5 py-2 rounded-full text-xs font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0"
        >
          Master Data
        </Link>
        <Link
          href="/admin/users"
          className="px-3.5 py-2 rounded-full text-xs font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0"
        >
          Pengguna
        </Link>
        <Link
          href="/"
          target="_blank"
          className="px-3.5 py-2 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 shrink-0 flex items-center gap-1.5"
        >
          <span>Katalog</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </>
  )
}
