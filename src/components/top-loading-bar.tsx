'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * TopLoadingBar - Memberikan umpan balik visual instan (0ms) ala SPA setiap kali pengguna
 * mengklik tautan navigasi, berpindah halaman, atau memuat data baru.
 */
export function TopLoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const isNavigatingRef = useRef(false)

  // Ketika rute atau searchParams selesai berubah, selesaikan progress bar
  useEffect(() => {
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false
      const finishTimer = setTimeout(() => {
        setProgress(100)
        const hideTimer = setTimeout(() => {
          setLoading(false)
          setProgress(0)
        }, 300)
        return () => clearTimeout(hideTimer)
      }, 0)

      return () => clearTimeout(finishTimer)
    }
  }, [pathname, searchParams])

  // Tangkap klik pada tautan internal untuk memicu progress bar seketika
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href) return

      // Lewati tautan eksternal, hash link, target blank, download, atau klik dengan tombol modifier
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

      // Jangan picu jika tautan sama persis dengan halaman saat ini
      const currentUrl = window.location.pathname + window.location.search
      if (href === currentUrl) return

      isNavigatingRef.current = true
      setLoading(true)
      setProgress(25)

      // Animasikan progress bertahap sambil menunggu server merespons
      const t1 = setTimeout(() => setProgress(55), 150)
      const t2 = setTimeout(() => setProgress(80), 450)
      const t3 = setTimeout(() => setProgress(92), 1000)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  if (!loading && progress === 0) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-9999 h-[3px] bg-transparent"
    >
      <div
        className="h-full bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transitionProperty: 'width, opacity',
        }}
      />
    </div>
  )
}
