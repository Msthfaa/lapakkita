'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/features/auth/schema'
import { signUpAction } from '@/features/auth/actions'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Store } from 'lucide-react'

export default function DaftarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterInput) {
    setLoading(true)
    try {
      const res = await signUpAction(data)
      if (!res.success) {
        toast.error(res.error || 'Pendaftaran gagal. Silakan coba lagi.')
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
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-md border-neutral-200">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Store className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Daftar Penjual UMKM</CardTitle>
          <CardDescription>
            Buka lapak digital Anda dan jangkau lebih banyak pembeli lokal
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nama">Nama Lengkap / Nama Usaha</Label>
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
              <Label htmlFor="email">Alamat Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@usaha.com"
                disabled={loading}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-rose-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Kata Sandi (minimal 8 karakter)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Buat kata sandi yang aman"
                disabled={loading}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-rose-600 font-medium">{errors.password.message}</p>
              )}
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
                  Mendaftarkan Akun...
                </>
              ) : (
                'Daftar Sekarang'
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
    </div>
  )
}
