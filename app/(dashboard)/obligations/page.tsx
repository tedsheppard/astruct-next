'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useContract } from '@/lib/contract-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Filter,
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
}

type StatusFilter = 'all' | 'expired' | 'upcoming' | 'compliant'
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

function getStatusInfo(obligation: Obligation) {
  if (obligation.completed) {
    return { label: 'Compliant', color: 'compliant' as const }
  }

  if (!obligation.due_date) {
    return { label: 'Compliant', color: 'compliant' as const }
  }

  const now = new Date()
  const due = new Date(obligation.due_date)
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { label: 'Expired', color: 'expired' as const }
  }
  if (diffDays <= 14) {
    return { label: 'Upcoming', color: 'upcoming' as const }
  }
  return { label: 'Compliant', color: 'compliant' as const }
}

function getDaysRemaining(dueDate: string | null): number | null {
  if (!dueDate) return null
  const now = new Date()
  const due = new Date(dueDate)
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'No date set'
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const statusBadgeClasses = {
  expired: 'bg-red-500/15 text-red-400 border border-red-500/20',
  upcoming: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  compliant: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
}

const statusIcons = {
  expired: XCircle,
  upcoming: AlertTriangle,
  compliant: CheckCircle2,
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ObligationsPage() {
  const { selectedContractId } = useContract()
  const router = useRouter()

  const [obligations, setObligations] = useState<Obligation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [showForm, setShowForm] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Form state
  const [formDescription, setFormDescription] = useState('')
  const [formClause, setFormClause] = useState('')
  const [formDueDate, setFormDueDate] = useState('')
  const [formType, setFormType] = useState<NoticeType>('Other')

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
        setObligations(data.obligations)
      }
    } catch (err) {
      console.error('Failed to fetch obligations:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedContractId])

  useEffect(() => {
    setLoading(true)
    fetchObligations()
  }, [fetchObligations])

  // ------------------------------------------
  // Filtered + sorted obligations
  // ------------------------------------------
  const filteredObligations = useMemo(() => {
    let filtered = obligations

    if (filter !== 'all') {
      filtered = obligations.filter((ob) => {
        const { color } = getStatusInfo(ob)
        return color === filter
      })
    }

    // Already sorted by due_date from the API, but ensure nulls at end
    return [...filtered].sort((a, b) => {
      if (!a.due_date && !b.due_date) return 0
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    })
  }, [obligations, filter])

  // ------------------------------------------
  // Status counts for filter badges
  // ------------------------------------------
  const statusCounts = useMemo(() => {
    const counts = { all: obligations.length, expired: 0, upcoming: 0, compliant: 0 }
    for (const ob of obligations) {
      const { color } = getStatusInfo(ob)
      counts[color]++
    }
    return counts
  }, [obligations])

  // ------------------------------------------
  // Add obligation
  // ------------------------------------------
  async function handleAddObligation(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedContractId || !formDescription.trim() || !formDueDate) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/obligations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_id: selectedContractId,
          description: formDescription.trim(),
          clause_reference: formClause.trim() || null,
          due_date: new Date(formDueDate).toISOString(),
          notice_type: formType,
        }),
      })

      if (res.ok) {
        setFormDescription('')
        setFormClause('')
        setFormDueDate('')
        setFormType('Other')
        setShowForm(false)
        await fetchObligations()
      }
    } catch (err) {
      console.error('Failed to add obligation:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // ------------------------------------------
  // Toggle completed
  // ------------------------------------------
  async function handleToggleComplete(obligation: Obligation) {
    setTogglingId(obligation.id)
    try {
      const res = await fetch('/api/obligations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: obligation.id,
          completed: !obligation.completed,
        }),
      })

      if (res.ok) {
        setObligations((prev) =>
          prev.map((ob) =>
            ob.id === obligation.id
              ? { ...ob, completed: !ob.completed }
              : ob
          )
        )
      }
    } catch (err) {
      console.error('Failed to toggle obligation:', err)
    } finally {
      setTogglingId(null)
    }
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
        await fetchObligations()
      } else {
        const data = await res.json()
        console.error('Extract failed:', data.error)
      }
    } catch (err) {
      console.error('Failed to extract obligations:', err)
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
  // Render
  // ------------------------------------------
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Obligations
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Track deadlines, notice requirements, and time-bar obligations
          </p>
        </div>
        <div className="flex items-center gap-2">
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Type</Label>
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
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={submitting || !formDescription.trim() || !formDueDate}
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {(
          [
            { key: 'all', label: 'All' },
            { key: 'expired', label: 'Expired' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'compliant', label: 'Compliant' },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:text-muted-foreground hover:bg-accent'
            }`}
          >
            {label}
            {statusCounts[key] > 0 && (
              <span className="ml-1.5 text-xs opacity-60">
                {statusCounts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Obligations List */}
      {filteredObligations.length === 0 && obligations.length === 0 ? (
        <EmptyState
          onAddClick={() => setShowForm(true)}
          onExtractClick={handleExtract}
          extracting={extracting}
        />
      ) : filteredObligations.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Filter className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No obligations match this filter
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredObligations.map((obligation) => (
            <ObligationCard
              key={obligation.id}
              obligation={obligation}
              togglingId={togglingId}
              onToggleComplete={handleToggleComplete}
              onCreateNotice={() =>
                router.push(
                  `/notices?obligation_id=${obligation.id}&contract_id=${selectedContractId}`
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ObligationCard
// ---------------------------------------------------------------------------

function ObligationCard({
  obligation,
  togglingId,
  onToggleComplete,
  onCreateNotice,
}: {
  obligation: Obligation
  togglingId: string | null
  onToggleComplete: (ob: Obligation) => void
  onCreateNotice: () => void
}) {
  const { label, color } = getStatusInfo(obligation)
  const daysRemaining = getDaysRemaining(obligation.due_date)
  const StatusIcon = statusIcons[color]
  const isToggling = togglingId === obligation.id

  let daysLabel = ''
  if (daysRemaining !== null) {
    if (obligation.completed) {
      daysLabel = 'Completed'
    } else if (daysRemaining < 0) {
      daysLabel = `${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''} overdue`
    } else if (daysRemaining === 0) {
      daysLabel = 'Due today'
    } else {
      daysLabel = `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
    }
  }

  return (
    <Card className="bg-card border-border hover:border-border transition-colors">
      <CardContent className="pt-0">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Status badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeClasses[color]}`}
              >
                <StatusIcon className="h-3 w-3" />
                {label}
              </span>

              {/* Notice type */}
              {obligation.notice_type && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                  {obligation.notice_type}
                </span>
              )}

              {/* Source badge */}
              {obligation.source === 'ai_extracted' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Sparkles className="h-3 w-3" />
                  AI Extracted
                </span>
              )}
            </div>

            <p
              className={`text-sm leading-relaxed ${
                obligation.completed
                  ? 'text-muted-foreground line-through'
                  : 'text-foreground'
              }`}
            >
              {obligation.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {obligation.clause_reference && (
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {obligation.clause_reference}
                </span>
              )}
              {obligation.due_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(obligation.due_date)}
                </span>
              )}
              {daysLabel && (
                <span
                  className={`font-medium ${
                    color === 'expired'
                      ? 'text-red-400'
                      : color === 'upcoming'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                  }`}
                >
                  {daysLabel}
                </span>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateNotice}
              className="text-muted-foreground hover:text-foreground"
            >
              <FileText className="mr-1 h-3.5 w-3.5" />
              Create Notice
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleComplete(obligation)}
              disabled={isToggling}
              className={`border-border transition-colors ${
                obligation.completed
                  ? 'text-emerald-400 hover:text-foreground bg-emerald-500/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isToggling ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              )}
              {obligation.completed ? 'Completed' : 'Mark Complete'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
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
