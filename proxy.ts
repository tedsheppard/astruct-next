import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ANON_FIRST_ENABLED = process.env.NEXT_PUBLIC_ANON_FIRST_ENABLED === 'true'

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
  const publicPaths = ['/login', '/register', '/forgot-password', '/auth', '/api', '/landing', '/platform', '/solutions', '/pricing', '/security', '/company', '/privacy', '/terms', '/contact', '/verify-email', '/verify-phone']
  // Anon-first mode opens up the assistant entry shim and contract pages so
  // anonymous Supabase sessions (created lazily inside /assistant) reach the UI.
  const anonPublicPaths = ANON_FIRST_ENABLED
    ? ['/assistant', '/contracts']
    : []
  const allPublic = [...publicPaths, ...anonPublicPaths]
  const isPublicPath = request.nextUrl.pathname === '/' || allPublic.some(p => request.nextUrl.pathname.startsWith(p))

  // Known protected route prefixes — only THESE redirect to login when no user.
  // Anything else (including unknown / 404 paths) falls through so Next can
  // render its app/not-found.tsx instead of bouncing to /assistant.
  const protectedPrefixes = ['/settings', '/letterheads', '/knowledge-base', '/setup', '/composer', '/notices']
  const isKnownProtected = protectedPrefixes.some(p => request.nextUrl.pathname.startsWith(p))

  if (!user && isKnownProtected) {
    const url = request.nextUrl.clone()
    url.pathname = ANON_FIRST_ENABLED ? '/assistant' : '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages — except anonymous
  // Supabase users, who must be allowed to land on /register so they can
  // upgrade in place via linkIdentity.
  if (
    user &&
    !user.is_anonymous &&
    (request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/register'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // ─── Verification + onboarding chain ──────────────────────────────────
  // v1: friction-removed. Email + phone verification are fully off (Supabase
  // mailer_autoconfirm = true). Onboarding (/setup) is voluntary — accessible
  // by user choice from a banner, not forced by middleware. Removing the
  // forced redirect was the fix for "Critical C5: /setup blocks billing".

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|mov|webm)$).*)',
  ],
}
