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
    <div className="space-y-5 sm:space-y-6">
      {/* Header Row: Title & Action Tunggal Tanpa Duplikasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/70 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
              <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              Live Online
            </span>
          </div>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            Monitoring metrik kurasi mutu, performa etalase, dan direktori penjual UMKM.
          </p>
        </div>

        {/* Action Button Tunggal (Hanya muncul jika butuh tindakan moderasi) */}
        <div className="self-start sm:self-auto">
          {data.stats.pendingCount > 0 ? (
            <Button
              asChild
              className="rounded-full bg-[#0B3B2C] hover:bg-[#0D4433] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 h-9 shadow-xs hover:shadow-md transition-all gap-2"
            >
              <Link href="/admin/moderasi">
                <CheckSquare className="h-3.5 w-3.5" />
                <span>Tinjau {data.stats.pendingCount} Produk Pending</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Semua Antrean Bersih &amp; Terverifikasi</span>
            </div>
          )}
        </div>
      </div>

      {/* Row 1: 4 Bento KPI Stats Cards (with Focal Anchor Forest Green Card) */}
      <AdminKpiCards stats={data.stats} />

      {/* Row 2: Analytics Bar Chart + Prioritas Aksi Cepat + Master Data Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5">
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5">
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
