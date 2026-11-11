'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  Layers,
  Users,
  ExternalLink,
  LogOut,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import { signOutAction } from '@/features/auth/actions'

interface AdminSidebarProps {
  pendingCount?: number
  profileName?: string
}

export function AdminSidebar({ pendingCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname()

  const mainNav = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
      badge: null,
    },
    {
      title: 'Moderasi Produk',
      href: '/admin/moderasi',
      icon: CheckSquare,
      exact: false,
      badge: pendingCount > 0 ? `${pendingCount}` : null,
      badgeAlert: pendingCount > 0,
    },
    {
      title: 'Master Data',
      href: '/admin/master',
      icon: Layers,
      exact: false,
      badge: null,
    },
    {
      title: 'Pengguna & Penjual',
      href: '/admin/users',
      icon: Users,
      exact: false,
      badge: null,
    },
  ]

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-60 shrink-0 flex flex-col justify-between min-h-[calc(100vh-3rem)] rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-4 shadow-xs transition-colors duration-300">
      {/* Brand & Menu */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-2 pt-1">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-xs transition-transform group-hover:scale-105">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-base text-neutral-900 dark:text-white tracking-tight">
                  LapakKita
                </span>
                <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 dark:text-emerald-300">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                Pusat Kontrol Ekosistem
              </p>
            </div>
          </Link>
        </div>

        {/* Menu Utama Navigasi */}
        <div className="space-y-1">
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Navigasi Utama
          </p>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const active = isActive(item.href, item.exact)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-medium transition-all duration-200 ${
                    active
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                        active
                          ? 'text-emerald-400 dark:text-emerald-600'
                          : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'
                      }`}
                    />
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        active
                          ? 'bg-emerald-500 text-white'
                          : item.badgeAlert
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Akses Cepat Etalase Publik */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900">
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Akses Publik
          </p>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-all duration-200"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Lihat Katalog Publik</span>
            </div>
            <ChevronRight className="h-3 w-3 text-neutral-400" />
          </Link>
        </div>
      </div>

      {/* Bagian Bawah: Card Info Singkat & Logout */}
      <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-900">
        {/* Banner Mini Estetik */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B3B2C] to-[#12533F] p-3.5 text-white shadow-xs">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300 text-[10px] font-semibold">
              <Sparkles className="h-3 w-3" />
              <span>Sistem Terverifikasi</span>
            </div>
            <p className="text-[11px] text-white/90 leading-tight">
              Kurasi mutu produk UMKM terstandarisasi.
            </p>
          </div>
          <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-emerald-400/20 blur-md pointer-events-none" />
        </div>

        {/* Logout Sesi */}
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar Sesi Admin</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
