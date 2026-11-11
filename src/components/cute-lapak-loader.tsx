'use client'

import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import { Sparkles, Store, CheckCircle2 } from 'lucide-react'

interface CuteLapakLoaderProps {
  message?: string
  subMessage?: string
  size?: 'sm' | 'md' | 'lg'
}

const MESSAGES = [
  'Menyiapkan etalase produk UMKM...',
  'Menghitung statistik & rasio kurasi...',
  'Menyinkronkan data katalog lokal...',
  'Memastikan data aman & terverifikasi...',
]

export function CuteLapakLoader({
  message,
  subMessage,
  size = 'md',
}: CuteLapakLoaderProps) {
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    if (message) return
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % MESSAGES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [message])

  const activeMsg = message || MESSAGES[msgIdx]

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center select-none">
      {/* Container Maskot Bouncing */}
      <div className="relative flex items-center justify-center h-28 w-28">
        {/* Lingkaran Aura Cahaya Hijau Lembut */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute h-24 w-24 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 dark:from-emerald-600 dark:to-teal-500 blur-xl pointer-events-none"
        />

        {/* Bintang-bintang Sparkle Melayang */}
        <motion.div
          animate={{
            y: [-6, 6, -6],
            rotate: [0, 15, -15, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1 -right-1 text-amber-400"
        >
          <Sparkles className="h-5 w-5 fill-amber-300" />
        </motion.div>

        <motion.div
          animate={{
            y: [5, -5, 5],
            rotate: [0, -20, 20, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          className="absolute -bottom-1 -left-2 text-emerald-400"
        >
          <Sparkles className="h-4 w-4 fill-emerald-300" />
        </motion.div>

        {/* Maskot Toko / Kotak UMKM Lucu */}
        <motion.div
          animate={{
            y: [-10, 4, -10],
            scaleY: [1, 0.94, 1.04, 1],
            scaleX: [1, 1.05, 0.97, 1],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-[#0B3B2C] text-white shadow-xl shadow-emerald-700/20 ring-4 ring-white/60 dark:ring-neutral-900"
        >
          {/* Ilustrasi Wajah Lucu pada Box */}
          <div className="relative flex flex-col items-center justify-center space-y-1">
            {/* Atap Toko Mini */}
            <div className="flex gap-1 -mt-1 mb-1">
              <span className="h-1.5 w-3 rounded-full bg-amber-300/90" />
              <span className="h-1.5 w-3 rounded-full bg-white/90" />
              <span className="h-1.5 w-3 rounded-full bg-amber-300/90" />
            </div>

            {/* Mata Berkedip & Senyum */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ duration: 3, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
                className="h-2 w-2 rounded-full bg-white shadow-xs"
              />
              <motion.div
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ duration: 3, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
                className="h-2 w-2 rounded-full bg-white shadow-xs"
              />
            </div>

            {/* Senyum Manis */}
            <div className="h-1.5 w-3.5 border-b-2 border-white rounded-full mt-0.5" />

            {/* Pipi Merona */}
            <div className="absolute -bottom-1 flex justify-between w-9 px-0.5">
              <span className="h-1 w-2 rounded-full bg-rose-300/80 blur-[0.5px]" />
              <span className="h-1 w-2 rounded-full bg-rose-300/80 blur-[0.5px]" />
            </div>
          </div>
        </motion.div>

        {/* Bayangan Dinamis di Bawah Maskot */}
        <motion.div
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-1 h-2.5 w-14 rounded-full bg-neutral-900/20 dark:bg-black/60 blur-xs"
        />
      </div>

      {/* Teks Animasi Berganti Lembut */}
      <div className="mt-5 space-y-1.5 max-w-xs">
        <motion.p
          key={activeMsg}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className="text-sm font-bold text-neutral-800 dark:text-neutral-100"
        >
          {activeMsg}
        </motion.p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
          {subMessage || 'Mohon tunggu sejenak, data sedang diproses...'}
        </p>
      </div>

      {/* Titik Loading Tiga Langkah */}
      <div className="flex items-center gap-1.5 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
            className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"
          />
        ))}
      </div>
    </div>
  )
}
