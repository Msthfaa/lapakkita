'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  Layers,
  Users,
  ExternalLink,
  PlusCircle,
  LogOut,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Store,
} from 'lucide-react'
import { signOutAction } from '@/features/auth/actions'
import { ThemeToggle } from '@/components/theme-toggle'

interface AdminSidebarProps {
  pendingCount?: number
  profileName?: string
}

export function AdminSidebar({ pendingCount = 0, profileName = 'Admin' }: AdminSidebarProps) {
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

  const quickLinks = [
    {
      title: 'Katalog Publik',
      href: '/',
      icon: ExternalLink,
      external: true,
    },
    {
      title: 'Dashboard Penjual',
      href: '/dashboard',
      icon: Store,
      external: false,
    },
    {
      title: 'Tambah Produk Baru',
      href: '/dashboard/produk/baru',
      icon: PlusCircle,
      external: false,
    },
  ]

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between min-h-[calc(100vh-2rem)] rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-5 shadow-xs transition-colors duration-300">
      {/* Brand & Logo */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-sm transition-transform group-hover:scale-105">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-base text-neutral-900 dark:text-white tracking-tight">
                  LapakKita
                </span>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 dark:text-emerald-300">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium -mt-0.5">
                Pusat Kontrol UMKM
              </p>
            </div>
          </Link>
          <div className="sm:hidden">
            <ThemeToggle />
          </div>
        </div>

        {/* Group: MENU UTAMA */}
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Menu Utama
          </p>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const active = isActive(item.href, item.exact)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 ${
                    active
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900/80 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
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
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
                        active
                          ? 'bg-emerald-500 text-white'
                          : item.badgeAlert
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
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

        {/* Group: ETALASE PUBLIK */}
        <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-900">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Akses Platform
          </p>
          <nav className="space-y-1">
            {quickLinks.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  className="flex items-center justify-between rounded-2xl px-3.5 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900/80 hover:text-neutral-900 dark:hover:text-white transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                    <span>{item.title}</span>
                  </div>
                  {item.external && (
                    <ChevronRight className="h-3 w-3 text-neutral-400 dark:text-neutral-600" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Bagian Bawah: Card Bantuan & Logout */}
      <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
        {/* Banner Mini Estetik (Gaya Donezo Mobile Card) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B3B2C] to-[#12533F] p-4 text-white shadow-md">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300 text-[11px] font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Etalase UMKM Aktif</span>
            </div>
            <p className="text-xs text-white/90 font-medium leading-relaxed">
              Dukung pertumbuhan produk lokal binaan.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:scale-105 active:scale-95"
              >
                <span>Kunjungi Web</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
          {/* Subtle abstract curve */}
          <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />
        </div>

        {/* Action Logout */}
        <div className="flex items-center justify-between pt-1">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <form action={signOutAction} className="flex-1 sm:flex-initial">
            <button
              type="submit"
              className="w-full flex items-center justify-center sm:justify-start gap-2 rounded-xl px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar Sesi</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
