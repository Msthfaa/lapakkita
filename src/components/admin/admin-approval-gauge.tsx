'use client'

import { Award } from 'lucide-react'
import { motion } from 'motion/react'

interface AdminApprovalGaugeProps {
  rate: number // percentage (0 - 100)
  approvedCount: number
  pendingCount: number
  rejectedCount: number
}

export function AdminApprovalGauge({
  rate = 100,
  approvedCount = 0,
  pendingCount = 0,
  rejectedCount = 0,
}: AdminApprovalGaugeProps) {
  const r = 76
  const arcLength = Math.PI * r
  const clampedRate = Math.max(0, Math.min(100, rate))
  const strokeDashoffset = arcLength * (1 - clampedRate / 100)

  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-6 sm:p-7 shadow-2xs transition-all duration-300 flex flex-col justify-between">
      {/* Title */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
            Tingkat Kurasi Mutu
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium mt-0.5">
            Rasio persentase produk UMKM lolos seleksi
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
          <Award className="h-4.5 w-4.5" />
        </div>
      </div>

      {/* SVG Semi-Circle Gauge (Donezo 41% Gauge replica - Scaled Up) */}
      <div className="relative flex flex-col items-center justify-center pt-2 pb-2">
        <svg
          viewBox="0 0 190 105"
          className="w-56 sm:w-64 max-w-full overflow-visible"
        >
          {/* Background Track Arc */}
          <path
            d="M 19 95 A 76 76 0 0 1 171 95"
            fill="none"
            stroke="currentColor"
            strokeWidth="18"
            strokeLinecap="round"
            className="text-neutral-100 dark:text-neutral-900"
          />

          {/* Foreground Progress Arc (Rich Forest / Emerald) */}
          <motion.path
            d="M 19 95 A 76 76 0 0 1 171 95"
            fill="none"
            stroke="url(#emeraldGaugeGrad)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          <defs>
            <linearGradient id="emeraldGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A943E" />
              <stop offset="100%" stopColor="#186049" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Text inside the Semi Circle */}
        <div className="absolute bottom-0 text-center flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white leading-none">
            {clampedRate}%
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mt-1.5">
            Lolos Seleksi
          </span>
        </div>
      </div>

      {/* Legend Dots */}
      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-around text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#186049] dark:bg-[#4A943E]" />
          <span className="text-neutral-700 dark:text-neutral-300">
            Setuju ({approvedCount})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#D98327]" />
          <span className="text-neutral-700 dark:text-neutral-300">
            Pending ({pendingCount})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span className="text-neutral-700 dark:text-neutral-300">
            Revisi ({rejectedCount})
          </span>
        </div>
      </div>
    </div>
  )
}
