import { getStoreProfile } from '@/features/products/queries'
import { ProductCard } from '@/components/product-card'
import { MiniMap } from '@/components/mini-map'
import { buildStoreWhatsappLink } from '@/lib/whatsapp'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowLeft,
  Store,
  MapPin,
  Calendar,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  Package,
  PackageOpen,
  Check,
  ExternalLink,
} from 'lucide-react'

interface StorePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { id } = await params
  const data = await getStoreProfile(id)

  if (!data || !data.profile) {
    return {
      title: 'Toko Tidak Ditemukan - LapakKita',
    }
  }

  const cleanStoreName = data.profile.nama.replace(/\s*\(Penjual\)\s*/gi, '').trim() || data.profile.nama

  return {
    title: `${cleanStoreName} - Profil Toko LapakKita`,
    description: data.profile.deskripsi_toko
      ? data.profile.deskripsi_toko.slice(0, 160)
      : `Kunjungi etalase resmi ${cleanStoreName} di LapakKita. Belanja langsung produk lokal berkualitas dari penjual terpercaya.`,
  }
}

export default async function StoreProfilePage({ params }: StorePageProps) {
  const { id } = await params
  const data = await getStoreProfile(id)

  if (!data || !data.profile) {
    notFound()
  }

  const { profile, products } = data
  const cleanStoreName = profile.nama.replace(/\s*\(Penjual\)\s*/gi, '').trim() || profile.nama
  const storeInitial = cleanStoreName.charAt(0).toUpperCase() || 'T'
  const joinYear = profile.created_at ? new Date(profile.created_at).getFullYear() : 2024

  const waUrl = profile.no_wa
    ? buildStoreWhatsappLink(profile.no_wa, cleanStoreName)
    : null

  const hasCoordinates =
    typeof profile.latitude === 'number' &&
    typeof profile.longitude === 'number' &&
    !isNaN(profile.latitude) &&
    !isNaN(profile.longitude)

  return (
    <div className="min-h-screen pb-24 sm:pb-28">
      {/* 1. Header Banner: Warm Artisan Gradient & Ambient Aura */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#186049]/15 via-[#ECE8AF]/20 to-transparent dark:from-[#186049]/25 dark:via-neutral-900/40 dark:to-transparent pt-20 sm:pt-28 pb-12 sm:pb-16 border-b border-neutral-200/60 dark:border-neutral-800/60">
        {/* Ambient Decorative Blurs */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-96 sm:w-[48rem] rounded-full bg-gradient-to-br from-[#186049]/20 to-[#4A943E]/20 blur-3xl opacity-70 dark:opacity-40" />
        <div className="pointer-events-none absolute top-12 right-10 h-44 w-44 rounded-full bg-[#ECE8AF]/30 dark:bg-[#186049]/20 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Tombol Navigasi Kembali */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/kategori"
              className="inline-flex items-center gap-2 rounded-full glass-btn px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-[#186049] dark:hover:text-white transition-all shadow-xs group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Kembali ke Katalog</span>
            </Link>

            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 bg-white/70 dark:bg-neutral-850/70 border border-neutral-200/60 dark:border-neutral-700/60 px-3 py-1 rounded-full backdrop-blur-xs">
              Profil Toko UMKM
            </span>
          </div>

          {/* Store Identity Card */}
          <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-[#0d1612]/90 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
              {/* Kolom Kiri: Avatar & Identitas */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 min-w-0 flex-1">
                {/* Avatar Box */}
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-[#186049] via-[#257d5a] to-[#4A943E] text-white font-serif text-3xl sm:text-4xl font-bold shadow-md shadow-[#186049]/20">
                  <span>{storeInitial}</span>
                  <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-neutral-900 rounded-full shadow-xs">
                    <Store className="h-4 w-4 text-[#186049] dark:text-[#5ebd4f]" />
                  </div>
                </div>

                {/* Nama Toko & Badges */}
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      UMKM Terverifikasi LapakKita
                    </span>

                    {profile.region && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2.5 py-0.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        <MapPin className="h-3 w-3 text-neutral-500" />
                        {profile.region.nama}
                      </span>
                    )}
                  </div>

                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                    {cleanStoreName}
                  </h1>

                  {profile.alamat && (
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{profile.alamat}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Kolom Kanan: Tombol WhatsApp Toko */}
              {waUrl && (
                <div className="w-full md:w-auto shrink-0 flex flex-col items-stretch md:items-end gap-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#186049] hover:bg-[#124d3a] text-white font-semibold text-sm shadow-md shadow-[#186049]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Hubungi Toko via WhatsApp</span>
                  </a>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 text-center md:text-right">
                    Tanya stok &amp; diskusikan pesanan langsung
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats Pills */}
            <div className="mt-8 pt-6 border-t border-neutral-200/70 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#186049]/10 text-[#186049] dark:bg-[#186049]/25 dark:text-[#7ed870]">
                  <Package className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium">Total Produk Aktif</p>
                  <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    {products.length} Produk
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/25 dark:text-amber-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium">Kota/Daerah Toko</p>
                  <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    {profile.region ? profile.region.nama : 'Indonesia'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/25 dark:text-blue-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium">Tahun Bergabung</p>
                  <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    Mitra Sejak {joinYear}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium">Respon WhatsApp</p>
                  <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    {profile.no_wa ? 'Respon Cepat' : 'Dalam Konfirmasi'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Content Body: Store Story, MiniMap & Products Showcase */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 space-y-10 sm:space-y-14">
        {/* Story & Location Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Store Story / Deskripsi Toko Card */}
          <div className={`${hasCoordinates ? 'lg:col-span-2' : 'lg:col-span-3'} rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur-xs p-6 sm:p-8 space-y-4 shadow-xs`}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#186049]/10 text-[#186049] dark:bg-[#186049]/25 dark:text-[#7ed870]">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50">
                Tentang &amp; Cerita Toko
              </h2>
            </div>

            {profile.deskripsi_toko ? (
              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                {profile.deskripsi_toko}
              </p>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 italic leading-relaxed">
                Toko ini adalah mitra UMKM terverifikasi LapakKita yang berkomitmen menyediakan produk lokal berkualitas tinggi langsung dari produsen ke tangan pembeli dengan harga transparan dan tanpa biaya perantara.
              </p>
            )}

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                <Check className="h-4 w-4" /> Transaksi Langsung ke Pemilik
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                <Check className="h-4 w-4" /> Tanpa Biaya Tambahan
              </span>
            </div>
          </div>

          {/* MiniMap Lokasi Toko */}
          {hasCoordinates && (
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur-xs p-6 sm:p-7 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#186049]/10 text-[#186049] dark:bg-[#186049]/25 dark:text-[#7ed870]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                      Lokasi Toko
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {profile.region?.nama || 'Indonesia'}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${profile.latitude},${profile.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#186049] dark:text-[#7ed870] hover:underline"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800">
                <MiniMap
                  latitude={profile.latitude}
                  longitude={profile.longitude}
                  storeName={cleanStoreName}
                  address={profile.alamat}
                  daerah={profile.region?.nama}
                  hideHeader={true}
                  className="border-0 rounded-none shadow-none"
                />
              </div>

              {profile.alamat && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {profile.alamat}
                </p>
              )}
            </div>
          )}
        </div>

        {/* 3. Store Products Showcase */}
        <section className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200/70 dark:border-neutral-800 pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                  Etalase Produk dari {cleanStoreName}
                </h2>
                <span className="rounded-full bg-[#186049]/10 dark:bg-[#186049]/25 px-2.5 py-0.5 text-xs font-bold text-[#186049] dark:text-[#7ed870]">
                  {products.length}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Seluruh produk aktif yang disiapkan dan dijual langsung oleh pengrajin/penjual ini.
              </p>
            </div>
          </div>

          {/* Grid Produk atau Empty State */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 p-12 sm:p-16 text-center flex flex-col items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                <PackageOpen className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Belum Ada Produk yang Ditampilkan
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
                Toko ini belum menambahkan produk aktif yang dapat dipesan saat ini. Silakan periksa kembali nanti atau hubungi penjual langsung melalui WhatsApp.
              </p>
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#186049] text-white text-xs font-semibold shadow-xs hover:bg-[#124d3a] transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Hubungi Toko via WhatsApp</span>
                </a>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
