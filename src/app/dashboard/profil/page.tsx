import { getUserAndProfile } from '@/features/auth/actions'
import { getRegions } from '@/features/products/queries'
import { SellerProfileForm } from '@/components/seller-profile-form'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Profil & Lokasi Toko - LapakKita',
  description: 'Kelola data identitas toko dan titik lokasi peta GPS UMKM Anda di LapakKita.',
}

export default async function ProfilTokoPage() {
  const { user, profile } = await getUserAndProfile()
  if (!user || !profile) {
    redirect('/masuk?redirect=/dashboard/profil')
  }

  if (profile.role === 'admin') {
    redirect('/admin')
  }

  const regions = await getRegions().catch(() => [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <SellerProfileForm initialProfile={profile} regions={regions} />
    </div>
  )
}
