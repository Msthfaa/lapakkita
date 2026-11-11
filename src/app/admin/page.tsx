import { getAdminStats } from '@/features/admin/queries'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Clock, CheckCircle2, XCircle, Users, ArrowRight } from 'lucide-react'

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-8">
      {/* 4 Kartu Statistik */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending */}
        <Card className="border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-300">
              Menunggu Verifikasi
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-950 dark:text-amber-100">{stats.pendingCount}</div>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              Produk baru yang butuh ditinjau
            </p>
          </CardContent>
        </Card>

        {/* Approved */}
        <Card className="border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-300">
              Produk Disetujui
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-950 dark:text-emerald-100">{stats.approvedCount}</div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
              Aktif &amp; tampil di etalase publik
            </p>
          </CardContent>
        </Card>

        {/* Rejected */}
        <Card className="border-rose-200 dark:border-rose-800/60 bg-rose-50/40 dark:bg-rose-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-rose-900 dark:text-rose-300">
              Produk Ditolak
            </CardTitle>
            <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-950 dark:text-rose-100">{stats.rejectedCount}</div>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">
              Menunggu perbaikan dari penjual
            </p>
          </CardContent>
        </Card>

        {/* Sellers */}
        <Link href="/admin/users" className="block group">
          <Card className="border-blue-200 dark:border-blue-800/60 bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-300 group-hover:text-blue-700 dark:group-hover:text-blue-200">
                Total Penjual UMKM
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-950 dark:text-blue-100">{stats.sellersCount}</div>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 flex items-center justify-between">
                <span>Pelaku usaha yang terdaftar</span>
                <span className="font-semibold underline">Kelola &rarr;</span>
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Akses Cepat Moderasi */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Perlu Moderasi Produk?
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Ada {stats.pendingCount} produk pending yang menunggu tindakan persetujuan atau penolakan.
          </p>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white font-medium">
          <Link href="/admin/moderasi">
            Buka Halaman Moderasi
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
