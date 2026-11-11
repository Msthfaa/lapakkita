'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Store, MapPin, ArrowRight } from 'lucide-react'
import { formatRupiah } from '@/lib/format'

interface Product {
  id: string
  nama: string
  harga: number
  foto_url: string | null
  is_featured?: boolean
  category?: { nama: string } | null
  region?: { nama: string } | null
  seller?: { nama: string } | null
}

interface HeroCarouselProps {
  products: Product[]
}

// Fallback curated aesthetic images if product doesn't have an image - High Definition (HD)
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=1200&auto=format&fit=crop&q=90',
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&auto=format&fit=crop&q=90',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=90',
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&auto=format&fit=crop&q=90',
  'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=1200&auto=format&fit=crop&q=90',
]

export function HeroCarousel({ products }: HeroCarouselProps) {
  // Ensure we have at least 5 items for the 3D cylinder display
  const items = products.length > 0 ? products : []
  const displayItems =
    items.length < 5 && items.length > 0
      ? [...items, ...items, ...items].slice(0, 7)
      : items

  const [activeIndex, setActiveIndex] = useState(
    displayItems.length > 2 ? 2 : 0
  )
  const [isHovered, setIsHovered] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDeltaX, setTouchDeltaX] = useState(0)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)

  const count = displayItems.length

  const handleNext = useCallback(() => {
    if (count === 0) return
    setActiveIndex((prev) => (prev + 1) % count)
  }, [count])

  const handlePrev = useCallback(() => {
    if (count === 0) return
    setActiveIndex((prev) => (prev - 1 + count) % count)
  }, [count])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  // Auto-advance every 6s when not hovered
  useEffect(() => {
    if (isHovered || count <= 1) return
    const timer = setInterval(() => {
      handleNext()
    }, 6000)
    return () => clearInterval(timer)
  }, [isHovered, count, handleNext])

  if (displayItems.length === 0) {
    return null
  }

  // Calculate 3D transforms for any card relative to activeIndex
  const getCardStyle = (index: number) => {
    let offset = index - activeIndex

    // Wrap around for shortest distance
    if (offset > count / 2) offset -= count
    if (offset < -count / 2) offset += count

    const isCenter = offset === 0
    const absOffset = Math.abs(offset)

    // Visibility: only show offset -2, -1, 0, 1, 2
    if (absOffset > 2) {
      const exitDir = offset > 0 ? 1 : -1
      return {
        transform: `translateX(${exitDir * 500}px) translateZ(-250px) rotateY(${-exitDir * 45}deg) scale(0.6)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none' as const,
      }
    }

    // Responsive position calculation
    let translateX = 0
    let translateZ = 0
    let rotateY = 0
    let scale = 1
    let opacity = 1
    let zIndex = 20

    if (offset === 0) {
      // Center Card - prominent, facing forward
      translateX = 0
      translateZ = 50
      rotateY = 0
      scale = 1.05
      opacity = 1
      zIndex = 30
    } else if (offset === -1) {
      // Near Left Card - angled towards center
      translateX = -200
      translateZ = -40
      rotateY = 22
      scale = 0.92
      opacity = 0.88
      zIndex = 20
    } else if (offset === 1) {
      // Near Right Card - angled towards center
      translateX = 200
      translateZ = -40
      rotateY = -22
      scale = 0.92
      opacity = 0.88
      zIndex = 20
    } else if (offset === -2) {
      // Far Left Card - angled strongly, lower opacity
      translateX = -380
      translateZ = -140
      rotateY = 36
      scale = 0.8
      opacity = 0.45
      zIndex = 10
    } else if (offset === 2) {
      // Far Right Card - angled strongly, lower opacity
      translateX = 380
      translateZ = -140
      rotateY = -36
      scale = 0.8
      opacity = 0.45
      zIndex = 10
    }

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents: 'auto' as const,
      isCenter,
    }
  }

  // Touch and drag handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchDeltaX(0)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const delta = e.touches[0].clientX - touchStartX
    setTouchDeltaX(delta)
  }

  const onTouchEnd = () => {
    if (touchDeltaX > 50) {
      handlePrev()
    } else if (touchDeltaX < -50) {
      handleNext()
    }
    setTouchStartX(null)
    setTouchDeltaX(0)
  }

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    dragStartX.current = e.clientX
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
  }

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const delta = e.clientX - dragStartX.current
    if (delta > 60) {
      handlePrev()
    } else if (delta < -60) {
      handleNext()
    }
    isDragging.current = false
  }

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        isDragging.current = false
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* 3D Curved Cylinder Viewport */}
      <div
        className="relative mx-auto flex h-[420px] sm:h-[460px] md:h-[490px] w-full max-w-6xl items-center justify-center overflow-visible"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {displayItems.map((product, idx) => {
          const style = getCardStyle(idx)
          const isCenter = style.isCenter
          const imageUrl = product.foto_url || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]

          return (
            <div
              key={`${product.id}-${idx}`}
              onClick={() => {
                if (!isCenter) {
                  setActiveIndex(idx)
                }
              }}
              style={{
                transform: style.transform,
                opacity: style.opacity,
                zIndex: style.zIndex,
                pointerEvents: style.pointerEvents,
                transition: 'all 550ms cubic-bezier(0.25, 1, 0.5, 1)',
                willChange: 'transform, opacity',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
              }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer
                w-[220px] sm:w-[260px] md:w-[285px]
                h-[330px] sm:h-[390px] md:h-[425px]
                rounded-[28px] overflow-hidden shadow-2xl
                ${isCenter ? 'ring-1 ring-white/30 dark:ring-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)]' : 'shadow-[0_10px_30px_rgba(0,0,0,0.5)]'}
              `}
            >
              {/* Full bleed card media */}
              <div className="relative h-full w-full bg-neutral-900 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={product.nama}
                  fill
                  priority={isCenter}
                  quality={95}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 650px"
                  className={`object-cover transition-transform duration-700 ${isCenter ? 'scale-100' : 'scale-105'}`}
                />

                {/* Ambient dark gradient overlay - clear on top for crisp HD image presentation */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 via-40% to-transparent pointer-events-none" />

                {/* Subtle top pill for category if available */}
                {product.category && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-block rounded-full bg-[#186049]/80 backdrop-blur-md border border-[#ECE8AF]/30 px-3 py-1 text-[11px] font-medium text-[#ECE8AF] shadow-xs">
                      {product.category.nama}
                    </span>
                  </div>
                )}

                {/* Bottom text in refined serif font */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-center flex flex-col items-center justify-end z-10">
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal leading-snug text-white drop-shadow-md line-clamp-2">
                    {product.nama}
                  </h3>

                  <p className="mt-2 text-sm sm:text-base font-medium text-[#4A943E] dark:text-[#7ed870] drop-shadow">
                    {formatRupiah(product.harga)}
                  </p>

                  {product.seller && (
                    <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-neutral-300">
                      <Store className="h-3 w-3 text-neutral-400" />
                      <span className="truncate max-w-[180px]">{product.seller.nama}</span>
                    </div>
                  )}

                  {/* Active card action button */}
                  {isCenter && (
                    <Link
                      href={`/produk/${product.id}`}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#186049] hover:bg-[#124b39] text-white px-4 py-1.5 text-xs font-semibold shadow-lg transition-all hover:scale-105"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Lihat Produk</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Controls: Left & Right minimalist circular buttons */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Produk Sebelumnya"
          className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md text-neutral-700 dark:text-neutral-300 transition-all hover:border-neutral-400 dark:hover:border-neutral-600 hover:scale-110 active:scale-95 shadow-sm"
        >
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
        </button>

        {/* Minimal dot indicators */}
        <div className="flex items-center gap-1.5">
          {displayItems.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Ke slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-6 bg-[#186049]'
                  : 'w-1.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-[#186049]/60'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Produk Berikutnya"
          className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md text-neutral-700 dark:text-neutral-300 transition-all hover:border-neutral-400 dark:hover:border-neutral-600 hover:scale-110 active:scale-95 shadow-sm"
        >
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  )
}
