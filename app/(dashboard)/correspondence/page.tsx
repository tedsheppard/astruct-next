'use client'

import { useState, useEffect, useCallback } from 'react'
import { useContract } from '@/lib/contract-context'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Mail,
  Plus,
  X,
  Loader2,
  ArrowDownLeft,
  ArrowUpRight,
  Minus,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Correspondence {
  id: string
  contract_id: string
  subject: string
  from_party: string
  date: string
  content: string
  category: 'Incoming' | 'Outgoing' | 'Neutral'
  clause_tags: string[]
  created_at: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PLATFORMS = [
  {
    name: 'Procore',
    letter: 'P',
    color: 'bg-orange-500',
    description: 'Construction project management platform',
  },
  {
    name: 'Aconex (Oracle)',
    letter: 'A',
    color: 'bg-red-500',
    description: 'Document management and collaboration',
  },
  {
    name: 'Asite',
    letter: 'A',
    color: 'bg-blue-500',
    description: 'Cloud platform for construction projects',
  },
  {
    name: 'Hammertech',
    letter: 'H',
    color: 'bg-emerald-500',
    description: 'Safety and compliance management',
  },
  {
    name: 'InEight',
    letter: 'I',
    color: 'bg-violet-500',
    description: 'Capital project management software',
  },
]

const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; icon: typeof ArrowDownLeft }
> = {
  Incoming: { bg: 'bg-blue-500/15', text: 'text-blue-400', icon: ArrowDownLeft },
  Outgoing: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    icon: ArrowUpRight,
  },
  Neutral: { bg: 'bg-zinc-500/15', text: 'text-zinc-400', icon: Minus },
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CorrespondencePage() {
  const { selectedContractId } = useContract()
  const [correspondence, setCorrespondence] = useState<Correspondence[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [subject, setSubject] = useState('')
  const [fromParty, setFromParty] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<string>('Incoming')
  const [clauseTagsInput, setClauseTagsInput] = useState('')

  const fetchCorrespondence = useCallback(async () => {
    if (!selectedContractId) {
      setCorrespondence([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('correspondence')
        .select('*')
        .eq('contract_id', selectedContractId)
        .order('date', { ascending: false })

      if (error) throw error
      setCorrespondence(data || [])
    } catch (err) {
      console.error('Failed to fetch correspondence:', err)
      toast.error('Failed to load correspondence')
    } finally {
      setLoading(false)
    }
  }, [selectedContractId])

  useEffect(() => {
    fetchCorrespondence()
  }, [fetchCorrespondence])

  const resetForm = () => {
    setSubject('')
    setFromParty('')
    setDate(new Date().toISOString().slice(0, 10))
    setContent('')
    setCategory('Incoming')
    setClauseTagsInput('')
    setShowForm(false)
  }

  const handleSave = async () => {
    if (!selectedContractId) return
    if (!subject.trim() || !fromParty.trim()) {
      toast.error('Subject and From are required')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const clauseTags = clauseTagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const { data: newCorr, error } = await supabase.from('correspondence').insert({
        contract_id: selectedContractId,
        subject: subject.trim(),
        from_party: fromParty.trim(),
        date,
        content: content.trim(),
        category,
        clause_tags: clauseTags,
      }).select('id').single()

      if (error) throw error

      toast.success('Correspondence added')

      // Trigger deadline scan in background
      if (newCorr?.id && content.trim().length > 20) {
        fetch('/api/deadlines/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contract_id: selectedContractId, correspondence_id: newCorr.id, trigger: 'correspondence' }),
        }).then(res => res.json()).then(data => {
          if (data.deadlines_created > 0) {
            toast.success(`${data.deadlines_created} deadline${data.deadlines_created !== 1 ? 's' : ''} added to calendar`)
          }
        }).catch(() => {})
      }

      resetForm()
      fetchCorrespondence()
    } catch (err) {
      console.error('Failed to save correspondence:', err)
      toast.error('Failed to save correspondence')
    } finally {
      setSaving(false)
    }
  }

  // ─── No contract selected ─────────────────────────────────────────────────

  if (!selectedContractId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] -m-6">
        <div className="text-center">
          <Mail className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
          <h2 className="text-lg font-medium text-foreground mb-1">
            Correspondence
          </h2>
          <p className="text-sm text-muted-foreground">
            Select a contract to view correspondence.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Correspondence</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track and manage project correspondence
        </p>
      </div>

      {/* Connected Platforms */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Connected Platforms
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.name}
              className="rounded-lg border border-border bg-card p-4 flex items-start gap-3"
            >
              <div
                className={`h-9 w-9 rounded-full ${platform.color} flex items-center justify-center text-white text-sm font-semibold shrink-0`}
              >
                {platform.letter}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {platform.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {platform.description}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedContractId) {
                    window.location.href = `/contracts/${selectedContractId}/correspondence`
                  } else {
                    toast.error('Select a contract first to set up integrations')
                  }
                }}
                className="shrink-0"
              >
                Set up
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Manual Correspondence */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Manual Correspondence
          </h2>
          {!showForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Correspondence
            </Button>
          )}
        </div>

        {/* Inline Form */}
        {showForm && (
          <div className="rounded-lg border border-border bg-card p-4 mb-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">
                Add Correspondence
              </h3>
              <button
                onClick={resetForm}
                className="text-muted-foreground hover:text-muted-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-xs text-muted-foreground">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. RE: Progress Claim #12"
                  className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="from" className="text-xs text-muted-foreground">
                  From
                </Label>
                <Input
                  id="from"
                  value={fromParty}
                  onChange={(e) => setFromParty(e.target.value)}
                  placeholder="e.g. Smith Contractors Pty Ltd"
                  className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs text-muted-foreground">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-main-panel border-border text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs text-muted-foreground">
                  Category
                </Label>
                <Select
                  value={category}
                  onValueChange={(val) => setCategory(val as string)}
                >
                  <SelectTrigger className="w-full bg-main-panel border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Incoming">Incoming</SelectItem>
                    <SelectItem value="Outgoing">Outgoing</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content" className="text-xs text-muted-foreground">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter correspondence content..."
                rows={4}
                className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="clauseTags" className="text-xs text-muted-foreground">
                Clause Tags (comma-separated)
              </Label>
              <Input
                id="clauseTags"
                value={clauseTagsInput}
                onChange={(e) => setClauseTagsInput(e.target.value)}
                placeholder="e.g. 34.1, 37.2, 41.5"
                className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button onClick={handleSave} disabled={saving} className="gap-1.5">
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Save
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Correspondence List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : correspondence.length === 0 && !showForm ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Mail className="h-10 w-10 mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground mb-4">
              No correspondence tracked yet. Add correspondence manually or
              connect a platform.
            </p>
            <Button
              variant="outline"
              onClick={() => setShowForm(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Correspondence
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {correspondence.map((item) => {
              const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.Neutral
              const Icon = style.icon
              const displayDate = new Date(item.date).toLocaleDateString(
                'en-AU',
                {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }
              )

              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-border bg-card px-4 py-3 flex items-center gap-3"
                >
                  <div
                    className={`h-8 w-8 rounded-full ${style.bg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${style.text}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.subject}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      From: {item.from_party}
                    </p>
                  </div>

                  {item.clause_tags && item.clause_tags.length > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                      {item.clause_tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-border text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.clause_tags.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{item.clause_tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text} shrink-0`}
                  >
                    {item.category}
                  </span>

                  <span className="text-xs text-muted-foreground shrink-0">
                    {displayDate}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
