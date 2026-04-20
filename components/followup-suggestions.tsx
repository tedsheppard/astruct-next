'use client'

import { ArrowUpRight } from 'lucide-react'

interface FollowupSuggestionsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
  disabled?: boolean
}

export default function FollowupSuggestions({ suggestions, onSelect, disabled }: FollowupSuggestionsProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-3 animate-slide-up">
      {suggestions.map((suggestion, i) => (
        <button
          key={i}
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-muted/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          <span className="max-w-[280px] truncate">{suggestion}</span>
          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </button>
      ))}
    </div>
  )
}
