import { createClient } from '@/lib/supabase/server'
import { getPublicClient } from '@/lib/supabase/public'
import { ITEMS_PER_PAGE, MAX_FEATURED_PRODUCTS } from '@/lib/constants'
import { unstable_cache } from 'next/cache'

/**
 * Mengambil daftar kategori dengan cache server 120 detik (tag: 'categories').
 * Respons instan (<5ms) tanpa bolak-balik koneksi Supabase di setiap navigasi.
 */
export const getCategories = unstable_cache(
  async () => {
    const supabase = getPublicClient()
    const { data, error } = await supabase
      .from('categories')
      .select('id, nama')
      .order('nama', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error.message)
      throw error
    }

    return data || []
  },
  ['categories-list-cache-v2'],
  {
    revalidate: 60,
    tags: ['categories'],
  }
)

/**
 * Mengambil daftar daerah dengan cache server 60 detik (tag: 'regions').
 */
export const getRegions = unstable_cache(
  async () => {
    const supabase = getPublicClient()
    const { data, error } = await supabase
      .from('regions')
      .select('id, nama')
      .order('nama', { ascending: true })

    if (error) {
      console.error('Error fetching regions:', error.message)
      throw error
    }

    return data || []
  },
  ['regions-list-cache-v2'],
  {
    revalidate: 60,
    tags: ['regions'],
  }
)

export async function getMyProducts() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const [productsRes, regions] = await Promise.all([
    supabase
      .from('products')
      .select(
        `
        *,
        category:categories(id, nama),
        wa_clicks(count)
      `
      )
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false }),
    getRegions().catch(() => []),
  ])

  if (productsRes.error) {
    console.error('Error fetching seller products:', productsRes.error.message)
    return []
  }

  const regionMap = new Map((regions || []).map((r) => [r.id, r]))

  return (productsRes.data || []).map((prod) => ({
    ...prod,
    total_clicks: prod.wa_clicks?.[0]?.count || 0,
    region: prod.region_id ? regionMap.get(prod.region_id) || null : null,
  }))
}

export async function getMyProductById(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('seller_id', user.id)
    .single()

  if (error) {
    return null
  }

  return data
}

/**
 * Mengambil produk unggulan terverifikasi dengan cache server (tag: 'featured-products').
 */
export const getFeaturedProducts = unstable_cache(
  async () => {
    const supabase = getPublicClient()
    const [productsRes, regions] = await Promise.all([
      supabase
        .from('products')
        .select(
          `
          *,
          category:categories(id, nama),
          seller:profiles(id, nama, region_id, alamat)
        `
        )
        .eq('status', 'approved')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(MAX_FEATURED_PRODUCTS),
      getRegions().catch(() => []),
    ])

    if (productsRes.error) {
      console.error('Error fetching featured products:', productsRes.error.message)
      return []
    }

    const regionMap = new Map((regions || []).map((r) => [r.id, r]))

    return (productsRes.data || []).map((prod) => {
      const regId = prod.region_id || prod.seller?.region_id
      return {
        ...prod,
        alamat: prod.alamat || prod.seller?.alamat || null,
        region: regId ? regionMap.get(regId) || null : null,
      }
    })
  },
  ['featured-products-cache'],
  {
    revalidate: 60,
    tags: ['products', 'featured-products'],
  }
)

interface GetApprovedProductsParams {
  query?: string
  categoryId?: number
  regionId?: number
  page?: number
}

/**
 * Mengambil produk katalog publik secara langsung dan andal dengan retry otomatis.
 */
export async function getApprovedProducts({
  query = '',
  categoryId,
  regionId,
  page = 1,
}: GetApprovedProductsParams) {
  const cleanQuery = query.trim().toLowerCase()
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const supabase = getPublicClient()
      let builder = supabase
        .from('products')
        .select(
          `
          *,
          category:categories(id, nama),
          seller:profiles(id, nama, region_id, alamat)
        `,
          { count: 'exact' }
        )
        .eq('status', 'approved')
        .eq('is_active', true)

      if (cleanQuery) {
        builder = builder.or(`nama.ilike.%${cleanQuery}%,deskripsi.ilike.%${cleanQuery}%`)
      }

      if (categoryId && !isNaN(categoryId)) {
        builder = builder.eq('category_id', categoryId)
      }

      if (regionId && !isNaN(regionId)) {
        builder = builder.eq('region_id', regionId)
      }

      const [res, regions] = await Promise.all([
        builder.order('created_at', { ascending: false }).range(from, to),
        getRegions().catch(() => []),
      ])

      if (res.error) {
        console.error(`Attempt ${attempt} error fetching public products:`, res.error.message)
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 200 * attempt))
          continue
        }
        return {
          products: [],
          total: 0,
          totalPages: 1,
          currentPage: page,
        }
      }

      const total = res.count || 0
      const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))
      const regionMap = new Map((regions || []).map((r) => [r.id, r]))

      const products = (res.data || []).map((prod) => {
        const regId = prod.region_id || prod.seller?.region_id
        return {
          ...prod,
          alamat: prod.alamat || prod.seller?.alamat || null,
          region: regId ? regionMap.get(regId) || null : null,
        }
      })

      return {
        products,
        total,
        totalPages,
        currentPage: page,
      }
    } catch (err: unknown) {
      console.error(`Attempt ${attempt} exception fetching products:`, err)
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 200 * attempt))
        continue
      }
      return {
        products: [],
        total: 0,
        totalPages: 1,
        currentPage: page,
      }
    }
  }

  return {
    products: [],
    total: 0,
    totalPages: 1,
    currentPage: page,
  }
}

