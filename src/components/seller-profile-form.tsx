'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sellerProfileSchema, type SellerProfileInput } from '@/features/auth/schema'
import { updateSellerProfileAction } from '@/features/auth/actions'
import { LocationMapPicker } from '@/components/location-map-picker'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Loader2,
  Store,
  MapPin,
  Phone,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Save,
  CheckCircle2,
} from 'lucide-react'

interface OptionItem {
  id: number
  nama: string
}

interface SellerProfileFormProps {
  initialProfile: {
    nama: string
    no_wa: string | null
    region_id: number | null
    alamat: string | null
    latitude: number | null
    longitude: number | null
    deskripsi_toko: string | null
  }
  regions: OptionItem[]
}

export function SellerProfileForm({ initialProfile, regions }: SellerProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showMap, setShowMap] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<SellerProfileInput>({
    resolver: zodResolver(sellerProfileSchema),
    defaultValues: {
      nama: initialProfile.nama || '',
      no_wa: initialProfile.no_wa || '',
      region_id: initialProfile.region_id ?? (regions[0]?.id ?? null),
      alamat: initialProfile.alamat || '',
      latitude: initialProfile.latitude ?? null,
      longitude: initialProfile.longitude ?? null,
      deskripsi_toko: initialProfile.deskripsi_toko || '',
    },
  })

  const currentLat = watch('latitude')
  const currentLng = watch('longitude')
  const currentAlamat = watch('alamat')

  function handleLocationSelected(loc: { lat: number; lng: number; address?: string }) {
    setValue('latitude', loc.lat, { shouldDirty: true })
    setValue('longitude', loc.lng, { shouldDirty: true })

    if (loc.address && !currentAlamat) {
      setValue('alamat', loc.address, { shouldDirty: true })
      toast.info('Alamat terdeteksi dari peta. Anda dapat merapikannya.')
    }
  }

  async function onSubmit(data: SellerProfileInput) {
    setLoading(true)
    try {
      const res = await updateSellerProfileAction(data)
      if (!res.success) {
        toast.error(res.error || 'Gagal menyimpan profil toko')
      } else {
        toast.success('Profil toko dan lokasi berhasil diperbarui!')
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyimpan profil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header & Navigasi Kembali */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-neutral-600">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </div>

      <Card className="border-neutral-200 shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Profil &amp; Lokasi Toko Penjual</CardTitle>
              <CardDescription>
                Kelola informasi identitas usaha, kontak WhatsApp, dan koordinat peta lokasi fisik toko Anda.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Nama Toko & Nomor WA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nama" className="font-semibold text-neutral-800 flex items-center gap-1.5">
                <Store className="h-4 w-4 text-emerald-600" />
                Nama Toko / Nama Usaha *
              </Label>
              <Input
                id="nama"
                placeholder="Contoh: Dapur Bu Siti"
                disabled={loading}
                {...register('nama')}
              />
              {errors.nama && (
                <p className="text-xs text-rose-600 font-medium">{errors.nama.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="no_wa" className="font-semibold text-neutral-800 flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-emerald-600" />
                Nomor WhatsApp Toko *
              </Label>
              <Input
                id="no_wa"
                placeholder="081234567890"
                disabled={loading}
                {...register('no_wa')}
              />
              {errors.no_wa && (
                <p className="text-xs text-rose-600 font-medium">{errors.no_wa.message}</p>
              )}
            </div>
          </div>

          {/* Deskripsi Singkat Toko */}
          <div className="space-y-1.5">
            <Label htmlFor="deskripsi_toko" className="font-semibold text-neutral-800">
              Deskripsi Singkat Usaha / Slogan Toko
            </Label>
            <Textarea
              id="deskripsi_toko"
              rows={2}
              placeholder="Contoh: Menyediakan aneka sambal kemasan rumahan dan lauk siap saji khas Jawa Timur sejak 2018..."
              disabled={loading}
              {...register('deskripsi_toko')}
            />
            {errors.deskripsi_toko && (
              <p className="text-xs text-rose-600 font-medium">{errors.deskripsi_toko.message}</p>
            )}
          </div>

          {/* Kota / Wilayah & Alamat Lengkap */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="region_id" className="font-semibold text-neutral-800 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-600" />
                Kota / Wilayah Utama
              </Label>
              <select
                id="region_id"
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                disabled={loading}
                {...register('region_id', {
                  setValueAs: (v) => (v ? parseInt(v, 10) : null),
                })}
              >
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="alamat" className="font-semibold text-neutral-800">
                Alamat Fisik Lengkap Toko / Rumah Produksi
              </Label>
              <Input
                id="alamat"
                placeholder="Contoh: Jl. Rungkut Madya No. 45, RT 02/05, Rungkut"
                disabled={loading}
                {...register('alamat')}
              />
              {errors.alamat && (
                <p className="text-xs text-rose-600 font-medium">{errors.alamat.message}</p>
              )}
            </div>
          </div>

          {/* Titik Lokasi Peta (Leaflet OpenStreetMap) */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    Titik Koordinat Peta Toko (GPS)
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Geser pin atau klik di peta untuk menandai titik presisi toko Anda.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className="h-8 text-xs font-semibold text-emerald-700 hover:bg-emerald-100/50 gap-1"
              >
                {showMap ? (
                  <>
                    Sembunyikan Peta <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Tampilkan Peta <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {currentLat && currentLng ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Koordinat Tersimpan: Latitude {currentLat.toFixed(5)}, Longitude {currentLng.toFixed(5)}
                </span>
              </div>
            ) : (
              <div className="text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                ⚠️ Belum ada koordinat peta. Tentukan titik di peta agar pembeli dapat melihat rute navigasi Google Maps ke toko Anda.
              </div>
            )}

            {showMap && (
              <div className="pt-2">
                <LocationMapPicker
                  initialLat={currentLat}
                  initialLng={currentLng}
                  initialAddress={currentAlamat}
                  onLocationSelect={handleLocationSelected}
                />
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-500">
            Perubahan profil akan langsung berlaku pada data kontak dan lokasi Anda.
          </p>

          <Button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1.5 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan Perubahan Profil
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
