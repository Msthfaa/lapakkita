'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  Layers,
  Users,
  Menu,
  X,
  ExternalLink,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { signOutAction } from '@/features/auth/actions'

interface AdminBottomNavProps {
  pendingCount?: number
  profileName?: string
  userEmail?: string
}

export function AdminBottomNav({
  pendingCount = 0,
  profileName,
  userEmail,
}: AdminBottomNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Tutup drawer secara otomatis saat rute berpindah
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Cegah scroll saat drawer terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
      badge: 0,
    },
    {
      label: 'Moderasi',
      href: '/admin/moderasi',
      icon: CheckSquare,
      exact: false,
      badge: pendingCount,
    },
    {
      label: 'Master',
      href: '/admin/master',
      icon: Layers,
      exact: false,
      badge: 0,
    },
    {
      label: 'Pengguna',
      href: '/admin/users',
      icon: Users,
      exact: false,
      badge: 0,
    },
  ]

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const initials = profileName
    ? profileName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AD'

  return (
    <>
      {/* Sticky Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Navigasi Bawah Admin"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-200/80 dark:border-neutral-800/80 px-2 py-1.5 shadow-lg select-none"
      >
        <div className="grid grid-cols-5 items-center gap-1 max-w-lg mx-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 ${
                  active
                    ? 'text-[#186049] dark:text-[#4A943E] font-bold bg-[#186049]/10 dark:bg-white/10'
                    : 'text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-neutral-950 animate-pulse">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] sm:text-[11px] mt-0.5 truncate max-w-full">
                  {item.label}
                </span>
              </Link>
            )
          })}

          {/* Tombol Menu Lainnya */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label="Buka Menu Lainnya"
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
              isOpen
                ? 'text-[#186049] dark:text-[#4A943E] font-bold bg-[#186049]/10 dark:bg-white/10'
                : 'text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <div className="relative">
              <Menu className="h-5 w-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] mt-0.5">Lainnya</span>
          </button>
        </div>
      </nav>

      {/* Admin Mobile Drawer (Slide-up Bottom Sheet) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-neutral-950 rounded-t-3xl border-t border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-250">
            {/* Handle Drag Bar */}
            <div className="w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-5" />

            {/* Header: Admin Info */}
            <div className="flex items-center justify-between pb-5 border-b border-neutral-100 dark:border-neutral-900">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#186049] to-[#4A943E] text-white font-bold text-sm shadow-xs shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                      {profileName || 'Administrator'}
                    </span>
                    <span className="rounded-md bg-[#ECE8AF] dark:bg-[#186049]/80 border border-[#186049]/20 dark:border-[#4A943E]/40 px-2 py-0.5 text-[10px] font-bold text-[#186049] dark:text-white shrink-0">
                      Administrator
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 font-mono truncate mt-0.5">
                    {userEmail || 'admin@lapakkita.id'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                aria-label="Tutup Menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="py-5 space-y-3">
              {/* Quick action 1: Buka Etalase Publik LapakKita */}
              <Link
                href="/"
                target="_blank"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between w-full p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#186049]/10 dark:bg-[#4A943E]/20 text-[#186049] dark:text-[#4A943E] group-hover:scale-105 transition-transform">
                    <ExternalLink className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Buka Etalase Publik LapakKita
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Lihat tampilan etalase produk UMKM publik
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Quick action 2: Sign Out */}
              <form action={signOutAction} className="w-full pt-1">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2.5 w-full p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-semibold text-sm hover:bg-rose-100/80 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Keluar Sesi Administrator</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
