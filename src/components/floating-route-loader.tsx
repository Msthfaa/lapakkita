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

      // Jika transisi butuh lebih dari 120ms, tampilkan full interactive overlay
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current)
      overlayTimerRef.current = setTimeout(() => {
        setShowFullOverlay(true)
      }, 120)
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current)
    }
  }, [])

  return (
    <>
      {/* Full-Screen Interactive Overlay saat transisi halaman butuh waktu muat */}
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
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none select-none"
          >
            <div className="flex items-center gap-3 rounded-full bg-[#186049] text-white dark:bg-[#0A1A14] dark:text-[#ECE8AF] border border-[#ECE8AF]/30 dark:border-[#186049]/60 px-4 py-2 shadow-xl backdrop-blur-md">
              {completed ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4A943E] text-white">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              ) : (
                <motion.div
                  animate={{ y: [-2, 2, -2], rotate: [-6, 6, -6] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D98327] text-white shadow-xs"
                >
                  <Store className="h-3.5 w-3.5" />
                </motion.div>
              )}
              <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide">
                <span>{completed ? 'Halaman Siap!' : 'Memuat Data...'}</span>
                {!completed && (
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        className="h-1.5 w-1.5 rounded-full bg-[#ECE8AF]"
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
