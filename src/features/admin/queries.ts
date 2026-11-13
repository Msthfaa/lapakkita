import { createClient } from '@/lib/supabase/server'
import { getRegions } from '@/features/products/queries'
import { cache } from 'react'

export const getAdminStats = cache(async () => {
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
})

export interface AdminDashboardData {
  stats: {
    pendingCount: number
    approvedCount: number
    rejectedCount: number
    sellersCount: number
    totalProductsCount: number
    approvalRate: number
    totalWaClicks: number
  }
  pendingProducts: Array<{
    id: string
    nama: string
    harga: number
    foto_url: string | null
    created_at: string
    category: { nama: string } | null
    seller: { nama: string } | null
  }>
  recentSellers: Array<{
    id: string
    nama: string
    created_at: string
    product_count: number
    alamat?: string | null
  }>
  weeklyStats: Array<{
    day: string
    label: string
    count: number
    percentage: number
    isToday: boolean
  }>
  categoryBreakdown: Array<{
    nama: string
    count: number
    color: string
  }>
}

export async function getAdminDashboardExtendedData(): Promise<AdminDashboardData> {
  const supabase = await createClient()

  const [
    stats,
    pendingRes,
    allProductsRes,
    sellersWithProducts,
    categoriesRes,
    waClicksRes,
  ] = await Promise.all([
    getAdminStats(),
    supabase
      .from('products')
      .select('id, nama, harga, foto_url, created_at, category:categories(nama), seller:profiles(nama, alamat)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('products')
      .select('id, created_at, status, category_id'),
    supabase
      .from('profiles')
      .select('id, nama, created_at, alamat')
      .eq('role', 'seller')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('categories')
      .select('id, nama'),
    supabase
      .from('wa_clicks')
      .select('count'),
  ])

  const totalProductsCount = stats.pendingCount + stats.approvedCount + stats.rejectedCount
  const reviewedCount = stats.approvedCount + stats.rejectedCount
  const approvalRate = reviewedCount > 0 ? Math.round((stats.approvedCount / reviewedCount) * 100) : 100

  // Hitung total WA clicks
  const totalWaClicks = (waClicksRes.data || []).reduce((acc, row) => acc + (row.count || 0), 0)

  // Hitung produk per seller
  const allProducts = allProductsRes.data || []
  const sellerProductMap = new Map<string, number>()
  for (const p of allProducts) {
    if ((p as any).seller_id) {
      sellerProductMap.set((p as any).seller_id, (sellerProductMap.get((p as any).seller_id) || 0) + 1)
    }
  }

  const recentSellers = (sellersWithProducts.data || []).map((s) => ({
    id: s.id,
    nama: s.nama || 'Pelaku UMKM',
    created_at: s.created_at,
    product_count: sellerProductMap.get(s.id) || 0,
    alamat: s.alamat,
  }))

  // Kalkulasi statistik 7 hari mingguan (Senin - Minggu)
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  const today = new Date()
  const currentDayIndex = today.getDay() // 0 = Min, 1 = Sen, etc.

  // Urutan hari dari Senin sampai Minggu
  const orderedDays = [1, 2, 3, 4, 5, 6, 0]
  const dayCountMap = new Map<number, number>()
  for (const d of orderedDays) {
    dayCountMap.set(d, 0)
  }

  // Agregasi produk yang dibuat dalam 7 hari terakhir
  for (const p of allProducts) {
    if (p.created_at) {
      const pDate = new Date(p.created_at)
      const dayIdx = pDate.getDay()
      dayCountMap.set(dayIdx, (dayCountMap.get(dayIdx) || 0) + 1)
    }
  }

  // Pastikan ada nilai visual yang seimbang jika data masih baru
  const maxDayCount = Math.max(1, ...Array.from(dayCountMap.values()))
  const weeklyStats = orderedDays.map((d) => {
    const rawCount = dayCountMap.get(d) || 0
    const percentage = Math.max(18, Math.min(100, Math.round((rawCount / maxDayCount) * 100)))
    return {
      day: dayNames[d].charAt(0),
      label: dayNames[d],
      count: rawCount,
      percentage,
      isToday: d === currentDayIndex,
    }
  })

  // Distribusi kategori
  const catColorPalette = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6']
  const catCountMap = new Map<number, number>()
  for (const p of allProducts) {
    if (p.category_id) {
      catCountMap.set(p.category_id, (catCountMap.get(p.category_id) || 0) + 1)
    }
  }

  const categoryBreakdown = (categoriesRes.data || []).slice(0, 5).map((cat, idx) => ({
    nama: cat.nama,
    count: catCountMap.get(cat.id) || 0,
    color: catColorPalette[idx % catColorPalette.length],
  }))

  return {
    stats: {
      pendingCount: stats.pendingCount,
      approvedCount: stats.approvedCount,
      rejectedCount: stats.rejectedCount,
      sellersCount: stats.sellersCount,
      totalProductsCount,
      approvalRate,
      totalWaClicks,
    },
    pendingProducts: (pendingRes.data || []) as unknown as AdminDashboardData['pendingProducts'],
    recentSellers,
    weeklyStats,
    categoryBreakdown,
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
