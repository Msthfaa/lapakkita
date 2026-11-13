'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-11 w-11 rounded-full glass-btn" />
    )
  }

  const isDark = resolvedTheme === 'dark' || theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full glass-btn cursor-pointer active:scale-95 transition-transform"
      aria-label={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
      title={isDark ? 'Mode Terang (Light Mode)' : 'Mode Gelap (Dark Mode)'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45 text-white" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12 text-[#186049]" />
      )}
    </button>
  )
}
