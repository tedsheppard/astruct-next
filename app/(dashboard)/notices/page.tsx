'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { useContract } from '@/lib/contract-context'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  FileEdit,
  Plus,
  Copy,
  Download,
  ChevronDown,
  ChevronRight,
  Loader2,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Notice {
  id: string
  contract_id: string
  user_id: string
  obligation_id: string | null
  notice_type: string
  title: string
  content: string
  clause_references: string[]
  document_path: string | null
  created_at: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const NOTICE_TYPES = [
  'All',
  'Payment Claim',
  'Variation',
  'Delay',
  'EOT Claim',
  'Dispute',
  'Show Cause',
] as const

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  'Payment Claim': { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  Variation: { bg: 'bg-purple-500/15', text: 'text-purple-400' },
  Delay: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  'EOT Claim': { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  Dispute: { bg: 'bg-red-500/15', text: 'text-red-400' },
  'Show Cause': { bg: 'bg-red-500/15', text: 'text-red-400' },
  Other: { bg: 'bg-zinc-500/15', text: 'text-zinc-400' },
}

function getTypeColor(type: string) {
  return TYPE_COLORS[type] || TYPE_COLORS.Other
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function NoticesPage() {
  const { selectedContractId } = useContract()
  const router = useRouter()
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('All')

  const fetchNotices = useCallback(async () => {
    if (!selectedContractId) {
      setNotices([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('contract_id', selectedContractId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotices(data || [])
    } catch (err) {
      console.error('Failed to fetch notices:', err)
      toast.error('Failed to load notices')
    } finally {
      setLoading(false)
    }
  }, [selectedContractId])

  useEffect(() => {
    fetchNotices()
  }, [fetchNotices])

  const filteredNotices =
    activeTab === 'All'
      ? notices
      : notices.filter((n) => n.notice_type === activeTab)

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success('Content copied to clipboard')
    } catch {
      toast.error('Failed to copy content')
    }
  }

  const handleDownloadDocx = async (notice: Notice) => {
    try {
      const res = await fetch('/api/documents/generate-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notice_id: notice.id,
          title: notice.title,
          content: notice.content,
        }),
      })

      if (!res.ok) throw new Error('Failed to generate document')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${notice.title.replace(/[^a-zA-Z0-9]/g, '_')}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Document downloaded')
    } catch {
      toast.error('Failed to download document')
    }
  }

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  // ─── No contract selected ─────────────────────────────────────────────────

  if (!selectedContractId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] -m-6">
        <div className="text-center">
          <FileEdit className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
          <h2 className="text-lg font-medium text-foreground mb-1">Notices</h2>
          <p className="text-sm text-muted-foreground">
            Select a contract to view notices.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Notices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage contract notices
          </p>
        </div>
        <Button
          onClick={() => router.push('/composer')}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Notice
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="All"
        onValueChange={(value) => setActiveTab(value as string)}
      >
        <TabsList variant="line" className="w-full justify-start overflow-x-auto">
          {NOTICE_TYPES.map((type) => (
            <TabsTrigger key={type} value={type}>
              {type}
              {type !== 'All' && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  {notices.filter((n) => n.notice_type === type).length}
                </span>
              )}
              {type === 'All' && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  {notices.length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All tab content renders filtered notices */}
        {NOTICE_TYPES.map((type) => (
          <TabsContent key={type} value={type}>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredNotices.length === 0 ? (
              <EmptyState onCompose={() => router.push('/composer')} />
            ) : (
              <div className="space-y-3 mt-4">
                {filteredNotices.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    expanded={expandedId === notice.id}
                    onToggle={() => toggleExpanded(notice.id)}
                    onCopy={() => handleCopy(notice.content)}
                    onDownload={() => handleDownloadDocx(notice)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

// ─── Notice Card ─────────────────────────────────────────────────────────────

function NoticeCard({
  notice,
  expanded,
  onToggle,
  onCopy,
  onDownload,
}: {
  notice: Notice
  expanded: boolean
  onToggle: () => void
  onCopy: () => void
  onDownload: () => void
}) {
  const color = getTypeColor(notice.notice_type)
  const date = new Date(notice.created_at).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Collapsed header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        )}

        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color.bg} ${color.text}`}
        >
          {notice.notice_type}
        </span>

        <span className="text-sm font-medium text-foreground truncate flex-1">
          {notice.title}
        </span>

        {notice.clause_references && notice.clause_references.length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            {notice.clause_references.slice(0, 3).map((ref, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-border text-muted-foreground"
              >
                {ref}
              </span>
            ))}
            {notice.clause_references.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{notice.clause_references.length - 3}
              </span>
            )}
          </div>
        )}

        <span className="text-xs text-muted-foreground shrink-0">{date}</span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border">
          <div className="px-4 py-4">
            {/* Clause refs on mobile */}
            {notice.clause_references && notice.clause_references.length > 0 && (
              <div className="flex sm:hidden items-center gap-1.5 mb-3 flex-wrap">
                {notice.clause_references.map((ref, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-border text-muted-foreground"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            )}

            {/* Markdown content */}
            <div className="prose dark:prose-invert prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-p:leading-relaxed">
              <ReactMarkdown>{notice.content}</ReactMarkdown>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onCopy()
                }}
                className="gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDownload()
                }}
                className="gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Download DOCX
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ onCompose }: { onCompose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FileEdit className="h-10 w-10 mb-3 text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground mb-4">
        No notices generated yet. Use the Composer to draft your first notice.
      </p>
      <Button onClick={onCompose} variant="outline" className="gap-2">
        <Plus className="h-4 w-4" />
        Go to Composer
      </Button>
    </div>
  )
}
