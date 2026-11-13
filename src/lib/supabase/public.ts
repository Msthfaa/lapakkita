import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { env } from '@/lib/env'

let cachedPublicClient: SupabaseClient<Database> | null = null

/**
 * Client Supabase publik tanpa cookie untuk query publik & server components.
 * Menggunakan singleton instance untuk memanfaatkan koneksi HTTP keep-alive / persistent connection.
 */
export function getPublicClient(): SupabaseClient<Database> {
  if (!cachedPublicClient) {
    cachedPublicClient = createSupabaseClient<Database>(
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
  return cachedPublicClient
}
