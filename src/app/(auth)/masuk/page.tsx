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
        <Card className="w-full shadow-md border-[#186049]/15 dark:border-[#186049]/30 bg-white dark:bg-[#0d1612]">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#186049]/15 text-[#186049] dark:text-white border border-[#186049]/20">
            <Store className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-serif font-bold text-[#186049] dark:text-white">Masuk ke LapakKita</CardTitle>
          <CardDescription className="dark:text-neutral-400">
            Kelola produk UMKM Anda atau masuk sebagai admin
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="dark:text-neutral-300">Alamat Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@contoh.com"
                disabled={loading}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="dark:text-neutral-300">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan kata sandi"
                disabled={loading}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div className="rounded-xl bg-[#ECE8AF]/15 dark:bg-white/[0.03] p-3 border border-[#186049]/15 dark:border-[#186049]/30 text-xs">
              <p className="font-semibold text-[#186049] dark:text-white mb-2">Akun Demo (Klik untuk isi cepat):</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setValue('email', 'admin@gmail.com')
                    setValue('password', '123456')
                  }}
                  className="text-left p-2.5 rounded-lg border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111e18] hover:border-[#4A943E] dark:hover:border-[#4A943E] transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200">Admin</div>
                  <div className="text-neutral-500 dark:text-neutral-400 text-[11px] truncate">admin@gmail.com</div>
                  <div className="text-[#D98327] text-[10px] font-mono mt-0.5">PW: 123456</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue('email', 'penjual@gmail.com')
                    setValue('password', '123456')
                  }}
                  className="text-left p-2.5 rounded-lg border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111e18] hover:border-[#4A943E] dark:hover:border-[#4A943E] transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200">Penjual</div>
                  <div className="text-neutral-500 dark:text-neutral-400 text-[11px] truncate">penjual@gmail.com</div>
                  <div className="text-[#4A943E] text-[10px] font-mono mt-0.5">PW: 123456</div>
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#186049] hover:bg-[#124b39] text-[#ECE8AF] border border-[#ECE8AF]/20 font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sedang Masuk...
                </>
              ) : (
                'Masuk'
              )}
            </Button>

            <div className="text-center text-xs text-neutral-500 dark:text-neutral-400">
              Belum punya akun penjual?{' '}
              <Link href="/daftar" className="font-semibold text-[#D98327] hover:underline">
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
