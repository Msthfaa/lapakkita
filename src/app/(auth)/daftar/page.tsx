import { getRegions } from '@/features/products/queries'
import { RegisterForm } from '@/components/register-form'
import { AuthScenicBackground } from '@/components/auth-scenic-background'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daftar Penjual UMKM - LapakKita',
  description: 'Daftarkan toko dan produk UMKM Anda di LapakKita dengan titik lokasi peta interaktif.',
}

export default async function DaftarPage() {
  const regions = await getRegions().catch(() => [])

  return (
    <AuthScenicBackground>
      <div className="w-full max-w-xl mx-auto relative z-10 px-4 py-8">
        <RegisterForm regions={regions} />
      </div>
    </AuthScenicBackground>
  )
}
