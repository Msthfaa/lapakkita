import { getCategories, getRegions, getMyProductById } from '@/features/products/queries'
import { getUserAndProfile } from '@/features/auth/actions'
import { ProductForm } from '@/components/product-form'
import { redirect, notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Ubah Produk - LapakKita',
}

export default async function UbahProdukPage({ params }: Props) {
  const { id } = await params
  const { user, profile } = await getUserAndProfile()
  if (!user) {
    redirect(`/masuk?redirect=/dashboard/produk/${id}/ubah`)
  }

  // Admin dilarang mengubah produk penjual
  if (profile?.role === 'admin') {
    redirect('/admin')
  }

  const [product, categories, regions] = await Promise.all([
    getMyProductById(id),
    getCategories(),
    getRegions(),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductForm
        categories={categories}
        regions={regions}
        userId={user.id}
        initialData={product}
      />
    </div>
  )
}
