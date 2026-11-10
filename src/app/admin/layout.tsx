import { getUserAndProfile } from '@/features/auth/actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, BarChart3, CheckSquare, Layers, Users } from 'lucide-react'

export const metadata = {
  title: 'Admin Panel - LapakKita',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await getUserAndProfile()

  if (!user) {
    redirect('/masuk?redirect=/admin')
  }

  // Cek otorisasi role di level server
  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">Panel Administrator</h1>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Pengelolaan & verifikasi produk UMKM LapakKita
          </p>
        </div>

        {/* Tab Navigasi Admin */}
        <div className="flex items-center gap-2 rounded-lg bg-neutral-100 p-1 self-start">
          <Link
            href="/admin"
            prefetch={true}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-white hover:shadow-xs transition-all"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Ringkasan Statistik
          </Link>
          <Link
            href="/admin/moderasi"
            prefetch={true}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-white hover:shadow-xs transition-all"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            Moderasi Produk
          </Link>
          <Link
            href="/admin/master"
            prefetch={true}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-white hover:shadow-xs transition-all"
          >
            <Layers className="h-3.5 w-3.5" />
            Master Data
          </Link>
          <Link
            href="/admin/users"
            prefetch={true}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-white hover:shadow-xs transition-all"
          >
            <Users className="h-3.5 w-3.5" />
            Pengguna & Penjual
          </Link>
        </div>
      </div>

      <div className="mt-8">{children}</div>
    </div>
  )
}
