/**
 * Lightweight analytics shim.
 *
 * If NEXT_PUBLIC_POSTHOG_KEY is set we lazy-load posthog-js and forward events
 * to it. Without keys, every call is a no-op — no SDK loaded, no network
 * traffic. Re-deploys after key provisioning are sufficient to start tracking.
 *
 * Use:
 *   import { track } from '@/lib/analytics'
 *   track('anon_first_message', { contract_id })
 */

type Props = Record<string, unknown>

let posthogPromise: Promise<unknown> | null = null
let initialized = false

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

async function ensure() {
  if (!KEY) return null
  if (typeof window === 'undefined') return null
  if (initialized) return posthogPromise
  if (!posthogPromise) {
    posthogPromise = (async () => {
      try {
        // posthog-js is optional — only loaded when a key is provided.
        // Use a string-built specifier so TypeScript doesn't try to resolve
        // the module at type-check time when the package isn't installed.
        const moduleName = 'posthog' + '-js'
        const mod = (await import(/* @vite-ignore */ moduleName)) as {
          default: { init: (key: string, opts: Record<string, unknown>) => unknown }
        }
        const posthog = mod.default
        posthog.init(KEY, {
          api_host: HOST,
          capture_pageview: true,
          persistence: 'localStorage',
        })
        initialized = true
        return posthog
      } catch {
        return null
      }
    })()
  }
  return posthogPromise
}

export async function track(event: string, properties?: Props) {
  try {
    const posthog = await ensure()
    if (posthog && typeof (posthog as { capture: (event: string, props?: Props) => void }).capture === 'function') {
      ;(posthog as { capture: (event: string, props?: Props) => void }).capture(event, properties)
    }
  } catch {
    // Swallow — analytics must not break the app.
  }
}

export async function identify(userId: string, traits?: Props) {
  try {
    const posthog = await ensure()
    if (posthog && typeof (posthog as { identify: (id: string, traits?: Props) => void }).identify === 'function') {
      ;(posthog as { identify: (id: string, traits?: Props) => void }).identify(userId, traits)
    }
  } catch {
    // Swallow.
  }
}

export const ANALYTICS_EVENTS = {
  ANON_SESSION_STARTED: 'anon_session_started',
  ANON_FIRST_MESSAGE: 'anon_first_message',
  ANON_FIRST_UPLOAD: 'anon_first_upload',
  SOFT_PROMPT_SHOWN: 'soft_prompt_shown',
  SOFT_PROMPT_DISMISSED: 'soft_prompt_dismissed',
  HARD_WALL_TRIGGERED: 'hard_wall_triggered',
  ANON_SIGNUP_STARTED: 'anon_signup_started',
  ANON_SIGNUP_COMPLETED: 'anon_signup_completed',
} as const
