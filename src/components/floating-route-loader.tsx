'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
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
  const watchdogTimerRef = useRef<NodeJS.Timeout | null>(null)
  const completionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const prevPathRef = useRef({ pathname, searchParams: searchParams?.toString() })

  const resetState = useCallback(() => {
    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current)
      overlayTimerRef.current = null
    }
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current)
      watchdogTimerRef.current = null
    }
    if (completionTimerRef.current) {
      clearTimeout(completionTimerRef.current)
      completionTimerRef.current = null
    }
    isNavigatingRef.current = false
    setLoading(false)
    setShowFullOverlay(false)
    setCompleted(false)
  }, [])

  // Ketika rute atau parameter URL berubah, tandai selesai dan fade out
  useEffect(() => {
    const currentSearch = searchParams?.toString()
    const prev = prevPathRef.current
    const hasPathChanged = prev.pathname !== pathname || prev.searchParams !== currentSearch

    // Selalu perbarui prevPathRef dengan nilai rute terkini
    prevPathRef.current = { pathname, searchParams: currentSearch }

    // Hanya picu penyelesaian jika pathname atau searchParams benar-benar berubah
    if (!hasPathChanged) {
      return
    }

    // Bersihkan timer overlay & watchdog segera saat navigasi selesai
    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current)
      overlayTimerRef.current = null
    }
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current)
      watchdogTimerRef.current = null
    }

    if (isNavigatingRef.current) {
      isNavigatingRef.current = false
      setCompleted(true)

      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current)
      }
      completionTimerRef.current = setTimeout(() => {
        setLoading(false)
        setShowFullOverlay(false)
        setCompleted(false)
      }, 350)
    } else {
      // Pastikan overlay dan loader tertutup jika URL telah berubah
      setShowFullOverlay(false)
      setLoading(false)
    }
  }, [pathname, searchParams])

  // Tangani navigasi riwayat browser (back/forward) dan pemulihan bfcache
  useEffect(() => {
    const handlePopState = () => {
      resetState()
    }

    const handlePageShow = () => {
      resetState()
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [resetState])

  // Tangkap klik pada semua tautan navigasi internal (Dashboard, Admin, Katalog, dsb)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // 1. Guard terhadap defaultPrevented (e.g. tabs, modal triggers, dropdown)
      if (e.defaultPrevented) return

      // Abaikan jika bukan klik kiri standar atau ada tombol modifikasi aktif
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
        return
      }

      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const rawHref = target.getAttribute('href')
      if (!rawHref) return

      // Lewati target _blank, download, dan protokol khusus non-HTTP
      if (
        target.target === '_blank' ||
        target.hasAttribute('download') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('javascript:') ||
        rawHref.startsWith('sms:') ||
        rawHref.startsWith('#')
      ) {
        return
      }

      // Resolusi URL untuk verifikasi origin dan kesamaan halaman
      let targetUrl: URL
      try {
        targetUrl = new URL(target.href, window.location.href)
      } catch {
        if (rawHref.startsWith('http://') || rawHref.startsWith('https://')) {
          return
        }
        return
      }

      // Abaikan link eksternal (beda origin)
      if (targetUrl.origin !== window.location.origin) {
        return
      }

      // Abaikan jangkar hashtag (#) atau tautan ke halaman yang persis sama
      if (
        targetUrl.pathname === window.location.pathname &&
        targetUrl.search === window.location.search
      ) {
        return
      }

      // Lewati rute detail produk (/produk/...) sesuai instruksi (tanpa loading)
      if (
        targetUrl.pathname.startsWith('/produk/') ||
        targetUrl.pathname === '/produk' ||
        rawHref.startsWith('/produk/') ||
        rawHref === '/produk'
      ) {
        return
      }

      // Bersihkan timer sebelumnya jika pengguna mengklik link baru
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current)
      if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current)
      if (completionTimerRef.current) clearTimeout(completionTimerRef.current)

      isNavigatingRef.current = true
      setCompleted(false)
      setLoading(true)

      // Deteksi konteks halaman tujuan
      if (targetUrl.pathname.startsWith('/dashboard')) {
        setTargetContext('dashboard')
      } else if (targetUrl.pathname.startsWith('/admin')) {
        setTargetContext('admin')
      } else {
        setTargetContext('general')
      }

      // Jika transisi butuh lebih dari 400ms, tampilkan full interactive overlay yang halus
      overlayTimerRef.current = setTimeout(() => {
        setShowFullOverlay(true)
      }, 400)

      // Watchdog Safety Timer (4,000ms): jika navigasi memakan waktu >4s atau gagal/abort,
      // otomatis paksa dismiss agar user TIDAK PERNAH terjebak secara permanen
      watchdogTimerRef.current = setTimeout(() => {
        resetState()
      }, 4000)
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current)
      if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current)
      if (completionTimerRef.current) clearTimeout(completionTimerRef.current)
    }
  }, [resetState])

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
