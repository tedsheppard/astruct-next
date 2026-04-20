'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useContract } from '@/lib/contract-context'
import { toast } from 'sonner'
import { format, startOfDay, differenceInDays, endOfWeek } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { ObligationCard } from '@/components/obligation-card'
import { CountdownBadge } from '@/components/countdown-badge'
import { cn } from '@/lib/utils'
import {
  Clock,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
  FileText,
  Loader2,
  Calendar,
  Search,
  Download,
  ArrowUpDown,
  User,
  Timer,
  Ban,
  Zap,
  Info,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Obligation {
  id: string
  contract_id: string
  user_id: string
  description: string
  clause_reference: string | null
  due_date: string | null
  status: string
  notice_type: string | null
  completed: boolean
  source: string
  created_at: string
  updated_at: string
  obligation_class: string | null
  trigger_event_id: string | null
  time_period_text: string | null
  time_period_days: number | null
  consequence: string | null
  party_responsible: string | null
  clause_text_snippet: string | null
  document_id: string | null
  explanation: string | null
  confidence: number | null
}

type FilterTab = 'all' | 'standing' | 'pending' | 'completed' | 'expired'
type SortKey = 'due_date' | 'clause_reference' | 'notice_type'

type NoticeType =
  | 'Payment Claim'
  | 'Variation'
  | 'Delay'
  | 'EOT'
  | 'Dispute'
  | 'Other'

const NOTICE_TYPES: NoticeType[] = [
  'Payment Claim',
  'Variation',
  'Delay',
  'EOT',
  'Dispute',
  'Other',
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveClass(ob: Obligation): FilterTab {
  if (ob.obligation_class === 'standing') return 'standing'
  if (ob.obligation_class === 'voided') return 'expired'
  if (ob.completed || ob.obligation_class === 'completed') return 'completed'
  if (ob.obligation_class === 'expired') return 'expired'
  if (ob.due_date) {
    const diff = differenceInDays(
      startOfDay(new Date(ob.due_date)),
      startOfDay(new Date())
    )
    if (diff < 0) return 'expired'
  }
  return 'pending'
}

function isOverdue(ob: Obligation): boolean {
  if (ob.completed) return false
  if (!ob.due_date) return false
  return differenceInDays(startOfDay(new Date(ob.due_date)), startOfDay(new Date())) < 0
}

function isDueThisWeek(ob: Obligation): boolean {
  if (ob.completed || !ob.due_date) return false
  const today = startOfDay(new Date())
  const due = startOfDay(new Date(ob.due_date))
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const diff = differenceInDays(due, today)
  return diff >= 0 && due <= weekEnd
}

function isStanding(ob: Obligation): boolean {
  return ob.obligation_class === 'standing'
}

function getUniqueParties(obligations: Obligation[]): string[] {
  const parties = new Set<string>()
  for (const ob of obligations) {
    if (ob.party_responsible) parties.add(ob.party_responsible)
  }
  return Array.from(parties).sort()
}

function exportToCsv(obligations: Obligation[]) {
  const headers = [
    'Description',
    'Clause Reference',
    'Due Date',
    'Status',
    'Notice Type',
    'Party Responsible',
    'Class',
    'Completed',
    'Source',
    'Consequence',
  ]

  const rows = obligations.map((ob) => [
    `"${(ob.description || '').replace(/"/g, '""')}"`,
    `"${ob.clause_reference || ''}"`,
    ob.due_date ? format(new Date(ob.due_date), 'yyyy-MM-dd') : '',
    ob.status || '',
    ob.notice_type || '',
    ob.party_responsible || '',
    ob.obligation_class || '',
    ob.completed ? 'Yes' : 'No',
    ob.source || '',
    `"${(ob.consequence || '').replace(/"/g, '""')}"`,
  ])

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `obligations-${format(new Date(), 'yyyy-MM-dd')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ObligationsPage() {
  const { selectedContractId } = useContract()
  const router = useRouter()

  const [obligations, setObligations] = useState<Obligation[]>([])
  const [loading, setLoading] = useState(true)
  const [filterTab, setFilterTab] = useState<FilterTab>('all')
  const [sortKey, setSortKey] = useState<SortKey>('due_date')
  const [partyFilter, setPartyFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Selection state for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Slide-out detail panel
  const [detailObligation, setDetailObligation] = useState<Obligation | null>(null)
  const [detailClauseExpanded, setDetailClauseExpanded] = useState(false)
  const [detailExplanationExpanded, setDetailExplanationExpanded] = useState(false)

  // Form state
  const [formDescription, setFormDescription] = useState('')
  const [formClause, setFormClause] = useState('')
  const [formDueDate, setFormDueDate] = useState('')
  const [formType, setFormType] = useState<NoticeType>('Other')
  const [formParty, setFormParty] = useState('')

  // ------------------------------------------
  // Fetch obligations
  // ------------------------------------------
  const fetchObligations = useCallback(async () => {
    if (!selectedContractId) {
      setObligations([])
      setLoading(false)
      return
    }

    try {
      const res = await fetch(
        `/api/obligations?contract_id=${selectedContractId}`
      )
      const data = await res.json()
      if (res.ok) {
        setObligations(data.obligations ?? [])
      } else {
        toast.error('Failed to load obligations')
      }
    } catch {
      toast.error('Failed to load obligations')
    } finally {
      setLoading(false)
    }
  }, [selectedContractId])

  useEffect(() => {
    setLoading(true)
    setSelectedIds(new Set())
    fetchObligations()
  }, [fetchObligations])

  // ------------------------------------------
  // Counts
  // ------------------------------------------
  const counts = useMemo(() => {
    const c = { all: 0, standing: 0, pending: 0, completed: 0, expired: 0, overdue: 0 }
    for (const ob of obligations) {
      c.all++
      const cls = resolveClass(ob)
      c[cls]++
      if (isOverdue(ob)) c.overdue++
    }
    return c
  }, [obligations])

  const parties = useMemo(() => getUniqueParties(obligations), [obligations])

  // ------------------------------------------
  // Filter + sort + search
  // ------------------------------------------
  const processedObligations = useMemo(() => {
    let filtered = obligations

    // Tab filter
    if (filterTab !== 'all') {
      filtered = filtered.filter((ob) => resolveClass(ob) === filterTab)
    }

    // Party filter
    if (partyFilter) {
      filtered = filtered.filter((ob) => ob.party_responsible === partyFilter)
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (ob) =>
          ob.description.toLowerCase().includes(q) ||
          (ob.clause_reference && ob.clause_reference.toLowerCase().includes(q)) ||
          (ob.clause_text_snippet && ob.clause_text_snippet.toLowerCase().includes(q)) ||
          (ob.notice_type && ob.notice_type.toLowerCase().includes(q))
      )
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === 'due_date') {
        if (!a.due_date && !b.due_date) return 0
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      }
      if (sortKey === 'clause_reference') {
        const aRef = a.clause_reference || ''
        const bRef = b.clause_reference || ''
        return aRef.localeCompare(bRef, undefined, { numeric: true })
      }
      if (sortKey === 'notice_type') {
        const aType = a.notice_type || ''
        const bType = b.notice_type || ''
        return aType.localeCompare(bType)
      }
      return 0
    })

    return sorted
  }, [obligations, filterTab, partyFilter, searchQuery, sortKey])

  // ------------------------------------------
  // Grouped obligations for display
  // ------------------------------------------
  const grouped = useMemo(() => {
    const overdue: Obligation[] = []
    const dueThisWeek: Obligation[] = []
    const standing: Obligation[] = []
    const upcoming: Obligation[] = []

    for (const ob of processedObligations) {
      if (isOverdue(ob)) {
        overdue.push(ob)
      } else if (isStanding(ob) && !ob.completed) {
        standing.push(ob)
      } else if (isDueThisWeek(ob)) {
        dueThisWeek.push(ob)
      } else {
        upcoming.push(ob)
      }
    }

    return { overdue, dueThisWeek, standing, upcoming }
  }, [processedObligations])

  // ------------------------------------------
  // Selection helpers
  // ------------------------------------------
  function toggleSelection(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function selectAll() {
    if (selectedIds.size === processedObligations.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(processedObligations.map((ob) => ob.id)))
    }
  }

  // ------------------------------------------
  // Add obligation
  // ------------------------------------------
  async function handleAddObligation(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedContractId || !formDescription.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/obligations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_id: selectedContractId,
          description: formDescription.trim(),
          clause_reference: formClause.trim() || null,
          due_date: formDueDate ? new Date(formDueDate).toISOString() : null,
          notice_type: formType,
          party_responsible: formParty.trim() || null,
        }),
      })

      if (res.ok) {
        toast.success('Obligation added')
        setFormDescription('')
        setFormClause('')
        setFormDueDate('')
        setFormType('Other')
        setFormParty('')
        setShowForm(false)
        await fetchObligations()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to add obligation')
      }
    } catch {
      toast.error('Failed to add obligation')
    } finally {
      setSubmitting(false)
    }
  }

  // ------------------------------------------
  // Mark complete (single or bulk)
  // ------------------------------------------
  async function handleMarkComplete(id: string) {
    const ob = obligations.find((o) => o.id === id)
    if (!ob) return

    try {
      const res = await fetch('/api/obligations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          completed: !ob.completed,
          obligation_class: !ob.completed ? 'completed' : 'pending',
        }),
      })

      if (res.ok) {
        setObligations((prev) =>
          prev.map((o) =>
            o.id === id
              ? {
                  ...o,
                  completed: !o.completed,
                  obligation_class: !o.completed ? 'completed' : 'pending',
                }
              : o
          )
        )
        // Update detail panel if open
        if (detailObligation?.id === id) {
          setDetailObligation((prev) =>
            prev
              ? {
                  ...prev,
                  completed: !prev.completed,
                  obligation_class: !prev.completed ? 'completed' : 'pending',
                }
              : null
          )
        }
        toast.success(ob.completed ? 'Marked incomplete' : 'Marked complete')
      }
    } catch {
      toast.error('Failed to update obligation')
    }
  }

  async function handleBulkMarkComplete() {
    if (selectedIds.size === 0) return

    const promises = Array.from(selectedIds).map((id) =>
      fetch('/api/obligations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: true, obligation_class: 'completed' }),
      })
    )

    try {
      await Promise.all(promises)
      toast.success(`${selectedIds.size} obligation${selectedIds.size !== 1 ? 's' : ''} marked complete`)
      setSelectedIds(new Set())
      await fetchObligations()
    } catch {
      toast.error('Failed to update some obligations')
    }
  }

  // ------------------------------------------
  // Void obligation
  // ------------------------------------------
  async function handleVoid(id: string) {
    try {
      const res = await fetch('/api/obligations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          obligation_class: 'voided',
          status: 'voided',
        }),
      })

      if (res.ok) {
        setObligations((prev) =>
          prev.map((o) =>
            o.id === id ? { ...o, obligation_class: 'voided', status: 'voided' } : o
          )
        )
        if (detailObligation?.id === id) {
          setDetailObligation(null)
        }
        toast.success('Obligation voided')
      }
    } catch {
      toast.error('Failed to void obligation')
    }
  }

  // ------------------------------------------
  // Export selected as CSV
  // ------------------------------------------
  function handleExportSelected() {
    const selected = obligations.filter((ob) => selectedIds.has(ob.id))
    if (selected.length === 0) return
    exportToCsv(selected)
    toast.success(`Exported ${selected.length} obligation${selected.length !== 1 ? 's' : ''}`)
  }

  // ------------------------------------------
  // Extract from contract
  // ------------------------------------------
  async function handleExtract() {
    if (!selectedContractId) return

    setExtracting(true)
    try {
      const res = await fetch('/api/obligations/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract_id: selectedContractId }),
      })

      if (res.ok) {
        const data = await res.json()
        const count = data.obligations?.length ?? 0
        toast.success(
          count > 0
            ? `Extracted ${count} obligation${count !== 1 ? 's' : ''}`
            : 'No new obligations found'
        )
        await fetchObligations()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Extraction failed')
      }
    } catch {
      toast.error('Extraction failed')
    } finally {
      setExtracting(false)
    }
  }

  // ------------------------------------------
  // Loading state
  // ------------------------------------------
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-56 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-lg" />
        ))}
      </div>
    )
  }

  // ------------------------------------------
  // No contract selected
  // ------------------------------------------
  if (!selectedContractId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] -m-6">
        <div className="text-center">
          <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
          <h2 className="text-lg font-medium text-foreground mb-1">
            No contract selected
          </h2>
          <p className="text-sm text-muted-foreground">
            Select a contract to view its obligations
          </p>
        </div>
      </div>
    )
  }

  // ------------------------------------------
  // Filter tabs config
  // ------------------------------------------
  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'standing', label: 'Standing', count: counts.standing },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'completed', label: 'Completed', count: counts.completed },
    { key: 'expired', label: 'Expired', count: counts.expired },
  ]

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'due_date', label: 'Due date' },
    { key: 'clause_reference', label: 'Clause number' },
    { key: 'notice_type', label: 'Type' },
  ]

  // ------------------------------------------
  // Render
  // ------------------------------------------
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Obligations
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            {counts.standing > 0 && (
              <span>{counts.standing} standing</span>
            )}
            {counts.pending > 0 && (
              <span>{counts.standing > 0 ? ' \u00b7 ' : ''}{counts.pending} pending</span>
            )}
            {counts.overdue > 0 && (
              <span className="text-red-400">
                {(counts.standing > 0 || counts.pending > 0) ? ' \u00b7 ' : ''}{counts.overdue} overdue
              </span>
            )}
            {counts.completed > 0 && (
              <span>
                {(counts.standing > 0 || counts.pending > 0 || counts.overdue > 0) ? ' \u00b7 ' : ''}{counts.completed} completed
              </span>
            )}
            {counts.all === 0 && 'Track deadlines, notice requirements, and time-bar obligations'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={handleExtract}
            disabled={extracting}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            {extracting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {extracting ? 'Extracting...' : 'Extract from Contract'}
          </Button>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="accent-gradient text-white btn-press"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Obligation
          </Button>
        </div>
      </div>

      {/* Inline Add Form */}
      {showForm && (
        <Card className="bg-card border-border">
          <CardContent className="pt-0">
            <form onSubmit={handleAddObligation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-muted-foreground">Description</Label>
                  <Textarea
                    placeholder="Describe the obligation or deadline..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground min-h-[80px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Clause Reference</Label>
                  <Input
                    placeholder="e.g. Clause 34.1"
                    value={formClause}
                    onChange={(e) => setFormClause(e.target.value)}
                    className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Due Date</Label>
                  <Input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="bg-main-panel border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Notice Type</Label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as NoticeType)}
                    className="flex h-8 w-full rounded-lg border border-border bg-main-panel px-2.5 py-1 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {NOTICE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Party Responsible</Label>
                  <Input
                    placeholder="e.g. Contractor, Principal"
                    value={formParty}
                    onChange={(e) => setFormParty(e.target.value)}
                    className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={submitting || !formDescription.trim()}
                  className="accent-gradient text-white btn-press"
                >
                  {submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {submitting ? 'Adding...' : 'Add Obligation'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter / Sort bar */}
      <div className="space-y-3">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {filterTabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilterTab(key)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                filterTab === key
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {label}
              {count > 0 && (
                <span className="ml-1.5 text-xs opacity-60">{count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Sort + party filter + search */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="h-7 rounded-md border border-border bg-main-panel px-2 text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {sortOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Party filter */}
          {parties.length > 0 && (
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={partyFilter}
                onChange={(e) => setPartyFilter(e.target.value)}
                className="h-7 rounded-md border border-border bg-main-panel px-2 text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">All parties</option>
                {parties.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search obligations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 pl-8 text-xs bg-main-panel border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-accent border border-border">
          <span className="text-sm text-foreground font-medium">
            {selectedIds.size} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkMarkComplete}
              className="border-border text-muted-foreground hover:text-foreground"
            >
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Mark Complete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportSelected}
              className="border-border text-muted-foreground hover:text-foreground"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Obligations List */}
      {processedObligations.length === 0 && obligations.length === 0 ? (
        <EmptyState
          onAddClick={() => setShowForm(true)}
          onExtractClick={handleExtract}
          extracting={extracting}
        />
      ) : processedObligations.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No obligations match your filters
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overdue section */}
          {grouped.overdue.length > 0 && (
            <ObligationGroup
              title="Overdue"
              count={grouped.overdue.length}
              headerClassName="text-red-400"
              dotClassName="bg-red-500"
              obligations={grouped.overdue}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelection}
              onCardClick={setDetailObligation}
              onMarkComplete={handleMarkComplete}
              onVoid={handleVoid}
            />
          )}

          {/* Due this week section */}
          {grouped.dueThisWeek.length > 0 && (
            <ObligationGroup
              title="Due this week"
              count={grouped.dueThisWeek.length}
              headerClassName="text-amber-400"
              dotClassName="bg-amber-500"
              obligations={grouped.dueThisWeek}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelection}
              onCardClick={setDetailObligation}
              onMarkComplete={handleMarkComplete}
              onVoid={handleVoid}
            />
          )}

          {/* Standing obligations */}
          {grouped.standing.length > 0 && (
            <ObligationGroup
              title="Standing obligations"
              count={grouped.standing.length}
              headerClassName="text-muted-foreground"
              dotClassName="bg-muted-foreground"
              obligations={grouped.standing}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelection}
              onCardClick={setDetailObligation}
              onMarkComplete={handleMarkComplete}
              onVoid={handleVoid}
            />
          )}

          {/* Upcoming / other */}
          {grouped.upcoming.length > 0 && (
            <ObligationGroup
              title="Upcoming"
              count={grouped.upcoming.length}
              headerClassName="text-foreground"
              dotClassName="bg-foreground/40"
              obligations={grouped.upcoming}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelection}
              onCardClick={setDetailObligation}
              onMarkComplete={handleMarkComplete}
              onVoid={handleVoid}
            />
          )}
        </div>
      )}

      {/* Slide-out detail panel */}
      <Sheet
        open={detailObligation !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDetailObligation(null)
            setDetailClauseExpanded(false)
            setDetailExplanationExpanded(false)
          }
        }}
      >
        <SheetContent side="right" className="sm:max-w-lg overflow-y-auto">
          {detailObligation && (
            <>
              <SheetHeader>
                <SheetTitle>Obligation Details</SheetTitle>
                <SheetDescription>
                  {detailObligation.clause_reference || 'No clause reference'}
                </SheetDescription>
              </SheetHeader>

              <div className="px-4 space-y-5">
                {/* Status badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge obligation={detailObligation} />
                  {detailObligation.notice_type && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                      {detailObligation.notice_type}
                    </span>
                  )}
                  {detailObligation.obligation_class === 'standing' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Standing
                    </span>
                  )}
                  {detailObligation.source === 'ai_extracted' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Sparkles className="h-3 w-3" />
                      AI
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Description
                  </h4>
                  <p className={cn(
                    'text-sm leading-relaxed',
                    detailObligation.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                  )}>
                    {detailObligation.description}
                  </p>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-3">
                  {detailObligation.due_date && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        Due Date
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground">
                          {format(new Date(detailObligation.due_date), 'd MMM yyyy')}
                        </span>
                        {!detailObligation.completed && (
                          <CountdownBadge dueDate={detailObligation.due_date} />
                        )}
                      </div>
                    </div>
                  )}

                  {detailObligation.party_responsible && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        Party Responsible
                      </h4>
                      <span className="text-sm text-foreground flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {detailObligation.party_responsible}
                      </span>
                    </div>
                  )}

                  {detailObligation.time_period_text && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        Time Period
                      </h4>
                      <span className="text-sm text-foreground flex items-center gap-1.5">
                        <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                        {detailObligation.time_period_text}
                        {detailObligation.time_period_days !== null && (
                          <span className="text-muted-foreground">
                            ({detailObligation.time_period_days} days)
                          </span>
                        )}
                      </span>
                    </div>
                  )}

                  {detailObligation.confidence !== null && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        Confidence
                      </h4>
                      <span className="text-sm text-foreground">
                        {Math.round(detailObligation.confidence * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Timeline - trigger event */}
                {detailObligation.trigger_event_id && (
                  <div className="rounded-lg bg-blue-500/5 border border-blue-500/10 px-3 py-2.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Zap className="h-3.5 w-3.5 text-blue-400" />
                      <h4 className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                        Trigger Event
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This obligation is linked to a trigger event.
                      {detailObligation.time_period_text && (
                        <> The deadline is {detailObligation.time_period_text} from the trigger.</>
                      )}
                    </p>
                  </div>
                )}

                {/* Consequence */}
                {detailObligation.consequence && (
                  <div className="rounded-lg bg-red-500/5 border border-red-500/10 px-3 py-2.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Shield className="h-3.5 w-3.5 text-red-400" />
                      <h4 className="text-xs font-medium text-red-400 uppercase tracking-wider">
                        Consequence
                      </h4>
                    </div>
                    <p className="text-xs text-red-400 leading-relaxed">
                      {detailObligation.consequence}
                    </p>
                  </div>
                )}

                {/* Clause text */}
                {detailObligation.clause_text_snippet && (
                  <div>
                    <button
                      onClick={() => setDetailClauseExpanded(!detailClauseExpanded)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {detailClauseExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                      <FileText className="h-3 w-3" />
                      View clause text
                    </button>
                    {detailClauseExpanded && (
                      <div className="mt-2 rounded-lg bg-main-panel border border-border px-3 py-2">
                        <p className="text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">
                          {detailObligation.clause_text_snippet}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Explanation */}
                {detailObligation.explanation && (
                  <div>
                    <button
                      onClick={() => setDetailExplanationExpanded(!detailExplanationExpanded)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {detailExplanationExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                      <Info className="h-3 w-3" />
                      Why is this here?
                    </button>
                    {detailExplanationExpanded && (
                      <div className="mt-2 rounded-lg bg-main-panel border border-border px-3 py-2">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {detailObligation.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <SheetFooter>
                {!detailObligation.completed && detailObligation.obligation_class !== 'voided' && (
                  <Button
                    onClick={() => handleMarkComplete(detailObligation.id)}
                    className="accent-gradient text-white btn-press"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark Complete
                  </Button>
                )}
                {detailObligation.completed && (
                  <Button
                    variant="outline"
                    onClick={() => handleMarkComplete(detailObligation.id)}
                    className="border-border text-muted-foreground hover:text-foreground"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark Incomplete
                  </Button>
                )}
                {!detailObligation.completed && detailObligation.obligation_class !== 'voided' && (
                  <Button
                    variant="ghost"
                    onClick={() => handleVoid(detailObligation.id)}
                    className="text-muted-foreground hover:text-red-400"
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Void
                  </Button>
                )}
                {detailObligation.obligation_class === 'voided' && (
                  <span className="text-sm text-muted-foreground italic">This obligation has been voided</span>
                )}
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ---------------------------------------------------------------------------
// StatusBadge (for detail panel)
// ---------------------------------------------------------------------------

function StatusBadge({ obligation }: { obligation: Obligation }) {
  if (obligation.obligation_class === 'voided') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
        <Ban className="h-3 w-3" />
        Voided
      </span>
    )
  }

  if (obligation.completed) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="h-3 w-3" />
        Completed
      </span>
    )
  }

  if (obligation.due_date) {
    const diff = differenceInDays(
      startOfDay(new Date(obligation.due_date)),
      startOfDay(new Date())
    )
    if (diff < 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/20">
          <XCircle className="h-3 w-3" />
          Overdue
        </span>
      )
    }
    if (diff <= 14) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/20">
          <AlertTriangle className="h-3 w-3" />
          Upcoming
        </span>
      )
    }
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
      <CheckCircle2 className="h-3 w-3" />
      On Track
    </span>
  )
}

// ---------------------------------------------------------------------------
// ObligationGroup
// ---------------------------------------------------------------------------

function ObligationGroup({
  title,
  count,
  headerClassName,
  dotClassName,
  obligations,
  selectedIds,
  onToggleSelect,
  onCardClick,
  onMarkComplete,
  onVoid,
}: {
  title: string
  count: number
  headerClassName: string
  dotClassName: string
  obligations: Obligation[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onCardClick: (ob: Obligation) => void
  onMarkComplete: (id: string) => void
  onVoid: (id: string) => void
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={cn('w-2 h-2 rounded-full', dotClassName)} />
        <h3 className={cn('text-sm font-medium', headerClassName)}>
          {title}
        </h3>
        <span className="text-xs text-muted-foreground">({count})</span>
      </div>
      <div className="space-y-2">
        {obligations.map((ob) => (
          <div key={ob.id} className="flex items-start gap-2">
            <div className="pt-4 shrink-0">
              <Checkbox
                checked={selectedIds.has(ob.id)}
                onCheckedChange={() => onToggleSelect(ob.id)}
              />
            </div>
            <div
              className="flex-1 cursor-pointer"
              onClick={() => onCardClick(ob)}
            >
              <ObligationCard
                obligation={{
                  ...ob,
                  due_date: ob.due_date ?? '',
                  obligation_class: ob.obligation_class ?? 'pending',
                }}
                onMarkComplete={onMarkComplete}
                onVoid={onVoid}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

function EmptyState({
  onAddClick,
  onExtractClick,
  extracting,
}: {
  onAddClick: () => void
  onExtractClick: () => void
  extracting: boolean
}) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center max-w-md">
        <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No deadlines tracked yet
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Upload your contract and use &lsquo;Extract from Contract&rsquo; to
          auto-detect obligations, or add them manually.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={onExtractClick}
            disabled={extracting}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            {extracting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Extract from Contract
          </Button>
          <Button
            onClick={onAddClick}
            className="accent-gradient text-white btn-press"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Obligation
          </Button>
        </div>
      </div>
    </div>
  )
}
