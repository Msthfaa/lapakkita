'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, ExternalLink, Activity, Sparkles, CheckCircle2 } from 'lucide-react'
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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06241B] via-[#093527] to-[#0D4433] p-5 text-white shadow-md flex flex-col justify-between min-h-[160px] transition-all">
      {/* Title & Live Pulse Indicator */}
      <div className="relative z-10 flex items-center justify-between pb-1">
        <span className="text-xs font-semibold text-emerald-300">
          Status Sistem &amp; Jam
        </span>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-400/30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Online</span>
        </div>
      </div>

      {/* Center Big Digital Timer (Donezo 01:24:08 Replica) */}
      <div className="relative z-10 my-2 text-center">
        <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-wider text-white drop-shadow-md">
          {mounted ? time : '--:--:--'}
        </div>
        <p className="text-[10px] text-emerald-300/80 font-medium mt-0.5">
          Waktu Indonesia Barat (WIB)
        </p>
      </div>

      {/* Footer Controls & Quick Metric (Donezo Circular Buttons Replica) */}
      <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between">
        <div className="text-[11px] text-white/80">
          <strong className="text-emerald-300">{totalWaClicks}</strong> klik WhatsApp etalase
        </div>

        <div className="flex items-center gap-1.5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => window.location.reload()}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            title="Muat Ulang Halaman"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </motion.button>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              href="/"
              target="_blank"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-colors"
              title="Lihat Etalase Publik"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:14px_14px]" />
      <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
    </div>
  )
}
