import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { env } from '@/lib/env'
import dns from 'node:dns'

try {
  dns.setDefaultResultOrder('ipv4first')
} catch {}

let publicClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

/**
 * Client Supabase publik tanpa cookie untuk query publik & server caching.
 * Menggunakan koneksi reusable (keep-alive) dan aman digunakan di dalam unstable_cache.
 */
export function getPublicClient() {
  if (!publicClient) {
    publicClient = createSupabaseClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )
  }
  return publicClient
}
