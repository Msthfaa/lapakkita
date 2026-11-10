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
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-md border-neutral-200">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Store className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Masuk ke LapakKita</CardTitle>
          <CardDescription>
            Kelola produk UMKM Anda atau masuk sebagai admin
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Alamat Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@contoh.com"
                disabled={loading}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-rose-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan kata sandi"
                disabled={loading}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-rose-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div className="rounded-lg bg-neutral-50 p-3 border border-neutral-200 text-xs">
              <p className="font-semibold text-neutral-700 mb-2">Akun Demo (Klik untuk isi cepat):</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setValue('email', 'admin@gmail.com')
                    setValue('password', '123456')
                  }}
                  className="text-left p-2 rounded border border-neutral-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-neutral-800">Admin</div>
                  <div className="text-neutral-500 text-[11px] truncate">admin@gmail.com</div>
                  <div className="text-emerald-700 text-[10px] font-mono mt-0.5">PW: 123456</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue('email', 'penjual@gmail.com')
                    setValue('password', '123456')
                  }}
                  className="text-left p-2 rounded border border-neutral-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-neutral-800">Penjual</div>
                  <div className="text-neutral-500 text-[11px] truncate">penjual@gmail.com</div>
                  <div className="text-emerald-700 text-[10px] font-mono mt-0.5">PW: 123456</div>
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 font-medium"
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

            <div className="text-center text-xs text-neutral-500">
              Belum punya akun penjual?{' '}
              <Link href="/daftar" className="font-semibold text-emerald-600 hover:underline">
                Daftar sekarang
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
