'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/features/auth/schema'
import { signUpAction } from '@/features/auth/actions'
import { LocationMapPicker } from '@/components/location-map-picker'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Store, MapPin, Phone, Mail, Lock, ChevronDown, ChevronUp } from 'lucide-react'

interface OptionItem {
  id: number
  nama: string
}

interface RegisterFormProps {
  regions: OptionItem[]
}

export function RegisterForm({ regions }: RegisterFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showMap, setShowMap] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nama: '',
      email: '',
      password: '',
      no_wa: '',
      region_id: regions[0]?.id ?? null,
      alamat: '',
      latitude: null,
      longitude: null,
    },
  })

  const currentLat = watch('latitude')
  const currentLng = watch('longitude')
  const currentAlamat = watch('alamat')

  function handleLocationSelected(loc: { lat: number; lng: number; address?: string }) {
    setValue('latitude', loc.lat)
    setValue('longitude', loc.lng)

    // Jika alamat belum diisi dan ada saran alamat dari peta, isi otomatis
    if (loc.address && !currentAlamat) {
      setValue('alamat', loc.address)
      toast.info('Alamat terdeteksi otomatis dari peta. Anda dapat menyempurnakannya.')
    }
  }

  async function onSubmit(data: RegisterInput) {
    setLoading(true)
    try {
      const res = await signUpAction(data)
      if (!res.success) {
        toast.error(res.error || 'Pendaftaran gagal. Silakan periksa kembali data Anda.')
      } else {
        toast.success('Pendaftaran berhasil! Selamat datang di LapakKita.')
        router.push(res.redirectTo || '/dashboard')
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan saat pendaftaran. Coba lagi nanti.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-xl shadow-md border-neutral-200">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Store className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold">Daftar Penjual UMKM</CardTitle>
        <CardDescription>
          Buka lapak digital Anda, tentukan lokasi toko di peta, dan hubungkan langsung dengan pembeli lokal via WhatsApp.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Nama Penjual / Nama Usaha */}
          <div className="space-y-1.5">
            <Label htmlFor="nama" className="font-semibold text-neutral-800 flex items-center gap-1.5">
              <Store className="h-4 w-4 text-emerald-600" />
              Nama Lengkap / Nama Usaha *
            </Label>
            <Input
              id="nama"
              placeholder="Contoh: Dapur Bu Siti / Keripik Mas Budi"
              disabled={loading}
              {...register('nama')}
            />
            {errors.nama && (
              <p className="text-xs text-rose-600 font-medium">{errors.nama.message}</p>
            )}
          </div>

          {/* Email & Kata Sandi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-semibold text-neutral-800 flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-emerald-600" />
                Email Login *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                disabled={loading}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-rose-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-semibold text-neutral-800 flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-emerald-600" />
                Kata Sandi *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 karakter"
                disabled={loading}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-rose-600 font-medium">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Nomor WhatsApp */}
          <div className="space-y-1.5">
            <Label htmlFor="no_wa" className="font-semibold text-neutral-800 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-emerald-600" />
              Nomor WhatsApp Toko / Usaha *
            </Label>
            <Input
              id="no_wa"
              placeholder="081234567890 atau 6281234567890"
              disabled={loading}
              {...register('no_wa')}
            />
            <p className="text-[11px] text-neutral-500">
              Calon pembeli akan menghubungi Anda langsung ke nomor ini saat memesan produk.
            </p>
            {errors.no_wa && (
              <p className="text-xs text-rose-600 font-medium">{errors.no_wa.message}</p>
            )}
          </div>

          {/* Daerah / Kota Toko */}
          <div className="space-y-1.5">
            <Label htmlFor="region_id" className="font-semibold text-neutral-800 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Kota / Wilayah Utama Toko
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

          {/* Alamat Lengkap Manual */}
          <div className="space-y-1.5">
            <Label htmlFor="alamat" className="font-semibold text-neutral-800 flex items-center justify-between">
              <span>Alamat Lengkap Toko / Patokan Lokasi</span>
              <span className="text-[11px] font-normal text-neutral-400">Dapat diisi manual atau via peta</span>
            </Label>
            <Input
              id="alamat"
              placeholder="Contoh: Jl. Rungkut Madya No. 45, RT 02/05, Kec. Rungkut"
              disabled={loading}
              {...register('alamat')}
            />
            {errors.alamat && (
              <p className="text-xs text-rose-600 font-medium">{errors.alamat.message}</p>
            )}
          </div>

          {/* Bagian Titik Lokasi Peta (Maps) */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-neutral-900">Titik Koordinat Peta (Maps)</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className="h-7 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100/50 gap-1 cursor-pointer"
              >
                {showMap ? (
                  <>
                    Sembunyikan Peta <ChevronUp className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    {currentLat && currentLng ? '📍 Ubah Titik di Peta' : '📍 Buka Peta & Tentukan Titik'} <ChevronDown className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>

            {currentLat && currentLng ? (
              <p className="text-xs text-emerald-800 font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                ✓ Titik toko tersimpan: ({currentLat.toFixed(5)}, {currentLng.toFixed(5)})
              </p>
            ) : (
              <p className="text-xs text-neutral-500">
                Pilih titik di peta agar produk Anda menampilkan peta mini lokasi toko yang bisa langsung dibuka pembeli di Google Maps.
              </p>
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

        <CardFooter className="flex flex-col space-y-4 pt-2">
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 font-medium"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mendaftarkan Lapak Anda...
              </>
            ) : (
              'Daftar Sebagai Penjual'
            )}
          </Button>

          <div className="text-center text-xs text-neutral-500">
            Sudah memiliki akun?{' '}
            <Link href="/masuk" className="font-semibold text-emerald-600 hover:underline">
              Masuk di sini
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
