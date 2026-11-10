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
      return []
    }

    return data || []
  },
  ['categories-list-cache'],
  {
    revalidate: 120,
    tags: ['categories'],
  }
)

/**
 * Mengambil daftar daerah dengan cache server 120 detik (tag: 'regions').
 */
export const getRegions = unstable_cache(
  async () => {
    const supabase = getPublicClient()
    const { data, error } = await supabase
      .from('regions')
      .select('id, nama')
      .order('nama', { ascending: true })

    if (error) {
      return []
    }

    return data || []
  },
  ['regions-list-cache'],
  {
    revalidate: 120,
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
          seller:profiles(id, nama)
        `
        )
        .eq('status', 'approved')
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

    return (productsRes.data || []).map((prod) => ({
      ...prod,
      region: prod.region_id ? regionMap.get(prod.region_id) || null : null,
    }))
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
 * Mengambil produk katalog publik dengan cache server berdasarkan kombinasi parameter.
 */
export async function getApprovedProducts({
  query = '',
  categoryId,
  regionId,
  page = 1,
}: GetApprovedProductsParams) {
  const cleanQuery = query.trim().toLowerCase()
  const cacheKey = `approved-products-${cleanQuery || 'all'}-${categoryId ?? 'all'}-${regionId ?? 'all'}-${page}`

  const fetcher = unstable_cache(
    async () => {
      const supabase = getPublicClient()
      const from = (page - 1) * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      let builder = supabase
        .from('products')
        .select(
          `
          *,
          category:categories(id, nama),
          seller:profiles(id, nama)
        `,
          { count: 'exact' }
        )
        .eq('status', 'approved')

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
        console.error('Error fetching public products:', res.error.message)
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

      const products = (res.data || []).map((prod) => ({
        ...prod,
        region: prod.region_id ? regionMap.get(prod.region_id) || null : null,
      }))

      return {
        products,
        total,
        totalPages,
        currentPage: page,
      }
    },
    [cacheKey],
    {
      revalidate: 60,
      tags: ['products', 'approved-products'],
    }
  )

  return fetcher()
}

/**
 * Mengambil detail produk publik dengan cache server.
 */
export async function getProductDetail(id: string) {
  const fetcher = unstable_cache(
    async () => {
      const supabase = getPublicClient()
      const [productRes, regions] = await Promise.all([
        supabase
          .from('products')
          .select(
            `
            *,
            category:categories(id, nama),
            seller:profiles(id, nama)
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
      return {
        ...product,
        region: product.region_id ? regionMap.get(product.region_id) || null : null,
      }
    },
    [`product-detail-${id}`],
    {
      revalidate: 60,
      tags: ['products', `product-${id}`],
    }
  )

  const product = await fetcher()
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
