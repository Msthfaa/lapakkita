'use client'

import { useEffect, useRef } from 'react'
import type { Map as LeafletMap } from 'leaflet'
import { MapPin, ExternalLink, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MiniMapProps {
  lat?: number | null
  lng?: number | null
  nama?: string
  alamat?: string | null
  daerah?: string | null
  className?: string
}

export function MiniMap({ lat, lng, nama, alamat, daerah, className }: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)

  const hasCoords = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)

  useEffect(() => {
    let isMounted = true

    async function renderMap() {
      if (!hasCoords || !containerRef.current || mapRef.current) return

      const L = (await import('leaflet')).default

      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
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
    <div className={`rounded-xl border border-[#186049]/15 dark:border-[#186049]/30 bg-white dark:bg-[#0d1612] overflow-hidden shadow-xs ${className || ''}`}>
      {/* Header Info Lokasi */}
      <div className="p-3 bg-[#186049]/10 dark:bg-[#186049]/20 border-b border-[#186049]/15 dark:border-[#186049]/30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#186049]/20 text-[#186049] dark:text-[#ECE8AF]">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
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
          className="h-7 px-2.5 text-[11px] font-medium gap-1 shrink-0 bg-white dark:bg-[#0f1915] border-[#186049]/25 hover:bg-[#186049]/10 text-[#186049] dark:text-[#ECE8AF]"
        >
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-3 w-3 text-[#4A943E]" />
            Buka di Maps
            <ExternalLink className="h-2.5 w-2.5 opacity-60" />
          </a>
        </Button>
      </div>

      {/* Tampilan Peta Mini */}
      {hasCoords ? (
        <div className="relative h-44 w-full bg-neutral-100 dark:bg-neutral-950">
          <div ref={containerRef} className="h-full w-full z-10" />
        </div>
      ) : (
        <div className="p-6 text-center bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col items-center justify-center gap-2 text-neutral-500 dark:text-neutral-400">
          <MapPin className="h-8 w-8 text-neutral-300 dark:text-neutral-600" />
          <p className="text-xs">
            {alamat || daerah ? `${alamat || ''} ${daerah ? `(${daerah})` : ''}` : 'Titik koordinat peta belum diatur oleh penjual.'}
          </p>
          <Button asChild size="sm" variant="ghost" className="text-xs text-emerald-700 dark:text-emerald-400">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              Cari Alamat di Google Maps &rarr;
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
