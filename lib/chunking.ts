import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Structure-aware text splitter (~1200 tokens per chunk, 200 token overlap)
export function chunkText(text: string, maxTokens = 1200, overlapTokens = 200): string[] {
  const charsPerToken = 4
  const maxChars = maxTokens * charsPerToken
  const overlapChars = overlapTokens * charsPerToken

  if (!text || text.length === 0) return []
  if (text.length <= maxChars) return [text]

  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    let end = start + maxChars

    if (end < text.length) {
      const slice = text.slice(start, end)
      // Prefer breaking at clause boundaries
      const clauseBreak = slice.search(/\n\d+\.\s+[A-Z]/)
      const lastParagraph = slice.lastIndexOf('\n\n')
      const lastSentence = slice.lastIndexOf('. ')
      const lastNewline = slice.lastIndexOf('\n')

      if (clauseBreak > maxChars * 0.4) {
        end = start + clauseBreak
      } else if (lastParagraph > maxChars * 0.5) {
        end = start + lastParagraph + 2
      } else if (lastSentence > maxChars * 0.5) {
        end = start + lastSentence + 2
      } else if (lastNewline > maxChars * 0.5) {
        end = start + lastNewline + 1
      }
    }

    chunks.push(text.slice(start, end).trim())
    start = end - overlapChars
    if (start < 0) start = 0
    if (end >= text.length) break
  }

  return chunks.filter(c => c.length > 0)
}

// Extract clause numbers from chunk text
export function extractClauseNumbers(text: string): string[] {
  const matches = [...text.matchAll(/(?:clause|section)\s+(\d+[\.\d]*)/gi)]
  return [...new Set(matches.map(m => m[1]))]
}

// Detect the nearest section heading in chunk text
export function detectSectionHeading(text: string): string | null {
  const headingMatch = text.match(/^(?:\d+[\.\d]*\.?\s+[A-Z][A-Z\s&]+|(?:Clause|Section)\s+\d+[\.\d]*\s*[-–—]\s*.+)/m)
  return headingMatch ? headingMatch[0].trim().slice(0, 100) : null
}

// Generate embeddings using text-embedding-3-large
export async function generateEmbeddings(chunks: string[]): Promise<number[][]> {
  if (chunks.length === 0) return []

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: chunks,
    dimensions: 1536,
  })

  return response.data.map(d => d.embedding)
}
