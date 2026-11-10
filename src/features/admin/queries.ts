import { createClient } from '@/lib/supabase/server'
import { getRegions } from '@/features/products/queries'

export async function getAdminStats() {
  const supabase = await createClient()

  const [pendingRes, approvedRes, rejectedRes, sellersRes] = await Promise.all([
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved'),
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected'),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'seller'),
  ])

  return {
    pendingCount: pendingRes.count || 0,
    approvedCount: approvedRes.count || 0,
    rejectedCount: rejectedRes.count || 0,
    sellersCount: sellersRes.count || 0,
  }
}

export async function getModerationProducts(
  statusFilter: 'pending' | 'approved' | 'rejected' = 'pending'
) {
  const supabase = await createClient()

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
      .eq('status', statusFilter)
      .order('created_at', { ascending: false }),
    getRegions().catch(() => []),
  ])

  if (productsRes.error) {
    console.error('Error fetching moderation products:', productsRes.error.message)
    return []
  }

  const regionMap = new Map((regions || []).map((r) => [r.id, r]))

  return (productsRes.data || []).map((prod) => ({
    ...prod,
    region: prod.region_id ? regionMap.get(prod.region_id) || null : null,
  }))
}

export async function getMasterData() {
  const supabase = await createClient()

  const [categoriesRes, regionsRes] = await Promise.all([
    supabase
      .from('categories')
      .select('id, nama')
      .order('nama', { ascending: true }),
    supabase
      .from('regions')
      .select('id, nama')
      .order('nama', { ascending: true }),
  ])

  return {
    categories: categoriesRes.data || [],
    regions: regionsRes.data || [],
  }
}

export type AdminUserItem = {
  id: string
  email: string
  nama: string
  role: 'seller' | 'admin'
  created_at: string
  product_count: number
}

export async function getAdminUsers(): Promise<AdminUserItem[]> {
  const supabase = await createClient()

  // 1. Coba panggil RPC admin_get_users jika fungsi sudah dibuat di SQL
  const { data: rpcData, error: rpcError } = await supabase.rpc('admin_get_users')
  if (!rpcError && Array.isArray(rpcData)) {
    return rpcData.map((u) => ({
      id: u.id,
      email: u.email || '-',
      nama: u.nama || 'Pengguna',
      role: u.role || 'seller',
      created_at: u.created_at,
      product_count: Number(u.product_count) || 0,
    }))
  }

  // 2. Fallback resilient jika RPC belum dieksekusi di database
  const [profilesRes, productsRes] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('products').select('seller_id'),
  ])

  if (profilesRes.error || !profilesRes.data) {
    console.error('Error fetching admin users fallback:', profilesRes.error?.message)
    return []
  }

  const counts = new Map<string, number>()
  for (const p of productsRes.data || []) {
    if (p.seller_id) {
      counts.set(p.seller_id, (counts.get(p.seller_id) || 0) + 1)
    }
  }

  return profilesRes.data.map((p) => ({
    id: p.id,
    email: '-',
    nama: p.nama,
    role: p.role,
    created_at: p.created_at,
    product_count: counts.get(p.id) || 0,
  }))
}

export async function getAdminUserDetail(userId: string) {
  const supabase = await createClient()

  const [profileRes, productsRes, regions] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase
      .from('products')
      .select('*, category:categories(id, nama)')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false }),
    getRegions().catch(() => []),
  ])

  if (!profileRes.data) {
    return null
  }

  const regionMap = new Map((regions || []).map((r) => [r.id, r]))
  const rawProducts = productsRes.data || []
  const productIds = rawProducts.map((p) => p.id)

  // Hitung klik WA jika ada produk
  const clickMap = new Map<string, number>()
  if (productIds.length > 0) {
    const { data: clicks } = await supabase
      .from('wa_clicks')
      .select('product_id')
      .in('product_id', productIds)

    if (clicks) {
      for (const c of clicks) {
        clickMap.set(c.product_id, (clickMap.get(c.product_id) || 0) + 1)
      }
    }
  }

  const products = rawProducts.map((p) => ({
    ...p,
    region: p.region_id ? regionMap.get(p.region_id) || null : null,
    wa_clicks_count: clickMap.get(p.id) || 0,
  }))

  const approvedCount = products.filter((p) => p.status === 'approved').length
  const pendingCount = products.filter((p) => p.status === 'pending').length
  const rejectedCount = products.filter((p) => p.status === 'rejected').length
  const totalClicks = products.reduce((acc, p) => acc + p.wa_clicks_count, 0)

  return {
    profile: profileRes.data,
    products,
    stats: {
      totalProducts: products.length,
      approvedCount,
      pendingCount,
      rejectedCount,
      totalClicks,
    },
  }
}
