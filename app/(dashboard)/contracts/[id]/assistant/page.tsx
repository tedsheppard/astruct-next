'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Send,
  FileText,
  Loader2,
  X,
  ChevronRight,
  Sparkles,
  FolderOpen,
  Globe,
  BookOpen,
  Paperclip,
  Wand2,
  Clock,
  ListChecks,
  DollarSign,
  PenTool,
  AlertTriangle,
  FileSearch,
  ArrowUpRight,
  Pen,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  ChevronDown,
  Check,
  Minus,
  Mail,
  Ruler,
  CalendarRange,
  Copy,
  FileDown,
  Save,
  SquarePen,
  Link2,
  ChevronUp,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface SourceItem {
  type: 'document' | 'web'
  document_id: string
  document_name: string
  section_heading: string | null
  excerpt: string
  chunk_index: number
  similarity_score: number
  clause_references: string[]
}

interface ChatMessage {
  id?: string
  role: 'user' | 'assistant'
  content: string
  feedback?: 'positive' | 'negative' | null
  sources?: SourceItem[] | null
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

// ─── Constants ──────────────────────────────────────────────────────────────

const NOTICE_TYPE_COLORS: Record<string, string> = {
  'Payment Claim': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Variation': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Delay': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'EOT Claim': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Dispute': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Show Cause': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Other': 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseAIResponse(content: string): { chatMessage: string; document: GeneratedDocument | null } {
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

// ─── Markdown Renderer ──────────────────────────────────────────────────────

function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="prose dark:prose-invert prose-sm max-w-none [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:mb-1 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_code]:bg-border [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-foreground [&_code]:text-xs [&_pre]:bg-muted [&_pre]:border [&_pre]:border-border [&_pre]:rounded-lg [&_pre]:p-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_strong]:text-foreground [&_a]:text-blue-400 [&_a]:no-underline hover:[&_a]:underline">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}

// ─── Thinking Shimmer ────────────────────────────────────────────────────────

interface ThinkingDocument {
  filename: string
}

function ShimmerText({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-sm"
      style={{
        background: 'linear-gradient(90deg, #9ca3af 0%, #d1d5db 35%, #e5e7eb 50%, #d1d5db 65%, #9ca3af 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'shimmer-sweep 2s ease-in-out infinite',
      }}
    >
      {children}
    </span>
  )
}

const THINKING_PHRASES = [
  'Checking clause references...',
  'Cross-referencing special conditions...',
  'Analysing time bar requirements...',
  'Reviewing payment provisions...',
  'Identifying relevant obligations...',
  'Verifying contractual entitlements...',
  'Examining variation provisions...',
  'Assessing delay notification rules...',
  'Reviewing dispute resolution steps...',
  'Checking extension of time criteria...',
]

function ThinkingIndicator() {
  const [step, setStep] = useState(0)
  const [thinkingIdx, setThinkingIdx] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1500),
      setTimeout(() => setStep(2), 3000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (step < 2) return
    const startIdx = Math.floor(Math.random() * THINKING_PHRASES.length)
    setThinkingIdx(startIdx)
    const interval = setInterval(() => {
      setThinkingIdx(prev => (prev + 1) % THINKING_PHRASES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [step])

  const steps = [
    'Searching documents...',
    'Reading relevant sections...',
  ]

  return (
    <div className="animate-slide-up space-y-1.5">
      {steps.map((label, i) => {
        if (i > step) return null
        const done = i < step
        return (
          <div key={i} className="flex items-center gap-2">
            {done && <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />}
            {done ? (
              <span className="text-sm text-muted-foreground">{label}</span>
            ) : (
              <ShimmerText>{label}</ShimmerText>
            )}
          </div>
        )
      })}
      {step >= 2 && (
        <div className="flex items-center gap-2">
          <ShimmerText>{THINKING_PHRASES[thinkingIdx]}</ShimmerText>
        </div>
      )}
    </div>
  )
}

// ─── Document Generating Indicator ─────────────────────────────────────────

function DocGeneratingIndicator() {
  return (
    <div className="mt-3 rounded-lg border border-border bg-card overflow-hidden">
      <div className="h-0.5 bg-muted overflow-hidden">
        <div className="h-full bg-foreground/20 animate-[shimmer-bar_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <FileText className="h-4 w-4 text-foreground/60" />
        <span
          className="text-sm"
          style={{
            background: 'linear-gradient(90deg, #9ca3af 0%, #d1d5db 35%, #e5e7eb 50%, #d1d5db 65%, #9ca3af 100%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer-sweep 2s ease-in-out infinite',
          }}
        >
          Writing document...
        </span>
      </div>
    </div>
  )
}

// ─── Document Reading View ─────────────────────────────────────────────────

function DocPagePreview({ content }: { content: string }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f3f0]">
      <div className="max-w-[700px] mx-auto my-6 bg-white rounded-sm shadow-[0_1px_6px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.08)]">
        <div className="px-8 py-10 doc-preview">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

// ─── Document Preview Panel ─────────────────────────────────────────────────

function DocumentPreview({ document, onClose }: { document: GeneratedDocument; onClose: () => void }) {
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
        body: JSON.stringify({ content: document.content, metadata: document.metadata, title: document.title }),
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
    <div className="flex flex-col h-full border-l border-border bg-sidebar">
      <div className="h-12 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-foreground truncate">{document.title}</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border flex-shrink-0">
        <Badge className={`text-xs border ${badgeColor}`}>{document.noticeType}</Badge>
        {document.clauseReference && <span className="text-xs text-muted-foreground">{document.clauseReference}</span>}
        {document.metadata?.date && <span className="text-xs text-muted-foreground ml-auto">{document.metadata.date}</span>}
      </div>
      <DocPagePreview content={document.content} />
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border flex-shrink-0">
        <Button size="sm" variant="ghost" onClick={handleCopy} className="text-muted-foreground hover:text-foreground hover:bg-muted">
          <Copy className="h-3.5 w-3.5 mr-1.5" />Copy
        </Button>
        <Button size="sm" variant="ghost" onClick={handleDownloadDocx} disabled={downloading} className="text-muted-foreground hover:text-foreground hover:bg-muted">
          {downloading ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5 mr-1.5" />}
          Download DOCX
        </Button>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/40">
          <Save className="h-3 w-3" />Auto-saved to Notices
        </div>
      </div>
    </div>
  )
}

// ─── Assistant Page ─────────────────────────────────────────────────────────

export default function AssistantPage() {
  const params = useParams()
  const contractId = params.id as string
  const searchParams = useSearchParams()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [activeDocument, setActiveDocument] = useState<GeneratedDocument | null>(null)
  const [contractDocuments, setContractDocuments] = useState<ThinkingDocument[]>([])

  // Full document list with categories for source selection
  const [allDocs, setAllDocs] = useState<{ id: string; filename: string; category: string }[]>([])
  // Selected document IDs
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set())
  // Expanded categories in dropdowns
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set())
  // Simple toggles
  const [srcWeb, setSrcWeb] = useState(false)
  const [webLegal, setWebLegal] = useState(false)
  const [webConstruction, setWebConstruction] = useState(false)
  const [webAll, setWebAll] = useState(false)
  const [activePromptTab, setActivePromptTab] = useState(0)
  const [selectedModel, setSelectedModel] = useState('claude-sonnet-4-6')
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false)
  const [modelPopoverOpen2, setModelPopoverOpen2] = useState(false)
  const [expandedSources, setExpandedSources] = useState<number | null>(null)
  const [loadingSession, setLoadingSession] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [pendingDraftMessage, setPendingDraftMessage] = useState<string | null>(null)
  const [savedTemplates, setSavedTemplates] = useState<{ id: string; name: string; description: string }[]>([])

