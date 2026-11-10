import { getCategories, getRegions } from '@/features/products/queries'
import { getUserAndProfile } from '@/features/auth/actions'
import { ProductForm } from '@/components/product-form'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Tambah Produk Baru - LapakKita',
}

export default async function TambahProdukPage() {
  const { user, profile } = await getUserAndProfile()
  if (!user) {
    redirect('/masuk?redirect=/dashboard/produk/baru')
  }

  // Admin dilarang menambah produk
  if (profile?.role === 'admin') {
    redirect('/admin')
  }

  const [categories, regions] = await Promise.all([
    getCategories(),
    getRegions(),
  ])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductForm
        categories={categories}
        regions={regions}
        userId={user.id}
      />
    </div>
  )
}
