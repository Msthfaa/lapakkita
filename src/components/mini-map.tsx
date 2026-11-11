'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapPin, ExternalLink, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MiniMapProps {
  lat?: number | null
  lng?: number | null
  nama?: string
  alamat?: string | null
  daerah?: string | null
  className?: string
  hideHeader?: boolean
}

export function MiniMap({ lat, lng, nama, alamat, daerah, className, hideHeader = false }: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  const hasCoords = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)

  useEffect(() => {
    let isMounted = true

    async function renderMap() {
      if (!hasCoords || !containerRef.current || mapRef.current) return

      const L = (await import('leaflet')).default

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if (!isMounted || !containerRef.current) return

      const map = L.map(containerRef.current, {
        center: [lat!, lng!],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)

      const marker = L.marker([lat!, lng!]).addTo(map)
      if (nama) {
        marker.bindPopup(`<b>${nama}</b><br/>${alamat || daerah || ''}`).openPopup()
      }

      mapRef.current = map

      setTimeout(() => {
        map.invalidateSize()
      }, 200)
    }

    renderMap()

    return () => {
      isMounted = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [lat, lng, hasCoords, nama, alamat, daerah])

  const googleMapsUrl = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${alamat || ''} ${daerah || ''}`.trim() || nama || ''
      )}`

  return (
    <div
      className={`rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md overflow-hidden shadow-xs relative ${className || ''}`}
    >
      {/* Header Info Lokasi (jika tidak di-hide) */}
      {!hideHeader && (
        <div className="p-3.5 bg-neutral-50/70 dark:bg-neutral-800/50 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#186049]/15 text-[#186049] dark:bg-[#186049]/30 dark:text-[#7ed870]">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                Lokasi Toko: {nama || 'Penjual'}
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                {daerah ? `${daerah}${alamat ? ` - ${alamat}` : ''}` : alamat || 'Indonesia'}
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-[11px] font-semibold gap-1 shrink-0 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:text-[#186049] dark:hover:text-white"
          >
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="h-3 w-3 text-[#186049] dark:text-[#4A943E]" />
              Buka di Maps
              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </a>
          </Button>
        </div>
      )}

      {/* Tampilan Peta Mini */}
      {hasCoords ? (
        <div className="relative h-48 w-full bg-neutral-100 dark:bg-neutral-950">
          <div ref={containerRef} className="h-full w-full z-10" />

          {/* Floating link to Google Maps when header is hidden */}
          {hideHeader && (
            <div className="absolute top-2.5 right-2.5 z-20">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-100 hover:text-[#186049] dark:hover:text-emerald-400 shadow-sm border border-neutral-200/80 dark:border-neutral-700 backdrop-blur-xs transition-colors"
              >
                <Navigation className="h-3 w-3 text-[#186049] dark:text-[#4A943E]" />
                <span>Buka di Google Maps</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 text-center bg-neutral-50/50 dark:bg-neutral-900/40 flex flex-col items-center justify-center gap-2 text-neutral-500 dark:text-neutral-400">
          <MapPin className="h-8 w-8 text-neutral-300 dark:text-neutral-700" />
          <p className="text-xs">
            {alamat || daerah ? `${alamat || ''} ${daerah ? `(${daerah})` : ''}` : 'Titik koordinat peta belum diatur oleh penjual.'}
          </p>
          <Button asChild size="sm" variant="ghost" className="text-xs text-[#186049] dark:text-[#7ed870] font-semibold">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              Cari Alamat di Google Maps &rarr;
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
