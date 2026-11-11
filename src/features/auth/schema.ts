import { z } from 'zod'

export const registerSchema = z.object({
  nama: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter'),
  no_wa: z
    .string()
    .min(10, 'Nomor WhatsApp minimal 10 digit (contoh: 081234567890)')
    .max(20, 'Nomor WhatsApp maksimal 20 karakter'),
  region_id: z.number().nullable().optional(),
  alamat: z.string().max(300, 'Alamat maksimal 300 karakter').nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password tidak boleh kosong'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const sellerProfileSchema = z.object({
  nama: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  no_wa: z
    .string()
    .min(10, 'Nomor WhatsApp minimal 10 digit')
    .max(20, 'Nomor WhatsApp maksimal 20 karakter'),
  region_id: z.number().nullable().optional(),
  alamat: z.string().max(300, 'Alamat maksimal 300 karakter').nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  deskripsi_toko: z.string().max(500, 'Deskripsi maksimal 500 karakter').nullable().optional(),
})

export type SellerProfileInput = z.infer<typeof sellerProfileSchema>
