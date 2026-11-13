'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/features/auth/schema'
import { signInAction } from '@/features/auth/actions'
import { toast } from 'sonner'
import { Loader2, Store, Mail, Lock, Sparkles, Shield, UserCheck } from 'lucide-react'
import { AuthScenicBackground } from '@/components/auth-scenic-background'

export default function MasukPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setLoading(true)
    try {
      const res = await signInAction(data)
      if (!res.success) {
        toast.error(res.error || 'Gagal masuk. Periksa email dan password.')
      } else {
        toast.success('Berhasil masuk!')
        router.push(res.redirectTo || '/dashboard')
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan saat masuk. Coba lagi nanti.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScenicBackground>
      <div className="w-full max-w-lg sm:max-w-[540px] mx-auto relative z-10 px-4 py-8">
        <div className="w-full bg-[#0E3D2F] dark:bg-[#0A2D23] rounded-[2.5rem] p-9 sm:p-12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] border border-white/20 backdrop-blur-md text-white transition-all">
          {/* Header */}
          <div className="text-center space-y-3 pb-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner border border-white/20">
              <Store className="h-8 w-8 text-[#ECE8AF]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
                Masuk
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#ECE8AF] font-medium">
                Kelola produk UMKM Anda atau masuk sebagai admin
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold text-white tracking-wide block">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="nama@contoh.com"
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

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-bold text-white tracking-wide block">
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="Masukkan kata sandi"
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

            {/* 1-Click Demo Account Pills */}
            <div className="rounded-2xl bg-black/25 backdrop-blur-md p-4 border border-white/20 text-xs mt-3">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-[#ECE8AF] flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#ECE8AF]" />
                  Akun Demo (Klik untuk isi cepat)
                </span>
                <span className="text-[11px] font-bold text-[#0E3D2F] bg-[#ECE8AF] px-2.5 py-0.5 rounded-full shadow-sm">
                  1-Klik
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setValue('email', 'admin@gmail.com')
                    setValue('password', '123456')
                  }}
                  className="group text-left p-3 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/35 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-[#ECE8AF]" /> Admin
                    </span>
                    <span className="text-xs font-mono text-[#0E3D2F] font-extrabold bg-[#ECE8AF] px-2 py-0.5 rounded-md shadow-sm">
                      123456
                    </span>
                  </div>
                  <div className="text-[#ECE8AF]/90 text-xs truncate mt-1.5 font-medium">admin@gmail.com</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue('email', 'penjual@gmail.com')
                    setValue('password', '123456')
                  }}
                  className="group text-left p-3 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/35 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <UserCheck className="h-3.5 w-3.5 text-[#ECE8AF]" /> Penjual
                    </span>
                    <span className="text-xs font-mono text-[#0E3D2F] font-extrabold bg-[#ECE8AF] px-2 py-0.5 rounded-md shadow-sm">
                      123456
                    </span>
                  </div>
                  <div className="text-[#ECE8AF]/90 text-xs truncate mt-1.5 font-medium">penjual@gmail.com</div>
                </button>
              </div>
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
                    Sedang Masuk...
                  </>
                ) : (
                  'Masuk ke Akun'
                )}
              </button>
            </div>

            {/* Link to Register */}
            <div className="text-center text-sm text-[#ECE8AF] pt-3 font-medium">
              Belum punya akun penjual?{' '}
              <Link href="/daftar" className="font-extrabold text-white hover:text-[#ECE8AF] underline underline-offset-4 decoration-2 transition-colors">
                Daftar sekarang
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthScenicBackground>
  )
}
