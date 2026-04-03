import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const contractId = request.nextUrl.searchParams.get('contract_id')

  if (!contractId) {
    return Response.json({ error: 'contract_id is required' }, { status: 400 })
  }

  // Fetch all documents for this contract with just their category
  const { data: documents, error } = await supabase
    .from('documents')
    .select('category')
    .eq('contract_id', contractId)

  if (error) {
    console.error('Category count error:', error)
    return Response.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }

  // Count by category
  const counts: Record<string, number> = {}
  let total = 0

  for (const doc of documents || []) {
    const cat = doc.category || '13_other'
    counts[cat] = (counts[cat] || 0) + 1
    total++
  }

  return Response.json({ counts, total })
}
