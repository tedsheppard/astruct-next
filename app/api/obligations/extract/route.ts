import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface ExtractedObligation {
  description: string
  clause_reference: string | null
  due_date: string | null
  notice_type: string | null
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

    const { contract_id } = await request.json()

    if (!contract_id) {
      return Response.json(
        { error: 'contract_id is required' },
        { status: 400 }
      )
    }

    // Get all documents for this contract that have extracted text
    const { data: documents, error: docError } = await supabase
      .from('documents')
      .select('id, filename, extracted_text')
      .eq('contract_id', contract_id)
      .not('extracted_text', 'is', null)

    if (docError) {
      console.error('Documents fetch error:', docError)
      return Response.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      )
    }

    if (!documents || documents.length === 0) {
      return Response.json(
        {
          error:
            'No processed documents found. Upload and process your contract documents first.',
        },
        { status: 400 }
      )
    }

    // Concatenate all extracted text
    const contractText = documents
      .map(
        (doc) =>
          `--- Document: ${doc.filename} ---\n${doc.extracted_text}`
      )
      .join('\n\n')

    // Truncate if extremely long (GPT-4o context limit considerations)
    const maxChars = 120000
    const truncatedText =
      contractText.length > maxChars
        ? contractText.slice(0, maxChars) +
          '\n\n[Text truncated due to length]'
        : contractText

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: `You are an expert construction contract analyst specialising in Australian construction law, including AS4000, AS4902, AS2124, NEC, and FIDIC contract forms.

Analyse the provided contract text and extract ALL time-bar obligations, notice requirements, deadlines, and key dates. Focus on:

1. **Notice requirements** - Any clause requiring a party to give notice within a specific timeframe (e.g., "within 28 days", "not later than 5 business days")
2. **Time-bar provisions** - Conditions where failing to act within a deadline results in loss of rights
3. **Payment claim deadlines** - When payment claims must be submitted
4. **Variation notice periods** - Deadlines for notifying variations
5. **Delay and extension of time (EOT) requirements** - Notice periods for claiming extensions
6. **Dispute resolution timeframes** - Deadlines for referring disputes
7. **Defects liability periods** - Key dates for defects obligations
8. **Insurance and guarantee deadlines** - When these must be provided
9. **Milestone and completion dates** - Key project dates if specified

For each obligation, provide:
- description: Clear, actionable description of what must be done
- clause_reference: The specific clause number (e.g., "Clause 34.1", "Section 11.2")
- due_date: If a specific calendar date is mentioned, provide in ISO format (YYYY-MM-DD). If it's a relative timeframe (e.g., "within 28 days of X"), set to null
- notice_type: Categorise as one of: "Payment Claim", "Variation", "Delay", "EOT", "Dispute", "Other"

Return your response as a JSON array of objects. Only return the JSON array, no other text.`,
        },
        {
          role: 'user',
          content: truncatedText,
        },
      ],
      response_format: { type: 'json_object' },
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      return Response.json(
        { error: 'No response from AI analysis' },
        { status: 500 }
      )
    }

    let extractedObligations: ExtractedObligation[]
    try {
      const parsed = JSON.parse(responseText)
      // Handle both { obligations: [...] } and direct array formats
      extractedObligations = Array.isArray(parsed)
        ? parsed
        : parsed.obligations || parsed.items || []
    } catch {
      console.error('Failed to parse AI response:', responseText)
      return Response.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      )
    }

    if (extractedObligations.length === 0) {
      return Response.json({
        obligations: [],
        message: 'No obligations found in the contract documents.',
      })
    }

    // Insert obligations using admin client (bypasses RLS)
    const admin = createAdminClient()
    const obligationsToInsert = extractedObligations.map((ob) => ({
      contract_id,
      user_id: user.id,
      description: ob.description,
      clause_reference: ob.clause_reference || null,
      due_date: ob.due_date || null,
      notice_type: ob.notice_type || 'Other',
      status: 'pending',
      completed: false,
      source: 'ai_extracted',
    }))

    const { data: inserted, error: insertError } = await admin
      .from('obligations')
      .insert(obligationsToInsert)
      .select()

    if (insertError) {
      console.error('Obligations insert error:', insertError)
      return Response.json(
        { error: 'Failed to save extracted obligations' },
        { status: 500 }
      )
    }

    return Response.json({
      obligations: inserted || [],
      message: `Successfully extracted ${inserted?.length || 0} obligations from your contract documents.`,
    })
  } catch (err) {
    console.error('Obligations extract error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
