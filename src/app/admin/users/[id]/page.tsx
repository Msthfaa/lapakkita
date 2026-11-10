import { notFound } from 'next/navigation'
import { getAdminUserDetail } from '@/features/admin/queries'
import { getUserAndProfile } from '@/features/auth/actions'
import { AdminUserDetailView } from '@/components/admin-user-detail-view'

interface AdminUserDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: AdminUserDetailPageProps) {
  const { id } = await params
  const data = await getAdminUserDetail(id)

  if (!data) {
    return { title: 'Pengguna Tidak Ditemukan - LapakKita' }
  }

  return {
    title: `Detail Pengguna: ${data.profile.nama} - Admin LapakKita`,
  }
}

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  const { id } = await params
  const [data, { user }] = await Promise.all([
    getAdminUserDetail(id),
    getUserAndProfile(),
  ])

  if (!data) {
    notFound()
  }

  return (
    <AdminUserDetailView
      user={data.profile}
      products={data.products}
      stats={data.stats}
      currentUserId={user?.id}
    />
  )
}
