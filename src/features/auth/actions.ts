'use server'

import { createClient } from '@/lib/supabase/server'
import { registerSchema, loginSchema, type RegisterInput, type LoginInput } from './schema'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cache } from 'react'

export type AuthActionResult = {
  success: boolean
  error?: string
  redirectTo?: string
}

export async function signUpAction(data: RegisterInput): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Input tidak valid',
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        nama: parsed.data.nama,
      },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { success: false, error: 'Email ini sudah terdaftar' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true, redirectTo: '/dashboard' }
}

export async function signInAction(data: LoginInput): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Input tidak valid',
    }
  }

  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error || !authData.user) {
    return { success: false, error: 'Email atau kata sandi tidak cocok' }
  }

  // Cek role pengguna di tabel profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single()

  const targetPath = profile?.role === 'admin' ? '/admin' : '/dashboard'

  revalidatePath('/', 'layout')
  return { success: true, redirectTo: targetPath }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/masuk')
}

export const getUserAndProfile = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, profile: null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
})
