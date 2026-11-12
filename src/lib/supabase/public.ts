import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { env } from '@/lib/env'
import dns from 'node:dns'

try {
  dns.setDefaultResultOrder('ipv4first')
} catch {}

/**
 * Client Supabase publik tanpa cookie untuk query publik & server components.
 * Selalu membuat instance andal tanpa risiko socket hangup/ECONNRESET.
 */
export function getPublicClient() {
  return createSupabaseClient<Database>(
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
