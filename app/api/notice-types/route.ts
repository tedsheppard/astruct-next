import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const contractId = request.nextUrl.searchParams.get('contract_id')
    if (!contractId) return Response.json({ error: 'contract_id required' }, { status: 400 })

    // Get notice types with their template status
    const { data: noticeTypes, error } = await supabase
      .from('notice_types')
      .select('id, name, description, clause_references, formal_requirements, created_at')
      .eq('contract_id', contractId)
      .order('name')

    if (error) throw error

    // Get templates for these notice types
    const { data: templates } = await supabase
      .from('notice_templates')
      .select('id, notice_type_id, status, version, updated_at')
      .eq('contract_id', contractId)

    // Merge template status into notice types
    const result = (noticeTypes || []).map(nt => {
      const template = (templates || []).find(t => t.notice_type_id === nt.id)
      return {
        ...nt,
        template: template ? { id: template.id, status: template.status, version: template.version, updated_at: template.updated_at } : null,
      }
    })

    return Response.json({ notice_types: result })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch notice types' }, { status: 500 })
  }
}
