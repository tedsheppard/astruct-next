'use client'

import { useState } from 'react'
import { FileText, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'

interface SourceItem {
  type: 'document' | 'web'
  document_id: string
  document_name: string
  section_heading: string | null
  excerpt: string
  full_text?: string
  chunk_index: number
  similarity_score: number
  clause_references: string[]
  page_number?: number | null
}

interface SourceCardProps {
  source: SourceItem
  onViewInContract?: (source: SourceItem) => void
}

export default function SourceCard({ source, onViewInContract }: SourceCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="group">
      <div className="px-4 py-3">
        {/* Document name + metadata */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-foreground truncate">{source.document_name}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {source.page_number && (
              <span className="text-[10px] text-muted-foreground/50">p. {source.page_number}</span>
            )}
            <span className="text-[10px] text-muted-foreground/40">
              {Math.round(source.similarity_score * 100)}%
            </span>
          </div>
        </div>

        {/* Section heading */}
        {source.section_heading && (
          <p className="text-[10px] font-medium text-muted-foreground mt-1 ml-5">{source.section_heading}</p>
        )}

        {/* Clause references */}
        {source.clause_references.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5 ml-5">
            {source.clause_references.map((ref, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                Cl. {ref}
              </span>
            ))}
          </div>
        )}

        {/* Excerpt */}
        <div className="mt-1.5 ml-5">
          <p className="text-xs text-muted-foreground/70 leading-relaxed font-['Georgia',_serif] italic line-clamp-2">
            "{source.excerpt}"
          </p>
        </div>

        {/* Expanded full text */}
        {expanded && source.full_text && (
          <div className="mt-2 ml-5 p-2 rounded bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {source.full_text}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1 mt-2 ml-5">
          {source.full_text && source.full_text.length > 160 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {expanded ? 'Less' : 'Full text'}
            </button>
          )}
          {onViewInContract && (
            <button
              onClick={() => onViewInContract(source)}
              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors ml-auto"
            >
              <ExternalLink className="h-3 w-3" />
              View in contract
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
