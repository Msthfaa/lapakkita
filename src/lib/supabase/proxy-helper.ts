import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database'
import { env } from '@/lib/env'

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Cek apakah ada cookie auth Supabase dalam request
  const allCookies = request.cookies.getAll()
  const hasAuthCookie = allCookies.some(
    (c) => c.name.includes('-auth-token') || c.name.startsWith('sb-')
  )

  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  const isAuthPath = pathname === '/masuk' || pathname === '/daftar'

  // Jika membuka rute terlindungi dan sama sekali tidak ada cookie login,
  // langsung redirect ke /masuk tanpa perlu membuang waktu network call ke Supabase (0ms)
  if (isProtectedPath && !hasAuthCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/masuk'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Fast-path untuk rute publik (/, /kategori, /tentang, dll):
  // Jika bukan rute terlindungi (/dashboard, /admin) dan bukan rute auth (/masuk, /daftar),
  // langsung loloskan request (0ms network latency tanpa memanggil auth.getUser())
  if (!isProtectedPath && !isAuthPath) {
    return NextResponse.next({ request })
  }

  // Cek apakah request merupakan prefetch dari Next.js router
  const isPrefetch =
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.get('purpose') === 'prefetch'

  // Lewati pemeriksaan auth.getUser() untuk request prefetch guna mencegah token lock & network overhead
  if (isPrefetch) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Hanya periksa getUser() ketika ada cookie dan di rute yang relevan
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/masuk'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (user && isAuthPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
