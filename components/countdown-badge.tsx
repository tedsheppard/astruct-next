'use client'

import { useMemo } from 'react'
import { differenceInDays, startOfDay } from 'date-fns'
import { cn } from '@/lib/utils'

interface CountdownBadgeProps {
  dueDate: string
  className?: string
}

export function CountdownBadge({ dueDate, className }: CountdownBadgeProps) {
  const { label, colorClasses, pulse } = useMemo(() => {
    const today = startOfDay(new Date())
    const due = startOfDay(new Date(dueDate))
    const diff = differenceInDays(due, today)

    if (diff < 0) {
      const overdueDays = Math.abs(diff)
      return {
        label: overdueDays === 1 ? 'OVERDUE 1 day' : `OVERDUE ${overdueDays} days`,
        colorClasses: 'bg-red-500/15 text-red-400 border border-red-500/20',
        pulse: false,
      }
    }

    if (diff === 0) {
      return {
        label: 'Today',
        colorClasses: 'bg-red-500/15 text-red-400 border border-red-500/20',
        pulse: true,
      }
    }

    if (diff === 1) {
      return {
        label: 'Tomorrow',
        colorClasses: 'bg-red-500/15 text-red-400 border border-red-500/20',
        pulse: true,
      }
    }

    if (diff < 3) {
      return {
        label: `${diff} days`,
        colorClasses: 'bg-red-500/15 text-red-400 border border-red-500/20',
        pulse: true,
      }
    }

    if (diff <= 14) {
      return {
        label: `${diff} days`,
        colorClasses: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
        pulse: false,
      }
    }

    return {
      label: `${diff} days`,
      colorClasses: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
      pulse: false,
    }
  }, [dueDate])

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        colorClasses,
        pulse && 'animate-pulse',
        className
      )}
    >
      {label}
    </span>
  )
}
