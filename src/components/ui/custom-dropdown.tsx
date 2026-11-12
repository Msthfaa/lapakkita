'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, Check } from 'lucide-react'

export interface DropdownOption {
  id: string | number
  nama: string
}

interface CustomDropdownProps {
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  placeholder: string
  allOptionLabel?: string
  icon?: React.ReactNode
  className?: string
  id?: string
}

export function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
  allOptionLabel = 'Semua',
  icon,
  className = '',
  id,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cari label opsi yang sedang aktif
  const selectedOption = options.find((opt) => String(opt.id) === String(value))
  const displayLabel = selectedOption ? selectedOption.nama : allOptionLabel

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Tutup dropdown saat menekan tombol Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
  }

  const isSelected = Boolean(value)

  return (
    <div ref={dropdownRef} id={id} className={`relative select-none ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-11 w-full items-center justify-between rounded-xl border px-3.5 py-2 text-sm transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'border-[#186049] ring-2 ring-[#186049]/20 bg-white dark:bg-neutral-900 shadow-sm'
            : isSelected
              ? 'border-[#186049]/50 dark:border-white/20 bg-neutral-50/80 dark:bg-neutral-900/80 text-[#186049] dark:text-white font-semibold'
              : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-700'
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {icon && <span className="shrink-0 text-neutral-400 dark:text-neutral-500">{icon}</span>}
          <span className="truncate">{displayLabel}</span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="shrink-0 text-neutral-400 dark:text-neutral-500"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      {/* Floating Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            role="listbox"
            className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-1.5 shadow-2xl max-h-64 overflow-y-auto no-scrollbar sm:no-scrollbar"
          >
            {/* Opsi Reset: Semua */}
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onClick={() => handleSelect('')}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors text-left cursor-pointer mb-1 ${
                !value
                  ? 'bg-[#186049] text-white font-semibold shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-[#186049]/10 dark:hover:bg-white/10 hover:text-[#186049] dark:hover:text-white'
              }`}
            >
              <span>{allOptionLabel}</span>
              {!value && <Check className="h-3.5 w-3.5 shrink-0" />}
            </button>

            {/* List Opsi Dinamis */}
            {options.map((opt) => {
              const active = String(opt.id) === String(value)

              return (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handleSelect(String(opt.id))}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors text-left cursor-pointer ${
                    active
                      ? 'bg-[#186049] text-white font-semibold shadow-xs'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-[#186049]/10 dark:hover:bg-white/10 hover:text-[#186049] dark:hover:text-white'
                  }`}
                >
                  <span className="truncate pr-2">{opt.nama}</span>
                  {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
