'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useSyncExternalStore, MouseEvent } from 'react'

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  if (!mounted) {
    return (
      <div className="h-13 w-13 sm:h-14 sm:w-14 rounded-full glass-btn" aria-hidden="true" />
    )
  }

  const isDark = resolvedTheme === 'dark' || theme === 'dark'

  const toggleTheme = (e: MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? 'light' : 'dark'

    // If View Transitions API is not supported or user prefers reduced motion
    if (
      typeof document === 'undefined' ||
      !('startViewTransition' in document) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setTheme(nextTheme)
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX > 0 ? e.clientX : rect.left + rect.width / 2
    const y = e.clientY > 0 ? e.clientY : rect.top + rect.height / 2

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = (document as unknown as { startViewTransition: (cb: () => Promise<void>) => { ready: Promise<void> } }).startViewTransition(async () => {
      setTheme(nextTheme)
      await new Promise((r) => setTimeout(r, 10))
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 500,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group relative inline-flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full glass-btn cursor-pointer active:scale-90 transition-all duration-300 hover:ring-4 hover:ring-emerald-500/15 dark:hover:ring-amber-400/20"
      aria-label={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
      title={isDark ? 'Mode Terang (Light Mode)' : 'Mode Gelap (Dark Mode)'}
    >
      {/* Sun icon */}
      <Sun
        className={`absolute h-5 w-5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark
            ? 'scale-100 rotate-0 opacity-100 text-amber-400'
            : 'scale-0 -rotate-90 opacity-0 text-amber-500'
        }`}
      />
      {/* Moon icon */}
      <Moon
        className={`absolute h-5 w-5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark
            ? 'scale-0 rotate-90 opacity-0 text-neutral-400'
            : 'scale-100 rotate-0 opacity-100 text-[#186049]'
        }`}
      />
    </button>
  )
}
