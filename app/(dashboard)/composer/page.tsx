'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { useContract } from '@/lib/contract-context'
import {
  getCategoryLabel,
  getCategoryColor,
  BADGE_COLORS,
} from '@/lib/document-categories'
import {
  Send,
  Plus,
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
  MessageSquare,
  Trash2,
  Loader2,
  X,
  Copy,
  Download,
  Save,
  FileDown,
  GripVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatMessage {
  id?: string
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

interface ChatSession {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface DocumentFile {
  id: string
  filename: string
  category: string
  file_type: string
  file_size: number
}

interface GroupedDocs {
  [category: string]: DocumentFile[]
}

interface GeneratedDocument {
  type: string
  title: string
  noticeType: string
  clauseReference: string
  content: string
  metadata: {
    addressee?: string
    from?: string
    date?: string
    reference?: string
    subject?: string
  }
}

// ─── Document Parser ─────────────────────────────────────────────────────────

function parseAIResponse(content: string): {
  chatMessage: string
  document: GeneratedDocument | null
} {
  const docMatch = content.match(/---DOCUMENT_START---([\s\S]*?)---DOCUMENT_END---/)
  if (docMatch) {
    const chatMessage = content.split('---DOCUMENT_START---')[0].trim()
    try {
      const document = JSON.parse(docMatch[1].trim())
      return { chatMessage, document }
    } catch {
      return { chatMessage: content, document: null }
    }
  }
  return { chatMessage: content, document: null }
}

// ─── Notice Type Colors ──────────────────────────────────────────────────────

const NOTICE_TYPE_COLORS: Record<string, string> = {
  'Payment Claim': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Variation': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Delay': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'EOT Claim': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Dispute': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Show Cause': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Other': 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

// ─── Thinking Shimmer ────────────────────────────────────────────────────────

function ThinkingIndicator() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-start gap-3 max-w-2xl animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative overflow-hidden rounded-lg bg-muted border border-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-muted-foreground">Thinking{dots}</span>
            </div>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Document Preview Panel ──────────────────────────────────────────────────

function DocumentPreview({
  document,
  onClose,
}: {
  document: GeneratedDocument
  onClose: () => void
}) {
  const [downloading, setDownloading] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(document.content)
    toast.success('Copied to clipboard')
  }

  const handleDownloadDocx = async () => {
    setDownloading(true)
    try {
      const res = await fetch('/api/documents/generate-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: document.content,
          metadata: document.metadata,
          title: document.title,
        }),
      })
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement('a')
      a.href = url
      a.download = `${document.title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_')}.docx`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('DOCX downloaded')
    } catch {
      toast.error('Failed to generate DOCX')
    } finally {
      setDownloading(false)
    }
  }

  const badgeColor = NOTICE_TYPE_COLORS[document.noticeType] || NOTICE_TYPE_COLORS['Other']

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-foreground truncate">{document.title}</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Metadata bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border flex-shrink-0">
        <Badge className={`text-xs border ${badgeColor}`}>{document.noticeType}</Badge>
        {document.clauseReference && (
          <span className="text-xs text-muted-foreground">{document.clauseReference}</span>
        )}
        {document.metadata?.date && (
          <span className="text-xs text-muted-foreground ml-auto">{document.metadata.date}</span>
        )}
      </div>

      {/* Document content - white paper look */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-[700px] mx-auto">
          <div className="px-12 py-10 text-[#1a1a1a] text-sm leading-relaxed font-['Georgia',_serif]">
            <div className="prose prose-sm max-w-none [&_p]:mb-3 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mb-2 [&_strong]:font-bold [&_hr]:my-4 [&_hr]:border-gray-300 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600">
              <ReactMarkdown>{document.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border flex-shrink-0">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Copy className="h-3.5 w-3.5 mr-1.5" />
          Copy
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDownloadDocx}
          disabled={downloading}
          className="text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          {downloading ? (
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          ) : (
            <FileDown className="h-3.5 w-3.5 mr-1.5" />
          )}
          Download DOCX
        </Button>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/40">
          <Save className="h-3 w-3" />
          Auto-saved to Notices
        </div>
      </div>
    </div>
  )
}

