'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'
import { useAnon } from '@/lib/anon-context'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

/**
 * Sidebar nav item that locks for anonymous users — clicking triggers the
 * hard-wall signup modal instead of navigating. For authenticated users it
 * behaves as a regular nav link.
 */
export function AnonLockedNavItem({
  icon: Icon,
  label,
  href,
  isActive,
  collapsed,
  beta,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  href: string
  isActive: boolean
  collapsed: boolean
  beta?: boolean
}) {
  const { isAnon, triggerHardWall } = useAnon()
  const locked = isAnon

  const content = (
    <Link
      href={locked ? '#' : href}
      onClick={(e) => {
        if (locked) {
          e.preventDefault()
          triggerHardWall('locked_feature')
        }
      }}
      className={`
        flex items-center rounded-lg text-sm transition-all duration-200 relative
        ${isActive
          ? 'bg-sidebar-active text-sidebar-active-fg font-medium'
          : 'text-sidebar-fg/60 hover:text-sidebar-fg hover:bg-sidebar-active/50'
        }
      `}
      style={{
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingTop: '8px',
        paddingBottom: '8px',
      }}
    >
      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4" strokeWidth={1.5} />
      </div>
      <span
        className={`ml-3 whitespace-nowrap transition-all duration-300 ease-in-out ${
          collapsed ? 'opacity-0 w-0 max-w-0 ml-0 overflow-hidden' : 'opacity-100'
        }`}
      >
        {label}
      </span>
      {locked && !collapsed && (
        <Lock className="ml-auto h-3 w-3 text-muted-foreground/50" strokeWidth={2} />
      )}
      {beta && !locked && !collapsed && (
        <span className="ml-auto text-[9px] uppercase tracking-wider text-violet-600 bg-violet-500/10 border border-violet-500/30 rounded px-1.5 py-0.5">
          Beta
        </span>
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={<div />}>{content}</TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}{locked ? ' (sign up to unlock)' : beta ? ' (beta)' : ''}</p>
        </TooltipContent>
      </Tooltip>
    )
  }
  return content
}
