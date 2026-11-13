'use server'

import { createClient } from '@/lib/supabase/server'
import {
  registerSchema,
  loginSchema,
  sellerProfileSchema,
  type RegisterInput,
  type LoginInput,
  type SellerProfileInput,
} from './schema'
import { normalizeWhatsappNumber } from '@/lib/whatsapp'
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

  const normalizedWa = normalizeWhatsappNumber(parsed.data.no_wa)
  if (!normalizedWa) {
    return {
      success: false,
      error: 'Nomor WhatsApp tidak valid (contoh: 08123456789 atau 628123456789)',
    }
  }

  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        nama: parsed.data.nama,
        region_id: parsed.data.region_id || null,
        alamat: parsed.data.alamat || null,
        latitude: parsed.data.latitude || null,
        longitude: parsed.data.longitude || null,
        no_wa: normalizedWa,
      },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { success: false, error: 'Email ini sudah terdaftar' }
    }
    return { success: false, error: error.message }
  }

  // Jika session langsung dibuat, pastikan kolom profiles terisi lengkap
  if (authData.user?.id) {
    await supabase
      .from('profiles')
      .update({
        nama: parsed.data.nama,
        region_id: parsed.data.region_id || null,
        alamat: parsed.data.alamat || null,
        latitude: parsed.data.latitude || null,
        longitude: parsed.data.longitude || null,
        no_wa: normalizedWa,
      })
      .eq('id', authData.user.id)
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

export async function updateSellerProfileAction(
  data: SellerProfileInput
): Promise<AuthActionResult> {
  const parsed = sellerProfileSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Data profil tidak valid',
    }
  }

  const normalizedWa = normalizeWhatsappNumber(parsed.data.no_wa)
  if (!normalizedWa) {
    return {
      success: false,
      error: 'Nomor WhatsApp tidak valid (contoh: 08123456789 atau 628123456789)',
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Silakan masuk terlebih dahulu' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      nama: parsed.data.nama,
      no_wa: normalizedWa,
      region_id: parsed.data.region_id || null,
      alamat: parsed.data.alamat || null,
      latitude: parsed.data.latitude || null,
      longitude: parsed.data.longitude || null,
      deskripsi_toko: parsed.data.deskripsi_toko || null,
    })
    .eq('id', user.id)

  if (error) {
    return { success: false, error: error.message || 'Gagal menyimpan profil toko' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profil')
  revalidatePath('/')
  return { success: true }
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
    .select(`
      *,
      region:regions(id, nama)
    `)
    .eq('id', user.id)
    .single()

  if (profile) {
    return { user, profile }
  }

  // Fallback jika join region bermasalah
  const { data: fallbackProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (fallbackProfile) {
    return { user, profile: fallbackProfile }
  }

  // Fallback darurat jika baris profiles belum ada: gunakan metadata auth
  const metadataRole = (user.user_metadata?.role as 'admin' | 'seller') || 'seller'
  const emergencyProfile = {
    id: user.id,
    nama:
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.nama as string) ||
      user.email?.split('@')[0] ||
      'Pengguna',
    role: metadataRole,
    created_at: user.created_at,
    alamat: null,
    latitude: null,
    longitude: null,
    no_wa: null,
    region_id: null,
    deskripsi_toko: null,
  }

  return { user, profile: emergencyProfile }
})
