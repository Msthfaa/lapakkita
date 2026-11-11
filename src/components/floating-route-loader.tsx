'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Sparkles, Store } from 'lucide-react'

export function FloatingRouteLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const isNavigatingRef = useRef(false)

  // Ketika rute atau parameter berubah, selesaikan animasi
  useEffect(() => {
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false
      setCompleted(true)
      const timer = setTimeout(() => {
        setLoading(false)
        setCompleted(false)
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [pathname, searchParams])

  // Tangkap klik pada tautan navigasi internal
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href) return

      // Lewati tautan eksternal, tel, mailto, target blank, dll.
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
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none select-none"
        >
          <div className="flex items-center gap-3 rounded-full bg-neutral-900/90 dark:bg-white/95 text-white dark:text-neutral-950 backdrop-blur-md px-4 py-2 shadow-xl ring-1 ring-white/10 dark:ring-black/10">
            {/* Maskot Mini Bouncing */}
            {completed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white"
              >
                <Check className="h-3 w-3 stroke-[3]" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ y: [-2, 2, -2], rotate: [-6, 6, -6] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs"
              >
                <Store className="h-3.5 w-3.5" />
              </motion.div>
            )}

            {/* Label Loading Dinamis */}
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span>{completed ? 'Halaman Siap!' : 'Memuat Data...'}</span>
              {!completed && (
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      className="h-1 w-1 rounded-full bg-emerald-400 dark:bg-emerald-600"
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
