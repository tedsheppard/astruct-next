export interface RAGConfig {
  contractId: string
  userId: string
  sessionId: string | null
  selectedDocumentIds?: string[]
  model: string
  conversationHistory: ConversationMessage[]
  contract: Record<string, unknown>
  profile: Record<string, unknown> | null
}

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface RetrievedChunk {
  id: string
  documentId: string
  documentName: string
  chunkIndex: number
  content: string
  sectionHeading: string | null
  clauseNumbers: string[]
  vectorSimilarity: number
  textRank: number
  combinedScore: number
  expandedContent?: string
}

export interface ClassifiedQuery {
  originalQuery: string
  rewrittenQuery: string
  queryType: 'question' | 'analysis' | 'drafting' | 'casual' | 'clause_lookup'
  extractedClauseRefs: string[]
  extractedKeyTerms: string[]
  complexity: 'simple' | 'moderate' | 'complex'
}

export interface VerifiedCitation {
  clauseRef: string
  found: boolean
  sourceDocument?: string
  confidence: number
  hasQuote: boolean
}

export interface SourceItem {
  type: 'document' | 'web'
  document_id: string
  document_name: string
  section_heading: string | null
  excerpt: string
  full_text: string
  chunk_index: number
  similarity_score: number
  clause_references: string[]
  page_number?: number | null
}

export interface StreamCallbacks {
  onThinkingState: (state: string) => void
  onThinkingSources: (data: { state: string; documents: string[]; chunk_count: number }) => void
  onSources: (sources: SourceItem[]) => void
  onContent: (content: string) => void
  onFollowups: (followups: string[]) => void
  onDone: (result: { sessionId: string; noticeId?: string | null }) => void
  onError: (error: string) => void
}
