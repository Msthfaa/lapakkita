import { getAdminUsers } from '@/features/admin/queries'
import { getUserAndProfile } from '@/features/auth/actions'
import { AdminUserManager } from '@/components/admin-user-manager'

export const metadata = {
  title: 'Manajemen Pengguna & Penjual - LapakKita',
}

export default async function AdminUsersPage() {
  const [users, { user }] = await Promise.all([
    getAdminUsers(),
    getUserAndProfile(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">
          Manajemen Pengguna & Penjual UMKM
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Pantau seluruh akun terdaftar, kelola hak akses role, serta pantau dan bersihkan produk jualan masing-masing penjual.
        </p>
      </div>

      <AdminUserManager users={users} currentUserId={user?.id} />
    </div>
  )
}