  // Load templates from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('astruct_templates_v2')
      if (raw) {
        const templates = JSON.parse(raw)
        setSavedTemplates(templates.slice(0, 5).map((t: { id: string; name: string; description: string }) => ({
          id: t.id, name: t.name, description: t.description
        })))
      }
    } catch {}
  }, [])
  const [srcKnowledgeCats, setSrcKnowledgeCats] = useState<Set<string>>(new Set())
  const [srcCorrespondence, setSrcCorrespondence] = useState(false)
  const [corrDateFrom, setCorrDateFrom] = useState('')
  const [corrDateTo, setCorrDateTo] = useState('')

  // Document pane resize
  const [docPaneWidth, setDocPaneWidth] = useState(520)
  const resizingRef = useRef(false)
  const resizeStartXRef = useRef(0)
  const resizeStartWRef = useRef(0)

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    resizingRef.current = true
    resizeStartXRef.current = e.clientX
    resizeStartWRef.current = docPaneWidth
    const onMove = (e: MouseEvent) => {
      if (!resizingRef.current) return
      const delta = resizeStartXRef.current - e.clientX
      setDocPaneWidth(Math.max(360, Math.min(900, resizeStartWRef.current + delta)))
    }
    const onUp = () => {
      resizingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [docPaneWidth])

  const uploadInputRef = useRef<HTMLInputElement>(null)
  const chatUploadRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [chatUploading, setChatUploading] = useState(false)
  const [pendingUploads, setPendingUploads] = useState<{ id: string; filename: string }[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const promptHandledRef = useRef(false)

  // Fetch contract documents for thinking indicator + source selection
  useEffect(() => {
    if (!contractId) return
    fetch(`/api/documents?contract_id=${contractId}`)
      .then(res => res.json())
      .then(data => {
        const docs = (data.documents || []) as { id: string; filename: string; category: string }[]
        setContractDocuments(docs.map(d => ({ filename: d.filename })))
        setAllDocs(docs)
        // Auto-select all documents
        setSelectedDocIds(new Set(docs.map(d => d.id)))
      })
      .catch(() => {/* ignore */})
  }, [contractId])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  // Handle ?prompt= query parameter (from workflows)
  useEffect(() => {
    const prompt = searchParams.get('prompt')
    if (prompt && !promptHandledRef.current) {
      promptHandledRef.current = true
      setInput(prompt)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [searchParams])

  // Handle ?session= query parameter (resume from history)
  useEffect(() => {
    const sid = searchParams.get('session')
    if (!sid) return
    setLoadingSession(true)
    fetch(`/api/chat/sessions/${sid}`)
      .then(res => {
        if (!res.ok) throw new Error('Session fetch failed')
        return res.json()
      })
      .then(data => {
        const msgs = data.messages || []
        setMessages(msgs)
        setSessionId(sid)
        setActiveDocument(null)
        // Check if last message has a document
        const lastAssistant = msgs.filter((m: ChatMessage) => m.role === 'assistant').pop()
        if (lastAssistant) {
          const { document } = parseAIResponse(lastAssistant.content)
          if (document) setActiveDocument(document)
        }
      })
      .catch((err) => { console.error('Failed to load session:', err) })
      .finally(() => setLoadingSession(false))
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  const isDraftingRequest = useCallback((text: string) => {
    return /\b(draft|write|create|prepare|generate)\b.*\b(letter|notice|correspondence|memo|memorandum|response|reply)\b/i.test(text)
  }, [])

  const sendMessageWithTemplate = useCallback(async (messageText: string, templateName?: string) => {
    const trimmed = messageText.trim()
    if (!trimmed || isStreaming) return

    // Append template instruction if selected
    const finalMessage = templateName
      ? `${trimmed}\n\n[Use template format: "${templateName}"]`
      : trimmed

    const userMsg: ChatMessage = { role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)

    const assistantMsg: ChatMessage = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMsg])

    try {
      abortControllerRef.current = new AbortController()
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: finalMessage, contract_id: contractId, session_id: sessionId, model: selectedModel, selected_document_ids: Array.from(selectedDocIds) }),
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
            if (data.thinking || data.thinking_sources) {
              // ThinkingIndicator handles display while isStreaming
            }
            if (data.sources) {
              // Attach sources to the last assistant message
              setMessages(prev => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last && last.role === 'assistant') {
                  updated[updated.length - 1] = { ...last, sources: data.sources }
                }
                return updated
              })
            }
            if (data.content) {
              fullContent += data.content
              setMessages(prev => {
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
              const { document } = parseAIResponse(fullContent)
              if (document) setActiveDocument(document)
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      // Detect truncated document (START marker present but no END marker)
      if (fullContent.includes('---DOCUMENT_START---') && !fullContent.includes('---DOCUMENT_END---')) {
        const chatPart = fullContent.split('---DOCUMENT_START---')[0].trim()
        setMessages(prev => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last && last.role === 'assistant') {
            updated[updated.length - 1] = {
              ...last,
              content: (chatPart ? chatPart + '\n\n' : '') +
                '⚠️ The document was too large to generate in one response. Please try again with a more specific request, or ask me to generate it in sections.',
            }
          }
          return updated
        })
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      console.error('Chat error:', err)
      setMessages(prev => {
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
  }, [contractId, sessionId, isStreaming]) // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isStreaming) return

    // For drafting requests, auto-use the first saved template (Standard Letterhead)
    if (isDraftingRequest(trimmed)) {
      const defaultTemplate = savedTemplates.length > 0 ? savedTemplates[0].name : undefined
      sendMessageWithTemplate(trimmed, defaultTemplate)
      return
    }

    sendMessageWithTemplate(trimmed)
  }, [input, isStreaming, isDraftingRequest, sendMessageWithTemplate])

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

  const handleChatUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setChatUploading(true)
    const formData = new FormData()
    formData.append('contract_id', contractId)
    for (const file of Array.from(files)) formData.append('files', file)
    try {
      const res = await fetch('/api/documents/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        const newDocs = (data.documents || []) as { id: string; filename: string; category: string }[]
        setAllDocs(prev => [...prev, ...newDocs])
        setContractDocuments(prev => [...prev, ...newDocs.map(d => ({ filename: d.filename }))])
        setSelectedDocIds(prev => {
          const next = new Set(prev)
          newDocs.forEach(d => next.add(d.id))
          return next
        })
        setPendingUploads(prev => [...prev, ...newDocs.map(d => ({ id: d.id, filename: d.filename }))])
        toast.success(`${newDocs.length} file${newDocs.length !== 1 ? 's' : ''} uploaded & added as context`)
      } else {
        toast.error('Upload failed')
      }
    } catch { toast.error('Upload failed') }
    finally { setChatUploading(false); e.target.value = '' }
  }

  const startNewChat = useCallback(() => {
    if (isStreaming) return
    setMessages([])
    setSessionId(null)
    setActiveDocument(null)
    setInput('')
    setPendingUploads([])
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [isStreaming])

  // Keyboard shortcut: Cmd+Shift+O for new chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'o') {
        e.preventDefault()
        startNewChat()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [startNewChat])

  const renderMessageContent = (content: string) => {
    // Check if document is still being generated (START found but no END yet)
    const hasStart = content.includes('---DOCUMENT_START---')
    const hasEnd = content.includes('---DOCUMENT_END---')

    if (hasStart && !hasEnd) {
      // Document is being generated — show the chat part before it + a generating indicator
      const chatPart = content.split('---DOCUMENT_START---')[0].trim()
      return (
        <>
          {chatPart && <MarkdownMessage content={chatPart} />}
          <DocGeneratingIndicator />
        </>
      )
    }

    const { chatMessage, document } = parseAIResponse(content)
    return (
      <>
        {chatMessage && <MarkdownMessage content={chatMessage} />}
        {document && (
          <button
            onClick={() => setActiveDocument(document)}
            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border hover:border-ring transition-colors group"
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

  return (
    <>
    {/* Template selector modal */}
    {showTemplateSelector && pendingDraftMessage && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowTemplateSelector(false); setPendingDraftMessage(null) }}>
        <div className="bg-card border border-border rounded-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
          <h3 className="text-base font-semibold text-foreground mb-1">Choose a template</h3>
          <p className="text-xs text-muted-foreground mb-4">Select a letterhead template for this document</p>
          <div className="space-y-2">
            {savedTemplates.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setShowTemplateSelector(false)
                  sendMessageWithTemplate(pendingDraftMessage, t.name)
                  setPendingDraftMessage(null)
                }}
                className="w-full text-left px-4 py-3 rounded-lg border border-border hover:border-foreground/20 hover:bg-muted/50 transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
              </button>
            ))}
            <button
              onClick={() => {
                setShowTemplateSelector(false)
                sendMessageWithTemplate(pendingDraftMessage)
                setPendingDraftMessage(null)
              }}
              className="w-full text-left px-4 py-3 rounded-lg border border-dashed border-border hover:border-foreground/20 hover:bg-muted/50 transition-colors"
            >
              <p className="text-sm font-medium text-foreground">Blank</p>
              <p className="text-xs text-muted-foreground mt-0.5">No template - use default formatting</p>
            </button>
          </div>
          <button onClick={() => { setShowTemplateSelector(false); setPendingDraftMessage(null) }} className="w-full mt-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
        </div>
      </div>
    )}
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {loadingSession ? (
          /* ─── Loading session skeleton ─── */
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${i % 2 === 0 ? 'max-w-[65%]' : 'max-w-[80%]'} space-y-2`}>
                    <div className={`h-4 rounded bg-muted animate-pulse ${i % 2 === 0 ? 'w-48 ml-auto' : 'w-64'}`} />
                    {i % 2 !== 0 && <>
                      <div className="h-4 rounded bg-muted animate-pulse w-80" />
                      <div className="h-4 rounded bg-muted animate-pulse w-56" />
                    </>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          /* ─── Empty: Harvey-style layout ─── */
          <div className="flex-1 flex flex-col">
            {/* Center section */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <div className="w-full max-w-[680px]">
                <h1 className="text-4xl font-light text-center text-foreground mb-10 tracking-tight">Astruct</h1>

                {/* Input card */}
                <input ref={chatUploadRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.csv,.xlsx" className="hidden" onChange={handleChatUpload} />
                <div className="bg-muted/40 border border-border rounded-2xl overflow-hidden">
                  <div className="px-5 pt-4 pb-2">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask Astruct anything..."
                      rows={3}
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 resize-none outline-none leading-relaxed"
                    />
                    {/* Pending uploads pills */}
                    {pendingUploads.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {pendingUploads.map(f => (
                          <span key={f.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-background border border-border text-[11px] text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            {f.filename.length > 25 ? f.filename.slice(0, 22) + '...' : f.filename}
                            <button onClick={() => setPendingUploads(prev => prev.filter(p => p.id !== f.id))} className="ml-0.5 hover:text-foreground">
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Bottom bar inside card */}
                  <div className="flex items-center justify-between px-4 pb-3">
                    <div className="flex items-center gap-1">
                      <Popover>
                        <PopoverTrigger className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                          <Paperclip className="h-3.5 w-3.5" />Files and sources
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-80 p-0 max-h-[400px] overflow-y-auto">
                          <div className="p-3 border-b border-border">
                            <p className="text-xs font-medium text-foreground">Sources</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{selectedDocIds.size} of {allDocs.length} documents selected</p>
                          </div>
                          <div className="p-2">
                            {/* Group docs by category */}
                            {(() => {
                              const catMap: Record<string, typeof allDocs> = {}
                              const catLabels: Record<string, string> = {
                                '01_contract': '01. Contract', '02_tender': '02. Tender', '03_drawings': '03. Drawings',
                                '04_specifications': '04. Specifications', '05_project_letters': '05. Project Letters',
                                '06_rfi': '06. RFIs', '07_variations': '07. Variations', '08_nod': '08. Notices of Delay',
                                '09_eot': '09. EOT Claims', '10_payment_claims': '10. Payment Claims',
                                '11_payment_schedules': '11. Payment Schedules', '12_third_party_invoices': '12. Third-Party Invoices',
                                '13_other': '13. Other / Misc.',
                              }
                              for (const doc of allDocs) {
                                const cat = doc.category || '13_other'
                                if (!catMap[cat]) catMap[cat] = []
                                catMap[cat].push(doc)
                              }
                              const sortedCats = Object.keys(catMap).sort()
                              return sortedCats.map(cat => {
                                const docs = catMap[cat]
                                const allSelected = docs.every(d => selectedDocIds.has(d.id))
                                const someSelected = docs.some(d => selectedDocIds.has(d.id))
                                const isExpanded = expandedCats.has(cat)
                                const toggleCat = () => {
                                  setSelectedDocIds(prev => {
                                    const next = new Set(prev)
                                    if (allSelected) { docs.forEach(d => next.delete(d.id)) }
                                    else { docs.forEach(d => next.add(d.id)) }
                                    return next
                                  })
                                }
                                const toggleExpand = () => {
                                  setExpandedCats(prev => {
                                    const next = new Set(prev)
                                    if (next.has(cat)) next.delete(cat); else next.add(cat)
                                    return next
                                  })
                                }
                                const toggleDoc = (docId: string) => {
                                  setSelectedDocIds(prev => {
                                    const next = new Set(prev)
                                    if (next.has(docId)) next.delete(docId); else next.add(docId)
                                    return next
                                  })
                                }
                                return (
                                  <div key={cat}>
                                    <div className="flex items-center gap-1">
                                      <button onClick={toggleExpand} className="p-1 rounded hover:bg-accent">
                                        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                                      </button>
                                      <button onClick={toggleCat} className="flex-1 flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-accent text-left">
                                        <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center flex-shrink-0 ${allSelected ? 'bg-foreground border-foreground' : someSelected ? 'bg-foreground/50 border-foreground/50' : 'border-border'}`}>
                                          {allSelected && <Check className="w-2.5 h-2.5 text-background" />}
                                          {someSelected && !allSelected && <Minus className="w-2.5 h-2.5 text-background" />}
                                        </div>
                                        <FolderOpen className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                        <span className="text-sm text-foreground">{catLabels[cat] || cat}</span>
                                        <span className="text-xs text-muted-foreground ml-auto">({docs.length})</span>
                                      </button>
                                    </div>
                                    {isExpanded && (
                                      <div className="ml-6 mb-1">
                                        {docs.map(doc => (
                                          <button key={doc.id} onClick={() => toggleDoc(doc.id)}
                                            className="w-full flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-accent text-left">
                                            <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center flex-shrink-0 ${selectedDocIds.has(doc.id) ? 'bg-foreground border-foreground' : 'border-border'}`}>
                                              {selectedDocIds.has(doc.id) && <Check className="w-2.5 h-2.5 text-background" />}
                                            </div>
                                            <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                            <span className="text-xs text-foreground truncate">{doc.filename}</span>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )
                              })
                            })()}
                          </div>
                          <div className="p-2 border-t border-border flex items-center justify-between">
                            <button onClick={() => setSelectedDocIds(new Set(allDocs.map(d => d.id)))} className="text-xs text-muted-foreground hover:text-foreground">Select all</button>
                            <button onClick={() => setSelectedDocIds(new Set())} className="text-xs text-muted-foreground hover:text-foreground">Clear all</button>
                          </div>
                          {/* Upload section */}
                          <div className="p-2.5 border-t border-border">
                            <input
                              ref={uploadInputRef}
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
                              className="hidden"
                              onChange={async (e) => {
                                const files = e.target.files
                                if (!files || files.length === 0) return
                                setUploading(true)
                                const formData = new FormData()
                                formData.append('contract_id', contractId)
                                for (const file of Array.from(files)) formData.append('files', file)
                                try {
                                  const res = await fetch('/api/documents/upload', { method: 'POST', body: formData })
                                  if (res.ok) {
                                    const data = await res.json()
                                    const newDocs = (data.documents || []) as { id: string; filename: string; category: string }[]
                                    setAllDocs(prev => [...prev, ...newDocs])
                                    setContractDocuments(prev => [...prev, ...newDocs.map(d => ({ filename: d.filename }))])
                                    setSelectedDocIds(prev => {
                                      const next = new Set(prev)
                                      newDocs.forEach(d => next.add(d.id))
                                      return next
                                    })
                                    toast.success(`${newDocs.length} file${newDocs.length !== 1 ? 's' : ''} uploaded`)
                                  } else {
                                    toast.error('Upload failed')
                                  }
                                } catch { toast.error('Upload failed') }
                                finally { setUploading(false); e.target.value = '' }
                              }}
                            />
                            <button
                              onClick={() => uploadInputRef.current?.click()}
                              disabled={uploading}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors disabled:opacity-50"
                            >
                              {uploading ? (
                                <><Loader2 className="h-3 w-3 animate-spin" />Uploading...</>
                              ) : (
                                <><Paperclip className="h-3 w-3" />Upload new files</>
                              )}
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <button
                        onClick={() => chatUploadRef.current?.click()}
                        disabled={chatUploading}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
                        title="Upload documents"
                      >
                        {chatUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                        Upload
                      </button>
                      <span className="text-border">|</span>
                      <button
                        onClick={async () => {
                          if (!input.trim()) { toast.error('Type a prompt first'); return }
                          const original = input
                          setInput('Improving...')
                          try {
                            const res = await fetch('/api/chat', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                message: `SYSTEM INSTRUCTION: Do not answer this question. Instead, rewrite the following user prompt to be more specific, detailed, and effective for a construction contract AI assistant. Return ONLY the improved prompt text, nothing else. No explanation, no preamble.\n\nOriginal prompt: "${original}"`,
                                contract_id: contractId,
                              }),
                            })
                            if (!res.ok) throw new Error()
                            const reader = res.body?.getReader()
                            if (!reader) throw new Error()
                            const decoder = new TextDecoder()
                            let improved = '', buffer = ''
                            while (true) {
                              const { done, value } = await reader.read()
                              if (done) break
                              buffer += decoder.decode(value, { stream: true })
                              const lines = buffer.split('\n'); buffer = lines.pop() || ''
                              for (const line of lines) {
                                if (!line.startsWith('data: ')) continue
                                try { const d = JSON.parse(line.slice(6)); if (d.content) improved += d.content } catch {}
                              }
                            }
                            setInput(improved.trim() || original)
                            inputRef.current?.focus()
                          } catch {
                            setInput(original)
                            toast.error('Failed to improve prompt')
                          }
                        }}
                        disabled={!input.trim() || isStreaming}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30"
                      >
                        <Wand2 className="h-3.5 w-3.5" />Improve
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {/* Model selector */}
                      <Popover open={modelPopoverOpen} onOpenChange={setModelPopoverOpen}>
                        <PopoverTrigger className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-muted-foreground hover:text-foreground border border-border hover:border-foreground/15 transition-colors">
                          {({ 'gpt-5-nano': '1x', 'gpt-5.4-nano': '4x', 'gpt-5-mini': '5x', 'gpt-5.4-mini': '15x', 'claude-haiku-4-5-20251001': '20x', 'gpt-5.4': '50x', 'claude-sonnet-4-6': '60x', 'claude-opus-4-6': '100x' } as Record<string, string>)[selectedModel] || selectedModel}
                          <ChevronDown className="h-2.5 w-2.5" />
                        </PopoverTrigger>
                        <PopoverContent side="top" align="end" className="w-56 p-1">
                          {[
                            { id: 'gpt-5-nano', label: 'GPT-5 Nano', rate: '1x' },
                            { id: 'gpt-5.4-nano', label: 'GPT-5.4 Nano', rate: '4x' },
                            { id: 'gpt-5-mini', label: 'GPT-5 Mini', rate: '5x' },
                            { id: 'gpt-5.4-mini', label: 'GPT-5.4 Mini', rate: '15x' },
                            { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5', rate: '20x' },
                            { id: 'gpt-5.4', label: 'GPT-5.4', rate: '50x' },
                            { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', rate: '60x' },
                            { id: 'claude-opus-4-6', label: 'Claude Opus 4.6', rate: '100x' },
                          ].map(m => (
                            <button key={m.id} onClick={() => { setSelectedModel(m.id); setModelPopoverOpen(false) }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${selectedModel === m.id ? 'bg-accent font-medium text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                              <span>{m.label}</span>
                              <span className="text-[10px] text-muted-foreground/60">{m.rate}</span>
                            </button>
                          ))}
                        </PopoverContent>
                      </Popover>
                      <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isStreaming}
                        className="px-4 py-1.5 rounded-lg text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Ask Astruct
                      </button>
                    </div>
                  </div>
                </div>

                {/* Source pills */}
                <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
                  {/* Source pills with folder tree dropdowns */}
                  {([
                    { label: 'Contract', icon: FileText, cats: ['01_contract'], catLabels: { '01_contract': '01. Contract' } as Record<string, string>, flat: true },
                    { label: 'Drawings & Specs', icon: Ruler, cats: ['02_tender', '03_drawings', '04_specifications'], catLabels: { '02_tender': '02. Tender', '03_drawings': '03. Drawings', '04_specifications': '04. Specifications' } as Record<string, string> },
                    { label: 'Project Documents', icon: FolderOpen, cats: ['05_project_letters', '06_rfi', '07_variations', '08_nod', '09_eot', '10_payment_claims', '11_payment_schedules', '12_third_party_invoices', '13_other'], catLabels: { '05_project_letters': '05. Project Letters', '06_rfi': '06. RFIs', '07_variations': '07. Variations', '08_nod': '08. Notices of Delay', '09_eot': '09. EOT Claims', '10_payment_claims': '10. Payment Claims', '11_payment_schedules': '11. Payment Schedules', '12_third_party_invoices': '12. Third-Party Invoices', '13_other': '13. Other' } as Record<string, string> },
                  ]).map(group => {
                    const groupDocs = allDocs.filter(d => group.cats.includes(d.category))
                    const selected = groupDocs.filter(d => selectedDocIds.has(d.id)).length
                    const total = groupDocs.length
                    const active = selected > 0
                    // Group by category
                    const byCat: Record<string, typeof allDocs> = {}
                    for (const doc of groupDocs) {
                      if (!byCat[doc.category]) byCat[doc.category] = []
                      byCat[doc.category].push(doc)
                    }
                    return (
                      <Popover key={group.label}>
                        <PopoverTrigger className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${active ? 'bg-foreground/5 border-foreground/15 text-foreground font-medium' : 'border-border text-muted-foreground hover:border-foreground/15 hover:text-foreground'}`}>
                          <group.icon className="h-3 w-3" />{group.label} {active ? <span className="opacity-60">({selected}/{total})</span> : <span className="opacity-50">+</span>}
                        </PopoverTrigger>
                        <PopoverContent side="top" className="w-80 p-0 max-h-[350px] overflow-y-auto">
                          <div className="p-2.5 border-b border-border flex items-center justify-between">
                            <span className="text-xs font-medium text-foreground">{group.label}</span>
                            <div className="flex gap-2">
                              <button onClick={() => setSelectedDocIds(prev => { const n = new Set(prev); groupDocs.forEach(d => n.add(d.id)); return n })} className="text-[10px] text-muted-foreground hover:text-foreground">All</button>
                              <button onClick={() => setSelectedDocIds(prev => { const n = new Set(prev); groupDocs.forEach(d => n.delete(d.id)); return n })} className="text-[10px] text-muted-foreground hover:text-foreground">None</button>
                            </div>
                          </div>
                          {total === 0 ? (
                            <p className="text-xs text-muted-foreground p-3">No documents uploaded in these categories</p>
                          ) : 'flat' in group && group.flat ? (
                            /* Flat mode — just show docs directly, no folder wrapper */
                            <div className="p-1.5">
                              {groupDocs.map(doc => (
                                <button key={doc.id} onClick={() => setSelectedDocIds(prev => { const n = new Set(prev); if (n.has(doc.id)) n.delete(doc.id); else n.add(doc.id); return n })}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent text-left">
                                  <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center flex-shrink-0 ${selectedDocIds.has(doc.id) ? 'bg-foreground border-foreground' : 'border-border'}`}>
                                    {selectedDocIds.has(doc.id) && <Check className="w-2.5 h-2.5 text-background" />}
                                  </div>
                                  <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                  <span className="text-xs text-foreground truncate">{doc.filename}</span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            /* Folder tree mode */
                            <div className="p-1.5">
                              {group.cats.map(cat => {
                                const docs = byCat[cat] || []
                                const catSelected = docs.filter(d => selectedDocIds.has(d.id)).length
                                const catAll = catSelected === docs.length && docs.length > 0
                                const catSome = catSelected > 0 && !catAll
                                const isExp = expandedCats.has(cat)
                                return (
                                  <div key={cat}>
                                    <div className="flex items-center">
                                      <button onClick={() => setExpandedCats(prev => { const n = new Set(prev); if (n.has(cat)) n.delete(cat); else n.add(cat); return n })}
                                        className="p-1 rounded hover:bg-accent flex-shrink-0">
                                        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${isExp ? '' : '-rotate-90'}`} />
                                      </button>
                                      <button onClick={() => setSelectedDocIds(prev => { const n = new Set(prev); if (catAll) docs.forEach(d => n.delete(d.id)); else docs.forEach(d => n.add(d.id)); return n })}
                                        className="flex-1 flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-accent text-left">
                                        <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center flex-shrink-0 ${catAll ? 'bg-foreground border-foreground' : catSome ? 'bg-foreground/50 border-foreground/50' : 'border-border'}`}>
                                          {catAll && <Check className="w-2.5 h-2.5 text-background" />}
                                          {catSome && <Minus className="w-2.5 h-2.5 text-background" />}
                                        </div>
                                        <FolderOpen className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                        <span className="text-xs text-foreground">{group.catLabels[cat] || cat}</span>
                                        <span className="text-[10px] text-muted-foreground ml-auto">{docs.length > 0 ? `${catSelected}/${docs.length}` : '0'}</span>
                                      </button>
                                    </div>
                                    {isExp && docs.length > 0 && (
                                      <div className="ml-7 mb-1">
                                        {docs.map(doc => (
                                          <button key={doc.id} onClick={() => setSelectedDocIds(prev => { const n = new Set(prev); if (n.has(doc.id)) n.delete(doc.id); else n.add(doc.id); return n })}
                                            className="w-full flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-accent text-left">
                                            <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center flex-shrink-0 ${selectedDocIds.has(doc.id) ? 'bg-foreground border-foreground' : 'border-border'}`}>
                                              {selectedDocIds.has(doc.id) && <Check className="w-2.5 h-2.5 text-background" />}
                                            </div>
                                            <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                            <span className="text-[11px] text-foreground truncate">{doc.filename}</span>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                    {isExp && docs.length === 0 && (
                                      <p className="ml-7 text-[10px] text-muted-foreground py-1 px-1.5">No documents</p>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    )
                  })}

                  {/* Web Search — checkbox options */}
                  <Popover>
                    <PopoverTrigger className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${srcWeb ? 'bg-foreground/5 border-foreground/15 text-foreground font-medium' : 'border-border text-muted-foreground hover:border-foreground/15 hover:text-foreground'}`}>
                      <Globe className="h-3 w-3" />Web Search {!srcWeb && <span className="opacity-50">+</span>}
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-64 p-0">
                      <div className="p-2.5 border-b border-border">
                        <span className="text-xs font-medium text-foreground">Web Search</span>
                      </div>
                      <div className="p-1.5">
                        {[
                          { key: 'legal' as const, label: 'Legal Resources', desc: 'Legislation, case law', checked: webLegal },
                          { key: 'construction' as const, label: 'Construction Resources', desc: 'Standards, guides, QBCC', checked: webConstruction },
                          { key: 'all' as const, label: 'Whole of Internet', desc: 'All web sources', checked: webAll },
                        ].map(opt => (
                          <button key={opt.key} onClick={() => {
                            if (opt.key === 'all') {
                              const next = !webAll
                              setWebAll(next)
                              if (next) { setWebLegal(true); setWebConstruction(true) }
                              setSrcWeb(next || webLegal || webConstruction)
                            } else if (opt.key === 'legal') {
                              const next = !webLegal
                              setWebLegal(next)
                              setSrcWeb(next || webConstruction || webAll)
                              if (!next) setWebAll(false)
                            } else {
                              const next = !webConstruction
                              setWebConstruction(next)
                              setSrcWeb(next || webLegal || webAll)
                              if (!next) setWebAll(false)
                            }
                          }}
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-accent text-left transition-colors">
                            <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center flex-shrink-0 ${opt.checked ? 'bg-foreground border-foreground' : 'border-border'}`}>
                              {opt.checked && <Check className="w-2.5 h-2.5 text-background" />}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground">{opt.label}</p>
                              <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Knowledge Base — per-category checkbox dropdown */}
                  {(() => {
                    const kbCats = ['Standards', 'Templates', 'Guides', 'Legislation', 'Internal']
                    const anySelected = srcKnowledgeCats.size > 0
                    return (
                      <Popover>
                        <PopoverTrigger className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${anySelected ? 'bg-foreground/5 border-foreground/15 text-foreground font-medium' : 'border-border text-muted-foreground hover:border-foreground/15 hover:text-foreground'}`}>
                          <BookOpen className="h-3 w-3" />Knowledge Base {anySelected ? <span className="opacity-60">({srcKnowledgeCats.size}/{kbCats.length})</span> : <span className="opacity-50">+</span>}
                        </PopoverTrigger>
                        <PopoverContent side="top" className="w-72 p-0">
                          <div className="p-2.5 border-b border-border flex items-center justify-between">
                            <span className="text-xs font-medium text-foreground">Knowledge Base</span>
                            <div className="flex gap-2">
                              <button onClick={() => setSrcKnowledgeCats(new Set(kbCats))} className="text-[10px] text-muted-foreground hover:text-foreground">All</button>
                              <button onClick={() => setSrcKnowledgeCats(new Set())} className="text-[10px] text-muted-foreground hover:text-foreground">None</button>
                            </div>
                          </div>
                          <div className="p-1.5">
                            {kbCats.map(cat => {
                              const isOn = srcKnowledgeCats.has(cat)
                              return (
                                <button key={cat} onClick={() => setSrcKnowledgeCats(prev => { const n = new Set(prev); if (n.has(cat)) n.delete(cat); else n.add(cat); return n })}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent text-left">
                                  <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center flex-shrink-0 ${isOn ? 'bg-foreground border-foreground' : 'border-border'}`}>
                                    {isOn && <Check className="w-2.5 h-2.5 text-background" />}
                                  </div>
                                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                  <span className="text-xs text-foreground">{cat}</span>
                                </button>
                              )
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )
                  })()}

                  {/* Correspondence — with date range */}
                  <Popover>
                    <PopoverTrigger className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${srcCorrespondence ? 'bg-foreground/5 border-foreground/15 text-foreground font-medium' : 'border-border text-muted-foreground hover:border-foreground/15 hover:text-foreground'}`}>
                      <Mail className="h-3 w-3" />Correspondence {!srcCorrespondence && <span className="opacity-50">+</span>}
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-80 p-0">
                      <div className="p-2.5 border-b border-border flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground">Correspondence</span>
                        <button onClick={() => setSrcCorrespondence(v => !v)} className="text-[10px] text-muted-foreground hover:text-foreground">
                          {srcCorrespondence ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSrcCorrespondence(v => !v)}
                            className="flex items-center gap-2 text-sm text-foreground">
                            <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center flex-shrink-0 ${srcCorrespondence ? 'bg-foreground border-foreground' : 'border-border'}`}>
                              {srcCorrespondence && <Check className="w-2.5 h-2.5 text-background" />}
                            </div>
                            Include synced correspondence
                          </button>
                        </div>
                        <div className="border-t border-border pt-3">
                          <p className="text-[10px] font-medium text-muted-foreground mb-2 flex items-center gap-1"><CalendarRange className="h-3 w-3" />Date Range</p>
                          <div className="flex items-center gap-2">
                            <input type="date" value={corrDateFrom} onChange={e => setCorrDateFrom(e.target.value)}
                              className="flex-1 text-xs px-2 py-1.5 rounded-md border border-border bg-transparent text-foreground" />
                            <span className="text-xs text-muted-foreground">to</span>
                            <input type="date" value={corrDateTo} onChange={e => setCorrDateTo(e.target.value)}
                              className="flex-1 text-xs px-2 py-1.5 rounded-md border border-border bg-transparent text-foreground" />
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1.5">Leave empty to include all dates</p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Prompt tabs — Perplexity style */}
            {(() => {
              const tabs = [
                {
                  label: 'Generate a notice',
                  icon: AlertTriangle,
                  prompts: [
                    'Draft a notice of delay citing the relevant delay clause',
                    'Draft a variation claim with clause references',
                    'Draft an extension of time claim',
                    'Draft a notice of dispute under the dispute resolution clause',
                    'Draft a show cause response',
                  ],
                },
                {
                  label: 'Draft correspondence',
                  icon: Pen,
                  prompts: [
                    'Draft a letter requesting a site inspection',
                    'Draft a response to a notice of default',
                    'Draft a payment claim cover letter',
                    'Draft a letter requesting release of retention',
                    'Draft a practical completion notification letter',
                  ],
                },
                {
                  label: 'Analyse documents',
                  icon: FileSearch,
                  prompts: [
                    'Summarise the key obligations and deadlines',
                    'Identify all notice requirements and time bars',
                    'What are the payment claim provisions and deadlines?',
                    'Extract all key dates from the contract',
                    'Review the variation provisions and our rights',
                  ],
                },
                {
                  label: 'Contract Q&A',
                  icon: MessageSquare,
                  prompts: [
                    'What are our rights if site access is delayed?',
                    'What is the process for claiming a variation?',
                    'What are the liquidated damages provisions?',
                    'What are the defects liability requirements?',
                    'What happens if we encounter latent conditions?',
                  ],
                },
              ]

              return (
                <div className="border-t border-border px-6 py-3">
                  <div className="w-full max-w-[680px] mx-auto">
                    {/* Tab buttons — stretch to fill width */}
                    <div className="flex items-center gap-0 mb-2">
                      {tabs.map((tab, i) => (
                        <button
                          key={tab.label}
                          onClick={() => setActivePromptTab(i)}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-medium border whitespace-nowrap transition-all ${
                            i === 0 ? 'rounded-l-full' : ''
                          } ${i === tabs.length - 1 ? 'rounded-r-full' : ''} ${
                            i > 0 ? '-ml-px' : ''
                          } ${
                            activePromptTab === i
                              ? 'bg-foreground text-background border-foreground z-10'
                              : 'bg-transparent text-muted-foreground border-border hover:text-foreground'
                          }`}
                        >
                          <tab.icon className="h-3 w-3" />
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Prompt suggestions for active tab */}
                    <div className="space-y-0.5">
                      {tabs[activePromptTab].prompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => { setInput(prompt); inputRef.current?.focus() }}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-left group"
                        >
                          <span>{prompt}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        ) : (
          /* ─── Active Conversation ─── */
          <>
            <div className="flex items-center justify-end px-4 py-2 border-b border-border flex-shrink-0">
              <button
                onClick={startNewChat}
                disabled={isStreaming}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-colors disabled:opacity-30"
                title="New conversation (⌘⇧O)"
              >
                <SquarePen className="h-3.5 w-3.5" />
                New Chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
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
                        {/* Action buttons */}
                        <div className="flex items-center gap-0.5 mt-2 -ml-1.5">
                          <button onClick={() => { navigator.clipboard.writeText(parseAIResponse(msg.content).chatMessage || msg.content); toast.success('Copied') }}
                            className="p-1.5 rounded-md text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted transition-colors" title="Copy">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (!msg.id) return
                              const newFeedback = msg.feedback === 'positive' ? null : 'positive'
                              setMessages(prev => prev.map((m, j) => j === i ? { ...m, feedback: newFeedback } : m))
                              await fetch(`/api/chat/messages/${msg.id}/feedback`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ feedback: newFeedback }),
                              })
                            }}
                            className={`p-1.5 rounded-md transition-colors ${msg.feedback === 'positive' ? 'text-foreground bg-muted' : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted'}`}
                            title="Good response"
                          >
                            <ThumbsUp className={`h-3.5 w-3.5 ${msg.feedback === 'positive' ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={async () => {
                              if (!msg.id) return
                              const newFeedback = msg.feedback === 'negative' ? null : 'negative'
                              setMessages(prev => prev.map((m, j) => j === i ? { ...m, feedback: newFeedback } : m))
                              await fetch(`/api/chat/messages/${msg.id}/feedback`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ feedback: newFeedback }),
                              })
                            }}
                            className={`p-1.5 rounded-md transition-colors ${msg.feedback === 'negative' ? 'text-foreground bg-muted' : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted'}`}
                            title="Bad response"
                          >
                            <ThumbsDown className={`h-3.5 w-3.5 ${msg.feedback === 'negative' ? 'fill-current' : ''}`} />
                          </button>
                          <button onClick={() => {
                            const lastUserMsg = messages.slice(0, i).reverse().find(m => m.role === 'user')
                            if (lastUserMsg) { setInput(lastUserMsg.content); inputRef.current?.focus() }
                          }} className="p-1.5 rounded-md text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted transition-colors" title="Retry">
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                          {msg.sources && msg.sources.length > 0 && (
                            <button
                              onClick={() => setExpandedSources(expandedSources === i ? null : i)}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ml-1 ${expandedSources === i ? 'text-foreground bg-muted' : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted'}`}
                              title="View sources"
                            >
                              <Link2 className="h-3 w-3" />
                              Sources ({[...new Set(msg.sources.map(s => s.document_id))].length})
                            </button>
                          )}
                        </div>
                        {/* Sources panel */}
                        {expandedSources === i && msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 rounded-lg border border-border bg-card overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
                              <span className="text-xs font-medium text-muted-foreground">
                                Sources ({[...new Set(msg.sources.map(s => s.document_id))].length} documents, {msg.sources.length} sections)
                              </span>
                              <button onClick={() => setExpandedSources(null)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="divide-y divide-border max-h-80 overflow-y-auto">
                              {(() => {
                                // Group sources by document
                                const grouped = new Map<string, typeof msg.sources>()
                                for (const s of msg.sources!) {
                                  const existing = grouped.get(s.document_id) || []
                                  existing.push(s)
                                  grouped.set(s.document_id, existing)
                                }
                                return [...grouped.entries()].map(([docId, sources]) => (
                                  <div key={docId} className="px-4 py-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                      <span className="text-xs font-medium text-foreground truncate">{sources[0].document_name}</span>
                                      {sources.length > 1 && <span className="text-[10px] text-muted-foreground/60">({sources.length} sections)</span>}
                                    </div>
                                    <div className="space-y-2 ml-5">
                                      {sources.map((s, si) => (
                                        <div key={si}>
                                          {s.section_heading && (
                                            <p className="text-[10px] font-medium text-muted-foreground mb-0.5">{s.section_heading}</p>
                                          )}
                                          <p className="text-xs text-muted-foreground/70 leading-relaxed font-['Georgia',_serif] italic">
                                            "{s.excerpt}"
                                          </p>
                                          {/* Clause refs hidden — too noisy */}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : isStreaming ? (
                      (() => {
                        const lastUser = messages.filter(m => m.role === 'user').pop()?.content?.trim() || ''
                        const isCasual = lastUser.length < 25 && /^(hi|hello|hey|test|thanks|thank you|ok|okay|yes|no|sure|yo|sup|who are (u|you)|what('s| is) (up|your name)|how are (u|you)|dtest|can u|do u|what do u do|who made (this|u|you))\s*[!?.]*$/i.test(lastUser)
                        return isCasual ? (
                          <ShimmerText>Thinking...</ShimmerText>
                        ) : (
                          <ThinkingIndicator />
                        )
                      })()
                    ) : null}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input bar — only shown during conversation */}
            <div className="border-t border-border p-4 bg-main-panel">
              <div className="max-w-3xl mx-auto">
                {/* Pending uploads pills */}
                {pendingUploads.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {pendingUploads.map(f => (
                      <span key={f.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted border border-border text-[11px] text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        {f.filename.length > 25 ? f.filename.slice(0, 22) + '...' : f.filename}
                        <button onClick={() => setPendingUploads(prev => prev.filter(p => p.id !== f.id))} className="ml-0.5 hover:text-foreground">
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input ref={chatUploadRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.csv,.xlsx" className="hidden" onChange={handleChatUpload} />
                <div className="flex items-end gap-3 bg-card border border-border rounded-xl px-4 py-3 focus-within:border-ring transition-colors">
                  <button
                    onClick={() => chatUploadRef.current?.click()}
                    disabled={chatUploading || isStreaming}
                    className="flex-shrink-0 p-2 rounded-lg transition-all disabled:opacity-30 text-muted-foreground hover:text-foreground hover:bg-accent"
                    title="Upload documents for context"
                  >
                    {chatUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                  </button>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Reply..."
                    rows={1}
                    disabled={isStreaming}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none max-h-[200px] leading-relaxed"
                  />
                  {/* Model selector in conversation */}
                  <Popover open={modelPopoverOpen2} onOpenChange={setModelPopoverOpen2}>
                    <PopoverTrigger className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-muted-foreground hover:text-foreground border border-border hover:border-foreground/15 transition-colors flex-shrink-0">
                      {({ 'gpt-5-nano': '1x', 'gpt-5.4-nano': '4x', 'gpt-5-mini': '5x', 'gpt-5.4-mini': '15x', 'claude-haiku-4-5-20251001': '20x', 'gpt-5.4': '50x', 'claude-sonnet-4-6': '60x', 'claude-opus-4-6': '100x' } as Record<string, string>)[selectedModel] || selectedModel}
                      <ChevronDown className="h-2.5 w-2.5" />
                    </PopoverTrigger>
                    <PopoverContent side="top" align="end" className="w-56 p-1">
                      {[
                        { id: 'gpt-5-nano', label: 'GPT-5 Nano', rate: '1x' },
                        { id: 'gpt-5.4-nano', label: 'GPT-5.4 Nano', rate: '4x' },
                        { id: 'gpt-5-mini', label: 'GPT-5 Mini', rate: '5x' },
                        { id: 'gpt-5.4-mini', label: 'GPT-5.4 Mini', rate: '15x' },
                        { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5', rate: '20x' },
                        { id: 'gpt-5.4', label: 'GPT-5.4', rate: '50x' },
                        { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', rate: '60x' },
                        { id: 'claude-opus-4-6', label: 'Claude Opus 4.6', rate: '100x' },
                      ].map(m => (
                        <button key={m.id} onClick={() => { setSelectedModel(m.id); setModelPopoverOpen2(false) }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${selectedModel === m.id ? 'bg-accent font-medium text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                          <span>{m.label}</span>
                          <span className="text-[10px] text-muted-foreground/60">{m.rate}</span>
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isStreaming}
                    className="flex-shrink-0 p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent text-muted-foreground hover:text-foreground"
                  >
                    {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Resize handle + Document preview pane */}
      {activeDocument && (
        <>
          <div
            onMouseDown={handleResizeMouseDown}
            className="w-1.5 flex-shrink-0 cursor-col-resize group relative hover:bg-foreground/10 transition-colors"
          >
            <div className="absolute inset-y-0 -left-1.5 -right-1.5 z-10" />
          </div>
          <div style={{ width: docPaneWidth }} className="flex-shrink-0 h-full overflow-hidden">
            <DocumentPreview document={activeDocument} onClose={() => setActiveDocument(null)} />
          </div>
        </>
      )}
    </div>
    </>
  )
}
