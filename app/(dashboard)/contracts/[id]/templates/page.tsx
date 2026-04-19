'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  FileText,
  Loader2,
  Sparkles,
  Check,
  PenLine,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Trash2,
} from 'lucide-react'

interface NoticeType {
  id: string
  name: string
  description: string
  clause_references: string[]
  formal_requirements: string[]
  template: { id: string; status: string; version: number; updated_at: string } | null
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft_generated: { label: 'Draft', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  user_edited: { label: 'Edited', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  finalised: { label: 'Finalised', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
}

export default function ContractTemplatesPage() {
  const params = useParams()
  const router = useRouter()
  const contractId = params.id as string

  const [noticeTypes, setNoticeTypes] = useState<NoticeType[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [generating, setGenerating] = useState<string | null>(null)
  const [scanned, setScanned] = useState(false)

  const fetchNoticeTypes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/notice-types?contract_id=${contractId}`)
      if (res.ok) {
        const data = await res.json()
        setNoticeTypes(data.notice_types || [])
        setScanned(data.notice_types?.length > 0)
      }
    } catch {} finally { setLoading(false) }
  }, [contractId])

  useEffect(() => { fetchNoticeTypes() }, [fetchNoticeTypes])

  const handleScan = async () => {
    setScanning(true)
    try {
      const res = await fetch('/api/notice-types/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract_id: contractId }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Found ${data.count} notice types`)
        fetchNoticeTypes()
      } else {
        toast.error(data.error || 'Scan failed')
      }
    } catch { toast.error('Scan failed') }
    finally { setScanning(false) }
  }

  const handleGenerate = async (noticeTypeId: string) => {
    setGenerating(noticeTypeId)
    try {
      const res = await fetch('/api/notice-templates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notice_type_id: noticeTypeId, contract_id: contractId }),
      })
      const data = await res.json()
      if (res.ok && data.template) {
        toast.success('Template generated')
        router.push(`/contracts/${contractId}/templates/${data.template.id}`)
      } else {
        toast.error(data.error || 'Generation failed')
      }
    } catch { toast.error('Generation failed') }
    finally { setGenerating(null) }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const res = await fetch(`/api/notice-templates/${templateId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Template deleted')
        fetchNoticeTypes()
      } else {
        toast.error('Delete failed')
      }
    } catch { toast.error('Delete failed') }
  }

  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Templates</h1>
            <p className="text-sm text-muted-foreground mt-1">Notice templates derived from this contract&rsquo;s terms</p>
          </div>
          {scanned && (
            <button
              onClick={handleScan}
              disabled={scanning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20 transition-colors disabled:opacity-50"
            >
              {scanning ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              Re-scan
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3 py-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-lg border border-border bg-card px-5 py-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-5 w-5 rounded bg-muted shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 rounded bg-muted" />
                    <div className="h-3 w-72 rounded bg-muted" />
                  </div>
                  <div className="h-8 w-28 rounded bg-muted shrink-0" />
                </div>
              </div>
            ))}
          </div>
        ) : scanning ? (
          <div className="text-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-foreground mx-auto mb-4" />
            <p className="text-sm font-medium text-foreground">Identifying notice types from your contract...</p>
            <p className="text-xs text-muted-foreground mt-2">This may take 30-60 seconds</p>
          </div>
        ) : noticeTypes.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Generate Notice Templates</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              We can scan this contract and pre-build compliant notice templates for every notice type it contemplates.
              Templates are drafts you&rsquo;ll review before use.
            </p>
            <button
              onClick={handleScan}
              disabled={scanning}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Scan Contract for Notice Types
            </button>
          </div>
        ) : (
          /* Notice type cards */
          <div className="space-y-2">
            {noticeTypes.map(nt => {
              const status = nt.template ? STATUS_LABELS[nt.template.status] : null
              const isGenerating = generating === nt.id

              return (
                <div key={nt.id} className="rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4 px-5 py-4">
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{nt.name}</h3>
                        {status && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${status.color}`}>
                            {nt.template?.status === 'finalised' && <Check className="h-2.5 w-2.5 mr-0.5" />}
                            {status.label}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{nt.description}</p>
                      {nt.clause_references.length > 0 && (
                        <div className="flex gap-1 mt-1.5">
                          {nt.clause_references.slice(0, 5).map((ref, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded text-[9px] bg-border text-muted-foreground">cl {ref}</span>
                          ))}
                          {nt.clause_references.length > 5 && (
                            <span className="text-[9px] text-muted-foreground/50">+{nt.clause_references.length - 5}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5">
                      {nt.template ? (
                        <>
                          <button
                            onClick={() => router.push(`/contracts/${contractId}/templates/${nt.template!.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-foreground/70 hover:text-foreground border border-border hover:border-foreground/20 transition-colors"
                          >
                            <PenLine className="h-3 w-3" />
                            Open
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(nt.template!.id)}
                            className="p-1.5 rounded-md text-muted-foreground/30 hover:text-red-400 transition-colors"
                            title="Delete template (keeps the notice type)"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleGenerate(nt.id)}
                          disabled={isGenerating}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
                        >
                          {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                          Generate Template
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
