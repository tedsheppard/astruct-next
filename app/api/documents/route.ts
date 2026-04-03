import { type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
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

  const { data: documents, error } = await supabase
    .from('documents')
    .select(
      'id, contract_id, filename, file_path, file_type, file_size, category, ai_summary, processed, uploaded_at'
    )
    .eq('contract_id', contractId)
    .order('uploaded_at', { ascending: false })

  if (error) {
    console.error('Documents fetch error:', error)
    return Response.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }

  return Response.json({ documents: documents || [] })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await request.json()

  if (!id) {
    return Response.json({ error: 'Document id is required' }, { status: 400 })
  }

  // Get the document to find its storage path
  const { data: doc } = await supabase
    .from('documents')
    .select('id, file_path')
    .eq('id', id)
    .single()

  if (!doc) {
    return Response.json({ error: 'Document not found' }, { status: 404 })
  }

  // Delete from storage (use admin client to bypass RLS on storage)
  if (doc.file_path) {
    const admin = createAdminClient()
    await admin.storage.from('documents').remove([doc.file_path])
  }

  // Delete from database (chunks cascade automatically)
  const { error } = await supabase.from('documents').delete().eq('id', id)

  if (error) {
    console.error('Document delete error:', error)
    return Response.json({ error: 'Failed to delete document' }, { status: 500 })
  }

  return Response.json({ success: true })
}
