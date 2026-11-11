'use client'

import { useState, useEffect } from 'react'
import { Activity, RotateCcw, ExternalLink, Zap, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

interface AdminSystemPulseProps {
  totalWaClicks: number
  totalProducts: number
}

export function AdminSystemPulse({ totalWaClicks = 0, totalProducts = 0 }: AdminSystemPulseProps) {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06241B] via-[#093527] to-[#0D4433] p-6 text-white shadow-md flex flex-col justify-between min-h-[170px]">
      {/* Title & Live Pulse Indicator */}
      <div className="relative z-10 flex items-center justify-between pb-2">
        <span className="text-xs font-semibold text-emerald-300">
          Status Sistem &amp; Jam
        </span>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-400/30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Online</span>
        </div>
      </div>

      {/* Center Big Digital Timer (Donezo 01:24:08 Replica) */}
      <div className="relative z-10 my-2 text-center">
        <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-wider text-white drop-shadow-md">
          {time || '12:00:00'}
        </div>
        <p className="text-[11px] text-emerald-300/80 font-medium mt-1">
          Waktu Indonesia Barat (WIB)
        </p>
      </div>

      {/* Footer Controls & Quick Metric (Donezo Circular Buttons Replica) */}
      <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between">
        <div className="text-[11px] text-white/80">
          <span className="font-semibold text-emerald-300">{totalWaClicks}</span> klik WhatsApp etalase
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-all hover:scale-110 active:scale-95"
            title="Muat Ulang Halaman"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <Link
            href="/"
            target="_blank"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all hover:scale-110 active:scale-95"
            title="Lihat Etalase Publik"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Background Graphic Lines (Donezo style wavy abstract flow) */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
    </div>
  )
}
