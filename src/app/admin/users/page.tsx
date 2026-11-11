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
    <div className="space-y-6 sm:space-y-7 w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Manajemen Pengguna &amp; Penjual UMKM
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Pantau seluruh akun terdaftar, kelola hak akses role, serta pantau dan kelola produk jualan masing-masing mitra.
        </p>
      </div>

      <AdminUserManager users={users} currentUserId={user?.id} />
    </div>
  )
}
