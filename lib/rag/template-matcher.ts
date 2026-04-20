import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface TemplateInfo {
  id: string
  name: string
  status: string
  body: string
  clause_references?: string[]
}

/**
 * Semantic template matching using a fast model.
 * Falls back to keyword heuristic if the model call fails.
 */
export async function findBestTemplate(
  query: string,
  templates: TemplateInfo[],
  queryType: string
): Promise<TemplateInfo | null> {
  if (queryType !== 'drafting' || templates.length === 0) return null

  // Build template list for the model
  const templateList = templates.map((t, i) =>
    `${i + 1}. "${t.name}" (status: ${t.status}, clauses: ${t.clause_references?.join(', ') || 'none'})`
  ).join('\n')

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 50,
      messages: [
        {
          role: 'system',
          content: `You match user drafting requests to available notice templates. Given the user's request and a numbered list of templates, return ONLY the number of the best matching template. If no template fits, return "none". Just the number or "none", nothing else.`
        },
        {
          role: 'user',
          content: `User request: "${query}"\n\nAvailable templates:\n${templateList}`
        }
      ],
    })

    const answer = (response.choices[0]?.message?.content || '').trim().toLowerCase()

    if (answer === 'none') return null

    const index = parseInt(answer) - 1
    if (index >= 0 && index < templates.length) {
      return templates[index]
    }
  } catch (err) {
    console.error('[TemplateMatcher] Semantic match failed, falling back to keyword:', err)
  }

  // Keyword fallback
  const queryLower = query.toLowerCase()
  return templates.find(t => {
    const name = t.name.toLowerCase()
    return queryLower.includes(name) || name.split(' ').some(word => word.length > 3 && queryLower.includes(word))
  }) || null
}
