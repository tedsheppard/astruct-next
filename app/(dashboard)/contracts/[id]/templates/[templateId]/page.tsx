'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Save,
  RefreshCw,
  Check,
  Trash2,
  ChevronLeft,
  Loader2,
  Send,
  AlertTriangle,
} from 'lucide-react'

interface NoticeTemplate {
  id: string
  body: string
  placeholders: Record<string, { label: string; hint: string; type: string }>
  status: string
  version: number
  updated_at: string
  notice_types: {
    name: string
    description: string
    clause_references: string[]
    formal_requirements: string[]
  }
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function TemplateEditorPage() {
  const params = useParams()
  const router = useRouter()
  const contractId = params.id as string
  const templateId = params.templateId as string

  const [template, setTemplate] = useState<NoticeTemplate | null>(null)
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [showConfirmRegen, setShowConfirmRegen] = useState(false)

  // AI chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const fetchTemplate = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/notice-templates/${templateId}`)
      if (res.ok) {
        const data = await res.json()
        setTemplate(data.template)
        setBody(data.template.body)
      }
    } catch {} finally { setLoading(false) }
  }, [templateId])

  useEffect(() => { fetchTemplate() }, [fetchTemplate])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/notice-templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })
      if (res.ok) {
        const data = await res.json()
        setTemplate(prev => prev ? { ...prev, ...data.template } : prev)
        setSaved(true)
        toast.success('Saved')
      }
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const handleFinalise = async () => {
    try {
      const res = await fetch(`/api/notice-templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, status: 'finalised' }),
      })
      if (res.ok) {
        setTemplate(prev => prev ? { ...prev, status: 'finalised' } : prev)
        toast.success('Template finalised')
      }
    } catch { toast.error('Failed to finalise') }
  }

  const handleRegenerate = async () => {
    setShowConfirmRegen(false)
    setRegenerating(true)
    try {
      const noticeTypeId = template?.notice_types ? undefined : undefined // need notice_type_id
      const res = await fetch('/api/notice-templates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notice_type_id: template?.id, contract_id: contractId }),
      })
      if (res.ok) {
        toast.success('Template regenerated')
        fetchTemplate()
      } else {
        toast.error('Regeneration failed')
      }
    } catch { toast.error('Regeneration failed') }
    finally { setRegenerating(false) }
  }

  const handleDelete = async () => {
    try {
      await fetch(`/api/notice-templates/${templateId}`, { method: 'DELETE' })
      toast.success('Template deleted')
      router.push(`/contracts/${contractId}/templates`)
    } catch { toast.error('Delete failed') }
  }

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setChatLoading(true)

    try {
      const res = await fetch('/api/notice-templates/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_body: body,
          notice_type_name: template?.notice_types?.name,
          user_request: userMsg,
          contract_id: contractId,
        }),
      })

      if (!res.ok) throw new Error('Request failed')

      const data = await res.json()

      // Show the message in chat
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.message || 'Done.' }])

      // Apply the edit to the template if one was returned
      if (data.updated_body) {
        setBody(data.updated_body)
        setSaved(false)
        toast.success('Template updated')
      }
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setChatLoading(false)
    }
  }

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!template) {
    return <div className="p-6 text-center text-muted-foreground">Template not found</div>
  }

  const isDraft = template.status === 'draft_generated'
  const isEdited = template.status === 'user_edited'

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left pane — editor (75%) */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-border" style={{ flex: '3' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.push(`/contracts/${contractId}/templates`)} className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-foreground truncate">{template.notice_types?.name}</h2>
              <p className="text-[10px] text-muted-foreground">v{template.version} · {saved ? 'Saved' : 'Unsaved changes'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSave} disabled={saving || saved} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20 transition-colors disabled:opacity-30">
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
              Save
            </button>
            <button onClick={() => setShowConfirmRegen(true)} disabled={regenerating} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20 transition-colors disabled:opacity-30">
              {regenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              Regenerate
            </button>
            {template.status !== 'finalised' && (
              <button onClick={handleFinalise} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors">
                <Check className="h-3 w-3" />
                Finalise
              </button>
            )}
            <button onClick={handleDelete} className="p-1.5 rounded-md text-muted-foreground/40 hover:text-red-400 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Draft banner */}
        {(isDraft || isEdited) && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <p className="text-xs font-medium">DRAFT — REVIEW BEFORE SENDING</p>
          </div>
        )}

        {/* Editor — A4 document view */}
        <div className="flex-1 overflow-y-auto" style={{ background: '#e8e5e0' }}>
          <div className="py-8 px-6">
            <div
              className="mx-auto bg-white"
              style={{
                maxWidth: '800px',
                minHeight: '1130px',
                padding: '72px',
                boxSizing: 'border-box',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.12)',
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: '13.3px',
                lineHeight: '1.6',
                color: '#1a1a1a',
              }}
            >
              <div className="notice-template-editor">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
              </div>
            </div>
          </div>
          {/* Raw editor below for editing */}
          <div className="py-4 px-6">
            <details className="mx-auto" style={{ maxWidth: '800px' }}>
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors py-2">
                Edit source
              </summary>
              <textarea
                value={body}
                onChange={e => { setBody(e.target.value); setSaved(false) }}
                onBlur={() => { if (!saved) handleSave() }}
                className="w-full min-h-[400px] bg-white border border-border rounded-lg p-4 text-sm text-foreground font-mono leading-relaxed resize-y outline-none focus:ring-1 focus:ring-ring"
                placeholder="Template body..."
              />
            </details>
          </div>
        </div>
      </div>

      {/* Right pane — AI chat (25%) */}
      <div className="flex flex-col bg-sidebar" style={{ flex: '1', minWidth: '280px', maxWidth: '400px' }}>
        <div className="px-4 py-3 border-b border-border shrink-0">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Refinement</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {chatMessages.length === 0 && (
            <p className="text-xs text-muted-foreground/50 text-center py-8">
              Ask questions about this template or request changes.
            </p>
          )}
          {chatMessages.map((msg, i) => (
            <div key={i} className={`text-xs leading-relaxed ${msg.role === 'user' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              {msg.role === 'user' ? (
                <p className="bg-muted rounded-lg px-3 py-2">{msg.content}</p>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:mb-2 [&_p]:text-xs">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}
          {chatLoading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Thinking...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="px-3 py-3 border-t border-border shrink-0">
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSend() } }}
              placeholder="Ask about this template..."
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button onClick={handleChatSend} disabled={chatLoading || !chatInput.trim()} className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Regeneration confirmation modal */}
      {showConfirmRegen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirmRegen(false)}>
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-foreground mb-2">Regenerate template?</h3>
            <p className="text-sm text-muted-foreground mb-6">This will replace the current template with a fresh AI-generated draft. Your manual edits will be lost (but saved in version history).</p>
            <div className="flex gap-3">
              <button onClick={handleRegenerate} className="flex-1 py-2 rounded-lg text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors">
                Regenerate
              </button>
              <button onClick={() => setShowConfirmRegen(false)} className="flex-1 py-2 rounded-lg text-sm text-muted-foreground border border-border hover:border-foreground/20 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
