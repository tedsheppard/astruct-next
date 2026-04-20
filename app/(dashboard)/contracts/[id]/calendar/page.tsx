'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Loader2,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { CountdownBadge } from '@/components/countdown-badge'
import { ObligationCard } from '@/components/obligation-card'
import { ObligationTimeline } from '@/components/obligation-timeline'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  addMonths,
  subMonths,
  isToday,
  isBefore,
  differenceInDays,
  startOfDay,
} from 'date-fns'

// ─── Types ──────────────────────────────────────────────────────────────────

interface Obligation {
  id: string
  description: string
  due_date: string
  status: string
  completed: boolean
  clause_reference: string | null
  notice_type: string | null
  obligation_class: string
  trigger_event_id: string | null
  time_period_text: string | null
  time_period_days: number | null
  consequence: string | null
  party_responsible: string | null
  clause_text_snippet: string | null
  document_id: string | null
  explanation: string | null
  confidence: number | null
  source: string
  contracts: {
    name: string
  } | null
}

interface TriggerEvent {
  id: string
  contract_id: string
  user_id: string
  source_type: string
  source_id: string | null
  source_name: string | null
  event_type: string
  event_date: string
  description: string | null
  raw_context: string | null
  clause_refs: string[] | null
}

type CalendarStatus = 'overdue' | 'red' | 'amber' | 'green' | 'completed'

// ─── Constants ──────────────────────────────────────────────────────────────

const STATUS_DOT_COLORS: Record<CalendarStatus, string> = {
  overdue: 'bg-red-500',
  red: 'bg-red-500',
  amber: 'bg-amber-500',
  green: 'bg-emerald-500',
  completed: 'bg-zinc-500',
}

const STATUS_BG_COLORS: Record<CalendarStatus, string> = {
  overdue: 'bg-red-500/10 text-red-400',
  red: 'bg-red-500/10 text-red-400',
  amber: 'bg-amber-500/10 text-amber-400',
  green: 'bg-emerald-500/10 text-emerald-400',
  completed: 'bg-zinc-500/10 text-zinc-400',
}

const STATUS_LABELS: Record<CalendarStatus, string> = {
  overdue: 'Overdue',
  red: 'Urgent',
  amber: 'Upcoming',
  green: 'On Track',
  completed: 'Completed',
}

const PARTY_OPTIONS = ['All', 'Contractor', 'Superintendent', 'Principal'] as const
const CLASS_OPTIONS = ['All', 'Standing', 'Pending', 'Completed', 'Expired'] as const

// ─── Helpers ────────────────────────────────────────────────────────────────

function getCalendarStatus(obligation: Obligation): CalendarStatus {
  if (
    obligation.status === 'completed' ||
    obligation.status === 'compliant' ||
    obligation.completed ||
    obligation.obligation_class === 'completed'
  ) {
    return 'completed'
  }

  const dueDate = startOfDay(new Date(obligation.due_date))
  const today = startOfDay(new Date())
  const daysUntil = differenceInDays(dueDate, today)

  if (isBefore(dueDate, today)) return 'overdue'
  if (daysUntil < 3) return 'red'
  if (daysUntil <= 14) return 'amber'
  return 'green'
}

