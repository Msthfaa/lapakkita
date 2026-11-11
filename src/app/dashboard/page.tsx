import { getMyProducts } from '@/features/products/queries'
import { getUserAndProfile } from '@/features/auth/actions'
import { SellerProductItem } from '@/components/seller-product-item'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, PackageOpen, LayoutDashboard, Store, MapPin } from 'lucide-react'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard Penjual - LapakKita',
}

export default async function DashboardPage() {
  const { user, profile } = await getUserAndProfile()
  if (!user) {
    redirect('/masuk?redirect=/dashboard')
  }

  // Admin tidak mengelola produk sendiri, arahkan ke panel admin
  if (profile?.role === 'admin') {
    redirect('/admin')
  }

  const products = await getMyProducts()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-neutral-900">Dashboard Penjual</h1>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Selamat datang, <strong>{profile?.nama || user.email}</strong>! Kelola produk UMKM Anda di sini.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button asChild variant="outline" className="font-medium gap-2">
            <Link href="/dashboard/profil">
              <Store className="h-4 w-4 text-emerald-600" />
              Profil &amp; Lokasi Toko
            </Link>
          </Button>

          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 font-medium gap-2">
            <Link href="/dashboard/produk/baru">
              <PlusCircle className="h-4 w-4" />
              Tambah Produk Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
              <PackageOpen className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-neutral-800">Belum Ada Produk yang Didaftarkan</h2>
            <p className="text-sm text-neutral-500 max-w-md mt-1 mb-6">
              Mulai promosikan produk UMKM Anda sekarang. Setiap produk yang disetujui akan langsung tampil di halaman depan LapakKita.
            </p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/dashboard/produk/baru">
                <PlusCircle className="mr-2 h-4 w-4" /> Pasang Produk Pertama
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-700">
                Semua Produk Saya ({products.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <SellerProductItem key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