// ─── Markdown Renderer ──────────────────────────────────────────────────────

function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="prose dark:prose-invert prose-sm max-w-none [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:mb-1 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_code]:bg-border [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-foreground [&_code]:text-xs [&_pre]:bg-muted [&_pre]:border [&_pre]:border-border [&_pre]:rounded-lg [&_pre]:p-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_strong]:text-foreground [&_a]:text-blue-400 [&_a]:no-underline hover:[&_a]:underline">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}

// ─── Resizable Panel Handle ─────────────────────────────────────────────────

function ResizeHandle({
  onMouseDown,
  side,
}: {
  onMouseDown: (e: React.MouseEvent) => void
  side: 'left' | 'right'
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      className={`w-1 flex-shrink-0 cursor-col-resize group relative hover:bg-border transition-colors ${
        side === 'left' ? 'border-r border-border' : 'border-l border-border'
      }`}
    >
      <div className="absolute inset-y-0 -left-1 -right-1 z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}

// ─── File Tree ──────────────────────────────────────────────────────────────

function FileTree({
  documents,
  isLoading,
}: {
  documents: DocumentFile[]
  isLoading: boolean
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const grouped: GroupedDocs = {}
  for (const doc of documents) {
    const cat = doc.category || '13_other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(doc)
  }

  const sortedCategories = Object.keys(grouped).sort()

  useEffect(() => {
    if (sortedCategories.length > 0 && expanded.size === 0) {
      setExpanded(new Set(sortedCategories))
    }
  }, [sortedCategories.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleCategory = (cat: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 rounded bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="p-4 text-center">
        <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground">No documents uploaded</p>
        <p className="text-xs text-muted-foreground/40 mt-1">Upload documents in the Library</p>
      </div>
    )
  }

  return (
    <div className="py-2">
      {sortedCategories.map((cat) => {
        const docs = grouped[cat]
        const isExpanded = expanded.has(cat)
        const color = getCategoryColor(cat)
        const badgeClass = BADGE_COLORS[color] || BADGE_COLORS.zinc

        return (
          <div key={cat}>
            <button
              onClick={() => toggleCategory(cat)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              )}
              <Folder className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate flex-1 text-left">{getCategoryLabel(cat)}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${badgeClass}`}>{docs.length}</span>
            </button>
            {isExpanded && (
              <div className="ml-5">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-2 px-3 py-1 text-xs text-muted-foreground hover:text-muted-foreground hover:bg-muted/50 transition-colors cursor-default"
                  >
                    <FileText className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{doc.filename}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Session List ───────────────────────────────────────────────────────────

function SessionList({
  sessions,
  activeSessionId,
  onSelect,
  onNew,
  onDelete,
  isLoading,
}: {
  sessions: ChatSession[]
  activeSessionId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  isLoading: boolean
}) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 30) return `${diffDays}d ago`
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <Button
          onClick={onNew}
          variant="ghost"
          className="w-full justify-start text-sm text-muted-foreground hover:text-foreground hover:bg-muted h-9"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-3 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No chat history yet</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelect(session.id)}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                  activeSessionId === session.id
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-card hover:text-foreground'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{session.title || 'New conversation'}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{formatTime(session.updated_at)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(session.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-accent transition-all"
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Composer Page ─────────────────────────────────────────────────────

export default function ComposerPage() {
  const { selectedContractId } = useContract()

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [activeDocument, setActiveDocument] = useState<GeneratedDocument | null>(null)

  // Sessions state
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(false)

  // Documents state
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [docsLoading, setDocsLoading] = useState(false)

  // Panel widths
  const [leftWidth, setLeftWidth] = useState(240)
  const [rightWidth, setRightWidth] = useState(256)
  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<'left' | 'right' | null>(null)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Resize handlers
  const handleMouseDown = useCallback((side: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault()
    draggingRef.current = side
    startXRef.current = e.clientX
    startWidthRef.current = side === 'left' ? leftWidth : rightWidth

    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return
      const delta = e.clientX - startXRef.current
      if (draggingRef.current === 'left') {
        setLeftWidth(Math.max(180, Math.min(400, startWidthRef.current + delta)))
      } else {
        setRightWidth(Math.max(180, Math.min(400, startWidthRef.current - delta)))
      }
    }

    const handleMouseUp = () => {
      draggingRef.current = null
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [leftWidth, rightWidth])

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Fetch documents when contract changes
  useEffect(() => {
    if (!selectedContractId) return
    async function fetchDocs() {
      setDocsLoading(true)
      try {
        const res = await fetch(`/api/documents?contract_id=${selectedContractId}`)
        const data = await res.json()
        setDocuments(data.documents || [])
      } catch (err) {
        console.error('Failed to fetch documents:', err)
      } finally {
        setDocsLoading(false)
      }
    }
    fetchDocs()
  }, [selectedContractId])

  // Fetch sessions when contract changes
  const fetchSessions = useCallback(async () => {
    if (!selectedContractId) return
    setSessionsLoading(true)
    try {
      const res = await fetch(`/api/chat/sessions?contract_id=${selectedContractId}`)
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
    } finally {
      setSessionsLoading(false)
    }
  }, [selectedContractId])

  useEffect(() => {
    setMessages([])
    setSessionId(null)
    setInput('')
    setActiveDocument(null)
    fetchSessions()
  }, [fetchSessions])

  // Load a session's messages
  const loadSession = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/chat/sessions/${id}`)
      const data = await res.json()
      setMessages(data.messages || [])
      setSessionId(id)
      setActiveDocument(null)

      // Check last assistant message for document
      const lastAssistant = (data.messages || []).filter((m: ChatMessage) => m.role === 'assistant').pop()
      if (lastAssistant) {
        const { document } = parseAIResponse(lastAssistant.content)
        if (document) setActiveDocument(document)
      }
    } catch (err) {
      console.error('Failed to load session:', err)
    }
  }, [])

  const startNewChat = useCallback(() => {
    setMessages([])
    setSessionId(null)
    setInput('')
    setActiveDocument(null)
    inputRef.current?.focus()
  }, [])

  const deleteSession = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/chat/sessions/${id}`, { method: 'DELETE' })
        setSessions((prev) => prev.filter((s) => s.id !== id))
        if (sessionId === id) startNewChat()
      } catch (err) {
        console.error('Failed to delete session:', err)
      }
    },
    [sessionId, startNewChat]
  )

  // Send a message
  const sendMessage = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || !selectedContractId || isStreaming) return

    const userMsg: ChatMessage = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)
    setActiveDocument(null)

    const assistantMsg: ChatMessage = { role: 'assistant', content: '' }
    setMessages((prev) => [...prev, assistantMsg])

    try {
      abortControllerRef.current = new AbortController()

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          contract_id: selectedContractId,
          session_id: sessionId,
          selected_document_ids: [],
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to send message')
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const jsonStr = line.slice(6)
          try {
            const data = JSON.parse(jsonStr)

            if (data.thinking) {
              // Silently consume
            }
            if (data.content) {
              fullContent += data.content
              setMessages((prev) => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last && last.role === 'assistant') {
                  updated[updated.length - 1] = { ...last, content: last.content + data.content }
                }
                return updated
              })
            }

            if (data.done && data.session_id) {
              setSessionId(data.session_id)
              fetchSessions()

              // Check for generated document
              const { document } = parseAIResponse(fullContent)
              if (document) {
                setActiveDocument(document)
              }
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      console.error('Chat error:', err)
      setMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last && last.role === 'assistant' && !last.content) {
          updated[updated.length - 1] = { ...last, content: 'Sorry, something went wrong. Please try again.' }
        }
        return updated
      })
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }, [input, selectedContractId, sessionId, isStreaming, fetchSessions])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }

  // Render message content - strip document delimiters for display
  const renderMessageContent = (content: string) => {
    const { chatMessage, document } = parseAIResponse(content)
    return (
      <>
        {chatMessage && <MarkdownMessage content={chatMessage} />}
        {document && (
          <button
            onClick={() => setActiveDocument(document)}
            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border hover:border-border transition-colors group"
          >
            <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            <span className="text-sm text-muted-foreground group-hover:text-foreground">{document.title}</span>
            <Badge className={`text-[10px] ml-2 border ${NOTICE_TYPE_COLORS[document.noticeType] || NOTICE_TYPE_COLORS['Other']}`}>
              {document.noticeType}
            </Badge>
            <ChevronRight className="h-3 w-3 text-muted-foreground ml-auto" />
          </button>
        )}
      </>
    )
  }

  // No contract selected
  if (!selectedContractId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
          <h2 className="text-lg font-medium text-foreground mb-1">Select a contract</h2>
          <p className="text-sm text-muted-foreground">Choose a contract from the sidebar to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex h-[calc(100vh-3.5rem)] -m-6 overflow-hidden">
      {/* Left Panel: File Browser */}
      <div style={{ width: leftWidth }} className="flex-shrink-0 bg-sidebar flex flex-col">
        <div className="h-12 flex items-center px-4 border-b border-border">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Documents</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          <FileTree documents={documents} isLoading={docsLoading} />
        </div>
      </div>

      <ResizeHandle side="left" onMouseDown={(e) => handleMouseDown('left', e)} />

      {/* Center Panel: Chat */}
      <div className="flex-1 flex flex-col min-w-0 bg-main-panel">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md px-6">
                <div className="w-12 h-12 rounded-2xl accent-gradient mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-lg font-medium text-foreground mb-2">Contract Composer</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ask questions about your contract, draft notices, review clauses, or get advice on contractual obligations.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  {[
                    'What are the delay notice requirements?',
                    'Draft a variation notice',
                    'What are the payment claim deadlines?',
                    'Draft an EOT claim',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion)
                        inputRef.current?.focus()
                      }}
                      className="text-left text-xs px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                  style={{ animationDelay: `${Math.min(i * 30, 150)}ms` }}
                >
                  {msg.role === 'user' ? (
                    <div className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-3 bg-muted text-foreground text-sm leading-relaxed">
                      {msg.content}
                    </div>
                  ) : msg.content ? (
                    <div className="max-w-[85%] text-foreground text-sm leading-relaxed">
                      {renderMessageContent(msg.content)}
                    </div>
                  ) : isStreaming ? (
                    <ThinkingIndicator />
                  ) : null}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t border-border p-4 bg-main-panel">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 bg-card border border-border rounded-xl px-4 py-3 focus-within:border-ring transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your contract, or draft a notice..."
                rows={1}
                disabled={isStreaming}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none max-h-[200px] leading-relaxed"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
                className="flex-shrink-0 p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground/40 mt-2 text-center">
              AI responses are based on your uploaded documents. Always verify critical advice.
            </p>
          </div>
        </div>
      </div>

      <ResizeHandle side="right" onMouseDown={(e) => handleMouseDown('right', e)} />

      {/* Right Panel: Session History or Document Preview */}
      <div style={{ width: activeDocument ? Math.max(rightWidth, 420) : rightWidth }} className="flex-shrink-0 bg-sidebar flex flex-col transition-[width] duration-200">
        {activeDocument ? (
          <DocumentPreview document={activeDocument} onClose={() => setActiveDocument(null)} />
        ) : (
          <>
            <div className="h-12 flex items-center px-4 border-b border-border">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Chat History</h3>
            </div>
            <div className="flex-1 overflow-hidden">
              <SessionList
                sessions={sessions}
                activeSessionId={sessionId}
                onSelect={loadSession}
                onNew={startNewChat}
                onDelete={deleteSession}
                isLoading={sessionsLoading}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
