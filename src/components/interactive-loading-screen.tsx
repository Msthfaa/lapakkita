'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heart, Store, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react'

// Color Palette Reference:
// #186049 (Deep Pine Forest Green)
// #4A943E (Fresh Leaf Green)
// #D98327 (Warm Terracotta Ochre)
// #ECE8AF (Soft Cream Vanilla)

interface SparkleParticle {
  id: number
  x: number
  y: number
  label: string
}

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
  general: [
    'Menghubungkan ke ekosistem UMKM LapakKita...',
    'Memuat katalog produk lokal terverifikasi...',
    'Menyiapkan pengalaman belanja lokal yang ramah...',
    'Sedikit lagi, etalase siap dibuka!',
  ],
}

export function InteractiveLoadingScreen({
  context = 'dashboard',
  isOverlay = false,
  title,
  subtitle,
}: InteractiveLoadingScreenProps) {
  const [progress, setProgress] = useState(18)
  const [msgIndex, setMsgIndex] = useState(0)
  const [cheerCount, setCheerCount] = useState(0)
  const [particles, setParticles] = useState<SparkleParticle[]>([])
  const [isBouncing, setIsBouncing] = useState(false)
  const particleIdRef = useRef(0)

  const messages = CONTEXT_MESSAGES[context] || CONTEXT_MESSAGES.general

  // Simulasi progress bar cerdas & halus
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return prev
        const increment = Math.max(1, Math.floor((95 - prev) / 6))
        return Math.min(94, prev + increment)
      })
    }, 350)
    return () => clearInterval(timer)
  }, [])

  // Rotasi pesan status setiap 2 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length)
    }, 2200)
    return () => clearInterval(timer)
  }, [messages.length])

  // Aksi interaktif: User klik/ketuk maskot untuk menyemangati UMKM
  function handleMascotClick(e: React.MouseEvent<HTMLDivElement>) {
    setIsBouncing(true)
    setTimeout(() => setIsBouncing(false), 450)

    setCheerCount((c) => c + 1)

    // Bikin partikel melayang di sekitar posisi klik
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - 20
    const y = e.clientY - rect.top - 20

    const cheerfulLabels = ['✨ +1 Semangat!', '❤️ UMKM Juara!', '🌟 Laris Manis!', '🚀 Mantap!']
    const randomLabel = cheerfulLabels[Math.floor(Math.random() * cheerfulLabels.length)]

    const newParticle: SparkleParticle = {
      id: particleIdRef.current++,
      x,
      y,
      label: randomLabel,
    }

    setParticles((prev) => [...prev.slice(-6), newParticle])

    // Hapus partikel setelah animasinya selesai
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
    }, 1100)
  }

  const containerClasses = isOverlay
    ? 'fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAF9F5]/92 dark:bg-[#040A07]/94 backdrop-blur-xl p-6 select-none transition-all'
    : 'flex min-h-[75vh] w-full flex-col items-center justify-center p-6 select-none transition-all'

  return (
    <div className={containerClasses}>
      {/* Background Ambient Radial Glow (Deep Pine & Warm Ochre) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 sm:h-96 sm:w-96 rounded-full bg-gradient-to-tr from-[#186049]/25 via-[#4A943E]/20 to-[#D98327]/20 blur-3xl opacity-70 animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        {/* =========================================================
            MASKOT INTERAKTIF "SI LAPAK" (BISA DIKLIK OLEH USER)
            ========================================================= */}
        <div className="relative mb-6">
          {/* Partikel Melayang dari Klik Interaktif */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: p.y, x: p.x, scale: 0.8 }}
              animate={{ opacity: 0, y: p.y - 65, x: p.x + (Math.random() * 30 - 15), scale: 1.15 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute z-30 pointer-events-none text-xs font-extrabold text-[#D98327] drop-shadow-md whitespace-nowrap bg-white/90 dark:bg-neutral-900/90 px-2 py-0.5 rounded-full border border-[#D98327]/30 shadow-xs"
            >
              {p.label}
            </motion.div>
          ))}

          {/* Aura Berpendar di Belakang Maskot */}
          <motion.div
            animate={{
              scale: [1, 1.18, 1],
              opacity: [0.35, 0.65, 0.35],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -inset-3 rounded-full bg-gradient-to-tr from-[#186049] via-[#4A943E] to-[#D98327] blur-lg opacity-40 pointer-events-none"
          />

          {/* Kotak Toko Maskot yang Interaktif */}
          <motion.div
            onClick={handleMascotClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            animate={
              isBouncing
                ? {
                    y: [-12, 6, -6, 0],
                    rotate: [0, -8, 8, -4, 0],
                    scale: [1, 1.15, 0.96, 1],
                  }
                : {
                    y: [-6, 3, -6],
                  }
            }
            transition={
              isBouncing
                ? { duration: 0.45, ease: 'easeOut' }
                : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
            }
            className="relative flex h-24 w-24 sm:h-28 sm:w-28 cursor-pointer items-center justify-center rounded-3xl bg-gradient-to-br from-[#186049] via-[#124b39] to-[#0A271E] text-white shadow-xl shadow-[#186049]/35 ring-4 ring-[#ECE8AF]/60 dark:ring-[#4A943E]/40"
            title="Klik maskot untuk menyemangati UMKM!"
          >
            {/* Atap Kanopi Toko Khas UMKM (Ochre & Cream) */}
            <div className="absolute -top-2 flex gap-1 items-center px-2 py-0.5 rounded-full bg-white/90 dark:bg-neutral-900/90 shadow-xs border border-neutral-200/50 dark:border-neutral-800">
              <span className="h-2 w-3 rounded-xs bg-[#D98327]" />
              <span className="h-2 w-3 rounded-xs bg-[#ECE8AF]" />
              <span className="h-2 w-3 rounded-xs bg-[#4A943E]" />
              <span className="h-2 w-3 rounded-xs bg-[#D98327]" />
            </div>

            {/* Wajah Maskot yang Lucu & Ekspresif */}
            <div className="flex flex-col items-center justify-center space-y-1.5 pt-1">
              {/* Mata Berkedip / Ceria */}
              <div className="flex gap-4 items-center">
                <motion.div
                  animate={{ scaleY: [1, 1, 0.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
                  className="h-2.5 w-2.5 rounded-full bg-[#ECE8AF]"
                />
                <motion.div
                  animate={{ scaleY: [1, 1, 0.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
                  className="h-2.5 w-2.5 rounded-full bg-[#ECE8AF]"
                />
              </div>

              {/* Pipi Merona & Senyum */}
              <div className="relative flex items-center justify-center w-8">
                <span className="absolute -left-2 h-1 w-2 rounded-full bg-[#D98327]/80" />
                <motion.div
                  animate={{ scaleX: [1, 1.2, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="h-1.5 w-3.5 rounded-b-full border-b-2 border-white"
                />
                <span className="absolute -right-2 h-1 w-2 rounded-full bg-[#D98327]/80" />
              </div>

              {/* Ikon Mini Toko di Bawah Senyum */}
              <div className="pt-0.5">
                <Store className="h-3.5 w-3.5 text-[#ECE8AF]/80" />
              </div>
            </div>
          </motion.div>

          {/* Hint Klik Interaktif */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#ECE8AF]/60 dark:bg-[#186049]/40 border border-[#186049]/20 px-3 py-1 text-[11px] font-bold text-[#186049] dark:text-white cursor-pointer hover:scale-105 transition-transform"
            onClick={handleMascotClick}
          >
            <Heart className="h-3 w-3 text-[#D98327]" />
            <span>
              {cheerCount === 0
                ? 'Ketuk maskot sambil menunggu!'
                : `Disemangati ${cheerCount}x! Terima kasih ❤️`}
            </span>
          </motion.div>
        </div>

        {/* =========================================================
            JUDUL & TEKS STATUS LOADING DINAMIS
            ========================================================= */}
        <div className="space-y-1.5 mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {title || (context === 'dashboard' ? 'Mempersiapkan Toko Anda' : context === 'admin' ? 'Memuat Panel Admin' : 'Sedang Memuat')}
          </h2>

          <div className="h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 max-w-sm truncate"
              >
                {subtitle || messages[msgIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* =========================================================
            ANIMATED PROGRESS BAR (BRAND 4-COLOR PALETTE GRADIENT)
            ========================================================= */}
        <div className="w-full max-w-xs space-y-2">
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 p-0.5 shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#D98327] via-[#4A943E] to-[#186049] relative"
              initial={{ width: '15%' }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 80 }}
            >
              {/* Kilauan Cahaya Berjalan di Atas Bar */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              />
            </motion.div>
          </div>

          {/* Indikator Persentase & Status Aman */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 px-1">
            <span className="flex items-center gap-1 text-[#186049] dark:text-[#4A943E]">
              <ShieldCheck className="h-3 w-3" />
              <span>Sistem Terverifikasi</span>
            </span>
            <span className="font-mono font-bold text-neutral-700 dark:text-neutral-300">
              {progress}%
            </span>
          </div>
        </div>

        {/* 3 Pill Mini Indikator Fitur */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 px-2.5 py-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 shadow-2xs">
            <Store className="h-3 w-3 text-[#4A943E]" />
            <span>Produk UMKM</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 px-2.5 py-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 shadow-2xs">
            <ShoppingBag className="h-3 w-3 text-[#D98327]" />
            <span>Katalog Lokal</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 px-2.5 py-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 shadow-2xs">
            <ShieldCheck className="h-3 w-3 text-[#186049] dark:text-white" />
            <span>Cepat &amp; Aman</span>
          </div>
        </div>
      </div>
    </div>
  )
}