/**
 * Mengambil detail produk publik dengan cache server.
 */
const fetchProductDetailInternal = unstable_cache(
  async (id: string) => {
    const supabase = getPublicClient()
    const [productRes, regions] = await Promise.all([
      supabase
        .from('products')
        .select(
          `
          *,
          category:categories(id, nama),
          seller:profiles(id, nama, region_id, alamat, latitude, longitude, no_wa)
        `
        )
        .eq('id', id)
        .single(),
      getRegions().catch(() => []),
    ])

    if (productRes.error || !productRes.data) {
      return null
    }

    const product = productRes.data
    const regionMap = new Map((regions || []).map((r) => [r.id, r]))
    const finalRegionId = product.region_id || product.seller?.region_id
    const finalAlamat = product.alamat || product.seller?.alamat
    const finalLat = product.latitude ?? product.seller?.latitude ?? null
    const finalLng = product.longitude ?? product.seller?.longitude ?? null

    return {
      ...product,
      alamat: finalAlamat,
      latitude: finalLat,
      longitude: finalLng,
      region: finalRegionId ? regionMap.get(finalRegionId) || null : null,
    }
  },
  ['product-detail-cache'],
  {
    revalidate: 60,
    tags: ['products'],
  }
)

export async function getProductDetail(id: string) {
  const product = await fetchProductDetailInternal(id)
  if (!product) return null

  // Jika produk belum approved (misal: pending/rejected), cek otorisasi pemilik atau admin
  if (product.status !== 'approved') {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    if (user.id !== product.seller_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return null
      }
    }
  }

  return product
}

/**
 * Mengambil produk terpopuler berdasarkan jumlah klik WhatsApp (carousel hero).
 */
export const getPopularProducts = unstable_cache(
  async (limit = 12) => {
    const supabase = getPublicClient()
    const [productsRes, regions] = await Promise.all([
      supabase
        .from('products')
        .select(
          `
          *,
          category:categories(id, nama),
          seller:profiles(id, nama),
          wa_clicks(count)
        `
        )
        .eq('status', 'approved')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit),
      getRegions().catch(() => []),
    ])

    if (productsRes.error) {
      console.error('Error fetching popular products:', productsRes.error.message)
      return []
    }

    const regionMap = new Map((regions || []).map((r) => [r.id, r]))

    return (productsRes.data || [])
      .map((prod) => ({
        ...prod,
        total_clicks: (prod.wa_clicks as unknown as Array<{ count: number }>)?.[0]?.count ?? 0,
        region: prod.region_id ? regionMap.get(prod.region_id) || null : null,
      }))
      .sort((a, b) => b.total_clicks - a.total_clicks)
  },
  ['popular-products-cache'],
  {
    revalidate: 60,
    tags: ['products', 'popular-products'],
  }
)


/**
 * Mengambil produk lain yang dijual oleh toko / penjual yang sama.
 */
export async function getProductsBySeller(sellerId: string, currentProductId?: string, limit = 8) {
  if (!sellerId) return []

  const supabase = getPublicClient()
  const [productsRes, regions] = await Promise.all([
    supabase
      .from('products')
      .select(
        `
        *,
        category:categories(id, nama),
        seller:profiles(id, nama, region_id, alamat)
      `
      )
      .eq('seller_id', sellerId)
      .eq('status', 'approved')
      .eq('is_active', true)
      .neq('id', currentProductId || '')
      .order('created_at', { ascending: false })
      .limit(limit),
    getRegions().catch(() => []),
  ])

  if (productsRes.error) {
    console.error('Error fetching seller products:', productsRes.error.message)
    return []
  }

  const regionMap = new Map((regions || []).map((r) => [r.id, r]))

  return (productsRes.data || []).map((prod) => {
    const regId = prod.region_id || prod.seller?.region_id
    return {
      ...prod,
      alamat: prod.alamat || prod.seller?.alamat || null,
      region: regId ? regionMap.get(regId) || null : null,
    }
  })
}

/**
 * Mengambil rekomendasi produk dari kategori yang sama sebagai pelengkap.
 */
export async function getRelatedProducts(categoryId?: number | null, currentProductId?: string, limit = 4) {
  const supabase = getPublicClient()
  let query = supabase
    .from('products')
    .select(
      `
      *,
      category:categories(id, nama),
      seller:profiles(id, nama, region_id, alamat)
    `
    )
    .eq('status', 'approved')
    .eq('is_active', true)

  if (currentProductId) {
    query = query.neq('id', currentProductId)
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const [productsRes, regions] = await Promise.all([
    query.order('created_at', { ascending: false }).limit(limit),
    getRegions().catch(() => []),
  ])

  if (productsRes.error) {
    return []
  }

  const regionMap = new Map((regions || []).map((r) => [r.id, r]))

  return (productsRes.data || []).map((prod) => {
    const regId = prod.region_id || prod.seller?.region_id
    return {
      ...prod,
      alamat: prod.alamat || prod.seller?.alamat || null,
      region: regId ? regionMap.get(regId) || null : null,
    }
  })
}
