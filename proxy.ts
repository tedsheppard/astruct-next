import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Skip proxy for file upload routes — the body must not be consumed by middleware
  if (request.nextUrl.pathname.startsWith('/api/documents/upload') ||
      request.nextUrl.pathname.startsWith('/api/correspondence/upload') ||
      request.nextUrl.pathname.startsWith('/api/waitlist')) {
    return NextResponse.next()
  }

  const hostname = request.headers.get('host') || ''
  const isAppDomain = hostname.startsWith('app.')
  const isMainDomain = !isAppDomain && (hostname.includes('astruct.io') || hostname.includes('astruct.com'))

  // ─── Main domain (astruct.io) → marketing site only ───────────────────
  if (isMainDomain) {
    const path = request.nextUrl.pathname

    // Marketing public paths
    const marketingPaths = ['/', '/landing', '/platform', '/solutions', '/pricing', '/security', '/company', '/privacy', '/terms', '/contact', '/features', '/product']
    const isMarketingPath = marketingPaths.some(p => path === p || path.startsWith(p + '/'))

    // API routes are shared
    if (path.startsWith('/api')) {
      return NextResponse.next()
    }

    // Root on main domain → landing page
    if (path === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/landing'
      return NextResponse.rewrite(url)
    }

    // Login/register on main domain → redirect to app subdomain
    if (path === '/login' || path === '/register') {
      return NextResponse.redirect(new URL(`https://app.astruct.io${path}`, request.url))
    }

    // Non-marketing paths on main domain → redirect to app subdomain
    if (!isMarketingPath) {
      return NextResponse.redirect(new URL(`https://app.astruct.io${path}`, request.url))
    }

    return NextResponse.next()
  }

  // ─── App domain (app.astruct.io) or localhost → app with auth ─────────
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public paths on app domain
  const publicPaths = ['/login', '/register', '/auth', '/api', '/landing', '/platform', '/solutions', '/pricing', '/security', '/company', '/privacy', '/terms', '/contact']
  const isPublicPath = request.nextUrl.pathname === '/' || publicPaths.some(p => request.nextUrl.pathname.startsWith(p))

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (
    user &&
    (request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/register'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|mov|webm)$).*)',
  ],
}
