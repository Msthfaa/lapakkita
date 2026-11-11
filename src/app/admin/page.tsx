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
import { CheckSquare, Layers, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Dashboard Admin - LapakKita',
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardExtendedData()

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Title & Quick Actions Row (Donezo Header Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/70 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              Real-time
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Pantau, moderasi, dan kelola ekosistem produk UMKM LapakKita dengan mudah.
          </p>
        </div>

        {/* Action Buttons: Solid Green Pill + Outline Pill */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            asChild
            className="rounded-full bg-[#0B3B2C] hover:bg-[#0D4433] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 h-10 shadow-xs hover:shadow-md transition-all hover:scale-105 active:scale-95 gap-2"
          >
            <Link href="/admin/moderasi">
              <CheckSquare className="h-4 w-4" />
              <span>Moderasi Produk</span>
              {data.stats.pendingCount > 0 && (
                <span className="rounded-full bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2">
                  {data.stats.pendingCount}
                </span>
              )}
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-full border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 font-semibold text-xs px-4 py-2 h-10 shadow-2xs transition-all hover:scale-105 active:scale-95 gap-2"
          >
            <Link href="/admin/master">
              <Layers className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              <span>Kelola Master Data</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Row 1: 4 Bento KPI Stats Cards (with Focal Anchor Forest Green Card) */}
      <AdminKpiCards stats={data.stats} />

      {/* Row 2: Analytics Bar Chart + Prioritas Aksi Cepat + Master Data Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Kolom 1-2: Grafik Batang Mingguan Interaktif (Pill-shaped Bar Chart Donezo) */}
        <div className="lg:col-span-2">
          <AdminWeeklyChart
            data={data.weeklyStats}
            totalModerations={data.stats.totalProductsCount}
          />
        </div>

        {/* Kolom 3: Aksi Prioritas / Reminders (Donezo Meeting Card Replica) */}
        <div className="lg:col-span-1">
          <AdminModerationQuickQueue
            pendingCount={data.stats.pendingCount}
            pendingProducts={data.pendingProducts}
          />
        </div>

        {/* Kolom 4: Kategori Teratas Master Data */}
        <div className="lg:col-span-1">
          <AdminMasterOverview categories={data.categoryBreakdown} />
        </div>
      </div>

      {/* Row 3: Penjual Terbaru + Approval Gauge Meter + System Monitor Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Kolom 1-2: Penjual UMKM Terbaru (Donezo Team Collaboration Replica) */}
        <div className="lg:col-span-2">
          <AdminRecentSellers sellers={data.recentSellers} />
        </div>

        {/* Kolom 3: Gauge Donut Meter Tingkat Kurasi Mutu (Donezo 41% Gauge Replica) */}
        <div className="lg:col-span-1">
          <AdminApprovalGauge
            rate={data.stats.approvalRate}
            approvedCount={data.stats.approvedCount}
            pendingCount={data.stats.pendingCount}
            rejectedCount={data.stats.rejectedCount}
          />
        </div>

        {/* Kolom 4: Monitor Waktu & Server Pulse (Donezo Time Tracker Replica) */}
        <div className="lg:col-span-1">
          <AdminSystemPulse
            totalWaClicks={data.stats.totalWaClicks}
            totalProducts={data.stats.totalProductsCount}
          />
        </div>
      </div>
    </div>
  )
}
