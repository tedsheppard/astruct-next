import { cookies } from 'next/headers'

// Cookie used to gate /dev pages. Set by /api/dev/auth on a successful code
// match; HttpOnly so client JS can't read it. 12-hour rolling session.
export const DEV_COOKIE = 'astruct_dev'
export const DEV_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 12

// Resolve the access code at runtime so production can rotate without a
// rebuild via DEV_ACCESS_CODE in the Vercel env. The fallback is the code
// the founder originally chose; rotate it as soon as anyone else needs in.
export function getDevAccessCode(): string {
  return process.env.DEV_ACCESS_CODE || '240501'
}

export async function isDevAuthorized(): Promise<boolean> {
  const jar = await cookies()
  return jar.get(DEV_COOKIE)?.value === '1'
}
