'use client'

import { format } from 'date-fns'
import {
  Zap,
  FileText,
  Calendar,
  AlertTriangle,
  Clock,
  Shield,
  Info,
  Timer,
} from 'lucide-react'
import { CountdownBadge } from '@/components/countdown-badge'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ObligationTimelineProps {
  triggerEvent?: {
    event_type: string
    event_date: string
    description: string | null
    source_name: string | null
    raw_context: string | null
  }
  obligation: {
    description: string
    clause_reference: string | null
    due_date: string
    time_period_text: string | null
    consequence: string | null
    explanation: string | null
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ObligationTimeline({
  triggerEvent,
  obligation,
}: ObligationTimelineProps) {
  const dueDate = new Date(obligation.due_date)
  const isOverdue = dueDate < new Date()

  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />

      <div className="space-y-0">
        {/* Node 1: Trigger Event */}
        {triggerEvent && (
          <TimelineNode
            icon={<Zap className="h-3.5 w-3.5" />}
            iconBg="bg-blue-500/15 text-blue-400 border-blue-500/30"
            dotColor="bg-blue-500"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">
                  Trigger Event
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {triggerEvent.event_type}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {format(new Date(triggerEvent.event_date), 'd MMM yyyy')}
              </p>

              {triggerEvent.description && (
                <p className="text-sm text-foreground leading-relaxed">
                  {triggerEvent.description}
                </p>
              )}

              {triggerEvent.source_name && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  {triggerEvent.source_name}
                </span>
              )}

              {triggerEvent.raw_context && (
                <div className="rounded-lg bg-main-panel border border-border px-3 py-2 mt-1">
                  <p className="text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">
                    {triggerEvent.raw_context}
                  </p>
                </div>
              )}
            </div>
          </TimelineNode>
        )}

        {/* Node 2: Obligation */}
        <TimelineNode
          icon={<Clock className="h-3.5 w-3.5" />}
          iconBg="bg-amber-500/15 text-amber-400 border-amber-500/30"
          dotColor="bg-amber-500"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground">
                Obligation Created
              </span>
              {obligation.time_period_text && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                  <Timer className="h-3 w-3" />
                  {obligation.time_period_text}
                </span>
              )}
            </div>

            <p className="text-sm text-foreground leading-relaxed">
              {obligation.description}
            </p>

            {obligation.clause_reference && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                {obligation.clause_reference}
              </span>
            )}

            {obligation.explanation && (
              <div className="flex items-start gap-2 rounded-lg bg-main-panel border border-border px-3 py-2 mt-1">
                <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {obligation.explanation}
                </p>
              </div>
            )}
          </div>
        </TimelineNode>

        {/* Node 3: Due Date */}
        <TimelineNode
          icon={<Calendar className="h-3.5 w-3.5" />}
          iconBg={cn(
            isOverdue
              ? 'bg-red-500/15 text-red-400 border-red-500/30'
              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          )}
          dotColor={isOverdue ? 'bg-red-500' : 'bg-emerald-500'}
          isLast
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground">
                Due Date
              </span>
              <CountdownBadge dueDate={obligation.due_date} />
            </div>

            <p className="text-sm text-foreground">
              {format(dueDate, 'EEEE, d MMMM yyyy')}
            </p>

            {obligation.consequence && (
              <div className="flex items-start gap-2 rounded-lg bg-red-500/5 border border-red-500/10 px-3 py-2 mt-1">
                <Shield className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-medium text-red-400 mb-0.5">
                    Consequence of non-compliance
                  </p>
                  <p className="text-xs text-red-400/80 leading-relaxed">
                    {obligation.consequence}
                  </p>
                </div>
              </div>
            )}
          </div>
        </TimelineNode>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TimelineNode
// ---------------------------------------------------------------------------

function TimelineNode({
  icon,
  iconBg,
  dotColor,
  isLast = false,
  children,
}: {
  icon: React.ReactNode
  iconBg: string
  dotColor: string
  isLast?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative flex gap-3 pb-6 last:pb-0">
      {/* Icon circle */}
      <div
        className={cn(
          'relative z-10 flex items-center justify-center w-[31px] h-[31px] rounded-full border shrink-0',
          iconBg
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">{children}</div>
    </div>
  )
}
