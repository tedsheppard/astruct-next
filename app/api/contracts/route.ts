import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const ANON_CONTRACT_LIMIT = 1

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  if (user.is_anonymous) {
    const { count } = await admin
      .from('contracts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
    if ((count || 0) >= ANON_CONTRACT_LIMIT) {
      return Response.json(
        {
          error: 'Guest accounts can have one project at a time. Sign up free to add more.',
          code: 'ANON_CONTRACT_LIMIT',
        },
        { status: 403 },
      )
    }
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const allowed = [
    'name',
    'reference_number',
    'contract_form',
    'party1_role',
    'party1_name',
    'party1_address',
    'party2_role',
    'party2_name',
    'party2_address',
    'user_is_party',
    'administrator_role',
    'administrator_name',
    'administrator_address',
    'principal_name',
    'contractor_name',
    'superintendent_name',
    'date_of_contract',
    'date_practical_completion',
    'contract_sum',
    'status',
  ] as const

  const insertRow: Record<string, unknown> = { user_id: user.id }
  for (const key of allowed) {
    if (key in body) insertRow[key] = body[key]
  }
  if (!insertRow.name) insertRow.name = 'Untitled project'
  if (!insertRow.contract_form) insertRow.contract_form = 'bespoke'
  if (!insertRow.party1_role) insertRow.party1_role = 'Party 1'
  if (!insertRow.party2_role) insertRow.party2_role = 'Party 2'
  if (!insertRow.user_is_party) insertRow.user_is_party = 'party2'
  if (!insertRow.status) insertRow.status = 'active'

  const { data: inserted, error: insertError } = await admin
    .from('contracts')
    .insert(insertRow)
    .select('id')
    .single()

  if (insertError || !inserted) {
    console.error('[contracts.POST] insert failed', insertError)
    return Response.json({ error: insertError?.message || 'Insert failed' }, { status: 500 })
  }

  return Response.json({ ok: true, id: inserted.id })
}
