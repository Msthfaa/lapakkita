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
    <div className="w-full bg-[#186049] dark:bg-[#104434] rounded-[2.25rem] p-6 sm:p-10 shadow-2xl border border-white/15 backdrop-blur-md text-white transition-all">
      {/* Header */}
      <div className="text-center space-y-3 pb-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner border border-white/20">
          <Store className="h-7 w-7 text-[#ECE8AF]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
            Daftar Penjual UMKM
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#ECE8AF]/80 max-w-md mx-auto">
            Buka lapak digital Anda, tentukan lokasi toko di peta, dan hubungkan langsung dengan pembeli lokal via WhatsApp.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nama Penjual / Nama Usaha */}
        <div className="space-y-1.5">
          <label htmlFor="nama" className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
            Nama Lengkap / Nama Usaha <span className="text-[#FED7AA]">*</span>
          </label>
          <div className="relative">
            <input
              id="nama"
              placeholder="Contoh: Dapur Bu Siti / Keripik Mas Budi"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#257056] dark:bg-[#2D7A5E] text-white placeholder-[#ECE8AF]/60 border border-white/10 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A943E] focus:border-transparent transition-all"
              {...register('nama')}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/80">
              <Store className="h-5 w-5" />
            </div>
          </div>
          {errors.nama && (
            <p className="text-xs text-[#FED7AA] font-medium mt-1">{errors.nama.message}</p>
          )}
        </div>

        {/* Email & Kata Sandi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
              Email Login <span className="text-[#FED7AA]">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="nama@email.com"
                disabled={loading}
                className="w-full h-12 rounded-full bg-[#257056] dark:bg-[#2D7A5E] text-white placeholder-[#ECE8AF]/60 border border-white/10 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A943E] focus:border-transparent transition-all"
                {...register('email')}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/80">
                <Mail className="h-5 w-5" />
              </div>
            </div>
            {errors.email && (
              <p className="text-xs text-[#FED7AA] font-medium mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
              Kata Sandi <span className="text-[#FED7AA]">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="Min. 8 karakter"
                disabled={loading}
                className="w-full h-12 rounded-full bg-[#257056] dark:bg-[#2D7A5E] text-white placeholder-[#ECE8AF]/60 border border-white/10 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A943E] focus:border-transparent transition-all"
                {...register('password')}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/80">
                <Lock className="h-5 w-5" />
              </div>
            </div>
            {errors.password && (
              <p className="text-xs text-[#FED7AA] font-medium mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Nomor WhatsApp */}
        <div className="space-y-1.5">
          <label htmlFor="no_wa" className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
            Nomor WhatsApp Toko / Usaha <span className="text-[#FED7AA]">*</span>
          </label>
          <div className="relative">
            <input
              id="no_wa"
              placeholder="081234567890 atau 6281234567890"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#257056] dark:bg-[#2D7A5E] text-white placeholder-[#ECE8AF]/60 border border-white/10 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A943E] focus:border-transparent transition-all"
              {...register('no_wa')}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/80">
              <Phone className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[11px] text-[#ECE8AF]/70">
            Calon pembeli akan menghubungi Anda langsung ke nomor ini saat memesan produk.
          </p>
          {errors.no_wa && (
            <p className="text-xs text-[#FED7AA] font-medium mt-1">{errors.no_wa.message}</p>
          )}
        </div>

        {/* Daerah / Kota Toko */}
        <div className="space-y-1.5">
          <label htmlFor="region_id" className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
            Kota / Wilayah Utama Toko
          </label>
          <div className="relative">
            <select
              id="region_id"
              className="w-full h-12 rounded-full bg-[#257056] dark:bg-[#2D7A5E] text-white border border-white/10 px-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A943E] appearance-none cursor-pointer"
              disabled={loading}
              {...register('region_id', {
                setValueAs: (v) => (v ? parseInt(v, 10) : null),
              })}
            >
              {regions.map((reg) => (
                <option key={reg.id} value={reg.id} className="bg-[#186049] text-white">
                  {reg.nama}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/80">
              <ChevronDown className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Alamat Lengkap Manual */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="alamat" className="text-xs font-semibold text-white/90">
              Alamat Lengkap Toko / Patokan
            </label>
            <span className="text-[10px] text-[#ECE8AF]/70">Bisa diisi manual atau via peta</span>
          </div>
          <div className="relative">
            <input
              id="alamat"
              placeholder="Contoh: Jl. Rungkut Madya No. 45, RT 02/05, Kec. Rungkut"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#257056] dark:bg-[#2D7A5E] text-white placeholder-[#ECE8AF]/60 border border-white/10 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A943E] focus:border-transparent transition-all"
              {...register('alamat')}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/80">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          {errors.alamat && (
            <p className="text-xs text-[#FED7AA] font-medium mt-1">{errors.alamat.message}</p>
          )}
        </div>

        {/* Bagian Titik Lokasi Peta (Maps) */}
        <div className="rounded-2xl bg-black/20 backdrop-blur-md border border-white/15 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#ECE8AF]" />
              <span className="text-xs font-bold text-white">Titik Koordinat Peta (Maps)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="h-8 px-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium text-xs border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {showMap ? (
                <>
                  Sembunyikan Peta <ChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  {currentLat && currentLng ? '📍 Ubah Titik Peta' : '📍 Buka Peta & Tentukan Titik'} <ChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          {currentLat && currentLng ? (
            <div className="flex items-center gap-2 bg-[#257056] border border-white/15 px-3 py-1.5 rounded-full text-xs text-[#ECE8AF]">
              <CheckCircle2 className="h-4 w-4 text-[#4A943E] shrink-0" />
              <span>Titik toko tersimpan: ({currentLat.toFixed(5)}, {currentLng.toFixed(5)})</span>
            </div>
          ) : (
            <p className="text-xs text-[#ECE8AF]/70">
              Pilih titik di peta agar produk Anda menampilkan peta mini lokasi toko yang bisa langsung dibuka pembeli di Google Maps.
            </p>
          )}

          {showMap && (
            <div className="pt-2 rounded-2xl overflow-hidden border border-white/15">
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
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-white text-[#186049] hover:bg-[#ECE8AF] font-bold rounded-full text-base shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#186049]" />
                Mendaftarkan Lapak Anda...
              </>
            ) : (
              'Daftar Sebagai Penjual'
            )}
          </button>
        </div>

        {/* Link to Login */}
        <div className="text-center text-xs text-[#ECE8AF]/80 pt-2">
          Sudah memiliki akun?{' '}
          <Link href="/masuk" className="font-bold text-white hover:text-[#ECE8AF] underline underline-offset-2">
            Masuk di sini
          </Link>
        </div>
      </form>
    </div>
  )
}
