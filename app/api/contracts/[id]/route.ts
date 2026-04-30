import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const ALLOWED_FIELDS = new Set([
  'name',
  'reference_number',
  'contract_form',
  'party1_name',
  'party1_role',
  'party1_address',
  'party2_name',
  'party2_role',
  'party2_address',
  'administrator_name',
  'administrator_role',
  'administrator_address',
  'user_is_party',
  'status',
])

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json().catch(() => ({}))

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
    for (const k of Object.keys(body)) {
      if (ALLOWED_FIELDS.has(k)) update[k] = body[k]
    }
    if (body.facts_verified_by_user === true) update.facts_verified_by_user = true

    if (Object.keys(update).length <= 1) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('contracts')
      .update(update)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id')
      .maybeSingle()

    if (error) {
      console.error('[contracts PATCH]', error)
      return Response.json({ error: error.message }, { status: 500 })
    }
    if (!data) {
      return Response.json({ error: 'Contract not found' }, { status: 404 })
    }
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[contracts PATCH] error', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
