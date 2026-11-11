'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapPin, Navigation, Search, Loader2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface LocationMapPickerProps {
  initialLat?: number | null
  initialLng?: number | null
  initialAddress?: string | null
  onLocationSelect: (loc: { lat: number; lng: number; address?: string }) => void
}

// Default center: Indonesia (Surabaya/Jawa Timur)
const DEFAULT_LAT = -7.2575
const DEFAULT_LNG = 112.7521

export function LocationMapPicker({
  initialLat,
  initialLng,
  initialAddress,
  onLocationSelect,
}: LocationMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  const [lat, setLat] = useState<number>(initialLat ?? DEFAULT_LAT)
  const [lng, setLng] = useState<number>(initialLng ?? DEFAULT_LNG)
  const [hasMarker, setHasMarker] = useState<boolean>(Boolean(initialLat && initialLng))
  const [isLocating, setIsLocating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    let isMounted = true

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return

      const L = (await import('leaflet')).default

      // Fix ikon default Leaflet agar tampil dengan benar di Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if (!isMounted || !mapContainerRef.current) return

      const initialZoom = initialLat && initialLng ? 15 : 11
      const startLat = initialLat ?? DEFAULT_LAT
      const startLng = initialLng ?? DEFAULT_LNG

      const map = L.map(mapContainerRef.current, {
        center: [startLat, startLng],
        zoom: initialZoom,
        zoomControl: true,
      })

      // Tile layer OpenStreetMap (Gratis & Cepat)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Marker pin
      const marker = L.marker([startLat, startLng], {
        draggable: true,
      })

      if (initialLat && initialLng) {
        marker.addTo(map)
      }

      // Event saat marker digeser
      marker.on('dragend', async () => {
        const position = marker.getLatLng()
        updateLocation(position.lat, position.lng, true)
      })

      // Event klik di peta untuk menaruh pin
      map.on('click', async (e: any) => {
        const { lat: clickLat, lng: clickLng } = e.latlng
        marker.setLatLng([clickLat, clickLng])
        if (!map.hasLayer(marker)) {
          marker.addTo(map)
        }
        updateLocation(clickLat, clickLng, true)
      })

      mapInstanceRef.current = map
      markerRef.current = marker

      // Pastikan rendering ukuran peta pas saat kontainer siap
      setTimeout(() => {
        map.invalidateSize()
      }, 250)
    }

    initMap()

    return () => {
      isMounted = false
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  // Fungsi update koordinat & panggil reverse geocoding
  async function updateLocation(newLat: number, newLng: number, fetchAddress = false) {
    setLat(newLat)
    setLng(newLng)
    setHasMarker(true)

    let detectedAddress = undefined

    if (fetchAddress) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'id',
            },
          }
        )
        if (res.ok) {
          const data = await res.json()
          if (data && data.display_name) {
            detectedAddress = data.display_name
          }
        }
      } catch (err) {
        console.warn('Gagal mengambil alamat dari koordinat:', err)
      }
    }

    onLocationSelect({
      lat: Number(newLat.toFixed(6)),
      lng: Number(newLng.toFixed(6)),
      address: detectedAddress,
    })
  }

  // Ambil lokasi GPS dari perangkat
  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error('Perangkat Anda tidak mendukung fitur pendeteksi lokasi GPS.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude
        const userLng = pos.coords.longitude

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([userLat, userLng], 16)
          markerRef.current.setLatLng([userLat, userLng])
          if (!mapInstanceRef.current.hasLayer(markerRef.current)) {
            markerRef.current.addTo(mapInstanceRef.current)
          }
        }

        updateLocation(userLat, userLng, true)
        setIsLocating(false)
        toast.success('Lokasi GPS Anda berhasil ditentukan!')
      },
      (err) => {
        setIsLocating(false)
        toast.error('Gagal mendeteksi lokasi GPS. Pastikan izin lokasi diizinkan di browser.')
        console.warn('Geolocation error:', err)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Cari lokasi berdasarkan teks
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=id&limit=1`,
        {
          headers: {
            'Accept-Language': 'id',
          },
        }
      )
      const data = await res.json()
      if (data && data.length > 0) {
        const targetLat = parseFloat(data[0].lat)
        const targetLng = parseFloat(data[0].lon)

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([targetLat, targetLng], 16)
          markerRef.current.setLatLng([targetLat, targetLng])
          if (!mapInstanceRef.current.hasLayer(markerRef.current)) {
            markerRef.current.addTo(mapInstanceRef.current)
          }
        }

        updateLocation(targetLat, targetLng, false)
        toast.success(`Ditemukan: ${data[0].display_name.slice(0, 50)}...`)
      } else {
        toast.error('Lokasi tidak ditemukan. Coba ketik nama jalan, kelurahan, atau kota yang lebih spesifik.')
      }
    } catch {
      toast.error('Gagal mencari lokasi. Coba lagi nanti.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Toolbar Pencarian & GPS */}
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jalan, pasar, atau patokan di peta..."
            className="text-xs h-9 bg-white"
            disabled={isSearching}
          />
          <Button
            type="submit"
            size="sm"
            variant="outline"
            disabled={isSearching || !searchQuery.trim()}
            className="gap-1 h-9 text-xs shrink-0"
          >
            {isSearching ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Search className="h-3.5 w-3.5" />
            )}
            Cari
          </Button>
        </form>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="gap-1.5 h-9 text-xs shrink-0 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
        >
          {isLocating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Navigation className="h-3.5 w-3.5 text-emerald-600" />
          )}
          Gunakan Lokasi GPS Saya
        </Button>
      </div>

      {/* Wadah Peta */}
      <div className="relative rounded-xl border border-neutral-300 overflow-hidden shadow-inner bg-neutral-100">
        <div ref={mapContainerRef} className="h-64 sm:h-72 w-full z-10" />

        {!hasMarker && (
          <div className="absolute top-2 left-2 right-2 z-20 pointer-events-none">
            <div className="rounded-lg bg-black/70 backdrop-blur-xs p-2 text-white text-xs flex items-center gap-2">
              <Info className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Klik di peta atau geser pin merah untuk menentukan titik lokasi toko Anda.</span>
            </div>
          </div>
        )}
      </div>

      {/* Status Koordinat */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
          {hasMarker ? (
            <span>
              Koordinat Terpilih: <strong>{lat.toFixed(5)}, {lng.toFixed(5)}</strong>
            </span>
          ) : (
            <span className="text-neutral-400">Belum ada titik yang dipilih di peta</span>
          )}
        </div>
        <span className="text-[11px] text-neutral-400">Peta OpenStreetMap &copy; Bebas Biaya</span>
      </div>
    </div>
  )
}
