import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contractId = request.nextUrl.searchParams.get('contract_id')

    if (!contractId) {
      return Response.json(
        { error: 'contract_id is required' },
        { status: 400 }
      )
    }

    const { data: obligations, error } = await supabase
      .from('obligations')
      .select('*')
      .eq('contract_id', contractId)
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Obligations fetch error:', error)
      return Response.json(
        { error: 'Failed to fetch obligations' },
        { status: 500 }
      )
    }

    return Response.json({ obligations: obligations || [] })
  } catch (err) {
    console.error('Obligations GET error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { contract_id, description, clause_reference, due_date, notice_type } =
      body

    if (!contract_id || !description || !due_date) {
      return Response.json(
        { error: 'contract_id, description, and due_date are required' },
        { status: 400 }
      )
    }

    const { data: obligation, error } = await supabase
      .from('obligations')
      .insert({
        contract_id,
        user_id: user.id,
        description,
        clause_reference: clause_reference || null,
        due_date,
        notice_type: notice_type || null,
        status: 'pending',
        completed: false,
        source: 'manual',
      })
      .select()
      .single()

    if (error) {
      console.error('Obligation create error:', error)
      return Response.json(
        { error: 'Failed to create obligation' },
        { status: 500 }
      )
    }

    return Response.json({ obligation }, { status: 201 })
  } catch (err) {
    console.error('Obligations POST error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return Response.json(
        { error: 'Obligation id is required' },
        { status: 400 }
      )
    }

    // Only allow updating specific fields
    const allowedFields: Record<string, unknown> = {}
    if ('completed' in updates) allowedFields.completed = updates.completed
    if ('status' in updates) allowedFields.status = updates.status
    if ('description' in updates) allowedFields.description = updates.description
    if ('clause_reference' in updates)
      allowedFields.clause_reference = updates.clause_reference
    if ('due_date' in updates) allowedFields.due_date = updates.due_date
    if ('notice_type' in updates) allowedFields.notice_type = updates.notice_type

    if (Object.keys(allowedFields).length === 0) {
      return Response.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    allowedFields.updated_at = new Date().toISOString()

    const { data: obligation, error } = await supabase
      .from('obligations')
      .update(allowedFields)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Obligation update error:', error)
      return Response.json(
        { error: 'Failed to update obligation' },
        { status: 500 }
      )
    }

    return Response.json({ obligation })
  } catch (err) {
    console.error('Obligations PATCH error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
