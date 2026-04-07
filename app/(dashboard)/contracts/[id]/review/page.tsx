'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Plus,
  Loader2,
  X,
  Play,
  Download,
  Trash2,
  ChevronRight,
  Table2,
  FileText,
  Check,
  AlertCircle,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface ReviewTable {
  id: string
  name: string
  description: string | null
  status: string
  document_ids: string[]
  created_at: string
}

interface ReviewColumn {
  id: string
  name: string
  description: string | null
  data_type: string
  column_order: number
}

interface ReviewCell {
  id: string
  review_column_id: string
  document_id: string
  value: string | null
  raw_excerpt: string | null
  confidence: number
  status: string
}

interface Doc {
  id: string
  filename: string
}

// ─── Templates ──────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    name: 'Correspondence Summary',
    columns: [
      { name: 'Date', data_type: 'date', description: 'Date of the correspondence' },
      { name: 'From', data_type: 'text', description: 'Who sent it (name and organisation)' },
      { name: 'To', data_type: 'text', description: 'Who received it' },
      { name: 'Subject', data_type: 'text', description: 'Brief subject (max 10 words)' },
      { name: 'Clause Refs', data_type: 'clause_ref', description: 'Contract clause numbers mentioned' },
      { name: 'Response Required', data_type: 'boolean', description: 'Does this require a response? Yes/No' },
    ],
  },
  {
    name: 'Variation Register',
    columns: [
      { name: 'Variation No.', data_type: 'text', description: 'Variation reference number' },
      { name: 'Description', data_type: 'text', description: 'Brief description of the variation (max 15 words)' },
      { name: 'Date', data_type: 'date', description: 'Date of variation direction or claim' },
      { name: 'Status', data_type: 'text', description: 'Current status: Directed/Claimed/Approved/Rejected/Pending' },
      { name: 'Claimed Value', data_type: 'currency', description: 'Amount claimed by contractor (AUD)' },
      { name: 'Clause', data_type: 'clause_ref', description: 'Relevant contract clause' },
    ],
  },
  {
    name: 'Payment Claim Tracker',
    columns: [
      { name: 'Claim Period', data_type: 'text', description: 'The payment claim period (e.g. "March 2026")' },
      { name: 'Claimed Amount', data_type: 'currency', description: 'Total amount claimed (AUD)' },
      { name: 'Certified Amount', data_type: 'currency', description: 'Amount certified by superintendent (AUD)' },
      { name: 'Difference', data_type: 'currency', description: 'Difference between claimed and certified (AUD)' },
      { name: 'Key Issues', data_type: 'text', description: 'Main issues or disputed items (brief)' },
    ],
  },
  {
    name: 'Custom',
    columns: [],
  },
]

// ─── Component ──────────────────────────────────────────────────────────────

