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
})

export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password tidak boleh kosong'),
})

export type LoginInput = z.infer<typeof loginSchema>
