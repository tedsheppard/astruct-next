import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { extractFacts } from '@/lib/contract-facts/extractor'

export const dynamic = 'force-dynamic'

// GET — return extracted facts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const { data } = await supabase
      .from('contracts')
      .select('extracted_facts, facts_extracted_at, facts_verified_by_user')
      .eq('id', id)
      .single()

    return Response.json(data || {})
  } catch {
    return Response.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// POST — trigger extraction or save user corrections
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()

    if (body.action === 'extract') {
      // Trigger extraction
      const facts = await extractFacts(id)
      return Response.json({ facts })
    }

    if (body.action === 'verify') {
      // Save user corrections
      const admin = createAdminClient()
      await admin.from('contracts').update({
        extracted_facts: body.facts,
        facts_verified_by_user: true,
      }).eq('id', id)
      return Response.json({ success: true })
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 })
  } catch {
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
