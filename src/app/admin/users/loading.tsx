import { CuteLapakLoader } from '@/components/cute-lapak-loader'

export default function UsersLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <CuteLapakLoader
        message="Memuat Direktori Pengguna..."
        subMessage="Sedang mengumpulkan profil penjual UMKM dan status akun..."
      />
    </div>
  )
}
