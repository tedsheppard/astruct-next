import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Skip proxy for file upload routes — the body must not be consumed by middleware
  if (request.nextUrl.pathname.startsWith('/api/documents/upload') ||
      request.nextUrl.pathname.startsWith('/api/correspondence/upload') ||
      request.nextUrl.pathname.startsWith('/api/waitlist')) {
    return NextResponse.next()
  }

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

  // Redirect unauthenticated users to login (except auth pages and API routes)
  // Public routes that don't require auth
  const publicPaths = ['/login', '/register', '/auth', '/api', '/platform', '/solutions', '/pricing', '/security', '/company', '/privacy', '/terms', '/contact', '/landing']
  const isPublicPath = request.nextUrl.pathname === '/' || publicPaths.some(p => request.nextUrl.pathname.startsWith(p))

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Unauthenticated users at root → show landing page
  if (!user && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/landing'
    return NextResponse.rewrite(url)
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
