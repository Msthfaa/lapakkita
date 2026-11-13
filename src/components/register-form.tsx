'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/features/auth/schema'
import { signUpAction } from '@/features/auth/actions'
import { LocationMapPicker } from '@/components/location-map-picker'
import { toast } from 'sonner'
import { Loader2, Store, MapPin, Phone, Mail, Lock, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react'

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
    <div className="w-full max-w-2xl mx-auto bg-[#0E3D2F] dark:bg-[#0A2D23] rounded-[2.5rem] p-8 sm:p-12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] border border-white/20 backdrop-blur-md text-white transition-all">
      {/* Header */}
      <div className="text-center space-y-3 pb-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner border border-white/20">
          <Store className="h-8 w-8 text-[#ECE8AF]" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
            Daftar Penjual UMKM
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#ECE8AF] font-medium max-w-lg mx-auto">
            Buka lapak digital Anda, tentukan lokasi toko di peta, dan hubungkan langsung dengan pembeli lokal via WhatsApp.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Nama Penjual / Nama Usaha */}
        <div className="space-y-2">
          <label htmlFor="nama" className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
            Nama Lengkap / Nama Usaha <span className="text-amber-200">*</span>
          </label>
          <div className="relative">
            <input
              id="nama"
              placeholder="Contoh: Dapur Bu Siti / Keripik Mas Budi"
              disabled={loading}
              className="w-full h-14 rounded-full bg-[#29745A] dark:bg-[#338568] text-white placeholder-[#ECE8AF]/80 border border-white/20 px-6 pr-14 text-base focus:outline-none focus:ring-2 focus:ring-[#ECE8AF] focus:border-transparent transition-all shadow-inner"
              {...register('nama')}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white">
              <Store className="h-5 w-5" />
            </div>
          </div>
          {errors.nama && (
            <p className="text-xs sm:text-sm text-amber-200 font-medium mt-1.5">{errors.nama.message}</p>
          )}
        </div>

        {/* Email & Kata Sandi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              Email Login <span className="text-amber-200">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="nama@email.com"
                disabled={loading}
                className="w-full h-14 rounded-full bg-[#29745A] dark:bg-[#338568] text-white placeholder-[#ECE8AF]/80 border border-white/20 px-6 pr-14 text-base focus:outline-none focus:ring-2 focus:ring-[#ECE8AF] focus:border-transparent transition-all shadow-inner"
                {...register('email')}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white">
                <Mail className="h-5 w-5" />
              </div>
            </div>
            {errors.email && (
              <p className="text-xs sm:text-sm text-amber-200 font-medium mt-1.5">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              Kata Sandi <span className="text-amber-200">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="Min. 8 karakter"
                disabled={loading}
                className="w-full h-14 rounded-full bg-[#29745A] dark:bg-[#338568] text-white placeholder-[#ECE8AF]/80 border border-white/20 px-6 pr-14 text-base focus:outline-none focus:ring-2 focus:ring-[#ECE8AF] focus:border-transparent transition-all shadow-inner"
                {...register('password')}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white">
                <Lock className="h-5 w-5" />
              </div>
            </div>
            {errors.password && (
              <p className="text-xs sm:text-sm text-amber-200 font-medium mt-1.5">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Nomor WhatsApp */}
        <div className="space-y-2">
          <label htmlFor="no_wa" className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
            Nomor WhatsApp Toko / Usaha <span className="text-amber-200">*</span>
          </label>
          <div className="relative">
            <input
              id="no_wa"
              placeholder="081234567890 atau 6281234567890"
              disabled={loading}
              className="w-full h-14 rounded-full bg-[#29745A] dark:bg-[#338568] text-white placeholder-[#ECE8AF]/80 border border-white/20 px-6 pr-14 text-base focus:outline-none focus:ring-2 focus:ring-[#ECE8AF] focus:border-transparent transition-all shadow-inner"
              {...register('no_wa')}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white">
              <Phone className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-[#ECE8AF]/90 font-medium">
            Calon pembeli akan menghubungi Anda langsung ke nomor ini saat memesan produk.
          </p>
          {errors.no_wa && (
            <p className="text-xs sm:text-sm text-amber-200 font-medium mt-1.5">{errors.no_wa.message}</p>
          )}
        </div>

        {/* Daerah / Kota Toko */}
        <div className="space-y-2">
          <label htmlFor="region_id" className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
            Kota / Wilayah Utama Toko
          </label>
          <div className="relative">
            <select
              id="region_id"
              className="w-full h-14 rounded-full bg-[#29745A] dark:bg-[#338568] text-white border border-white/20 px-6 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-[#ECE8AF] appearance-none cursor-pointer shadow-inner"
              disabled={loading}
              {...register('region_id', {
                setValueAs: (v) => (v ? parseInt(v, 10) : null),
              })}
            >
              {regions.map((reg) => (
                <option key={reg.id} value={reg.id} className="bg-[#0E3D2F] text-white">
                  {reg.nama}
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white">
              <ChevronDown className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Alamat Lengkap Manual */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="alamat" className="text-sm font-bold text-white tracking-wide">
              Alamat Lengkap Toko / Patokan
            </label>
            <span className="text-xs text-[#ECE8AF]/90 font-medium">Bisa diisi manual atau via peta</span>
          </div>
          <div className="relative">
            <input
              id="alamat"
              placeholder="Contoh: Jl. Rungkut Madya No. 45, RT 02/05, Kec. Rungkut"
              disabled={loading}
              className="w-full h-14 rounded-full bg-[#29745A] dark:bg-[#338568] text-white placeholder-[#ECE8AF]/80 border border-white/20 px-6 pr-14 text-base focus:outline-none focus:ring-2 focus:ring-[#ECE8AF] focus:border-transparent transition-all shadow-inner"
              {...register('alamat')}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          {errors.alamat && (
            <p className="text-xs sm:text-sm text-amber-200 font-medium mt-1.5">{errors.alamat.message}</p>
          )}
        </div>

        {/* Bagian Titik Lokasi Peta (Maps) */}
        <div className="rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#ECE8AF]" />
              <span className="text-sm font-bold text-white">Titik Koordinat Peta (Maps)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="h-10 px-4 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {showMap ? (
                <>
                  Sembunyikan Peta <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  {currentLat && currentLng ? '📍 Ubah Titik Peta' : '📍 Buka Peta & Tentukan Titik'} <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {currentLat && currentLng ? (
            <div className="flex items-center gap-2 bg-[#29745A] border border-white/20 px-4 py-2 rounded-full text-xs sm:text-sm text-[#ECE8AF] font-medium">
              <CheckCircle2 className="h-4 w-4 text-[#ECE8AF] shrink-0" />
              <span>Titik toko tersimpan: ({currentLat.toFixed(5)}, {currentLng.toFixed(5)})</span>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-[#ECE8AF]/90 font-medium">
              Pilih titik di peta agar produk Anda menampilkan peta mini lokasi toko yang bisa langsung dibuka pembeli di Google Maps.
            </p>
          )}

          {showMap && (
            <div className="pt-2 rounded-2xl overflow-hidden border border-white/20">
              <LocationMapPicker
                initialLat={currentLat}
                initialLng={currentLng}
                initialAddress={currentAlamat}
                onLocationSelect={handleLocationSelected}
              />
            </div>
          )}
        </div>

        {/* Primary Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-white text-[#0E3D2F] hover:bg-[#ECE8AF] font-extrabold rounded-full text-base sm:text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#0E3D2F]" />
                Mendaftarkan Lapak Anda...
              </>
            ) : (
              'Daftar Sebagai Penjual'
            )}
          </button>
        </div>

        {/* Link to Login */}
        <div className="text-center text-sm text-[#ECE8AF] pt-3 font-medium">
          Sudah memiliki akun?{' '}
          <Link href="/masuk" className="font-extrabold text-white hover:text-[#ECE8AF] underline underline-offset-4 decoration-2 transition-colors">
            Masuk di sini
          </Link>
        </div>
      </form>
    </div>
  )
}
