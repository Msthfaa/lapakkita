import { z } from 'zod'

export const productFormSchema = z.object({
  nama: z
    .string()
    .min(3, 'Nama produk minimal 3 karakter')
    .max(100, 'Nama produk maksimal 100 karakter'),
  deskripsi: z
    .string()
    .max(2000, 'Deskripsi maksimal 2000 karakter'),
  harga: z
    .number()
    .int('Harga harus berupa bilangan bulat')
    .min(0, 'Harga tidak boleh kurang dari 0'),
  satuan: z.string().min(1, 'Pilih satuan produk'),
  kondisi_stok: z.enum(['ready_stock', 'pre_order', 'stok_terbatas']),
  metode_pengiriman: z.array(z.string()),
  varian: z.string().max(100, 'Varian maksimal 100 karakter').nullable().optional(),
  no_izin: z.string().max(100, 'Nomor izin maksimal 100 karakter').nullable().optional(),
  category_id: z.number().nullable(),
  region_id: z.number().nullable(),
  no_wa: z.string().min(1, 'Nomor WhatsApp wajib diisi'),
  alamat: z.string().max(200, 'Alamat maksimal 200 karakter').nullable(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  foto_url: z.string().nullable().optional(),
  foto_urls: z.array(z.string()),
  is_active: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
