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
import { formatRibuanInput, parseRibuanInput } from '@/lib/format'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Loader2,
  UploadCloud,
  Image as ImageIcon,
  ArrowLeft,
  Trash2,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Layers,
  MapPin,
  Tag,
  Phone,
} from 'lucide-react'
import Link from 'next/link'
import { LocationMapPicker } from '@/components/location-map-picker'

interface OptionItem {
  id: number
  nama: string
}

interface ProductFormProps {
  categories: OptionItem[]
  regions: OptionItem[]
  userId: string
  sellerProfile?: {
    no_wa?: string | null
    region_id?: number | null
    alamat?: string | null
    latitude?: number | null
    longitude?: number | null
  } | null
  initialData?: {
    id: string
    nama: string
    deskripsi: string
    harga: number
    satuan?: string
    kondisi_stok?: 'ready_stock' | 'pre_order' | 'stok_terbatas'
    metode_pengiriman?: string[]
    varian?: string | null
    no_izin?: string | null
    category_id: number | null
    region_id: number | null
    no_wa: string
    alamat: string | null
    latitude?: number | null
    longitude?: number | null
    foto_url: string | null
    foto_urls?: string[]
    status?: string
    alasan_tolak?: string | null
    is_active?: boolean
  }
}

const SATUAN_OPTIONS = [
  'Pcs / Buah',
  'Pack / Bungkus',
  'Box / Kotak',
  'Porsi',
  'Toples',
  'Kg (Kilogram)',
  'Gram',
  'Botol / Cup',
  'Pasang / Set',
  'Lusin',
]

const PENGIRIMAN_OPTIONS = [
  'Bisa Kirim Seluruh Indonesia (Ekspedisi)',
  'Khusus Area Lokal (Kurir Instan / Sameday)',
  'Bisa Ambil di Tempat (Self Pick-up)',
  'Bisa COD (Bayar di Tempat)',
]

