import { getMyProducts } from '@/features/products/queries'
import { getUserAndProfile } from '@/features/auth/actions'
import { SellerProductItem } from '@/components/seller-product-item'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, PackageOpen, Store, Package, Eye, MessageCircle, ShieldCheck } from 'lucide-react'
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

  const products = await getMyProducts(user.id)

  // Ringkasan metrik toko
  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.is_active && p.status === 'approved').length
  const totalClicks = products.reduce((acc, p) => acc + (p.total_clicks || 0), 0)
  const pendingProducts = products.filter((p) => p.status === 'pending').length

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 sm:pt-28 pb-12 sm:px-6 lg:px-8 space-y-8">
      {/* Header Utama */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-[#186049]/15 dark:border-[#186049]/30">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium bg-[#186049]/10 dark:bg-[#186049]/25 text-[#186049] dark:text-white border border-[#186049]/30">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4A943E] animate-pulse" />
            LapakKita &bull; Ruang Penjual
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[#186049] dark:text-white">
            Dashboard Penjual
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Selamat datang, <strong className="font-semibold text-neutral-900 dark:text-neutral-100">{profile?.nama || user.email}</strong>. Pantau performa produk dan etalase toko Anda di sini.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            asChild
            variant="outline"
            className="h-10 px-4 text-xs font-medium gap-2 rounded-xl border-[#186049]/25 dark:border-[#186049]/40 bg-white/80 dark:bg-[#0d1612] hover:bg-[#186049]/10 text-[#186049] dark:text-white shadow-2xs"
          >
            <Link href="/dashboard/profil">
              <Store className="h-4 w-4 text-[#4A943E]" />
              Profil &amp; Lokasi Toko
            </Link>
          </Button>

          <Button
            asChild
            className="h-10 px-4 text-xs font-medium gap-2 rounded-xl bg-[#186049] hover:bg-[#124b39] text-[#ECE8AF] border border-[#ECE8AF]/20 shadow-sm active:scale-[0.98] transition-all"
          >
            <Link href="/dashboard/produk/baru">
              <PlusCircle className="h-4 w-4 text-[#D98327]" />
              Tambah Produk Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* Kartu Ringkasan Metrik Toko */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Produk */}
        <div className="rounded-2xl border border-[#186049]/15 dark:border-[#186049]/30 bg-white dark:bg-[#0d1612] p-4 sm:p-5 shadow-2xs transition-all hover:border-[#186049]/40">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-medium">Total Produk</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ECE8AF]/30 dark:bg-[#186049]/30 text-[#186049] dark:text-white">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#186049] dark:text-white">
              {totalProducts}
            </span>
            <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
              Terdaftar di lapak Anda
            </p>
          </div>
        </div>

        {/* Aktif di Etalase */}
        <div className="rounded-2xl border border-[#186049]/15 dark:border-[#186049]/30 bg-white dark:bg-[#0d1612] p-4 sm:p-5 shadow-2xs transition-all hover:border-[#4A943E]/40">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-medium">Aktif di Etalase</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4A943E]/15 text-[#4A943E]">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#4A943E]">
              {activeProducts}
            </span>
            <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
              Siap diorder oleh pembeli
            </p>
          </div>
        </div>

        {/* Klik WhatsApp */}
        <div className="rounded-2xl border border-[#186049]/15 dark:border-[#186049]/30 bg-white dark:bg-[#0d1612] p-4 sm:p-5 shadow-2xs transition-all hover:border-[#186049]/40">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-medium">Interaksi WhatsApp</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4A943E]/15 text-[#4A943E]">
              <MessageCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#186049] dark:text-white">
              {totalClicks}
            </span>
            <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
              Calon pembeli klik chat WA
            </p>
          </div>
        </div>

        {/* Status Moderasi */}
        <div className="rounded-2xl border border-[#186049]/15 dark:border-[#186049]/30 bg-white dark:bg-[#0d1612] p-4 sm:p-5 shadow-2xs transition-all hover:border-[#D98327]/40">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-medium">Status Pengajuan</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D98327]/15 text-[#D98327]">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#D98327]">
              {pendingProducts > 0 ? pendingProducts : '0'}
            </span>
            <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
              {pendingProducts > 0 ? 'Menunggu verifikasi admin' : 'Semua produk telah diproses'}
            </p>
          </div>
        </div>
      </div>

      {/* Daftar Produk */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Koleksi Produk Anda
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400">
              {totalProducts}
            </span>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300/80 dark:border-white/[0.08] bg-white dark:bg-[#111216] p-12 sm:p-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
              <PackageOpen className="h-8 w-8" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Belum Ada Produk yang Didaftarkan
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mt-1 mb-6">
              Mulai pasang produk UMKM Anda sekarang. Setiap produk yang disetujui kurasi akan langsung tayang di katalog utama LapakKita.
            </p>
            <Button asChild className="h-10 px-5 text-xs font-medium gap-2 rounded-xl bg-[#186049] hover:bg-[#124b39] text-[#ECE8AF] border border-[#ECE8AF]/20 shadow-xs">
              <Link href="/dashboard/produk/baru">
                <PlusCircle className="h-4 w-4 text-[#D98327]" /> Pasang Produk Pertama
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <SellerProductItem key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
