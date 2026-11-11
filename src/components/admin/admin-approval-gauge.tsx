'use client'

import { ShieldCheck, Award } from 'lucide-react'

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
  // SVG Semi-Circle Arc Calculation:
  // Radius r = 80, Circumference of half circle = PI * r ≈ 251.32
  const r = 80
  const arcLength = Math.PI * r
  const clampedRate = Math.max(0, Math.min(100, rate))
  const strokeDashoffset = arcLength * (1 - clampedRate / 100)

  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-6 shadow-2xs transition-all duration-300 flex flex-col justify-between">
      {/* Title */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Tingkat Kurasi Produk
          </h3>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
            Rasio kelayakan & standar etalase
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
          <Award className="h-4 w-4" />
        </div>
      </div>

      {/* SVG Semi-Circle Gauge (Donezo 41% Gauge replica) */}
      <div className="relative flex flex-col items-center justify-center pt-2">
        <svg
          viewBox="0 0 200 115"
          className="w-52 max-w-full overflow-visible"
        >
          {/* Background Track Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="20"
            strokeLinecap="round"
            className="text-neutral-100 dark:text-neutral-900"
          />

          {/* Pending portion accent if any */}
          {pendingCount > 0 && (
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={arcLength}
              strokeDashoffset={arcLength * (1 - Math.min(1, (approvedCount + pendingCount) / Math.max(1, approvedCount + pendingCount + rejectedCount)))}
              className="opacity-40 transition-all duration-1000 ease-out"
            />
          )}

          {/* Foreground Progress Arc (Rich Forest / Emerald) */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#emeraldGaugeGrad)"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />

          <defs>
            <linearGradient id="emeraldGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#0B3B2C" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Text inside the Semi Circle */}
        <div className="absolute bottom-1 text-center flex flex-col items-center justify-center">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-none">
            {clampedRate}%
          </span>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium mt-1">
            Lolos Kurasi
          </span>
        </div>
      </div>

      {/* Legend Dots (Donezo Style) */}
      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-around text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#0B3B2C] dark:bg-emerald-400" />
          <span className="text-neutral-600 dark:text-neutral-400">
            Disetujui ({approvedCount})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span className="text-neutral-600 dark:text-neutral-400">
            Pending ({pendingCount})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span className="text-neutral-600 dark:text-neutral-400">
            Revisi ({rejectedCount})
          </span>
        </div>
      </div>
    </div>
  )
}
