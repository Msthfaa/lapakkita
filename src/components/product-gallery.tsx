'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  nama: string
  isFeatured?: boolean
}

export function ProductGallery({ images, nama, isFeatured }: ProductGalleryProps) {
  // Filter out any empty strings
  const validImages = (images || []).filter((img) => Boolean(img && img.trim()))
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Pastikan index valid jika images berubah
  const safeIndex = selectedIndex < validImages.length ? selectedIndex : 0
  const activeImage = validImages[safeIndex]

  function handlePrev() {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1))
  }

  function handleNext() {
    setSelectedIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="flex flex-col gap-3.5">
      {/* Gambar Utama (Aspect Square, Rounded Halus Seperti Gambar Referensi) */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={`${nama} - Foto ${safeIndex + 1}`}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-300 dark:text-neutral-600">
            <ImageIcon className="h-20 w-20 stroke-1" />
            <span className="text-xs text-neutral-400">Tidak ada foto produk</span>
          </div>
        )}

        {/* Badge Produk Pilihan Hijau */}
        {isFeatured && (
          <div className="absolute left-4 top-4 flex items-center rounded-full bg-[#186049] px-3 py-1 text-xs font-semibold text-white shadow-md">
            Produk Pilihan
          </div>
        )}

        {/* Indikator Jumlah Foto */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-xs">
            {safeIndex + 1} / {validImages.length}
          </div>
        )}

        {/* Tombol Navigasi Kiri & Kanan */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto Sebelumnya"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-200 shadow-md backdrop-blur-xs transition hover:bg-white dark:hover:bg-neutral-800 hover:scale-105 active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Foto Berikutnya"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-200 shadow-md backdrop-blur-xs transition hover:bg-white dark:hover:bg-neutral-800 hover:scale-105 active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Baris Thumbnail (Grid sejajar di bawah foto seperti gambar referensi) */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {validImages.slice(0, 4).map((img, idx) => {
            const isActive = idx === safeIndex
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-square w-full overflow-hidden rounded-2xl border-2 transition-all cursor-pointer bg-neutral-100 dark:bg-neutral-900 ${
                  isActive
                    ? 'border-[#186049] dark:border-[#4A943E] ring-2 ring-[#186049]/30 scale-[1.02]'
                    : 'border-neutral-200/80 dark:border-neutral-800 opacity-70 hover:opacity-100 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <Image
                  src={img}
                  alt={`${nama} thumbnail ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 33vw, 120px"
                  className="object-cover"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