function generateICS(obligations: Obligation[], contractName: string): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Astruct//Obligation Tracker//EN',
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${contractName} - Obligations`,
  ]

  for (const ob of obligations) {
    const dueDate = new Date(ob.due_date)
    const dtStart = format(dueDate, "yyyyMMdd")
    const uid = `${ob.id}@astruct.app`
    const summary = ob.description.replace(/[,;\\]/g, ' ').slice(0, 200)
    const desc = [
      ob.clause_reference ? `Clause: ${ob.clause_reference}` : '',
      ob.party_responsible ? `Party: ${ob.party_responsible}` : '',
      ob.consequence ? `Consequence: ${ob.consequence}` : '',
    ]
      .filter(Boolean)
      .join('\\n')

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTART;VALUE=DATE:${dtStart}`,
      `DTEND;VALUE=DATE:${dtStart}`,
      `SUMMARY:${summary}`,
      desc ? `DESCRIPTION:${desc}` : '',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Due tomorrow: ${summary}`,
      'END:VALARM',
      'END:VEVENT'
    )
  }

  lines.push('END:VCALENDAR')
  return lines.filter(Boolean).join('\r\n')
}

function downloadICS(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ─── SlideOut Panel ─────────────────────────────────────────────────────────

function SlideOutPanel({
  obligation,
  triggerEvent,
  onClose,
  onMarkComplete,
}: {
  obligation: Obligation
  triggerEvent: TriggerEvent | null
  onClose: () => void
  onMarkComplete: (id: string) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* Panel */}
      <div className="relative w-full max-w-lg bg-card border-l border-border overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-border bg-card">
          <h3 className="text-sm font-medium text-foreground">Obligation Details</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* ObligationCard */}
          <ObligationCard
            obligation={obligation}
            onMarkComplete={onMarkComplete}
          />

          {/* Timeline */}
          {(triggerEvent || obligation.trigger_event_id) && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Timeline
              </h4>
              <ObligationTimeline
                triggerEvent={
                  triggerEvent
                    ? {
                        event_type: triggerEvent.event_type,
                        event_date: triggerEvent.event_date,
                        description: triggerEvent.description,
                        source_name: triggerEvent.source_name,
                        raw_context: triggerEvent.raw_context,
                      }
                    : undefined
                }
                obligation={{
                  description: obligation.description,
                  clause_reference: obligation.clause_reference,
                  due_date: obligation.due_date,
                  time_period_text: obligation.time_period_text,
                  consequence: obligation.consequence,
                  explanation: obligation.explanation,
                }}
              />
            </div>
          )}

          {/* Source document link */}
          {obligation.document_id && (
            <a
              href={`/contracts/${obligation.contracts ? '' : ''}documents/${obligation.document_id}`}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              View source document
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Calendar Page ──────────────────────────────────────────────────────────

export default function CalendarPage() {
  const params = useParams()
  const contractId = params.id as string

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [allObligations, setAllObligations] = useState<Obligation[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)

  // Filters
  const [partyFilter, setPartyFilter] = useState<string>('All')
  const [classFilter, setClassFilter] = useState<string>('All')
  const [noticeTypeFilter, setNoticeTypeFilter] = useState<string>('All')

  // Slide-out panel state
  const [selectedObligation, setSelectedObligation] = useState<Obligation | null>(null)
  const [selectedTriggerEvent, setSelectedTriggerEvent] = useState<TriggerEvent | null>(null)
  const [panelLoading, setPanelLoading] = useState(false)

  // Calendar days for the grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentMonth])

  // Load all obligations for this contract (not just calendar range, so filters/stats/upcoming work)
  useEffect(() => {
    const supabase = createClient()
    async function loadObligations() {
      setLoading(true)
      const { data } = await supabase
        .from('obligations')
        .select('*, contracts(name)')
        .eq('contract_id', contractId)
        .order('due_date', { ascending: true })
      if (data) setAllObligations(data)
      setLoading(false)
    }
    loadObligations()
  }, [contractId])

  // Unique notice types for filter
  const noticeTypes = useMemo(() => {
    const types = new Set<string>()
    for (const ob of allObligations) {
      if (ob.notice_type) types.add(ob.notice_type)
    }
    return Array.from(types).sort()
  }, [allObligations])

  // Apply filters
  const filteredObligations = useMemo(() => {
    return allObligations.filter(ob => {
      if (partyFilter !== 'All' && ob.party_responsible !== partyFilter) return false
      if (classFilter !== 'All' && ob.obligation_class !== classFilter.toLowerCase()) return false
      if (noticeTypeFilter !== 'All' && ob.notice_type !== noticeTypeFilter) return false
      return true
    })
  }, [allObligations, partyFilter, classFilter, noticeTypeFilter])

  // Obligations grouped by date (for calendar cells)
  const obligationsByDate = useMemo(() => {
    const map = new Map<string, Obligation[]>()
    for (const ob of filteredObligations) {
      const key = ob.due_date.slice(0, 10)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(ob)
    }
    return map
  }, [filteredObligations])

  // Summary stats
  const stats = useMemo(() => {
    let standing = 0
    let pending = 0
    let overdue = 0
    for (const ob of filteredObligations) {
      const status = getCalendarStatus(ob)
      if (ob.obligation_class === 'standing') standing++
      else if (status === 'overdue') overdue++
      else if (ob.obligation_class === 'pending' || (status !== 'completed')) pending++
    }
    return { standing, pending, overdue }
  }, [filteredObligations])

  // Filter counts
  const filterCounts = useMemo(() => {
    const party: Record<string, number> = {}
    const cls: Record<string, number> = {}
    for (const ob of allObligations) {
      const p = ob.party_responsible || 'Unknown'
      party[p] = (party[p] || 0) + 1
      const c = ob.obligation_class || 'pending'
      cls[c] = (cls[c] || 0) + 1
    }
    return { party, cls }
  }, [allObligations])

  // Open slide-out panel
  const openPanel = useCallback(async (ob: Obligation) => {
    setSelectedObligation(ob)
    setSelectedTriggerEvent(null)

    if (ob.trigger_event_id) {
      setPanelLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('trigger_events')
        .select('*')
        .eq('id', ob.trigger_event_id)
        .single()
      if (data) setSelectedTriggerEvent(data)
      setPanelLoading(false)
    }
  }, [])

  // Mark complete handler
  const handleMarkComplete = useCallback(async (obligationId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('obligations')
      .update({ status: 'completed', completed: true, obligation_class: 'completed' })
      .eq('id', obligationId)

    if (error) {
      toast.error('Failed to mark obligation as complete')
      return
    }

    toast.success('Obligation marked as complete')
    setAllObligations(prev =>
      prev.map(ob =>
        ob.id === obligationId
          ? { ...ob, status: 'completed', completed: true, obligation_class: 'completed' }
          : ob
      )
    )
    if (selectedObligation?.id === obligationId) {
      setSelectedObligation(prev =>
        prev ? { ...prev, status: 'completed', completed: true, obligation_class: 'completed' } : null
      )
    }
  }, [selectedObligation])

  // Export ICS
  const handleExportICS = useCallback(() => {
    if (filteredObligations.length === 0) {
      toast('No obligations to export')
      return
    }
    const contractName = filteredObligations[0]?.contracts?.name || 'Contract'
    const ics = generateICS(filteredObligations, contractName)
    downloadICS(ics, `${contractName.replace(/\s+/g, '_')}_obligations.ics`)
    toast.success(`Exported ${filteredObligations.length} obligation${filteredObligations.length !== 1 ? 's' : ''}`)
  }, [filteredObligations])

  // Upcoming deadlines (next 90 days, pending only)
  const upcomingDeadlines = useMemo(() => {
    const today = startOfDay(new Date())
    const futureLimit = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
    return filteredObligations.filter(ob => {
      const status = getCalendarStatus(ob)
      if (status === 'completed') return false
      const due = startOfDay(new Date(ob.due_date))
      return due >= today && due <= futureLimit
    })
  }, [filteredObligations])

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">{format(currentMonth, 'MMMM yyyy')}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportICS}
              className="text-muted-foreground border-border hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export .ics
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
              className="text-muted-foreground border-border hover:text-foreground"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setCurrentMonth(m => subMonths(m, 1))}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setCurrentMonth(m => addMonths(m, 1))}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary stats */}
        {!loading && allObligations.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">{stats.standing}</span> standing obligation{stats.standing !== 1 ? 's' : ''}
            {' \u2022 '}
            <span className="text-foreground font-medium">{stats.pending}</span> pending
            {stats.overdue > 0 && (
              <>
                {' \u2022 '}
                <span className="text-red-400 font-medium">{stats.overdue}</span> overdue
              </>
            )}
          </div>
        )}

        {/* Filter bar */}
        {!loading && allObligations.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />

            {/* Party filter */}
            <div className="flex items-center gap-1">
              {PARTY_OPTIONS.map(option => {
                const count =
                  option === 'All'
                    ? allObligations.length
                    : filterCounts.party[option] || 0
                return (
                  <button
                    key={option}
                    onClick={() => setPartyFilter(option)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      partyFilter === option
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {option}
                    {count > 0 && (
                      <span className={`text-[10px] ${partyFilter === option ? 'text-background/70' : 'text-muted-foreground/60'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <span className="w-px h-4 bg-border" />

            {/* Class filter */}
            <div className="flex items-center gap-1">
              {CLASS_OPTIONS.map(option => {
                const count =
                  option === 'All'
                    ? allObligations.length
                    : filterCounts.cls[option.toLowerCase()] || 0
                return (
                  <button
                    key={option}
                    onClick={() => setClassFilter(option)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      classFilter === option
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {option}
                    {count > 0 && (
                      <span className={`text-[10px] ${classFilter === option ? 'text-background/70' : 'text-muted-foreground/60'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Notice type filter */}
            {noticeTypes.length > 0 && (
              <>
                <span className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setNoticeTypeFilter('All')}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      noticeTypeFilter === 'All'
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All Types
                  </button>
                  {noticeTypes.map(nt => (
                    <button
                      key={nt}
                      onClick={() => setNoticeTypeFilter(nt)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        noticeTypeFilter === nt
                          ? 'bg-foreground text-background'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {nt}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Clear filters */}
            {(partyFilter !== 'All' || classFilter !== 'All' || noticeTypeFilter !== 'All') && (
              <button
                onClick={() => {
                  setPartyFilter('All')
                  setClassFilter('All')
                  setNoticeTypeFilter('All')
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
        )}

        {/* Calendar grid */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {weekdays.map(day => (
              <div
                key={day}
                className="px-3 py-2 text-xs font-medium text-muted-foreground text-center uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map(day => {
              const dateKey = format(day, 'yyyy-MM-dd')
              const dayObligations = obligationsByDate.get(dateKey) || []
              const inCurrentMonth = isSameMonth(day, currentMonth)
              const todayCheck = isToday(day)

              // Collect unique statuses for dots (priority order)
              const statuses = new Set<CalendarStatus>()
              for (const ob of dayObligations) statuses.add(getCalendarStatus(ob))
              const sortedStatuses: CalendarStatus[] = []
              if (statuses.has('overdue')) sortedStatuses.push('overdue')
              if (statuses.has('red')) sortedStatuses.push('red')
              if (statuses.has('amber')) sortedStatuses.push('amber')
              if (statuses.has('green')) sortedStatuses.push('green')
              if (statuses.has('completed')) sortedStatuses.push('completed')

              const cellContent = (
                <div
                  className={`min-h-[5.5rem] p-2 border-b border-r border-border transition-colors ${
                    inCurrentMonth ? 'bg-card' : 'bg-main-panel'
                  } ${inCurrentMonth ? 'hover:bg-muted' : ''} ${
                    todayCheck ? 'ring-1 ring-inset ring-border' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-sm font-medium inline-flex items-center justify-center ${
                        todayCheck
                          ? 'bg-white text-[#09090b] w-6 h-6 rounded-full text-xs font-semibold'
                          : ''
                      } ${!todayCheck && inCurrentMonth ? 'text-foreground' : ''} ${
                        !todayCheck && !inCurrentMonth ? 'text-muted-foreground/40' : ''
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    {sortedStatuses.length > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        {sortedStatuses.map(status => (
                          <span
                            key={status}
                            className={`w-2 h-2 rounded-full ${STATUS_DOT_COLORS[status]}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {dayObligations.length > 0 && inCurrentMonth && (
                    <div className="mt-1.5 space-y-1">
                      {dayObligations.slice(0, 2).map(ob => {
                        const status = getCalendarStatus(ob)
                        return (
                          <div
                            key={ob.id}
                            className={`text-[11px] leading-tight truncate rounded px-1.5 py-0.5 ${STATUS_BG_COLORS[status]}`}
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
                          {dayObligations.length} obligation
                          {dayObligations.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {dayObligations.map(ob => {
                          const status = getCalendarStatus(ob)
                          return (
                            <button
                              key={ob.id}
                              onClick={() => openPanel(ob)}
                              className="w-full text-left px-3 py-2.5 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-start gap-2">
                                <span
                                  className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${STATUS_DOT_COLORS[status]}`}
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm text-foreground leading-snug">
                                    {ob.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {ob.clause_reference && (
                                      <span className="text-xs text-muted-foreground">
                                        {ob.clause_reference}
                                      </span>
                                    )}
                                    <span
                                      className={`inline-block text-[11px] font-medium px-1.5 py-0.5 rounded ${STATUS_BG_COLORS[status]}`}
                                    >
                                      {STATUS_LABELS[status]}
                                    </span>
                                    {ob.party_responsible && (
                                      <span className="text-[11px] text-muted-foreground">
                                        {ob.party_responsible}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
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
            {'< 3 days / overdue'}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            3-14 days
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {'> 14 days'}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-500" />
            Completed
          </div>
        </div>

        {/* Upcoming deadlines table */}
        {upcomingDeadlines.length > 0 && (
          <div className="mt-2">
            <h3 className="text-sm font-medium text-foreground mb-3">
              Upcoming Deadlines
              <span className="text-muted-foreground font-normal ml-2">
                Next 90 days
              </span>
            </h3>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-main-panel">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-8"></th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Clause
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Party
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Consequence
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingDeadlines.map(ob => {
                    const status = getCalendarStatus(ob)
                    return (
                      <tr
                        key={ob.id}
                        onClick={() => openPanel(ob)}
                        className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <span
                            className={`w-2 h-2 rounded-full inline-block ${STATUS_DOT_COLORS[status]}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-foreground leading-snug line-clamp-2">
                            {ob.description}
                          </p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-foreground text-xs">
                            {format(new Date(ob.due_date), 'd MMM yyyy')}
                          </p>
                          <CountdownBadge dueDate={ob.due_date} className="mt-1" />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {ob.clause_reference || '\u2014'}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                          {ob.party_responsible || '\u2014'}
                        </td>
                        <td className="px-4 py-3">
                          {ob.consequence ? (
                            <p className="text-xs text-red-400 leading-snug line-clamp-2">
                              {ob.consequence}
                            </p>
                          ) : (
                            <span className="text-muted-foreground">{'\u2014'}</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && allObligations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CalendarDays className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No deadlines tracked yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              Scan your uploaded documents and correspondence to automatically identify
              response deadlines, time-bars, and contractual obligations.
            </p>
            <button
              onClick={async () => {
                setScanning(true)
                try {
                  const res = await fetch('/api/deadlines/scan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contract_id: contractId, trigger: 'manual' }),
                  })
                  const data = await res.json()
                  if (res.ok && data.deadlines_created > 0) {
                    toast.success(
                      `Found ${data.deadlines_created} deadline${data.deadlines_created !== 1 ? 's' : ''}`
                    )
                    // Reload obligations
                    const supabase = createClient()
                    const { data: reloaded } = await supabase
                      .from('obligations')
                      .select('*, contracts(name)')
                      .eq('contract_id', contractId)
                      .order('due_date', { ascending: true })
                    if (reloaded) setAllObligations(reloaded)
                  } else {
                    toast('No actionable deadlines found in current documents')
                  }
                } catch {
                  toast.error('Scan failed')
                } finally {
                  setScanning(false)
                }
              }}
              disabled={scanning}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {scanning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {scanning ? 'Scanning documents...' : 'Scan for Deadlines'}
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-border border-t-muted-foreground rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Slide-out panel */}
      {selectedObligation && (
        <SlideOutPanel
          obligation={selectedObligation}
          triggerEvent={selectedTriggerEvent}
          onClose={() => {
            setSelectedObligation(null)
            setSelectedTriggerEvent(null)
          }}
          onMarkComplete={handleMarkComplete}
        />
      )}
    </div>
  )
}