export function ProductForm({
  categories,
  regions,
  userId,
  initialData,
  sellerProfile,
}: ProductFormProps) {
  const router = useRouter()
  const isEditing = Boolean(initialData)

  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showMap, setShowMap] = useState(false)

  // State Galeri Multi-Foto (Maksimal 5 Foto)
  const initialPhotos =
    initialData?.foto_urls && initialData.foto_urls.length > 0
      ? initialData.foto_urls
      : initialData?.foto_url
        ? [initialData.foto_url]
        : []
  const [photos, setPhotos] = useState<string[]>(initialPhotos)

  // State Input Harga dengan Titik Ribuan (contoh: 120.000)
  const [rawHarga, setRawHarga] = useState<string>(
    initialData?.harga ? formatRibuanInput(initialData.harga) : ''
  )

  // State Pengiriman
  const [metodeKirim, setMetodeKirim] = useState<string[]>(
    initialData?.metode_pengiriman && initialData.metode_pengiriman.length > 0
      ? initialData.metode_pengiriman
      : ['Bisa Kirim Seluruh Indonesia (Ekspedisi)']
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      nama: initialData?.nama || '',
      deskripsi: initialData?.deskripsi || '',
      harga: initialData?.harga ?? 0,
      satuan: initialData?.satuan || 'Pcs / Buah',
      kondisi_stok: initialData?.kondisi_stok || 'ready_stock',
      metode_pengiriman: initialData?.metode_pengiriman || ['Bisa Kirim Seluruh Indonesia (Ekspedisi)'],
      varian: initialData?.varian || '',
      no_izin: initialData?.no_izin || '',
      category_id: initialData?.category_id ?? (categories[0]?.id ?? null),
      region_id: initialData?.region_id ?? (sellerProfile?.region_id ?? (regions[0]?.id ?? null)),
      no_wa: initialData?.no_wa || sellerProfile?.no_wa || '',
      alamat: initialData?.alamat || sellerProfile?.alamat || null,
      latitude: initialData?.latitude ?? sellerProfile?.latitude ?? null,
      longitude: initialData?.longitude ?? sellerProfile?.longitude ?? null,
      foto_url: initialData?.foto_url || null,
      foto_urls: initialPhotos,
      is_active: initialData?.is_active ?? true,
    },
  })

  const selectedKondisiStok = watch('kondisi_stok')
  const currentIsActive = watch('is_active')
  const currentLat = watch('latitude')
  const currentLng = watch('longitude')
  const currentAlamat = watch('alamat')

  // Handle Input Harga Berformat Ribuan (Rupiah)
  function handleHargaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatRibuanInput(e.target.value)
    const numericValue = parseRibuanInput(formatted)
    setRawHarga(formatted)
    setValue('harga', numericValue, { shouldValidate: true })
  }

  // Handle Upload Multi-Foto (Hingga 5 foto)
  async function handleMultiFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    const selectedFiles = Array.from(fileList)
    const sisaSlot = 5 - photos.length

    if (sisaSlot <= 0) {
      toast.error('Batas maksimal 5 foto telah tercapai.')
      return
    }

    const filesToUpload = selectedFiles.slice(0, sisaSlot)
    if (selectedFiles.length > sisaSlot) {
      toast.warning(`Hanya ${sisaSlot} foto yang dapat diunggah (maksimal 5 foto per produk).`)
    }

    setUploadingImage(true)
    const uploadedUrls: string[] = []

    try {
      const supabase = createClient()

      for (const file of filesToUpload) {
        if (file.size > MAX_PHOTO_SIZE) {
          toast.error(`Foto "${file.name}" melebihi batas 2 MB dan dilewati.`)
          continue
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          toast.error(`Format foto "${file.name}" tidak didukung.`)
          continue
        }

        const ext = file.name.split('.').pop() || 'jpg'
        const fileName = `${userId}/${crypto.randomUUID()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          toast.error(`Gagal mengunggah foto "${file.name}": ${uploadError.message}`)
          continue
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('product-images').getPublicUrl(fileName)

        uploadedUrls.push(publicUrl)
      }

      if (uploadedUrls.length > 0) {
        const updatedPhotos = [...photos, ...uploadedUrls]
        setPhotos(updatedPhotos)
        setValue('foto_urls', updatedPhotos)
        setValue('foto_url', updatedPhotos[0] || null)
        toast.success(`${uploadedUrls.length} foto berhasil ditambahkan!`)
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengunggah foto.')
    } finally {
      setUploadingImage(false)
      // Reset input file value agar dapat memilih file yang sama jika diinginkan
      e.target.value = ''
    }
  }

  // Hapus Foto Tertentu
  function handleRemovePhoto(indexToRemove: number) {
    const updated = photos.filter((_, idx) => idx !== indexToRemove)
    setPhotos(updated)
    setValue('foto_urls', updated)
    setValue('foto_url', updated[0] || null)
  }

  // Jadikan Foto Tertentu Sebagai Foto Utama (Cover)
  function handleSetAsCover(indexToCover: number) {
    if (indexToCover === 0) return
    const targetPhoto = photos[indexToCover]
    const filtered = photos.filter((_, idx) => idx !== indexToCover)
    const updated = [targetPhoto, ...filtered]
    setPhotos(updated)
    setValue('foto_urls', updated)
    setValue('foto_url', updated[0])
    toast.success('Foto utama (cover) berhasil diperbarui!')
  }

  // Toggle Opsi Pengiriman
  function handleTogglePengiriman(option: string) {
    let updated: string[]
    if (metodeKirim.includes(option)) {
      if (metodeKirim.length === 1) {
        toast.warning('Pilih minimal 1 metode pengiriman.')
        return
      }
      updated = metodeKirim.filter((item) => item !== option)
    } else {
      updated = [...metodeKirim, option]
    }
    setMetodeKirim(updated)
    setValue('metode_pengiriman', updated)
  }

  // Submit Handler
  async function onSubmit(data: ProductFormValues) {
    if (photos.length === 0) {
      toast.error('Unggah minimal 1 foto produk untuk menarik minat calon pembeli.')
      return
    }

    if (data.harga <= 0) {
      toast.error('Harga produk harus lebih dari Rp 0.')
      return
    }

    setLoading(true)
    try {
      const payload: ProductFormValues = {
        ...data,
        foto_url: photos[0] || null,
        foto_urls: photos,
        metode_pengiriman: metodeKirim,
      }

      if (isEditing && initialData) {
        const res = await updateProductAction(initialData.id, payload)
        if (!res.success) {
          toast.error(res.error || 'Gagal memperbarui produk')
        } else {
          toast.success(
            'Produk berhasil diperbarui dan dikirim ke antrean moderasi admin!'
          )
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        const res = await createProductAction(payload)
        if (!res.success) {
          toast.error(res.error || 'Gagal menambahkan produk')
        } else {
          toast.success(
            'Produk berhasil didaftarkan! Menunggu verifikasi dari admin.'
          )
          router.push('/dashboard')
          router.refresh()
        }
      }
    } catch {
      toast.error('Terjadi kesalahan saat memproses data produk.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Tombol Kembali & Info Penjual */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-neutral-600">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </div>

      {/* ================= BAGIAN 1: GALERI MULTI-FOTO PRODUK ================= */}
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Galeri Foto Produk UMKM
              </CardTitle>
              <CardDescription>
                Unggah 1 hingga 5 foto asli produk (tampak depan, kemasan, detail isi, atau sertifikat).
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {photos.length} / 5 Foto
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Dropzone Upload */}
          {photos.length < 5 && (
            <div className="rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-6 text-center hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all bg-neutral-50/50 dark:bg-neutral-900/50">
              <input
                id="product-photos-input"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploadingImage || loading}
                onChange={handleMultiFileChange}
              />
              <label
                htmlFor="product-photos-input"
                className="flex flex-col items-center justify-center cursor-pointer space-y-2"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  {uploadingImage ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <UploadCloud className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <span className="font-semibold text-sm text-emerald-700 dark:text-emerald-400 hover:underline">
                    {uploadingImage ? 'Sedang Mengunggah...' : 'Klik untuk Pilih Foto'}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400"> atau seret gambar ke sini</span>
                </div>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  Format: JPG, PNG, WEBP &bull; Maksimal 2 MB per foto &bull; Tersedia {5 - photos.length} slot lagi
                </p>
              </label>
            </div>
          )}

          {/* Grid Preview Foto */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
              {photos.map((url, idx) => (
                <div
                  key={idx}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 bg-neutral-100 dark:bg-neutral-800 transition-all ${
                    idx === 0
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                >
                  <Image
                    src={url}
                    alt={`Foto Produk ${idx + 1}`}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />

                  {/* Badge Foto Utama */}
                  {idx === 0 ? (
                    <div className="absolute top-1.5 left-1.5 rounded-md bg-[#186049] text-[#ECE8AF] border border-[#ECE8AF]/20 px-1.5 py-0.5 text-[10px] font-bold shadow-xs flex items-center gap-1">
                      <Star className="h-3 w-3 fill-[#D98327] text-[#D98327]" />
                      Cover
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetAsCover(idx)}
                      className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-md bg-black/70 hover:bg-[#186049] px-1.5 py-0.5 text-[10px] font-medium text-white cursor-pointer"
                      title="Jadikan foto cover utama"
                    >
                      Pilih Cover
                    </button>
                  )}

                  {/* Tombol Hapus Foto */}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    disabled={uploadingImage || loading}
                    className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex h-6 w-6 items-center justify-center rounded-md bg-rose-600 text-white hover:bg-rose-700 cursor-pointer shadow-xs"
                    title="Hapus foto ini"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= BAGIAN 2: INFORMASI DASAR PRODUK ================= */}
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Tag className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Informasi Dasar Produk
          </CardTitle>
          <CardDescription>
            Isi nama produk, kategori usaha, dan daerah asal UMKM Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Nama Produk */}
          <div className="space-y-1.5">
            <Label htmlFor="nama" className="font-semibold text-neutral-800 dark:text-neutral-200">
              Nama Produk UMKM <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="nama"
              placeholder="Contoh: Kripik Tempe Renyah Gurih 250gr"
              disabled={loading}
              {...register('nama')}
            />
            {errors.nama && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.nama.message}</p>
            )}
          </div>

          {/* Kategori & Daerah */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="category_id" className="font-semibold text-neutral-800 dark:text-neutral-200">
                Kategori Usaha <span className="text-rose-500">*</span>
              </Label>
              <select
                id="category_id"
                disabled={loading}
                {...register('category_id', { valueAsNumber: true })}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm shadow-xs focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                    {cat.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="region_id" className="font-semibold text-neutral-800 dark:text-neutral-200">
                Daerah / Kota UMKM <span className="text-rose-500">*</span>
              </Label>
              <select
                id="region_id"
                disabled={loading}
                {...register('region_id', { valueAsNumber: true })}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm shadow-xs focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                    {reg.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Varian & Sertifikasi */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="varian" className="text-neutral-700 dark:text-neutral-300">
                Pilihan Varian Produk <span className="text-neutral-400 dark:text-neutral-500 text-xs">(Opsional)</span>
              </Label>
              <Input
                id="varian"
                placeholder="Contoh: Original, Pedas Manis, Keju"
                disabled={loading}
                {...register('varian')}
              />
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Tuliskan pilihan rasa, ukuran, atau warna yang tersedia.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="no_izin" className="text-neutral-700 dark:text-neutral-300">
                Legalitas / Sertifikasi <span className="text-neutral-400 dark:text-neutral-500 text-xs">(Opsional)</span>
              </Label>
              <Input
                id="no_izin"
                placeholder="Contoh: Halal ID3121..., P-IRT 2063..."
                disabled={loading}
                {...register('no_izin')}
              />
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Nomor izin P-IRT, Halal, atau BPOM untuk meningkatkan kepercayaan pembeli.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= BAGIAN 3: HARGA, SATUAN & KETERSEDIAAN STOK ================= */}
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Harga, Satuan & Ketersediaan Stok
          </CardTitle>
          <CardDescription>
            Tentukan harga dengan pemisah ribuan otomatis, satuan produk, dan ketersediaan stok.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Harga Rupiah (Formatted with dots) & Satuan */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="harga-input" className="font-semibold text-neutral-800 dark:text-neutral-200">
                Harga Jual (Rupiah) <span className="text-rose-500">*</span>
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 font-semibold text-neutral-500 dark:text-neutral-400 text-sm">
                  Rp
                </span>
                <Input
                  id="harga-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="Contoh: 120.000"
                  value={rawHarga}
                  onChange={handleHargaChange}
                  disabled={loading}
                  className="pl-10 font-mono font-semibold text-neutral-900 dark:text-neutral-100"
                />
              </div>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Ketik angka murni, tanda titik (.) ribuan akan diformat otomatis.
              </p>
              {errors.harga && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.harga.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="satuan" className="font-semibold text-neutral-800 dark:text-neutral-200">
                Satuan / Kemasan Produk <span className="text-rose-500">*</span>
              </Label>
              <select
                id="satuan"
                disabled={loading}
                {...register('satuan')}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm shadow-xs focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {SATUAN_OPTIONS.map((sat) => (
                  <option key={sat} value={sat} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                    {sat}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Menjelaskan harga tersebut per apa (misal: Rp 120.000 / Box).
              </p>
            </div>
          </div>

          {/* Ketersediaan Stok */}
          <div className="space-y-2 pt-2">
            <Label className="font-semibold text-neutral-800 dark:text-neutral-200">
              Status Ketersediaan Produk <span className="text-rose-500">*</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedKondisiStok === 'ready_stock'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/80'
                }`}
              >
                <input
                  type="radio"
                  value="ready_stock"
                  className="sr-only"
                  {...register('kondisi_stok')}
                />
                <CheckCircle2
                  className={`h-5 w-5 shrink-0 ${
                    selectedKondisiStok === 'ready_stock'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-neutral-300 dark:text-neutral-600'
                  }`}
                />
                <div>
                  <div className="font-bold text-sm text-neutral-900 dark:text-white">Ready Stock</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Stok siap langsung dikirim</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedKondisiStok === 'pre_order'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/80'
                }`}
              >
                <input
                  type="radio"
                  value="pre_order"
                  className="sr-only"
                  {...register('kondisi_stok')}
                />
                <Clock
                  className={`h-5 w-5 shrink-0 ${
                    selectedKondisiStok === 'pre_order'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-neutral-300 dark:text-neutral-600'
                  }`}
                />
                <div>
                  <div className="font-bold text-sm text-neutral-900 dark:text-white">Pre-Order (PO)</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Dibuat berdasarkan pesanan</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedKondisiStok === 'stok_terbatas'
                    ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/40 ring-1 ring-amber-500'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/80'
                }`}
              >
                <input
                  type="radio"
                  value="stok_terbatas"
                  className="sr-only"
                  {...register('kondisi_stok')}
                />
                <AlertCircle
                  className={`h-5 w-5 shrink-0 ${
                    selectedKondisiStok === 'stok_terbatas'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-neutral-300 dark:text-neutral-600'
                  }`}
                />
                <div>
                  <div className="font-bold text-sm text-neutral-900 dark:text-white">Stok Terbatas</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Persediaan cepat habis</div>
                </div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= BAGIAN 4: PENGIRIMAN, KONTAK & LOKASI PENJUAL ================= */}
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Jangkauan Pengiriman & Kontak Penjual
          </CardTitle>
          <CardDescription>
            Pilih metode pengiriman yang Anda layani serta nomor WhatsApp untuk pesanan otomatis.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Metode Pengiriman Checkbox */}
          <div className="space-y-2">
            <Label className="font-semibold text-neutral-800 dark:text-neutral-200">
              Metode / Jangkauan Pengiriman yang Dilayani <span className="text-rose-500">*</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PENGIRIMAN_OPTIONS.map((opt) => {
                const isSelected = metodeKirim.includes(opt)
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleTogglePengiriman(opt)}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#186049] bg-[#186049]/10 dark:bg-[#186049]/25 font-semibold text-[#186049] dark:text-[#ECE8AF]'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/80'
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        isSelected
                          ? 'border-[#186049] bg-[#186049] text-[#ECE8AF]'
                          : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Nomor WhatsApp */}
          <div className="space-y-1.5">
            <Label htmlFor="no_wa" className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Nomor WhatsApp Penjual <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="no_wa"
              placeholder="Contoh: 08123456789 atau 628123456789"
              disabled={loading}
              {...register('no_wa')}
            />
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Pembeli yang menekan tombol pesan akan langsung terhubung ke nomor WhatsApp ini dengan format pemesanan otomatis.
            </p>
            {errors.no_wa && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.no_wa.message}</p>
            )}
          </div>

          {/* Alamat Lengkap */}
          <div className="space-y-1.5">
            <Label htmlFor="alamat" className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Alamat Lengkap Toko / Patokan Usaha
            </Label>
            <Input
              id="alamat"
              placeholder="Contoh: Jl. Mawar No. 12, Kel. Sukamaju, Kec. Lowokwaru"
              disabled={loading}
              {...register('alamat')}
            />
            {errors.alamat && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.alamat.message}</p>
            )}
          </div>

          {/* Titik Lokasi Peta Produk (Maps) */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  Titik Lokasi Peta Toko (GPS)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className="h-7 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/50"
              >
                {showMap ? 'Sembunyikan Peta' : '📍 Atur Titik di Peta'}
              </Button>
            </div>

            {currentLat && currentLng ? (
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800/60">
                ✓ Koordinat tersimpan: ({currentLat.toFixed(5)}, {currentLng.toFixed(5)})
              </p>
            ) : (
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Secara otomatis menggunakan koordinat peta dari profil toko Anda jika tidak diubah di sini.
              </p>
            )}

            {showMap && (
              <div className="pt-2">
                <LocationMapPicker
                  initialLat={currentLat}
                  initialLng={currentLng}
                  initialAddress={currentAlamat}
                  onLocationSelect={(loc) => {
                    setValue('latitude', loc.lat)
                    setValue('longitude', loc.lng)
                    if (loc.address && !currentAlamat) {
                      setValue('alamat', loc.address)
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Deskripsi Lengkap Produk */}
          <div className="space-y-1.5">
            <Label htmlFor="deskripsi" className="font-semibold text-neutral-800 dark:text-neutral-200">
              Deskripsi Lengkap Produk
            </Label>
            <Textarea
              id="deskripsi"
              rows={4}
              placeholder="Jelaskan keunggulan produk, komposisi bahan, cara penyajian/penyimpanan, atau catatan penting lainnya..."
              disabled={loading}
              {...register('deskripsi')}
            />
            {errors.deskripsi && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{errors.deskripsi.message}</p>
            )}
          </div>

          {/* Status Etalase Produk (Aktif vs Nonaktif) */}
          <div className="space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-neutral-800 dark:text-neutral-200">
                Status Publikasi di Etalase
              </Label>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  currentIsActive
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/50'
                    : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                }`}
              >
                {currentIsActive ? '🟢 Siap Tayang / Aktif' : '⏸️ Disembunyikan / Nonaktif'}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Pilih apakah produk ini ingin langsung ditampilkan di katalog publik setelah disetujui admin, atau disembunyikan sementara (misal jika stok kosong atau toko sedang libur).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label
                className={`relative flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                  currentIsActive
                    ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <input
                  type="radio"
                  name="is_active_radio"
                  checked={currentIsActive === true}
                  onChange={() => setValue('is_active', true, { shouldValidate: true })}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-neutral-900 dark:text-white block">🟢 Aktifkan Produk</span>
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Produk akan langsung tampil di etalase publik setelah disetujui admin.
                  </span>
                </div>
              </label>

              <label
                className={`relative flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                  !currentIsActive
                    ? 'border-neutral-800 dark:border-neutral-500 bg-neutral-50 dark:bg-neutral-900 ring-1 ring-neutral-800 dark:ring-neutral-500'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <input
                  type="radio"
                  name="is_active_radio"
                  checked={currentIsActive === false}
                  onChange={() => setValue('is_active', false, { shouldValidate: true })}
                  className="mt-1 h-4 w-4 text-neutral-600 focus:ring-neutral-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-neutral-900 dark:text-white block">⏸️ Nonaktifkan Sementara</span>
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Sembunyikan dari katalog publik. Anda bisa mengaktifkannya kapan saja di Dashboard.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {isEditing
              ? 'Catatan: Setiap perubahan akan mengirim produk kembali ke antrean moderasi admin.'
              : 'Produk akan diverifikasi oleh tim admin sebelum tampil di etalase publik.'}
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              asChild
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <Link href="/dashboard">Batal</Link>
            </Button>
            <Button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full sm:w-auto bg-[#186049] hover:bg-[#124b39] text-[#ECE8AF] border border-[#ECE8AF]/20 font-medium shadow-2xs"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : isEditing ? (
                'Simpan Perubahan'
              ) : (
                'Daftarkan Produk'
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
