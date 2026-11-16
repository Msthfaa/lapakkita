import { NextResponse } from 'next/server'
import { getPublicClient } from '@/lib/supabase/public'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const clean = q.trim()

    if (clean.length < 1) {
      return NextResponse.json({ products: [] })
    }

    const sanitized = clean.replace(/,/g, ' ')
    const supabase = getPublicClient()

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        nama,
        harga,
        satuan,
        foto_url,
        category:categories(id, nama),
        seller:profiles(id, nama)
      `)
      .eq('status', 'approved')
      .eq('is_active', true)
      .or(`nama.ilike.%${sanitized}%,deskripsi.ilike.%${sanitized}%`)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) {
      console.error('Search API error:', error.message)
      return NextResponse.json({ products: [] })
    }

    return NextResponse.json({ products: products || [] })
  } catch (err: unknown) {
    console.error('Search API exception:', err)
    return NextResponse.json({ products: [] })
  }
}
