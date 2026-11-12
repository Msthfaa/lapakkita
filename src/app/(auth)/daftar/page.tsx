import { getRegions } from '@/features/products/queries'
import { RegisterForm } from '@/components/register-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daftar Penjual UMKM - LapakKita',
  description: 'Daftarkan toko dan produk UMKM Anda di LapakKita dengan titik lokasi peta interaktif.',
}

export default async function DaftarPage() {
  const regions = await getRegions().catch(() => [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-start sm:justify-center px-4 pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="my-auto w-full max-w-xl">
        <RegisterForm regions={regions} />
      </div>
    </div>
  )
}
