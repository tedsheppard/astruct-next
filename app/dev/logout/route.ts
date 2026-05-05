import { DEV_COOKIE } from '@/lib/dev-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(null, {
    status: 302,
    headers: {
      location: '/dev/login',
      'set-cookie': `${DEV_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
    },
  })
}
