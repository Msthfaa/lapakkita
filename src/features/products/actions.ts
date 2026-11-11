'use server'

import { createClient } from '@/lib/supabase/server'
import { productFormSchema, type ProductFormValues } from './schema'
import { normalizeWhatsappNumber } from '@/lib/whatsapp'
import { revalidatePath, revalidateTag } from 'next/cache'

export type ActionResult<T = unknown> = {
  success: boolean
  error?: string
  data?: T
}

export async function createProductAction(values: ProductFormValues): Promise<ActionResult<{ id: string }>> {
  const parsed = productFormSchema.safeParse(values)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Data produk tidak valid',
    }
  }

  const normalizedWa = normalizeWhatsappNumber(parsed.data.no_wa)
  if (!normalizedWa) {
    return {
      success: false,
      error: 'Format nomor WhatsApp tidak valid (harus 10-15 digit, contoh: 08123456789 atau 628123456789)',
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Silakan masuk terlebih dahulu' }
  }

  // Admin tidak boleh memasang produk (hanya role seller)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') {
    return {
      success: false,
      error: 'Administrator tidak diperbolehkan menambah produk. Gunakan akun penjual.',
    }
  }

  const coverPhoto = parsed.data.foto_url || parsed.data.foto_urls[0] || null
  const photoList =
    parsed.data.foto_urls.length > 0
      ? parsed.data.foto_urls
      : coverPhoto
        ? [coverPhoto]
        : []

  const { data, error } = await supabase
    .from('products')
    .insert({
      seller_id: user.id,
      nama: parsed.data.nama,
      deskripsi: parsed.data.deskripsi || '',
      harga: parsed.data.harga,
      satuan: parsed.data.satuan || 'Pcs',
      kondisi_stok: parsed.data.kondisi_stok || 'ready_stock',
      metode_pengiriman: parsed.data.metode_pengiriman || ['Lokal'],
      varian: parsed.data.varian || null,
      no_izin: parsed.data.no_izin || null,
      category_id: parsed.data.category_id || null,
      region_id: parsed.data.region_id || null,
      no_wa: normalizedWa,
      alamat: parsed.data.alamat || null,
      latitude: parsed.data.latitude ?? null,
      longitude: parsed.data.longitude ?? null,
      foto_url: coverPhoto,
      foto_urls: photoList,
      is_active: parsed.data.is_active ?? true,
      status: 'pending',
      is_featured: false,
    })
    .select('id')
    .single()

  if (error || !data) {
    return { success: false, error: error?.message || 'Gagal menambahkan produk' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/')
  revalidateTag('products', 'max')
  revalidateTag('approved-products', 'max')
  return { success: true, data: { id: data.id } }
}

export async function updateProductAction(
  productId: string,
  values: ProductFormValues
): Promise<ActionResult> {
  const parsed = productFormSchema.safeParse(values)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Data produk tidak valid',
    }
  }

  const normalizedWa = normalizeWhatsappNumber(parsed.data.no_wa)
  if (!normalizedWa) {
    return {
      success: false,
      error: 'Format nomor WhatsApp tidak valid (harus 10-15 digit, contoh: 08123456789 atau 628123456789)',
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Silakan masuk terlebih dahulu' }
  }

  // Admin tidak boleh mengubah produk penjual
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') {
    return {
      success: false,
      error: 'Administrator tidak diperbolehkan mengubah produk penjual.',
    }
  }

  const coverPhoto = parsed.data.foto_url || parsed.data.foto_urls[0] || null
  const photoList =
    parsed.data.foto_urls.length > 0
      ? parsed.data.foto_urls
      : coverPhoto
        ? [coverPhoto]
        : []

  // Update data. Catatan: Trigger DB guard_product_update akan otomatis
  // mengembalikan status ke 'pending' dan mengosongkan alasan_tolak untuk non-admin.
  const { error } = await supabase
    .from('products')
    .update({
      nama: parsed.data.nama,
      deskripsi: parsed.data.deskripsi || '',
      harga: parsed.data.harga,
      satuan: parsed.data.satuan || 'Pcs',
      kondisi_stok: parsed.data.kondisi_stok || 'ready_stock',
      metode_pengiriman: parsed.data.metode_pengiriman || ['Lokal'],
      varian: parsed.data.varian || null,
      no_izin: parsed.data.no_izin || null,
      category_id: parsed.data.category_id || null,
      region_id: parsed.data.region_id || null,
      no_wa: normalizedWa,
      alamat: parsed.data.alamat || null,
      latitude: parsed.data.latitude ?? null,
      longitude: parsed.data.longitude ?? null,
      foto_url: coverPhoto,
      foto_urls: photoList,
      is_active: parsed.data.is_active,
    })
    .eq('id', productId)
    .eq('seller_id', user.id)

  if (error) {
    return { success: false, error: error.message || 'Gagal memperbarui produk' }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/produk/${productId}`)
  revalidatePath('/')
  revalidateTag('products', 'max')
  revalidateTag(`product-${productId}`, 'max')
  return { success: true }
}

export async function deleteProductAction(productId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Silakan masuk terlebih dahulu' }
  }

  // Ambil data produk untuk mengetahui foto_url sebelum dihapus
  const { data: prod } = await supabase
    .from('products')
    .select('foto_url, seller_id')
    .eq('id', productId)
    .single()

  if (!prod) {
    return { success: false, error: 'Produk tidak ditemukan' }
  }

  // Hapus produk dari database (RLS memastikan hanya pemilik atau admin yang bisa)
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) {
    return { success: false, error: error.message || 'Gagal menghapus produk' }
  }

  // Hapus file foto dari Storage jika tersimpan di bucket product-images
  if (prod.foto_url && prod.foto_url.includes('product-images/')) {
    try {
      const parts = prod.foto_url.split('product-images/')
      if (parts[1]) {
        const filePath = decodeURIComponent(parts[1])
        await supabase.storage.from('product-images').remove([filePath])
      }
    } catch (e) {
      console.warn('Gagal menghapus foto dari storage:', e)
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/')
  revalidateTag('products', 'max')
  revalidateTag(`product-${productId}`, 'max')
  return { success: true }
}

export async function recordWaClickAction(productId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('wa_clicks')
    .insert({
      product_id: productId,
    })

  if (error) {
    console.warn('Gagal mencatat wa_clicks:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Aksi bagi pedagang/penjual untuk mengaktifkan atau menonaktifkan produk di etalase.
 * Toggling ini tidak mereset status 'approved' karena tidak ada perubahan isi konten.
 */
export async function toggleProductActiveAction(
  productId: string,
  nextActive: boolean
): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Silakan masuk terlebih dahulu' }
  }

  // Pastikan produk milik user yang sedang login
  const { data: prod } = await supabase
    .from('products')
    .select('seller_id, nama')
    .eq('id', productId)
    .single()

  if (!prod) {
    return { success: false, error: 'Produk tidak ditemukan' }
  }

  if (prod.seller_id !== user.id) {
    return {
      success: false,
      error: 'Anda hanya dapat mengubah status produk milik Anda sendiri.',
    }
  }

  const { error } = await supabase
    .from('products')
    .update({ is_active: nextActive })
    .eq('id', productId)
    .eq('seller_id', user.id)

  if (error) {
    return { success: false, error: error.message || 'Gagal mengubah status etalase produk' }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/produk/${productId}`)
  revalidatePath('/')
  revalidateTag('products', 'max')
  revalidateTag('approved-products', 'max')
  revalidateTag('featured-products', 'max')
  revalidateTag(`product-${productId}`, 'max')

  return { success: true }
}

