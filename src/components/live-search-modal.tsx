'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search,
  X,
  Store,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  Loader2,
  PackageSearch,
  CornerDownLeft,
  Utensils,
  Coffee,
  Shirt,
  Sparkle,
  Sprout,
  Image as ImageIcon,
} from 'lucide-react'
import { formatRupiah } from '@/lib/format'

interface SearchProduct {
  id: string
  nama: string
  harga: number
  satuan?: string | null
  foto_url?: string | null
  category?: { id: number; nama: string } | null
  seller?: { id: string; nama: string } | null
}

interface LiveSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const POPULAR_SEARCHES = [
  'Sambal Cumi',
  'Kopi Gayo',
  'Keripik Tempe',
  'Batik',
  'Madu Murni',
  'Minuman Herbal',
]

const QUICK_CATEGORIES = [
  { name: 'Makanan', label: 'Makanan & Camilan', icon: Utensils },
  { name: 'Minuman', label: 'Minuman & Kopi', icon: Coffee },
  { name: 'Fashion', label: 'Fashion & Batik', icon: Shirt },
  { name: 'Kerajinan', label: 'Kerajinan Tangan', icon: Sparkle },
  { name: 'Pertanian', label: 'Pertanian & Herbal', icon: Sprout },
]

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <mark
            key={i}
            className="bg-[#ECE8AF] text-[#186049] dark:bg-[#186049]/70 dark:text-[#ECE8AF] font-bold px-1 rounded-sm"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

