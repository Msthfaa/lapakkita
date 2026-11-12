'use client'

import { useState } from 'react'
import { formatTanggal } from '@/lib/format'
import { MiniMap } from '@/components/mini-map'
import {
  FileText,
  FileCheck2,
  Store,
  MapPin,
  Calendar,
  Truck,
  Check,
  ShieldCheck,
  Award,
} from 'lucide-react'

interface ProductTabsProps {
  product: {
    id: string
    nama: string
    deskripsi?: string | null
    no_izin?: string | null
    metode_pengiriman?: string[] | null
    created_at: string
    latitude?: number | null
    longitude?: number | null
    alamat?: string | null
    region?: { id: number; nama: string } | null
    seller?: {
      id: string
      nama: string
      region_id?: number | null
      alamat?: string | null
    } | null
  }
}

const SHIPPING_INFO: Record<string, { label: string; desc: string }> = {
  ambil_di_tempat: {
    label: 'Ambil di Toko',
    desc: 'Bisa ambil langsung ke lokasi toko / alamat penjual',
  },
  cod: {
    label: 'Bayar di Tempat (COD)',
    desc: 'Bayar tunai saat pesanan sampai di tangan pembeli',
  },
  kurir_instan: {
    label: 'Kurir Instan / Sameday',
    desc: 'Pengantaran kilat area lokal via Gojek / Grab / Maxim',
  },
  kurir_ekspedisi: {
    label: 'Kirim Seluruh Indonesia',
    desc: 'Ekspedisi reguler terpercaya (JNE / J&T / SiCepat)',
  },
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'spesifikasi' | 'toko'>('deskripsi')

  // Parse legalitas izin usaha
  const legalitasBadges = product.no_izin
    ? product.no_izin
        .split(/[,;\n]+/)
        .map((item) => item.trim())
        .filter(Boolean)
    : []

  // Bersihkan label (Penjual) agar lebih humanis
  const rawSellerName = product.seller?.nama || 'Penjual LapakKita'
  const cleanSellerName = rawSellerName.replace(/\s*\(Penjual\)\s*/gi, '').trim() || rawSellerName
  const sellerInitial = cleanSellerName.charAt(0).toUpperCase()

  // Ekstrak bullet points dari deskripsi jika ada format baris baru / minus
  const descriptionLines = (product.deskripsi || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  return (
    <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-xs overflow-hidden">
      {/* Tab Navigation Bar (Pill Segmented Control Seperti Gambar Referensi) */}
      <div className="flex border-b border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/40 p-2 sm:p-3 gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('deskripsi')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === 'deskripsi'
              ? 'bg-[#186049] text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Deskripsi Produk</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('spesifikasi')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === 'spesifikasi'
              ? 'bg-[#186049] text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Informasi &amp; Pengiriman</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('toko')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === 'toko'
              ? 'bg-[#186049] text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60'
          }`}
        >
          <Store className="h-4 w-4" />
          <span>Profil &amp; Lokasi Toko</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6 sm:p-8">
        {/* =================================================================== */}
        {/* TAB 1: DESKRIPSI PRODUK                                             */}
        {/* =================================================================== */}
        {activeTab === 'deskripsi' && (
          <div className="space-y-6">
            <div className="prose prose-neutral dark:prose-invert max-w-none text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal whitespace-pre-line">
              {product.deskripsi || 'Tidak ada deskripsi rinci untuk produk ini.'}
            </div>

            {/* Poin Keunggulan Produk (Seperti bullet points pada gambar referensi) */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
              <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-3">
                Keunggulan Produk Ini
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#186049] dark:text-[#4A943E] shrink-0 stroke-[2.5]" />
                  <span>100% Produk UMKM Asli &amp; Terverifikasi</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#186049] dark:text-[#4A943E] shrink-0 stroke-[2.5]" />
                  <span>Kualitas terjamin &amp; diproduksi secara higienis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#186049] dark:text-[#4A943E] shrink-0 stroke-[2.5]" />
                  <span>Transaksi aman langsung dengan pengrajin/penjual</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#186049] dark:text-[#4A943E] shrink-0 stroke-[2.5]" />
                  <span>Bebas biaya perantara atau komisi tambahan</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: INFORMASI & LEGALITAS                                        */}
        {/* =================================================================== */}
        {activeTab === 'spesifikasi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sertifikasi & Izin */}
              <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 p-4 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">
                  <FileCheck2 className="h-4 w-4 text-[#186049] dark:text-[#4A943E]" />
                  <span>Sertifikasi &amp; Izin Edar</span>
                </div>
                {legalitasBadges.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {legalitasBadges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/50 border border-emerald-200/50 dark:border-emerald-800/30 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300"
                      >
                        <Check className="h-3 w-3 stroke-[2.5]" />
                        {badge}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Produk UMKM binaan lokal resmi LapakKita
                  </p>
                )}
              </div>

              {/* Tanggal Pembaruan */}
              <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 p-4 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">
                  <Calendar className="h-4 w-4 text-[#186049] dark:text-[#4A943E]" />
                  <span>Pembaruan Etalase</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  Terakhir diperbarui pada {formatTanggal(product.created_at)}
                </p>
              </div>
            </div>

            {/* Metode Pengiriman */}
            {product.metode_pengiriman && product.metode_pengiriman.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  <Truck className="h-4 w-4 text-[#186049] dark:text-[#4A943E]" />
                  <span>Pilihan Metode Pengiriman yang Didukung:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {product.metode_pengiriman.map((key) => {
                    const info = SHIPPING_INFO[key] || {
                      label: key,
                      desc: 'Bisa didiskusikan langsung dengan penjual',
                    }
                    return (
                      <div
                        key={key}
                        className="rounded-2xl border border-neutral-200/70 dark:border-neutral-700/60 bg-white dark:bg-neutral-800/50 p-3.5 space-y-1"
                      >
                        <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                          {info.label}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                          {info.desc}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: PROFIL & LOKASI TOKO                                         */}
        {/* =================================================================== */}
        {activeTab === 'toko' && (
          <div className="space-y-6">
            {/* Header Profil Penjual */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#186049] to-[#4A943E] text-white font-bold text-lg shadow-2xs">
                  {sellerInitial}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                      {cleanSellerName}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                      <Check className="h-2.5 w-2.5 stroke-[2.5]" /> Terverifikasi
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span>
                      {product.region
                        ? `${product.region.nama}${product.alamat ? ` • ${product.alamat}` : ''}`
                        : product.alamat || 'Indonesia'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="text-xs text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 self-start sm:self-auto">
                Mitra Resmi LapakKita
              </div>
            </div>

            {/* Peta Mini Interaktif OpenStreetMap */}
            <div className="rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800">
              <MiniMap
                lat={product.latitude}
                lng={product.longitude}
                nama={cleanSellerName}
                alamat={product.alamat}
                daerah={product.region?.nama}
                hideHeader={true}
                className="border-0 rounded-none shadow-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
