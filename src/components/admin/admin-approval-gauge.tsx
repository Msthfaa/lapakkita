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
    <div className="rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-5 sm:p-6 shadow-2xs transition-all duration-300 flex flex-col justify-between">
      {/* Title */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Tingkat Kurasi Mutu
          </h3>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
            Rasio produk lolos seleksi
          </p>
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
          <Award className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* SVG Semi-Circle Gauge (Donezo 41% Gauge replica) */}
      <div className="relative flex flex-col items-center justify-center pt-1 pb-1">
        <svg
          viewBox="0 0 190 105"
          className="w-48 max-w-full overflow-visible"
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
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#0B3B2C" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Text inside the Semi Circle */}
        <div className="absolute bottom-0 text-center flex flex-col items-center justify-center">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-none">
            {clampedRate}%
          </span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium mt-1">
            Lolos Seleksi
          </span>
        </div>
      </div>

      {/* Legend Dots (Donezo Style) */}
      <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-around text-[10px]">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0B3B2C] dark:bg-emerald-400" />
          <span className="text-neutral-600 dark:text-neutral-400">
            Setuju ({approvedCount})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span className="text-neutral-600 dark:text-neutral-400">
            Pending ({pendingCount})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span className="text-neutral-600 dark:text-neutral-400">
            Revisi ({rejectedCount})
          </span>
        </div>
      </div>
    </div>
  )
}
