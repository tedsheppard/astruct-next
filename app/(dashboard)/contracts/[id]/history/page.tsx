'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare, Trash2, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react'

interface ChatSession {
  id: string
  title: string
  created_at: string
  updated_at: string
  messages?: { content: string }[]
}

const PAGE_SIZE = 20

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function HistoryPage() {
  const params = useParams()
  const contractId = params.id as string
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    // Fetch sessions with their message contents for search
    supabase
      .from('chat_sessions')
      .select('id, title, created_at, updated_at, chat_messages(content)')
      .eq('contract_id', contractId)
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        const mapped = (data || []).map(s => ({
          ...s,
          messages: (s.chat_messages as { content: string }[]) || [],
        }))
        setSessions(mapped)
        setLoading(false)
      })
  }, [contractId])

  // Filter by search query (searches titles and message contents)
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return sessions
    const q = searchQuery.toLowerCase()
    return sessions.filter(s => {
      if (s.title?.toLowerCase().includes(q)) return true
      return s.messages?.some(m => m.content.toLowerCase().includes(q))
    })
  }, [sessions, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  // Reset page when search changes
  useEffect(() => { setPage(0) }, [searchQuery])

  const deleteSession = async (id: string) => {
    const supabase = createClient()
    await supabase.from('chat_sessions').delete().eq('id', id)
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const resumeSession = (sessionId: string) => {
    router.push(`/contracts/${contractId}/assistant?session=${sessionId}`)
  }

  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-1">Chat History</h1>
            <p className="text-sm text-muted-foreground">Past conversations for this contract. Click to resume.</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring transition-colors"
          />
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground mb-1">
              {searchQuery ? 'No conversations match your search' : 'No conversations yet'}
            </p>
            <p className="text-xs text-muted-foreground/60">
              {searchQuery ? 'Try a different search term.' : 'Start a conversation in the Assistant.'}
            </p>
          </div>
        ) : (
          <>
            <div className="border border-border rounded-xl overflow-hidden">
              {paginated.map((session, i) => (
                <div
                  key={session.id}
                  onClick={() => resumeSession(session.id)}
                  className={`group flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-muted/30 transition-colors ${i < paginated.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{session.title || 'Untitled conversation'}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Clock className="h-3 w-3" />
                    {formatTime(session.updated_at)}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteSession(session.id) }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-muted-foreground">
                  {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-1.5 rounded-md border border-border hover:bg-accent text-muted-foreground disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs text-muted-foreground px-2">{page + 1} / {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="p-1.5 rounded-md border border-border hover:bg-accent text-muted-foreground disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
