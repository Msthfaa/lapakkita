import { getUserAndProfile } from '@/features/auth/actions'
import { getAdminStats } from '@/features/admin/queries'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export const metadata = {
  title: 'Panel Administrator - LapakKita',
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

  const stats = await getAdminStats()

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#070A08] transition-colors duration-300">
      <div className="mx-auto max-w-[1560px] p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        {/* Desktop Sidebar (Donezo style) */}
        <div className="hidden md:block sticky top-8 self-start">
          <AdminSidebar pendingCount={stats.pendingCount} profileName={profile.nama} />
        </div>

        {/* Main Workspace Area */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          <AdminHeader user={user} profile={profile} pendingCount={stats.pendingCount} />
          <main className="w-full">{children}</main>
        </div>
      </div>
    </div>
  )
}
