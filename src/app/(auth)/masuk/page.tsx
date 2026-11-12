'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/features/auth/schema'
import { signInAction } from '@/features/auth/actions'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Store } from 'lucide-react'

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
    <div className="flex min-h-screen flex-col items-center justify-start sm:justify-center px-4 pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="my-auto w-full max-w-md">
        <Card className="w-full rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-xl shadow-2xl transition-all">
          <CardHeader className="text-center space-y-3 pb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#186049] to-[#257d5a] text-white shadow-lg shadow-[#186049]/20 ring-4 ring-[#186049]/10">
              <Store className="h-7 w-7" />
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-serif font-normal text-neutral-900 dark:text-white">
                Masuk ke LapakKita
              </CardTitle>
              <CardDescription className="mt-1.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Kelola produk UMKM Anda atau masuk sebagai admin
              </CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                  Alamat Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@contoh.com"
                  disabled={loading}
                  className="h-11 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700/80 text-sm focus-visible:ring-2 focus-visible:ring-[#186049] transition-all"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                    Kata Sandi
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan kata sandi"
                  disabled={loading}
                  className="h-11 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700/80 text-sm focus-visible:ring-2 focus-visible:ring-[#186049] transition-all"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.password.message}</p>
                )}
              </div>

              <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 p-3.5 border border-neutral-200/80 dark:border-neutral-800 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-neutral-800 dark:text-white">
                    Akun Demo (Klik untuk isi cepat)
                  </span>
                  <span className="text-[10px] font-medium text-neutral-400">1-Klik</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setValue('email', 'admin@gmail.com')
                      setValue('password', '123456')
                    }}
                    className="group text-left p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700/60 bg-white dark:bg-neutral-900 hover:border-[#D98327] dark:hover:border-[#D98327] hover:shadow-xs transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-800 dark:text-white text-xs">Admin</span>
                      <span className="text-[10px] font-mono text-[#D98327] font-semibold bg-[#D98327]/10 px-1.5 py-0.5 rounded">123456</span>
                    </div>
                    <div className="text-neutral-500 dark:text-neutral-400 text-[11px] truncate mt-0.5">admin@gmail.com</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValue('email', 'penjual@gmail.com')
                      setValue('password', '123456')
                    }}
                    className="group text-left p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700/60 bg-white dark:bg-neutral-900 hover:border-[#4A943E] dark:hover:border-[#4A943E] hover:shadow-xs transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-800 dark:text-white text-xs">Penjual</span>
                      <span className="text-[10px] font-mono text-[#4A943E] font-semibold bg-[#4A943E]/10 px-1.5 py-0.5 rounded">123456</span>
                    </div>
                    <div className="text-neutral-500 dark:text-neutral-400 text-[11px] truncate mt-0.5">penjual@gmail.com</div>
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                className="h-11 w-full bg-[#186049] hover:bg-[#124b39] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                    Sedang Masuk...
                  </>
                ) : (
                  'Masuk ke Akun'
                )}
              </Button>

              <div className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-1">
                Belum punya akun penjual?{' '}
                <Link href="/daftar" className="font-semibold text-[#D98327] hover:underline underline-offset-2">
                  Daftar sekarang
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