export default function ReviewPage() {
  const params = useParams()
  const contractId = params.id as string

  const [tables, setTables] = useState<ReviewTable[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [activeTable, setActiveTable] = useState<string | null>(null)
  const [tableData, setTableData] = useState<{ table: ReviewTable; columns: ReviewColumn[]; cells: ReviewCell[]; documents: Doc[] } | null>(null)
  const [processing, setProcessing] = useState(false)

  // Create form
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newTemplate, setNewTemplate] = useState(0)
  const [newColumns, setNewColumns] = useState<{ name: string; description: string; data_type: string }[]>([])
  const [allDocs, setAllDocs] = useState<Doc[]>([])
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set())
  const [creating, setCreating] = useState(false)

  const fetchTables = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/review-tables?contract_id=${contractId}`)
      if (res.ok) {
        const data = await res.json()
        setTables(data.tables || [])
      }
    } catch {} finally { setLoading(false) }
  }, [contractId])

  const fetchTableData = useCallback(async (tableId: string) => {
    try {
      const res = await fetch(`/api/review-tables/${tableId}`)
      if (res.ok) {
        const data = await res.json()
        setTableData(data)
      }
    } catch {}
  }, [])

  useEffect(() => { fetchTables() }, [fetchTables])

  useEffect(() => {
    if (activeTable) fetchTableData(activeTable)
  }, [activeTable, fetchTableData])

  // Load docs for create form
  useEffect(() => {
    if (!showCreate) return
    const supabase = createClient()
    supabase.from('documents').select('id, filename').eq('contract_id', contractId).then(({ data }) => {
      setAllDocs(data || [])
      setSelectedDocIds(new Set((data || []).map(d => d.id))) // Select all by default
    })
  }, [showCreate, contractId])

  const handleTemplateSelect = (idx: number) => {
    setNewTemplate(idx)
    const template = TEMPLATES[idx]
    setNewName(template.name === 'Custom' ? '' : template.name)
    setNewColumns(template.columns.map(c => ({ ...c })))
  }

  const handleCreate = async () => {
    if (!newName.trim() || newColumns.length === 0 || selectedDocIds.size === 0) {
      toast.error('Name, columns, and documents are required')
      return
    }
    setCreating(true)
    try {
      const res = await fetch('/api/review-tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_id: contractId,
          name: newName,
          description: newDesc,
          document_ids: Array.from(selectedDocIds),
          columns: newColumns,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        toast.success('Review table created')
        setShowCreate(false)
        setNewName('')
        setNewDesc('')
        setNewColumns([])
        fetchTables()
        setActiveTable(data.table.id)
      }
    } catch { toast.error('Failed to create') }
    finally { setCreating(false) }
  }

  const handleProcess = async () => {
    if (!activeTable) return
    setProcessing(true)
    try {
      const res = await fetch(`/api/review-tables/${activeTable}/process`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        toast.success(`Processed ${data.documents_processed} documents`)
        fetchTableData(activeTable)
        fetchTables()
      } else {
        toast.error('Processing failed')
      }
    } catch { toast.error('Processing failed') }
    finally { setProcessing(false) }
  }

  const handleExport = async () => {
    if (!activeTable) return
    window.open(`/api/review-tables/${activeTable}/export`, '_blank')
  }

  const handleDelete = async (tableId: string) => {
    try {
      await fetch(`/api/review-tables/${tableId}`, { method: 'DELETE' })
      toast.success('Deleted')
      if (activeTable === tableId) { setActiveTable(null); setTableData(null) }
      fetchTables()
    } catch {}
  }

  // Get cell value for a document + column
  const getCellValue = (docId: string, colId: string) => {
    return tableData?.cells.find(c => c.document_id === docId && c.review_column_id === colId)
  }

  const getDocName = (docId: string) => {
    return tableData?.documents.find(d => d.id === docId)?.filename || 'Unknown'
  }

  // ─── Active table view ────────────────────────────────────────────────────

  if (activeTable && tableData) {
    return (
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => { setActiveTable(null); setTableData(null) }} className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-foreground">{tableData.table.name}</h2>
              {tableData.table.description && <p className="text-xs text-muted-foreground">{tableData.table.description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${tableData.table.status === 'complete' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : tableData.table.status === 'processing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
              {tableData.table.status}
            </span>
            <button onClick={handleProcess} disabled={processing} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50">
              {processing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
              {processing ? 'Processing...' : 'Process'}
            </button>
            <button onClick={handleExport} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20">
              <Download className="h-3 w-3" />CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-muted/80 backdrop-blur">
                <th className="text-left px-3 py-2 border-b border-r border-border text-xs font-semibold text-muted-foreground min-w-[200px]">Document</th>
                {(tableData.columns || []).map(col => (
                  <th key={col.id} className="text-left px-3 py-2 border-b border-r border-border text-xs font-semibold text-muted-foreground min-w-[140px]">
                    {col.name}
                    <span className="ml-1 text-[9px] font-normal text-muted-foreground/50">({col.data_type})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(tableData.table.document_ids || []).map(docId => (
                <tr key={docId} className="hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2 border-b border-r border-border">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="text-xs text-foreground truncate max-w-[180px]">{getDocName(docId)}</span>
                    </div>
                  </td>
                  {(tableData.columns || []).map(col => {
                    const cell = getCellValue(docId, col.id)
                    const confidence = cell?.confidence || 0
                    const borderColor = !cell || cell.status === 'pending' ? 'border-border'
                      : cell.status === 'not_found' || cell.status === 'error' ? 'border-l-2 border-l-red-500/40 border-b border-r border-border'
                      : confidence >= 0.7 ? 'border-l-2 border-l-emerald-500/40 border-b border-r border-border'
                      : 'border-l-2 border-l-amber-500/40 border-b border-r border-border'

                    return (
                      <td key={col.id} className={`px-3 py-2 ${borderColor}`} title={cell?.raw_excerpt || undefined}>
                        {cell?.status === 'processing' ? (
                          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                        ) : cell?.status === 'error' ? (
                          <span className="text-xs text-red-400">Error</span>
                        ) : cell?.status === 'not_found' ? (
                          <span className="text-xs text-muted-foreground/50">N/A</span>
                        ) : (
                          <span className="text-xs text-foreground">{cell?.value || '—'}</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // ─── Table list / empty state ─────────────────────────────────────────────

  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Review Tables</h1>
            <p className="text-sm text-muted-foreground mt-1">Extract and compare data across documents</p>
          </div>
          <button onClick={() => { setShowCreate(true); handleTemplateSelect(0) }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-foreground text-background hover:bg-foreground/90">
            <Plus className="h-4 w-4" />New Review Table
          </button>
        </div>

        {/* Create modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
            <div className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-5" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">New Review Table</h3>
                <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>

              {/* Template selection */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Template</p>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map((t, i) => (
                    <button key={i} onClick={() => handleTemplateSelect(i)} className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors ${newTemplate === i ? 'border-foreground bg-accent font-medium' : 'border-border hover:border-foreground/20'}`}>
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Table Name</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full px-3 py-2 rounded-md bg-main-panel border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>

              {/* Columns */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Columns ({newColumns.length})</p>
                  <button onClick={() => setNewColumns(prev => [...prev, { name: '', description: '', data_type: 'text' }])} className="text-xs text-muted-foreground hover:text-foreground">+ Add column</button>
                </div>
                {newColumns.map((col, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={col.name} onChange={e => setNewColumns(prev => prev.map((c, j) => j === i ? { ...c, name: e.target.value } : c))} placeholder="Column name" className="flex-1 px-2 py-1.5 rounded-md bg-main-panel border border-border text-xs text-foreground focus:outline-none" />
                    <button onClick={() => setNewColumns(prev => prev.filter((_, j) => j !== i))} className="text-muted-foreground/40 hover:text-red-400"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>

              {/* Documents */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Documents ({selectedDocIds.size}/{allDocs.length})</p>
                <div className="max-h-40 overflow-y-auto space-y-1 rounded-lg border border-border p-2">
                  {allDocs.map(doc => (
                    <label key={doc.id} className="flex items-center gap-2 text-xs text-foreground cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5">
                      <input type="checkbox" checked={selectedDocIds.has(doc.id)} onChange={e => {
                        setSelectedDocIds(prev => { const next = new Set(prev); e.target.checked ? next.add(doc.id) : next.delete(doc.id); return next })
                      }} className="rounded" />
                      <span className="truncate">{doc.filename}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={handleCreate} disabled={creating} className="w-full py-2 rounded-lg text-sm font-medium bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 inline-flex items-center justify-center gap-2">
                {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                {creating ? 'Creating...' : 'Create & Process'}
              </button>
            </div>
          </div>
        )}

        {/* Table list */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : tables.length === 0 && !showCreate ? (
          <div className="text-center py-20">
            <Table2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground mb-1">No review tables yet</p>
            <p className="text-xs text-muted-foreground/60 mb-4">Create a review table to extract and compare data across your documents</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tables.map(t => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setActiveTable(t.id)}>
                <Table2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.document_ids?.length || 0} documents</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${t.status === 'complete' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : t.status === 'processing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                  {t.status}
                </span>
                <button onClick={e => { e.stopPropagation(); handleDelete(t.id) }} className="text-muted-foreground/30 hover:text-red-400 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
