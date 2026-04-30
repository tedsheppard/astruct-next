import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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
 * - Authenticated user with contracts → 302 into their first contract assistant.
 * - Authenticated user with no contracts → 302 to /contracts/new (existing flow).
 * - Anonymous user with contracts → 302 into the latest contract assistant.
 * - Anonymous user with no contracts → admin-create a blank contract and 302
 *   straight into its assistant with ?intro=1 so the upload modal opens.
 * - No session → render bootstrap.tsx, which auto-fires anon-start and
 *   redirects on response.
 *
 * Flag off → 302 to /login (preserves prior UX).
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
      const admin = createAdminClient()
      const { data: contract } = await admin
        .from('contracts')
        .insert({
          user_id: user.id,
          name: 'Untitled project',
          contract_form: 'bespoke',
          party1_role: 'Principal',
          party2_role: 'Contractor',
          user_is_party: 'party2',
          status: 'active',
        })
        .select('id')
        .single()
      if (contract?.id) {
        redirect(`/contracts/${contract.id}/assistant?intro=1`)
      }
    }

    redirect('/contracts/new')
  }

  return <AnonAssistantBootstrap />
}
