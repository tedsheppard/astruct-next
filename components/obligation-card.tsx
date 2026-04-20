'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Calendar,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Shield,
  User,
  Zap,
  Ban,
  Info,
  Timer,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CountdownBadge } from '@/components/countdown-badge'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ObligationCardProps {
  obligation: {
    id: string
    description: string
    clause_reference: string | null
    due_date: string
    status: string
    notice_type: string | null
    completed: boolean
    obligation_class: string
    time_period_text: string | null
    time_period_days: number | null
    consequence: string | null
    party_responsible: string | null
    clause_text_snippet: string | null
    explanation: string | null
    confidence: number | null
    trigger_event_id: string | null
    source: string
  }
  onMarkComplete?: (id: string) => void
  onVoid?: (id: string) => void
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type StatusColor = 'expired' | 'upcoming' | 'compliant'

function getStatusInfo(obligation: ObligationCardProps['obligation']): {
  label: string
  color: StatusColor
} {
  if (obligation.completed) {
    return { label: 'Compliant', color: 'compliant' }
  }

  const now = new Date()
  const due = new Date(obligation.due_date)
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { label: 'Expired', color: 'expired' }
  if (diffDays <= 14) return { label: 'Upcoming', color: 'upcoming' }
  return { label: 'Compliant', color: 'compliant' }
}

const statusBadgeClasses: Record<StatusColor, string> = {
  expired: 'bg-red-500/15 text-red-400 border border-red-500/20',
  upcoming: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  compliant: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
}

const statusDotClasses: Record<StatusColor, string> = {
  expired: 'bg-red-500',
  upcoming: 'bg-amber-500',
  compliant: 'bg-emerald-500',
}

const statusIcons: Record<StatusColor, typeof XCircle> = {
  expired: XCircle,
  upcoming: AlertTriangle,
  compliant: CheckCircle2,
}

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.9) return 'High'
  if (confidence >= 0.7) return 'Medium'
  return 'Low'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ObligationCard({
  obligation,
  onMarkComplete,
  onVoid,
}: ObligationCardProps) {
  const [clauseExpanded, setClauseExpanded] = useState(false)
  const [explanationExpanded, setExplanationExpanded] = useState(false)

  const { label, color } = getStatusInfo(obligation)
  const StatusIcon = statusIcons[color]

  return (
    <Card className="bg-card border-border hover:border-border transition-colors">
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Row 1: Status + badges */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Status badge */}
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                  statusBadgeClasses[color]
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', statusDotClasses[color])} />
                {label}
              </span>

              {/* Notice type */}
              {obligation.notice_type && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                  {obligation.notice_type}
                </span>
              )}

              {/* Time bar warning */}
              {obligation.obligation_class === 'time_bar' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  <Timer className="h-3 w-3" />
                  Time Bar
                </span>
              )}

              {/* Source badge */}
              {obligation.source === 'ai_extracted' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Sparkles className="h-3 w-3" />
                  AI Extracted
                </span>
              )}

              {/* Pending trigger */}
              {obligation.trigger_event_id && !obligation.completed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Zap className="h-3 w-3" />
                  Triggered
                </span>
              )}
            </div>

            {/* Confidence */}
            {obligation.confidence !== null && (
              <span className="text-[11px] text-muted-foreground/60 shrink-0">
                {Math.round(obligation.confidence * 100)}% confidence
              </span>
            )}
          </div>

          {/* Row 2: Description */}
          <p
            className={cn(
              'text-sm leading-relaxed',
              obligation.completed
                ? 'text-muted-foreground line-through'
                : 'text-foreground'
            )}
          >
            {obligation.description}
          </p>

          {/* Row 3: Meta info */}
          <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
            {obligation.clause_reference && (
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {obligation.clause_reference}
              </span>
            )}

            {obligation.due_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(obligation.due_date), 'd MMM yyyy')}
              </span>
            )}

            {obligation.party_responsible && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {obligation.party_responsible}
              </span>
            )}

            {obligation.time_period_text && (
              <span className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                {obligation.time_period_text}
              </span>
            )}

            {obligation.due_date && !obligation.completed && (
              <CountdownBadge dueDate={obligation.due_date} />
            )}
          </div>

          {/* Consequence */}
          {obligation.consequence && (
            <div className="flex items-start gap-2 rounded-lg bg-red-500/5 border border-red-500/10 px-3 py-2">
              <Shield className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-400 leading-relaxed">
                {obligation.consequence}
              </p>
            </div>
          )}

          {/* Expandable: Clause snippet */}
          {obligation.clause_text_snippet && (
            <div>
              <button
                onClick={() => setClauseExpanded(!clauseExpanded)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {clauseExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                <FileText className="h-3 w-3" />
                View clause text
              </button>
              {clauseExpanded && (
                <div className="mt-2 rounded-lg bg-main-panel border border-border px-3 py-2">
                  <p className="text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">
                    {obligation.clause_text_snippet}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Expandable: Explanation */}
          {obligation.explanation && (
            <div>
              <button
                onClick={() => setExplanationExpanded(!explanationExpanded)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {explanationExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                <Info className="h-3 w-3" />
                Why is this here?
              </button>
              {explanationExpanded && (
                <div className="mt-2 rounded-lg bg-main-panel border border-border px-3 py-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {obligation.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            {onMarkComplete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkComplete(obligation.id)}
                disabled={obligation.completed}
                className={cn(
                  'border-border transition-colors',
                  obligation.completed
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                {obligation.completed ? 'Completed' : 'Mark Complete'}
              </Button>
            )}

            {onVoid && !obligation.completed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVoid(obligation.id)}
                className="text-muted-foreground hover:text-red-400"
              >
                <Ban className="mr-1 h-3.5 w-3.5" />
                Void
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
