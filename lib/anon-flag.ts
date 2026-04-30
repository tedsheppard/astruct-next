/**
 * Single source of truth for the anon-first launch feature flag.
 *
 * Toggle in Vercel:
 *   NEXT_PUBLIC_ANON_FIRST_ENABLED=true
 *
 * When false (default), the app behaves exactly as it did pre-launch:
 *  - Marketing CTAs go to /register
 *  - /assistant 302s to /login if no session
 *  - Welcome modal + tour suppressed for unauthenticated visitors
 *  - Soft / hard wall logic dormant
 *
 * When true:
 *  - Marketing CTAs go to /assistant
 *  - /assistant creates an anon session on the fly
 *  - Welcome modal fires for first-time anon users
 *  - Usage counters + soft / hard walls active
 *
 * Reversibility: flipping back to false restores the prior UX without code rollback.
 *
 * NEXT_PUBLIC_ prefix means the flag is inlined at build time on both server and
 * client. Re-deploy after toggling to propagate.
 */

export const ANON_FIRST_ENABLED =
  process.env.NEXT_PUBLIC_ANON_FIRST_ENABLED === 'true'

export function getCtaTarget(authedTarget = '/contracts'): string {
  // Where every "Try free" / "Start free" / "Get started" CTA points.
  // Marketing pages live on astruct.io, the app on app.astruct.io — links are
  // absolute when crossing domains. Callers pass the full app URL when needed.
  return ANON_FIRST_ENABLED ? '/assistant' : '/register'
}

export function getAppCtaTarget(): string {
  // Used on marketing pages where we cross domains via the public app origin.
  const appOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://app.astruct.io'
  return `${appOrigin}${getCtaTarget()}`
}
