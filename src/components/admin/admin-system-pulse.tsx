'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, ExternalLink, Activity, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'motion/react'

interface AdminSystemPulseProps {
  totalWaClicks: number
  totalProducts: number
}

export function AdminSystemPulse({ totalWaClicks = 0, totalProducts = 0 }: AdminSystemPulseProps) {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState<string>('00:00:00')

  useEffect(() => {
    setMounted(true)
    function updateClock() {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      )
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c261e] via-[#134434] to-[#186049] p-6 sm:p-7 text-white shadow-md flex flex-col justify-between min-h-[190px] transition-all">
      {/* Title & Live Pulse Indicator */}
      <div className="relative z-10 flex items-center justify-between pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#ECE8AF]">
          Status Sistem &amp; Jam
        </span>
        <div className="flex items-center gap-2 rounded-full bg-[#4A943E]/25 px-3 py-1 text-xs font-bold text-[#ECE8AF] border border-[#4A943E]/40">
          <span className="h-2 w-2 rounded-full bg-[#4A943E] animate-ping" />
          <span>Live Online</span>
        </div>
      </div>

      {/* Center Big Digital Timer (Donezo Time Tracker Replica) */}
      <div className="relative z-10 my-3 text-center">
        <div className="font-mono text-4xl sm:text-5xl font-black tracking-wider text-white drop-shadow-md">
          {mounted ? time : '--:--:--'}
        </div>
        <p className="text-xs text-[#ECE8AF]/80 font-medium mt-1">
          Waktu Indonesia Barat (WIB) &bull; Sinkron
        </p>
      </div>

      {/* Footer Controls & Quick Metric (Donezo Circular Buttons Replica) */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
        <div className="text-xs sm:text-sm text-white/90">
          <strong className="text-[#ECE8AF] font-bold">{totalWaClicks}</strong> klik WhatsApp etalase
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => window.location.reload()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            title="Muat Ulang Halaman"
          >
            <RotateCcw className="h-4 w-4" />
          </motion.button>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              href="/"
              target="_blank"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4A943E] hover:bg-[#3d7a33] text-white transition-colors"
              title="Lihat Etalase Publik"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#4A943E_1px,transparent_1px)] [background-size:14px_14px]" />
      <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[#4A943E]/20 blur-2xl pointer-events-none" />
    </div>
  )
}
