'use client'

import { useAnon, ANON_MESSAGE_LIMIT } from '@/lib/anon-context'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

/**
 * Subtle "Guest · 12/50 messages" pill in the dashboard header. Only renders
 * for anonymous Supabase users; hidden for authenticated users (no jitter).
 */
export function AnonGuestPill() {
  const { isAnon, ready, messagesSent } = useAnon()
  if (!ready || !isAnon) return null

  const remaining = Math.max(0, ANON_MESSAGE_LIMIT - messagesSent)
  const danger = remaining <= 5

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] font-medium border transition-colors ${
              danger
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-600'
                : 'border-border bg-muted/40 text-muted-foreground'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
            Guest · {messagesSent}/{ANON_MESSAGE_LIMIT} messages
          </span>
        }
      />
      <TooltipContent side="bottom">
        <p className="max-w-[220px] text-xs">
          Sign up free to remove the message limit on your first project.
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
