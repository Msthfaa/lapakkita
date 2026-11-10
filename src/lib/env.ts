import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL harus berupa URL yang valid'),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY wajib diisi'),
  NEXT_PUBLIC_SITE_URL: z.string().default('http://localhost:3000'),
})

const rawPublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Normalisasi URL Supabase: hapus /rest/v1 atau trailing slash jika tertempel
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? process.env.NEXT_PUBLIC_SUPABASE_URL.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
  : ''

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: rawUrl,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: rawPublishableKey,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
})

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format())
  throw new Error('Konfigurasi environment variable tidak valid. Periksa file .env.local Anda.')
}

export const env = parsed.data
