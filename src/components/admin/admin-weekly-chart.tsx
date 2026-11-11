'use client'

import { useState } from 'react'
import { Calendar, TrendingUp, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

interface DayStat {
  day: string
  label: string
  count: number
  percentage: number
  isToday: boolean
}

interface AdminWeeklyChartProps {
  data: DayStat[]
  totalModerations?: number
}

export function AdminWeeklyChart({ data, totalModerations = 0 }: AdminWeeklyChartProps) {
  const defaultIdx = data.findIndex((d) => d.isToday) !== -1
    ? data.findIndex((d) => d.isToday)
    : 3

  const [activeIdx, setActiveIdx] = useState<number>(defaultIdx >= 0 ? defaultIdx : 0)

  const activeItem = data[activeIdx] || data[0]

  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-900 p-6 sm:p-7 shadow-2xs transition-all duration-300 flex flex-col justify-between">
      {/* Header Card */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
            Aktivitas Mingguan
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium mt-0.5">
            Frekuensi produk masuk &amp; verifikasi sistem
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>7 Hari Terakhir</span>
        </div>
      </div>

      {/* Pill Bars Area (Donezo Style with Motion Springs - Scaled Up) */}
      <div className="relative pt-8 pb-3">
        <div className="flex items-end justify-between gap-3 sm:gap-4 h-48 px-1">
          {data.map((item, idx) => {
            const isActive = idx === activeIdx
            const heightPercent = Math.max(18, item.percentage)

            return (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative"
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setActiveIdx(idx)}
              >
                {/* Active Tooltip Pill on top */}
                {isActive && (
                  <motion.div
                    layoutId="chartTooltip"
                    className="absolute -top-9 z-20 flex flex-col items-center"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  >
                    <span className="rounded-full bg-neutral-950 dark:bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg whitespace-nowrap">
                      {item.count > 0 ? `${item.count} Produk` : `${item.percentage}%`}
                    </span>
                    <span className="h-1.5 w-1.5 -mt-0.5 rotate-45 bg-neutral-950 dark:bg-emerald-500" />
                  </motion.div>
                )}

                {/* Pill-shaped Bar */}
                <div className="relative w-full max-w-[42px] h-40 flex items-end justify-center">
                  <motion.div
                    initial={{ height: '0%' }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200, delay: idx * 0.05 }}
                    className={`w-full rounded-full transition-colors duration-200 flex items-center justify-center ${
                      isActive
                        ? 'bg-gradient-to-t from-emerald-700 via-emerald-600 to-emerald-400 shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/30'
                        : item.isToday
                        ? 'bg-emerald-800/80 dark:bg-emerald-950/80 border border-emerald-600/40'
                        : 'bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-800'
                    }`}
                  >
                    {!isActive && !item.isToday && (
                      <div className="w-full h-full rounded-full opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,currentColor_2px,currentColor_3px)] text-neutral-400" />
                    )}
                  </motion.div>
                </div>

                {/* Day Letter */}
                <span
                  className={`text-xs font-semibold transition-colors mt-0.5 ${
                    isActive
                      ? 'font-bold text-emerald-600 dark:text-emerald-400'
                      : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Insight */}
      <div className="mt-2 pt-3.5 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <span>Fokus: <strong className="text-neutral-900 dark:text-white font-semibold">{activeItem.label}</strong></span>
        </div>
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          {activeItem.count} item tercatat
        </span>
      </div>
    </div>
  )
}
