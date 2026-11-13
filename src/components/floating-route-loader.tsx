'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Store } from 'lucide-react'

export function FloatingRouteLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  const isNavigatingRef = useRef(false)
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Ketika rute atau parameter URL berubah, tandai selesai dan fade out
  useEffect(() => {
    if (isNavigatingRef.current || loading) {
      isNavigatingRef.current = false
      setCompleted(true)

      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current)
      }

      const timer = setTimeout(() => {
        setLoading(false)
        setCompleted(false)
      }, 450)

      return () => clearTimeout(timer)
    }
  }, [pathname, searchParams])

  // Tangkap klik pada tautan internal untuk menampilkan indikator kecil
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

      // Lewati rute detail produk (/produk/...) sesuai instruksi
      if (href.startsWith('/produk/') || href === '/produk') {
        return
      }

      isNavigatingRef.current = true
      setCompleted(false)
      setLoading(true)

      // Safety timeout: jika dalam 2.5 detik navigasi selesai atau terhambat, otomatis sembunyikan
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current)
      safetyTimeoutRef.current = setTimeout(() => {
        setLoading(false)
        setCompleted(false)
        isNavigatingRef.current = false
      }, 2500)
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current)
    }
  }, [])

  return (
    <AnimatePresence>
      {loading && (
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
  )
}
