import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ANON_FIRST_ENABLED } from '@/lib/anon-flag'
import AnonAssistantBootstrap from './bootstrap'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Astruct — Try the AI assistant',
  description: 'Try Astruct on a real contract — no signup, no credit card.',
  robots: { index: false, follow: false },
}

/**
 * /assistant — public entry point.
 *
 * Behavior depends on session + flag:
 *  - Flag off → 302 to /login (preserves prior UX).
 *  - Authenticated user with contracts → 302 into their first contract assistant.
 *  - Authenticated user with no contracts → 302 to /contracts/new.
 *  - Anonymous user (already had a session) with contracts → 302 into it.
 *  - No session → render bootstrap UI which calls /api/auth/anon-start client-side
 *    and then redirects into the seeded/blank assistant.
 */
export default async function AssistantEntry() {
  if (!ANON_FIRST_ENABLED) {
    redirect('/login')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: contracts } = await supabase
      .from('contracts')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (contracts && contracts.length > 0) {
      redirect(`/contracts/${contracts[0].id}/assistant`)
    }

    if (user.is_anonymous) {
      // Anon with no contracts — show bootstrap so they can pick sample vs upload.
      return <AnonAssistantBootstrap hasSession={true} />
    }

    // Authenticated user with no contracts — preserve existing flow.
    redirect('/contracts/new')
  }

  // No session — let the client-side bootstrap call /api/auth/anon-start.
  return <AnonAssistantBootstrap hasSession={false} />
}
