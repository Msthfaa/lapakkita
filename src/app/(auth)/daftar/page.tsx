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
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <RegisterForm regions={regions} />
    </div>
  )
}
