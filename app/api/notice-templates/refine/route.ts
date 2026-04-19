import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * POST /api/notice-templates/refine
 * Body: { template_body, notice_type_name, user_request, contract_id }
 *
 * Returns: { message: string, updated_body?: string }
 * - message: human-readable description of what was changed
 * - updated_body: the full updated template body (only if changes were made)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { template_body, notice_type_name, user_request, contract_id } = await request.json()

    if (!template_body || !user_request) {
      return Response.json({ error: 'template_body and user_request required' }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 5000,
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant helping refine a construction contract notice template. The user will ask you to make changes or answer questions about the template.

If the user asks you to MAKE A CHANGE to the template:
- Apply the change to the template body
- Respond with JSON: {"message": "Short description of what you changed (1-2 sentences)", "updated_body": "The complete updated template body with the change applied"}

If the user asks a QUESTION about the template (not requesting a change):
- Answer the question helpfully
- Respond with JSON: {"message": "Your answer to their question"}

IMPORTANT:
- The "message" field is shown to the user in a chat interface — keep it concise and friendly
- The "updated_body" field (when present) replaces the entire template — it must be the COMPLETE template, not just the changed part
- Never include raw JSON, code blocks, or ---DOCUMENT_START--- markers in the message field
- Respond with JSON only, no markdown fences

Current template for "${notice_type_name || 'Notice'}":
${template_body.slice(0, 8000)}`
        },
        {
          role: 'user',
          content: user_request,
        }
      ],
      response_format: { type: 'json_object' },
    })

    const text = response.choices[0]?.message?.content || '{}'
    let result: { message: string; updated_body?: string }

    try {
      result = JSON.parse(text)
    } catch {
      result = { message: 'Sorry, I had trouble processing that request. Please try rephrasing.' }
    }

    return Response.json(result)
  } catch (err) {
    console.error('[Refine] Error:', err)
    return Response.json({ error: 'Refinement failed' }, { status: 500 })
  }
}
