'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Store, ShieldCheck } from 'lucide-react'

// Color Palette Reference:
// #186049 (Deep Pine Forest Green)
// #4A943E (Fresh Leaf Green)
// #D98327 (Warm Terracotta Ochre)
// #ECE8AF (Soft Cream Vanilla)

interface InteractiveLoadingScreenProps {
  context?: 'dashboard' | 'admin' | 'public' | 'general'
  isOverlay?: boolean
  title?: string
  subtitle?: string
}

const CONTEXT_MESSAGES: Record<string, string[]> = {
  dashboard: [
    'Menyiapkan ringkasan penjualan & performa toko...',
    'Menghitung interaksi calon pembeli via WhatsApp...',
    'Memeriksa status kurasi produk jualan Anda...',
    'Menata etalase produk UMKM agar siap dikunjungi...',
    'Hampir siap, menyempurnakan tampilan dashboard!',
  ],
  admin: [
    'Menghubungkan ke Pusat Kendali Administrator...',
    'Mengambil antrean moderasi produk UMKM terbaru...',
    'Menyinkronkan metrik rasio kurasi & direktori penjual...',
    'Memeriksa integritas katalog & master wilayah...',
    'Hampir siap, menyiapkan panel kendali!',
  ],
  public: [
    'Menghubungkan ke ekosistem UMKM LapakKita...',
    'Memuat katalog produk lokal terverifikasi...',
    'Menyiapkan pengalaman belanja lokal yang ramah...',
    'Sedikit lagi, etalase siap dibuka!',
  ],
  general: [
    'Menghubungkan ke ekosistem UMKM LapakKita...',
    'Memuat katalog produk lokal terverifikasi...',
    'Menyiapkan pengalaman belanja lokal yang ramah...',
    'Sedikit lagi, etalase siap dibuka!',
  ],
}

export function InteractiveLoadingScreen({
  context = 'general',
  isOverlay = false,
  title,
  subtitle,
}: InteractiveLoadingScreenProps) {
  const [progress, setProgress] = useState(24)
  const [msgIndex, setMsgIndex] = useState(0)

  const messages = CONTEXT_MESSAGES[context] || CONTEXT_MESSAGES.general

  // Simulasi progress bar cerdas & halus
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        const increment = Math.max(1, Math.floor((96 - prev) / 7))
        return Math.min(95, prev + increment)
      })
    }, 320)
    return () => clearInterval(timer)
  }, [])

  // Rotasi pesan status setiap 2.4 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length)
    }, 2400)
    return () => clearInterval(timer)
  }, [messages.length])

  const defaultTitle =
    context === 'dashboard'
      ? 'Mempersiapkan Toko Anda'
      : context === 'admin'
      ? 'Memuat Panel Administrator'
      : 'Menyiapkan Etalase LapakKita'

  const containerClasses = isOverlay
    ? 'fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAF9F5]/92 dark:bg-[#000000]/95 backdrop-blur-xl p-6 select-none transition-all'
    : 'flex min-h-[60vh] sm:min-h-[70vh] w-full flex-col items-center justify-center p-6 select-none transition-all'

  return (
    <div className={containerClasses}>
      {/* Background Ambient Radial Glow (Soft Pine & Ochre) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 sm:h-96 sm:w-96 rounded-full bg-gradient-to-tr from-[#186049]/15 via-[#4A943E]/10 to-[#D98327]/10 blur-3xl opacity-70 animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        {/* =========================================================
            BRAND EMBLEM (REFINED, MINIMAL, AESTHETIC)
            ========================================================= */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Delicate rotating spinner halo */}
          <div className="absolute -inset-3.5 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="h-28 w-28 sm:h-30 sm:w-30 rounded-full border border-dashed border-[#186049]/25 dark:border-[#4A943E]/40"
            />
          </div>

          {/* Smooth breathing ambient glow */}
          <motion.div
            animate={{ scale: [0.96, 1.05, 0.96], opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-[#186049]/25 via-[#4A943E]/20 to-[#D98327]/15 blur-lg pointer-events-none"
          />

          {/* Center Store Emblem */}
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex h-20 w-20 sm:h-22 sm:w-22 items-center justify-center rounded-2xl bg-gradient-to-br from-[#186049] to-[#257d5a] text-white shadow-xl ring-4 ring-[#186049]/10"
          >
            <Store className="h-9 w-9 text-white stroke-[1.75]" />
          </motion.div>
        </div>

        {/* =========================================================
            BRAND TITLE & DYNAMIC SUBTITLE
            ========================================================= */}
        <div className="space-y-2 mb-6">
          <p className="text-xs sm:text-sm font-serif font-bold tracking-[0.25em] uppercase text-[#186049] dark:text-white">
            LapakKita
          </p>

          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-neutral-900 dark:text-white">
            {title || defaultTitle}
          </h2>

          <div className="h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={subtitle || msgIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-white max-w-sm px-4 truncate"
              >
                {subtitle || messages[msgIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* =========================================================
            MINIMALIST SLEEK SLIM PROGRESS BAR (2.5px)
            ========================================================= */}
        <div className="w-full max-w-xs space-y-2.5">
          <div className="relative h-[2.5px] w-full overflow-hidden rounded-full bg-neutral-200/80 dark:bg-neutral-800">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#186049] via-[#4A943E] to-[#D98327]"
              animate={{
                x: ['-100%', '200%'],
                width: ['30%', '50%', '30%'],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Indikator Status Aman */}
          <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 dark:text-white px-0.5">
            <span className="flex items-center gap-1.5 text-[#186049] dark:text-white">
              <ShieldCheck className="h-3.5 w-3.5 text-[#4A943E] dark:text-white" />
              <span>Sistem Terverifikasi</span>
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-400">
              Sinkronisasi...
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
