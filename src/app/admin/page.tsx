import { getAdminDashboardExtendedData } from '@/features/admin/queries'
import { AdminKpiCards } from '@/components/admin/admin-kpi-cards'
import { AdminWeeklyChart } from '@/components/admin/admin-weekly-chart'
import { AdminApprovalGauge } from '@/components/admin/admin-approval-gauge'
import { AdminRecentSellers } from '@/components/admin/admin-recent-sellers'
import { AdminModerationQuickQueue } from '@/components/admin/admin-moderation-quick-queue'
import { AdminMasterOverview } from '@/components/admin/admin-master-overview'
import { AdminSystemPulse } from '@/components/admin/admin-system-pulse'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckSquare, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Dashboard Admin - LapakKita',
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardExtendedData()

  return (
    <div className="space-y-6 sm:space-y-7 w-full">
      {/* Header Row: Title & Action Tunggal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/70 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Sistem Aktif
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Monitoring kurasi mutu produk, aktivitas moderasi, dan direktori pelaku UMKM binaan.
          </p>
        </div>

        {/* Action Button Pintar */}
        <div className="self-start sm:self-auto">
          {data.stats.pendingCount > 0 ? (
            <Button
              asChild
              className="rounded-full bg-[#0B3B2C] hover:bg-[#0D4433] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 h-11 shadow-sm hover:shadow-md transition-all gap-2"
            >
              <Link href="/admin/moderasi">
                <CheckSquare className="h-4 w-4" />
                <span>Tinjau {data.stats.pendingCount} Produk Pending</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Semua Antrean Bersih &amp; Terverifikasi</span>
            </div>
          )}
        </div>
      </div>

      {/* Row 1: 4 Bento KPI Stats Cards (Full-Width, Scaled Up) */}
      <AdminKpiCards stats={data.stats} />

      {/* 3-Column Bento Layout (Exact Donezo Architectural Replica) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full">
        {/* Kolom 1 (Kiri - 5 Kolom): Grafik Mingguan + Penjual Terbaru */}
        <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
          <AdminWeeklyChart
            data={data.weeklyStats}
            totalModerations={data.stats.totalProductsCount}
          />
          <AdminRecentSellers sellers={data.recentSellers} />
        </div>

        {/* Kolom 2 (Tengah - 4 Kolom): Aksi Prioritas Moderasi + Gauge Tingkat Kurasi */}
        <div className="lg:col-span-4 flex flex-col gap-5 sm:gap-6">
          <AdminModerationQuickQueue
            pendingCount={data.stats.pendingCount}
            pendingProducts={data.pendingProducts}
          />
          <AdminApprovalGauge
            rate={data.stats.approvalRate}
            approvedCount={data.stats.approvedCount}
            pendingCount={data.stats.pendingCount}
            rejectedCount={data.stats.rejectedCount}
          />
        </div>

        {/* Kolom 3 (Kanan - 3 Kolom): Kategori Master Data + Monitor Jam & Pulse */}
        <div className="lg:col-span-3 flex flex-col gap-5 sm:gap-6">
          <AdminMasterOverview categories={data.categoryBreakdown} />
          <AdminSystemPulse
            totalWaClicks={data.stats.totalWaClicks}
            totalProducts={data.stats.totalProductsCount}
          />
        </div>
      </div>
    </div>
  )
}