export function LiveSearchModal({ isOpen, onClose }: LiveSearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<SearchProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(-1)
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setQuery('')
      setProducts([])
      setIsLoading(false)
      setSelectedIndex(-1)
    }
  }, [isOpen])

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Debounced search fetch
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setProducts([])
      setIsLoading(false)
      setSelectedIndex(-1)
      return
    }

    setIsLoading(true)
    const timeoutId = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        })
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
          setSelectedIndex(-1)
        }
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          console.error('Failed to search products:', err)
        }
      } finally {
        setIsLoading(false)
      }
    }, 220)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [query])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (products.length === 0) return
        setSelectedIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0))
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (products.length === 0) return
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1))
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < products.length) {
          const selected = products[selectedIndex]
          router.push(`/produk/${selected.id}`)
          onClose()
        } else if (query.trim()) {
          router.push(`/kategori?q=${encodeURIComponent(query.trim())}`)
          onClose()
        }
      }
    },
    [products, selectedIndex, query, router, onClose]
  )

  // Scroll active item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsContainerRef.current) {
      const activeElement = resultsContainerRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  const handleSelectProduct = (id: string) => {
    router.push(`/produk/${id}`)
    onClose()
  }

  const handleSelectChip = (text: string) => {
    setQuery(text)
    inputRef.current?.focus()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 pointer-events-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Centered Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Pencarian Produk UMKM"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onKeyDown={handleKeyDown}
            className="relative z-10 max-w-xl w-full rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl p-0 overflow-hidden flex flex-col max-h-[82vh]"
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center border-b border-neutral-200/80 dark:border-neutral-800 px-4 py-3.5 bg-neutral-50/70 dark:bg-neutral-900/90">
              <Search className="h-5 w-5 text-neutral-400 dark:text-neutral-500 shrink-0 ml-1" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari produk UMKM, makanan, kerajinan..."
                className="w-full bg-transparent px-3 text-sm sm:text-base text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-hidden"
              />

              <div className="flex items-center gap-1.5 shrink-0">
                {isLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-[#186049] dark:text-[#4A943E]" />
                )}

                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      inputRef.current?.focus()
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Hapus pencarian"
                    aria-label="Hapus pencarian"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={onClose}
                  className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/80 px-2 py-0.5 text-[11px] font-mono font-medium text-neutral-500 dark:text-neutral-400 shadow-2xs hover:bg-neutral-100 transition-colors"
                  title="Tutup (Esc)"
                >
                  ESC
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div
              ref={resultsContainerRef}
              className="overflow-y-auto flex-1 overscroll-contain"
            >
              {/* Default State: When query is empty */}
              {!query.trim() && (
                <div className="p-5 space-y-6">
                  {/* Paling Sering Dicari Chips */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      <TrendingUp className="h-3.5 w-3.5 text-[#186049] dark:text-[#4A943E]" />
                      <span>Paling Sering Dicari</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleSelectChip(chip)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-800/60 hover:bg-[#186049]/10 hover:border-[#186049]/30 dark:hover:bg-[#186049]/30 dark:hover:border-[#186049]/50 hover:text-[#186049] dark:hover:text-white px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-all cursor-pointer active:scale-95"
                        >
                          <Sparkles className="h-3 w-3 text-[#4A943E]" />
                          <span>{chip}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kategori Populer Links */}
                  <div className="space-y-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      <Layers className="h-3.5 w-3.5 text-[#186049] dark:text-[#4A943E]" />
                      <span>Jelajahi Kategori</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {QUICK_CATEGORIES.map((cat) => {
                        const Icon = cat.icon
                        return (
                          <Link
                            key={cat.name}
                            href={`/kategori?q=${encodeURIComponent(cat.name)}`}
                            onClick={onClose}
                            className="group flex items-center justify-between p-2.5 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-800/40 hover:border-[#186049]/40 hover:bg-[#186049]/5 dark:hover:bg-neutral-800 transition-all"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-neutral-800 text-[#186049] dark:text-[#5ebd4f] shadow-2xs group-hover:scale-105 transition-transform">
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate group-hover:text-[#186049] dark:group-hover:text-white">
                                {cat.label}
                              </span>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-[#186049] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Typing State: Results list */}
              {query.trim() && products.length > 0 && (
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 p-2">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Hasil Produk ({products.length})
                  </div>
                  {products.map((product, idx) => {
                    const isSelected = selectedIndex === idx
                    return (
                      <div
                        key={product.id}
                        data-index={idx}
                        onClick={() => handleSelectProduct(product.id)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group flex items-center gap-3.5 p-2.5 rounded-2xl cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-neutral-100 dark:bg-neutral-800/90 text-neutral-900 dark:text-white'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        {/* Thumbnail image 48x48 */}
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200/60 dark:border-neutral-700/60">
                          {product.foto_url ? (
                            <Image
                              src={product.foto_url}
                              alt={product.nama}
                              fill
                              sizes="48px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-neutral-400">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>

                        {/* Title, Category & Seller */}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-semibold truncate leading-tight group-hover:text-[#186049] dark:group-hover:text-white transition-colors">
                            <HighlightedText text={product.nama} query={query} />
                          </h4>

                          <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                            {product.category?.nama && (
                              <span className="inline-flex items-center rounded-md bg-[#ECE8AF]/60 dark:bg-[#186049]/30 text-[#186049] dark:text-[#ECE8AF] border border-[#186049]/15 px-1.5 py-0.2 font-medium text-[10px] truncate max-w-[120px]">
                                {product.category.nama}
                              </span>
                            )}
                            {product.seller?.nama && (
                              <span className="inline-flex items-center gap-1 truncate text-neutral-600 dark:text-neutral-400">
                                <Store className="h-3 w-3 shrink-0 text-neutral-400" />
                                <span className="truncate">{product.seller.nama}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price in Bold Green */}
                        <div className="text-right shrink-0">
                          <div className="text-xs sm:text-sm font-bold text-[#186049] dark:text-[#4A943E]">
                            {formatRupiah(product.harga)}
                          </div>
                          {product.satuan && (
                            <div className="text-[10px] text-neutral-400">/{product.satuan}</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Empty Results State */}
              {query.trim() && !isLoading && products.length === 0 && (
                <div className="py-12 px-6 text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500">
                    <PackageSearch className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      Tidak ditemukan produk untuk &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                      Coba gunakan kata kunci lain yang lebih umum, periksa ejaan, atau jelajahi semua kategori produk UMKM kami.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/kategori"
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#186049] px-4 py-2 text-xs font-semibold text-white hover:bg-[#124b39] transition-all shadow-xs"
                    >
                      <span>Jelajahi Semua Produk di Katalog</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Footer */}
            {query.trim() && products.length > 0 && (
              <div className="p-3 border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/90 flex flex-col sm:flex-row items-center justify-between gap-2">
                <Link
                  href={`/kategori?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#186049] dark:text-[#ECE8AF] hover:underline px-2 py-1"
                >
                  <span>Buka Semua Hasil di Halaman Katalog</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <div className="hidden sm:flex items-center gap-3 text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-1 py-0.5 text-[10px]">↑↓</kbd>
                    Pilih
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-1 py-0.5 text-[10px]">↵</kbd>
                    Buka
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-1 py-0.5 text-[10px]">esc</kbd>
                    Tutup
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
