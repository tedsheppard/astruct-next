'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  isToday,
  isBefore,
  differenceInDays,
  startOfDay,
} from 'date-fns'

interface Obligation {
  id: string
  description: string
  due_date: string
  status: string
  clause_reference: string | null
  contracts: {
    name: string
  } | null
}

type ObligationStatus = 'expired' | 'upcoming' | 'compliant'

function getObligationStatus(obligation: Obligation): ObligationStatus {
  if (obligation.status === 'completed' || obligation.status === 'compliant') {
    return 'compliant'
  }
  const dueDate = startOfDay(new Date(obligation.due_date))
  const today = startOfDay(new Date())
  if (isBefore(dueDate, today)) {
    return 'expired'
  }
  if (differenceInDays(dueDate, today) <= 7) {
    return 'upcoming'
  }
  return 'compliant'
}

const STATUS_COLORS: Record<ObligationStatus, string> = {
  expired: 'bg-red-500',
  upcoming: 'bg-amber-500',
  compliant: 'bg-emerald-500',
}

const STATUS_LABELS: Record<ObligationStatus, string> = {
  expired: 'Expired',
  upcoming: 'Upcoming',
  compliant: 'Compliant',
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [obligations, setObligations] = useState<Obligation[]>([])
  const [loading, setLoading] = useState(true)

  // Calculate calendar grid days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentMonth])

  // Fetch obligations for the visible range
  useEffect(() => {
    const supabase = createClient()

    async function loadObligations() {
      setLoading(true)
      const rangeStart = format(calendarDays[0], 'yyyy-MM-dd')
      const rangeEnd = format(calendarDays[calendarDays.length - 1], 'yyyy-MM-dd')

      const { data } = await supabase
        .from('obligations')
        .select('*, contracts(name)')
        .gte('due_date', rangeStart)
        .lte('due_date', rangeEnd)

      if (data) {
        setObligations(data)
      }
      setLoading(false)
    }

    loadObligations()
  }, [calendarDays])

  // Group obligations by date
  const obligationsByDate = useMemo(() => {
    const map = new Map<string, Obligation[]>()
    for (const ob of obligations) {
      const key = ob.due_date
      if (!map.has(key)) {
        map.set(key, [])
      }
      map.get(key)!.push(ob)
    }
    return map
  }, [obligations])

  function goToPreviousMonth() {
    setCurrentMonth((m) => subMonths(m, 1))
  }

  function goToNextMonth() {
    setCurrentMonth((m) => addMonths(m, 1))
  }

  function goToToday() {
    setCurrentMonth(new Date())
  }

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const hasObligations = obligations.length > 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Calendar
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Track obligation deadlines across all contracts.
          </p>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-muted-foreground border-border hover:text-foreground"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={goToPreviousMonth}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={goToNextMonth}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-lg border border-border overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {weekdays.map((day) => (
            <div
              key={day}
              className="px-3 py-2 text-xs font-medium text-muted-foreground text-center uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dateKey = format(day, 'yyyy-MM-dd')
            const dayObligations = obligationsByDate.get(dateKey) || []
            const inCurrentMonth = isSameMonth(day, currentMonth)
            const today = isToday(day)

            // Determine which statuses are present for dots
            const statuses = new Set<ObligationStatus>()
            for (const ob of dayObligations) {
              statuses.add(getObligationStatus(ob))
            }

            // Priority order for dots: expired, upcoming, compliant
            const sortedStatuses: ObligationStatus[] = []
            if (statuses.has('expired')) sortedStatuses.push('expired')
            if (statuses.has('upcoming')) sortedStatuses.push('upcoming')
            if (statuses.has('compliant')) sortedStatuses.push('compliant')

            const cellContent = (
              <div
                className={`
                  min-h-[5.5rem] p-2 border-b border-r border-border transition-colors
                  ${inCurrentMonth ? 'bg-card' : 'bg-main-panel'}
                  ${inCurrentMonth ? 'hover:bg-muted' : ''}
                  ${today ? 'ring-1 ring-inset ring-border' : ''}
                  ${index % 7 === 0 ? 'border-l-0' : ''}
                `}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`
                      text-sm font-medium inline-flex items-center justify-center
                      ${today ? 'bg-white text-[#09090b] w-6 h-6 rounded-full text-xs font-semibold' : ''}
                      ${!today && inCurrentMonth ? 'text-foreground' : ''}
                      ${!today && !inCurrentMonth ? 'text-muted-foreground/40' : ''}
                    `}
                  >
                    {format(day, 'd')}
                  </span>
                  {sortedStatuses.length > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                      {sortedStatuses.map((status) => (
                        <span
                          key={status}
                          className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {dayObligations.length > 0 && inCurrentMonth && (
                  <div className="mt-1.5 space-y-1">
                    {dayObligations.slice(0, 2).map((ob) => {
                      const status = getObligationStatus(ob)
                      return (
                        <div
                          key={ob.id}
                          className={`
                            text-[11px] leading-tight truncate rounded px-1.5 py-0.5
                            ${status === 'expired' ? 'bg-red-500/10 text-red-400' : ''}
                            ${status === 'upcoming' ? 'bg-amber-500/10 text-amber-400' : ''}
                            ${status === 'compliant' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                          `}
                        >
                          {ob.description}
                        </div>
                      )
                    })}
                    {dayObligations.length > 2 && (
                      <div className="text-[11px] text-muted-foreground px-1.5">
                        +{dayObligations.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            )

            if (dayObligations.length > 0) {
              return (
                <Popover key={dateKey}>
                  <PopoverTrigger className="text-left cursor-pointer w-full">
                    {cellContent}
                  </PopoverTrigger>
                  <PopoverContent
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    className="w-80 bg-card border border-border p-0"
                  >
                    <div className="px-3 py-2.5 border-b border-border">
                      <p className="text-sm font-medium text-foreground">
                        {format(day, 'EEEE, d MMMM yyyy')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {dayObligations.length} obligation{dayObligations.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {dayObligations.map((ob) => {
                        const status = getObligationStatus(ob)
                        return (
                          <div
                            key={ob.id}
                            className="px-3 py-2.5 border-b border-border last:border-b-0"
                          >
                            <div className="flex items-start gap-2">
                              <span
                                className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[status]}`}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm text-foreground leading-snug">
                                  {ob.description}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {ob.contracts?.name && (
                                    <span className="text-xs text-muted-foreground truncate">
                                      {ob.contracts.name}
                                    </span>
                                  )}
                                  {ob.clause_reference && (
                                    <>
                                      <span className="text-muted-foreground/40">·</span>
                                      <span className="text-xs text-muted-foreground">
                                        {ob.clause_reference}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <span
                                  className={`
                                    inline-block mt-1.5 text-[11px] font-medium px-1.5 py-0.5 rounded
                                    ${status === 'expired' ? 'bg-red-500/10 text-red-400' : ''}
                                    ${status === 'upcoming' ? 'bg-amber-500/10 text-amber-400' : ''}
                                    ${status === 'compliant' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                                  `}
                                >
                                  {STATUS_LABELS[status]}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              )
            }

            return <div key={dateKey}>{cellContent}</div>
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Expired
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Upcoming (within 7 days)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Compliant
        </div>
      </div>

      {/* Empty state */}
      {!loading && !hasObligations && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <CalendarDays className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No deadlines tracked yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Go to a contract&apos;s Obligations page to add or extract them.
          </p>
        </div>
      )}

      {/* Loading overlay for month transitions */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-border border-t-muted-foreground rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
