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
      <div className="w-full max-w-md mx-auto relative z-10 px-4 py-8">
        <div className="w-full bg-[#186049] dark:bg-[#104434] rounded-[2.25rem] p-8 sm:p-10 shadow-2xl border border-white/15 backdrop-blur-md text-white transition-all">
          {/* Header */}
          <div className="text-center space-y-3 pb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner border border-white/20">
              <Store className="h-7 w-7 text-[#ECE8AF]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-serif">
                Masuk
              </h1>
              <p className="mt-2 text-sm text-[#ECE8AF]/80">
                Kelola produk UMKM Anda atau masuk sebagai admin
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-white/90 block">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="nama@contoh.com"
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-white/90">
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="Masukkan kata sandi"
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

            {/* 1-Click Demo Account Pills */}
            <div className="rounded-2xl bg-black/15 backdrop-blur-md p-3.5 border border-white/10 text-xs mt-2">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-semibold text-[#ECE8AF] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#ECE8AF]" />
                  Akun Demo (Klik untuk isi cepat)
                </span>
                <span className="text-[10px] font-medium text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                  1-Klik
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setValue('email', 'admin@gmail.com')
                    setValue('password', '123456')
                  }}
                  className="group text-left p-2.5 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 hover:border-white/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs flex items-center gap-1">
                      <Shield className="h-3 w-3 text-[#ECE8AF]" /> Admin
                    </span>
                    <span className="text-[10px] font-mono text-[#D98327] font-bold bg-[#ECE8AF] px-1.5 py-0.5 rounded">
                      123456
                    </span>
                  </div>
                  <div className="text-white/70 text-[11px] truncate mt-1">admin@gmail.com</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue('email', 'penjual@gmail.com')
                    setValue('password', '123456')
                  }}
                  className="group text-left p-2.5 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 hover:border-white/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs flex items-center gap-1">
                      <UserCheck className="h-3 w-3 text-[#ECE8AF]" /> Penjual
                    </span>
                    <span className="text-[10px] font-mono text-[#186049] font-bold bg-[#ECE8AF] px-1.5 py-0.5 rounded">
                      123456
                    </span>
                  </div>
                  <div className="text-white/70 text-[11px] truncate mt-1">penjual@gmail.com</div>
                </button>
              </div>
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
                    Sedang Masuk...
                  </>
                ) : (
                  'Masuk ke Akun'
                )}
              </button>
            </div>

            {/* Link to Register */}
            <div className="text-center text-xs text-[#ECE8AF]/80 pt-2">
              Belum punya akun penjual?{' '}
              <Link href="/daftar" className="font-bold text-white hover:text-[#ECE8AF] underline underline-offset-2">
                Daftar sekarang
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthScenicBackground>
  )
}
