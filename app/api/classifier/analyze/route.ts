import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { classifyAndResolve } from '@/lib/obligations/classifier'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { contract_id, source_type, source_id, text, metadata } = body

    if (!contract_id || !source_type || !source_id || !text) {
      return Response.json(
        { error: 'contract_id, source_type, source_id, and text are required' },
        { status: 400 }
      )
    }

    const result = await classifyAndResolve(
      {
        contract_id,
        source_type,
        source_id,
        text,
        metadata,
      },
      user.id
    )

    return Response.json({
      trigger_events: result.trigger_events,
      pending_obligations_created: result.pending_obligations_created,
    })
  } catch (err) {
    console.error('POST /api/classifier/analyze error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
