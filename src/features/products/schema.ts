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
  category_id: z.number().nullable(),
  region_id: z.number().nullable(),
  no_wa: z.string().min(1, 'Nomor WhatsApp wajib diisi'),
  alamat: z.string().max(200, 'Alamat maksimal 200 karakter').nullable(),
  foto_url: z.string().url('URL foto tidak valid').nullable(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
