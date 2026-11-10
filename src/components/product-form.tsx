'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productFormSchema, type ProductFormValues } from '@/features/products/schema'
import { createProductAction, updateProductAction } from '@/features/products/actions'
import { createClient } from '@/lib/supabase/client'
import { MAX_PHOTO_SIZE, ALLOWED_IMAGE_TYPES } from '@/lib/constants'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, UploadCloud, Image as ImageIcon, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface OptionItem {
  id: number
  nama: string
}

interface ProductFormProps {
  categories: OptionItem[]
  regions: OptionItem[]
  userId: string
  initialData?: {
    id: string
    nama: string
    deskripsi: string
    harga: number
    category_id: number | null
    region_id: number | null
    no_wa: string
    alamat: string | null
    foto_url: string | null
    status?: string
    alasan_tolak?: string | null
  }
}

export function ProductForm({ categories, regions, userId, initialData }: ProductFormProps) {
  const router = useRouter()
  const isEditing = Boolean(initialData)

  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.foto_url || null
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      nama: initialData?.nama || '',
      deskripsi: initialData?.deskripsi || '',
      harga: initialData?.harga ?? 0,
      category_id: initialData?.category_id ?? (categories[0]?.id ?? null),
      region_id: initialData?.region_id ?? (regions[0]?.id ?? null),
      no_wa: initialData?.no_wa || '',
      alamat: initialData?.alamat || null,
      foto_url: initialData?.foto_url || null,
    },
  })

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi ukuran file (maks 2MB)
    if (file.size > MAX_PHOTO_SIZE) {
      toast.error('Ukuran foto terlalu besar. Maksimal 2 MB.')
      return
    }

    // Validasi format
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Format foto harus berupa JPG, PNG, atau WEBP.')
      return
    }

    setUploadingImage(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() || 'jpg'
      const fileName = `${userId}/${crypto.randomUUID()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      setValue('foto_url', urlData.publicUrl)
      setPhotoPreview(urlData.publicUrl)
      toast.success('Foto produk berhasil diunggah')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengunggah foto'
      toast.error(message)
    } finally {
      setUploadingImage(false)
    }
  }

  function handleRemovePhoto() {
    setValue('foto_url', null)
    setPhotoPreview(null)
  }

  async function onSubmit(data: ProductFormValues) {
    setLoading(true)
    try {
      if (isEditing && initialData) {
        const res = await updateProductAction(initialData.id, data)
        if (!res.success) {
          toast.error(res.error || 'Gagal memperbarui produk')
        } else {
          toast.success('Produk berhasil diperbarui dan kini berstatus menunggu moderasi.')
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        const res = await createProductAction(data)
        if (!res.success) {
          toast.error(res.error || 'Gagal membuat produk')
        } else {
          toast.success('Produk berhasil ditambahkan! Menunggu moderasi dari admin.')
          router.push('/dashboard')
          router.refresh()
        }
      }
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-sm border-neutral-200">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-neutral-500">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
            </Link>
          </Button>
        </div>
        <CardTitle className="text-xl font-bold">
          {isEditing ? 'Ubah Informasi Produk' : 'Tambah Produk Baru'}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? 'Catatan: Setiap perubahan data akan mengembalikan status produk ke menunggu moderasi.'
            : 'Produk akan ditinjau oleh admin sebelum dapat dilihat calon pembeli di halaman utama.'}
        </CardDescription>

        {isEditing && initialData?.status === 'rejected' && initialData.alasan_tolak && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <p className="font-semibold text-rose-900">Alasan Penolakan Sebelumnya:</p>
            <p className="mt-1">{initialData.alasan_tolak}</p>
          </div>
        )}
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Foto Produk */}
          <div className="space-y-2">
            <Label>Foto Produk (Maks. 2 MB - JPG, PNG, WEBP)</Label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50">
                {photoPreview ? (
                  <>
                    <Image
                      src={photoPreview}
                      alt="Pratinjau foto produk"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute bottom-2 right-2 rounded-full bg-rose-600 p-1.5 text-white shadow hover:bg-rose-700"
                      title="Hapus foto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-neutral-400">
                    <ImageIcon className="h-8 w-8 mb-1" />
                    <span className="text-[11px]">Belum ada foto</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full">
                <input
                  type="file"
                  id="foto-upload"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  disabled={uploadingImage || loading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingImage || loading}
                  onClick={() => document.getElementById('foto-upload')?.click()}
                  className="w-full sm:w-auto self-start gap-2"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mengunggah Foto...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      Pilih & Unggah Foto
                    </>
                  )}
                </Button>
                <p className="text-xs text-neutral-500">
                  Gunakan foto asli produk yang jelas dan terang untuk menarik minat pembeli.
                </p>
                {errors.foto_url && (
                  <p className="text-xs text-rose-600">{errors.foto_url.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Nama Produk */}
          <div className="space-y-1.5">
            <Label htmlFor="nama">Nama Produk *</Label>
            <Input
              id="nama"
              placeholder="Contoh: Keripik Pisang Cokelat Lumer 250gr"
              disabled={loading}
              {...register('nama')}
            />
            {errors.nama && (
              <p className="text-xs text-rose-600">{errors.nama.message}</p>
            )}
          </div>

          {/* Kategori, Daerah & Harga */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category_id">Kategori Produk</Label>
              <select
                id="category_id"
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:opacity-50"
                disabled={loading}
                {...register('category_id', {
                  setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
                })}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nama}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-xs text-rose-600">{errors.category_id.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="region_id">Daerah / Kota UMKM</Label>
              <select
                id="region_id"
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:opacity-50"
                disabled={loading}
                {...register('region_id', {
                  setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
                })}
              >
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.nama}
                  </option>
                ))}
              </select>
              {errors.region_id && (
                <p className="text-xs text-rose-600">{errors.region_id.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="harga">Harga (Rupiah) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-neutral-400">Rp</span>
                <Input
                  id="harga"
                  type="number"
                  min="0"
                  step="500"
                  placeholder="25000"
                  className="pl-10"
                  disabled={loading}
                  {...register('harga', { valueAsNumber: true })}
                />
              </div>
              {errors.harga && (
                <p className="text-xs text-rose-600">{errors.harga.message}</p>
              )}
            </div>
          </div>

          {/* Nomor WhatsApp */}
          <div className="space-y-1.5">
            <Label htmlFor="no_wa">Nomor WhatsApp Penjual *</Label>
            <Input
              id="no_wa"
              placeholder="Contoh: 08123456789 atau 628123456789"
              disabled={loading}
              {...register('no_wa')}
            />
            <p className="text-xs text-neutral-500">
              Format diawali 08.. atau 62.. (akan dinormalisasi otomatis).
            </p>
            {errors.no_wa && (
              <p className="text-xs text-rose-600">{errors.no_wa.message}</p>
            )}
          </div>

          {/* Alamat Detail */}
          <div className="space-y-1.5">
            <Label htmlFor="alamat">Alamat Detail / Nama Jalan / Kecamatan</Label>
            <Input
              id="alamat"
              placeholder="Contoh: Jl. Soekarno Hatta No. 12, Kec. Lowokwaru"
              disabled={loading}
              {...register('alamat', { setValueAs: (v) => (v ? v : null) })}
            />
            {errors.alamat && (
              <p className="text-xs text-rose-600">{errors.alamat.message}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <Label htmlFor="deskripsi">Deskripsi Produk</Label>
            <Textarea
              id="deskripsi"
              rows={4}
              placeholder="Jelaskan keunggulan produk, varian rasa, ketahanan, atau ketentuan pemesanan..."
              disabled={loading}
              {...register('deskripsi')}
            />
            {errors.deskripsi && (
              <p className="text-xs text-rose-600">{errors.deskripsi.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-neutral-100 pt-6">
          <Button asChild variant="outline" type="button" disabled={loading}>
            <Link href="/dashboard">Batal</Link>
          </Button>
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 font-medium"
            disabled={loading || uploadingImage}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : isEditing ? (
              'Simpan Perubahan'
            ) : (
              'Kirim untuk Dimoderasi'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
