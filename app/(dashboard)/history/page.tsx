'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  MessageSquare,
  Search,
  ChevronRight,
} from 'lucide-react'

interface ChatSession {
  id: string
  title: string | null
  contract_id: string
  created_at: string
  updated_at: string
  contracts: {
    name: string
  } | null
}

interface ContractOption {
  id: string
  name: string
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay === 1) return 'Yesterday'
  if (diffDay < 7) return `${diffDay}d ago`

  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [contracts, setContracts] = useState<ContractOption[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [contractFilter, setContractFilter] = useState('')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    async function loadData() {
      const [sessionsResult, contractsResult] = await Promise.all([
        supabase
          .from('chat_sessions')
          .select('*, contracts(name)')
          .order('updated_at', { ascending: false }),
        supabase
          .from('contracts')
          .select('id, name')
          .order('name'),
      ])

      if (sessionsResult.data) {
        setSessions(sessionsResult.data as ChatSession[])
      }
      if (contractsResult.data) {
        setContracts(contractsResult.data)
      }
      setLoading(false)
    }

    loadData()
  }, [])

  const filteredSessions = useMemo(() => {
    let result = sessions

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          (s.title && s.title.toLowerCase().includes(q)) ||
          (s.contracts?.name && s.contracts.name.toLowerCase().includes(q))
      )
    }

    if (contractFilter) {
      result = result.filter((s) => s.contract_id === contractFilter)
    }

    return result
  }, [sessions, searchQuery, contractFilter])

  if (loading) {
    return (
      <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]"><div className="max-w-5xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded-lg" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-muted rounded-lg" />
        ))}
      </div></div>
    )
  }

  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]"><div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          History
        </h1>
        <p className="text-sm mt-1 text-muted-foreground">
          Past conversations and drafts
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-card border-border"
          />
        </div>
        <select
          value={contractFilter}
          onChange={(e) => setContractFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
        >
          <option value="">All contracts</option>
          {contracts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Session List */}
      {filteredSessions.length === 0 ? (
        <Card className="bg-card border-border border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare
                className="h-8 w-8 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery || contractFilter
                ? 'No matching conversations'
                : 'No conversations yet'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {searchQuery || contractFilter
                ? 'Try adjusting your search or filter criteria.'
                : "Start chatting from the Home page or a contract's Assistant tab."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-1.5">
          {filteredSessions.map((session) => (
            <Card
              key={session.id}
              className="bg-card border-border card-hover cursor-pointer"
              onClick={() =>
                router.push(
                  `/contracts/${session.contract_id}?tab=assistant&session=${session.id}`
                )
              }
            >
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <MessageSquare
                      className="h-4 w-4 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {session.title || 'Untitled conversation'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {session.contracts?.name && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {session.contracts.name}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeDate(session.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div></div>
  )
}
