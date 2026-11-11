'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'

async function checkIsAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Akses ditolak: pengguna belum masuk.')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Akses ditolak: hanya administrator yang memiliki izin.')
  }

  return { supabase, user }
}

export async function approveProductAction(productId: string) {
  try {
    const { supabase } = await checkIsAdmin()

    const { error } = await supabase
      .from('products')
      .update({
        status: 'approved',
        alasan_tolak: null,
      })
      .eq('id', productId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath('/admin/moderasi')
    revalidatePath('/')
    revalidatePath(`/produk/${productId}`)
    revalidateTag('products', 'max')
    revalidateTag('approved-products', 'max')
    revalidateTag('popular-products', 'max')
    revalidateTag(`product-${productId}`, 'max')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menyetujui produk'
    return { success: false, error: message }
  }
}

export async function rejectProductAction(productId: string, alasan: string) {
  try {
    if (!alasan || alasan.trim().length < 3) {
      return { success: false, error: 'Alasan penolakan wajib diisi (minimal 3 karakter).' }
    }

    const { supabase } = await checkIsAdmin()

    const { error } = await supabase
      .from('products')
      .update({
        status: 'rejected',
        alasan_tolak: alasan.trim(),
        is_featured: false,
      })
      .eq('id', productId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath('/admin/moderasi')
    revalidatePath('/')
    revalidateTag('products', 'max')
    revalidateTag('approved-products', 'max')
    revalidateTag('popular-products', 'max')
    revalidateTag(`product-${productId}`, 'max')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menolak produk'
    return { success: false, error: message }
  }
}

export async function toggleFeaturedAction(productId: string, isFeatured: boolean) {
  try {
    const { supabase } = await checkIsAdmin()

    const { error } = await supabase
      .from('products')
      .update({
        is_featured: isFeatured,
      })
      .eq('id', productId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/moderasi')
    revalidatePath('/')
    revalidateTag('products', 'max')
    revalidateTag('featured-products', 'max')
    revalidateTag('popular-products', 'max')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengubah status unggulan'
    return { success: false, error: message }
  }
}

// ---------------- MASTER KATEGORI ACTIONS ----------------

export async function createCategoryAction(nama: string) {
  try {
    if (!nama || nama.trim().length < 2) {
      return { success: false, error: 'Nama kategori minimal 2 karakter.' }
    }

    const { supabase } = await checkIsAdmin()

    const { data, error } = await supabase
      .from('categories')
      .insert({
        nama: nama.trim(),
      })
      .select('id, nama')
      .single()

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'Kategori dengan nama tersebut sudah ada.' }
      }
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/master')
    revalidatePath('/')
    revalidatePath('/dashboard/produk/baru')
    revalidateTag('categories', 'max')
    return { success: true, item: data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menambah kategori'
    return { success: false, error: message }
  }
}

export async function updateCategoryAction(id: number, nama: string) {
  try {
    if (!nama || nama.trim().length < 2) {
      return { success: false, error: 'Nama kategori minimal 2 karakter.' }
    }

    const { supabase } = await checkIsAdmin()

    const { error } = await supabase
      .from('categories')
      .update({ nama: nama.trim() })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/master')
    revalidatePath('/')
    revalidateTag('categories', 'max')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui kategori'
    return { success: false, error: message }
  }
}

export async function deleteCategoryAction(id: number) {
  try {
    const { supabase } = await checkIsAdmin()

    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/master')
    revalidatePath('/')
    revalidateTag('categories', 'max')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus kategori'
    return { success: false, error: message }
  }
}

// ---------------- MASTER DAERAH (REGIONS) ACTIONS ----------------

export async function createRegionAction(nama: string) {
  try {
    if (!nama || nama.trim().length < 2) {
      return { success: false, error: 'Nama daerah minimal 2 karakter.' }
    }

    const { supabase } = await checkIsAdmin()

    const { data, error } = await supabase
      .from('regions')
      .insert({
        nama: nama.trim(),
      })
      .select('id, nama')
      .single()

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'Daerah dengan nama tersebut sudah ada.' }
      }
      if (error.code === 'PGRST205' || error.message.includes('regions')) {
        return {
          success: false,
          error:
            "Tabel 'regions' belum dibuat di database Supabase Anda. Silakan jalankan file migrasi '0002_add_regions.sql' di Supabase SQL Editor.",
        }
      }
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/master')
    revalidatePath('/')
    revalidatePath('/dashboard/produk/baru')
    revalidateTag('regions', 'max')
    return { success: true, item: data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menambah daerah'
    return { success: false, error: message }
  }
}

export async function updateRegionAction(id: number, nama: string) {
  try {
    if (!nama || nama.trim().length < 2) {
      return { success: false, error: 'Nama daerah minimal 2 karakter.' }
    }

    const { supabase } = await checkIsAdmin()

    const { error } = await supabase
      .from('regions')
      .update({ nama: nama.trim() })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/master')
    revalidatePath('/')
    revalidateTag('regions', 'max')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui daerah'
    return { success: false, error: message }
  }
}

export async function deleteRegionAction(id: number) {
  try {
    const { supabase } = await checkIsAdmin()

    const { error } = await supabase.from('regions').delete().eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/master')
    revalidatePath('/')
    revalidateTag('regions', 'max')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus daerah'
    return { success: false, error: message }
  }
}

// ---------------- MANAJEMEN PENGGUNA (USERS) ACTIONS ----------------

export async function adminUpdateUserAction(
  userId: string,
  data: { nama: string; role: 'seller' | 'admin' }
) {
  try {
    const { supabase } = await checkIsAdmin()

    if (!data.nama || data.nama.trim().length < 2) {
      return { success: false, error: 'Nama pengguna minimal 2 karakter.' }
    }

    if (!['seller', 'admin'].includes(data.role)) {
      return { success: false, error: 'Role pengguna tidak valid.' }
    }

    // 1. Coba lewat RPC admin_update_user
    const { error: rpcErr } = await supabase.rpc('admin_update_user', {
      target_user_id: userId,
      target_nama: data.nama.trim(),
      target_role: data.role,
    })

    if (rpcErr) {
      // 2. Fallback direct update ke tabel profiles
      const { error: directErr } = await supabase
        .from('profiles')
        .update({
          nama: data.nama.trim(),
          role: data.role,
        })
        .eq('id', userId)

      if (directErr) {
        return { success: false, error: directErr.message }
      }
    }

    revalidatePath('/admin')
    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${userId}`)
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui pengguna'
    return { success: false, error: message }
  }
}

export async function adminDeleteUserAction(userId: string) {
  try {
    const { supabase, user } = await checkIsAdmin()

    if (user.id === userId) {
      return {
        success: false,
        error: 'Anda tidak dapat menghapus akun Anda sendiri saat sedang masuk.',
      }
    }

    // 1. Hitung jumlah produk yang terkait
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', userId)

    // 2. Coba lewat RPC admin_delete_user
    const { data: rpcData, error: rpcErr } = await supabase.rpc('admin_delete_user', {
      target_user_id: userId,
    })

    if (rpcErr) {
      // 3. Fallback cascade: hapus produk terlebih dahulu agar tidak terjadi error foreign key
      const { error: prodErr } = await supabase
        .from('products')
        .delete()
        .eq('seller_id', userId)

      if (prodErr) {
        return {
          success: false,
          error: `Gagal menghapus produk penjual: ${prodErr.message}`,
        }
      }

      // Hapus profile
      const { error: profileErr } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (profileErr) {
        return {
          success: false,
          error: `Gagal menghapus profil pengguna: ${profileErr.message}`,
        }
      }
    }

    revalidatePath('/admin')
    revalidatePath('/admin/users')
    revalidatePath('/admin/moderasi')
    revalidatePath('/')
    revalidateTag('products', 'max')
    revalidateTag('approved-products', 'max')
    revalidateTag('popular-products', 'max')

    const deletedCount =
      rpcData && typeof rpcData === 'object' && 'deleted_products_count' in rpcData
        ? Number((rpcData as { deleted_products_count?: number }).deleted_products_count)
        : productCount || 0

    return {
      success: true,
      deletedProductsCount: deletedCount,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus pengguna'
    return { success: false, error: message }
  }
}
