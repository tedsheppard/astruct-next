import { type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Get the document (RLS ensures user owns it)
  const { data: doc } = await supabase
    .from('documents')
    .select('file_path, file_type, filename')
    .eq('id', id)
    .single()

  if (!doc || !doc.file_path) {
    return new Response('Document not found', { status: 404 })
  }

  // Download from storage using admin client
  const admin = createAdminClient()
  const { data: fileData, error } = await admin.storage
    .from('documents')
    .download(doc.file_path)

  if (error || !fileData) {
    console.error('File download error:', error)
    return new Response('File not found', { status: 404 })
  }

  const buffer = Buffer.from(await fileData.arrayBuffer())

  return new Response(buffer, {
    headers: {
      'Content-Type': doc.file_type || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${doc.filename}"`,
      'Cache-Control': 'private, max-age=3600',
    },
  })
}
