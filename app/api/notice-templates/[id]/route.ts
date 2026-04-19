import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

// GET — fetch a template with its notice type
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const { data: template } = await supabase
      .from('notice_templates')
      .select('*, notice_types(name, description, clause_references, formal_requirements)')
      .eq('id', id)
      .single()

    if (!template) return Response.json({ error: 'Not found' }, { status: 404 })

    return Response.json({ template })
  } catch {
    return Response.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// PATCH — update template body/status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const updates = await request.json()

    const allowed: Record<string, unknown> = {}
    if ('body' in updates) { allowed.body = updates.body; allowed.status = 'user_edited' }
    if ('status' in updates) allowed.status = updates.status
    allowed.updated_at = new Date().toISOString()

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('notice_templates')
      .update(allowed)
      .eq('id', id)
      .select('id, status, version, updated_at')
      .single()

    if (error) throw error
    return Response.json({ template: data })
  } catch {
    return Response.json({ error: 'Failed to update' }, { status: 500 })
  }
}

// DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const { error } = await supabase.from('notice_templates').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
