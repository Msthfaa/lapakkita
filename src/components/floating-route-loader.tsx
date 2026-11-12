'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { InteractiveLoadingScreen } from '@/components/interactive-loading-screen'
import { Check, Store } from 'lucide-react'

export function FloatingRouteLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showFullOverlay, setShowFullOverlay] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [targetContext, setTargetContext] = useState<'dashboard' | 'admin' | 'general'>('general')

  const isNavigatingRef = useRef(false)
  const overlayTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Ketika rute atau parameter URL berubah, tandai selesai dan fade out
  useEffect(() => {
    if (isNavigatingRef.current || loading) {
      isNavigatingRef.current = false
      setCompleted(true)

      const timer = setTimeout(() => {
        setLoading(false)
        setShowFullOverlay(false)
        setCompleted(false)
      }, 350)

      return () => clearTimeout(timer)
    }
  }, [pathname, searchParams, loading])

  // Tangkap klik pada semua tautan navigasi internal (Dashboard, Admin, Katalog, dsb)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href) return

      // Lewati tautan eksternal, tel, mailto, target blank, jangkar hashtag, dsb
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        target.target === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return
      }

      const currentUrl = window.location.pathname + window.location.search
      if (href === currentUrl) return

      isNavigatingRef.current = true
      setCompleted(false)
      setLoading(true)

      // Deteksi konteks halaman tujuan
      if (href.startsWith('/dashboard')) {
        setTargetContext('dashboard')
      } else if (href.startsWith('/admin')) {
        setTargetContext('admin')
      } else {
        setTargetContext('general')
      }

      // Jika transisi butuh lebih dari 400ms, tampilkan full interactive overlay yang halus
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current)
      overlayTimerRef.current = setTimeout(() => {
        setShowFullOverlay(true)
      }, 400)
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current)
    }
  }, [])

  return (
    <>
      {/* Full-Screen Interactive Overlay saat transisi halaman butuh waktu muat >400ms */}
      <AnimatePresence>
        {showFullOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[99999]"
          >
            <InteractiveLoadingScreen
              isOverlay
              context={targetContext}
              title={
                targetContext === 'dashboard'
                  ? 'Membuka Dashboard Toko'
                  : targetContext === 'admin'
                  ? 'Membuka Panel Administrator'
                  : 'Menyiapkan Halaman LapakKita'
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pill Mini Indikator Transisi Cepat di Bagian Bawah */}
      <AnimatePresence>
        {loading && !showFullOverlay && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none select-none"
          >
            <div className="flex items-center gap-2.5 rounded-full bg-[#186049] text-white dark:bg-[#101814] dark:text-white border border-white/20 dark:border-white/15 px-3.5 py-1.5 shadow-2xl backdrop-blur-md">
              {completed ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4A943E] text-white">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </div>
              ) : (
                <div className="relative flex h-5 w-5 items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-2 border-white/25 border-t-white"
                  />
                  <Store className="h-2.5 w-2.5 text-white" />
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-white dark:text-white">
                <span>{completed ? 'Halaman Siap' : 'Memuat data...'}</span>
                {!completed && (
                  <div className="flex items-center gap-1 ml-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        className="h-1 w-1 rounded-full bg-white dark:bg-white"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
