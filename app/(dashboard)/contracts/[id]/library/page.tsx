'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import {
  DOCUMENT_CATEGORIES,
  getCategoryLabel,
  getCategoryColor,
  BADGE_COLORS,
} from '@/lib/document-categories'
import { toast } from 'sonner'
import {
  FileText,
  Trash2,
  Loader2,
  Sparkles,
  ExternalLink,
  File,
  CheckCircle2,
  AlertCircle,
  Upload,
  RefreshCw,
} from 'lucide-react'

interface DocumentFile {
  id: string
  contract_id: string
  filename: string
  file_path: string
  file_type: string
  file_size: number
  category: string
  ai_summary: string
  processed: boolean
  uploaded_at: string
}

interface CategoryCounts {
  counts: Record<string, number>
  total: number
}

interface UploadingFile {
  name: string
  size: number
  status: 'uploading' | 'processing' | 'done' | 'error'
  category?: string
  summary?: string
  error?: string
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function LibraryPage() {
  const params = useParams()
  const contractId = params.id as string

  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [categoryCounts, setCategoryCounts] = useState<CategoryCounts>({ counts: {}, total: 0 })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [reindexing, setReindexing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [docsRes, catsRes] = await Promise.all([
      fetch(`/api/documents?contract_id=${contractId}`),
      fetch(`/api/documents/categories?contract_id=${contractId}`),
    ])
    if (docsRes.ok) {
      const data = await docsRes.json()
      setDocuments(data.documents || [])
    }
    if (catsRes.ok) {
      const data = await catsRes.json()
      setCategoryCounts(data)
    }
    setLoading(false)
  }, [contractId])

  useEffect(() => { fetchData() }, [fetchData])

  const handleUpload = async (files: FileList | File[]) => {
    if (files.length === 0) return
    const fileArray = Array.from(files)
    setUploadingFiles(fileArray.map(f => ({ name: f.name, size: f.size, status: 'uploading' as const })))
    const formData = new FormData()
    formData.append('contract_id', contractId)
    for (const file of fileArray) formData.append('files', file)
    setUploadingFiles(prev => prev.map(f => ({ ...f, status: 'processing' as const })))
    try {
      const res = await fetch('/api/documents/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        const uploaded = data.documents || []
        setUploadingFiles(prev => prev.map(f => {
          const match = uploaded.find((d: DocumentFile) => d.filename === f.name)
          if (match) return { ...f, status: 'done' as const, category: match.category, summary: match.ai_summary }
          return { ...f, status: 'error' as const, error: 'Upload failed' }
        }))
        await fetchData()
        setTimeout(() => setUploadingFiles([]), 8000)
      } else {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        console.error('[Library Upload] Error:', res.status, err)
        setUploadingFiles(prev => prev.map(f => ({ ...f, status: 'error' as const, error: err.error || `Upload failed (${res.status})` })))
      }
    } catch (e) {
      console.error('[Library Upload] Network error:', e)
      setUploadingFiles(prev => prev.map(f => ({ ...f, status: 'error' as const, error: 'Network error' })))
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch('/api/documents', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      if (res.ok) await fetchData()
    } catch { console.error('Delete failed') }
    setDeletingId(null)
  }

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false)
    if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files)
  }

  const filteredDocuments = selectedCategory ? documents.filter(d => d.category === selectedCategory) : documents
  const activeCategories = DOCUMENT_CATEGORIES.filter(cat => (categoryCounts.counts[cat.value] || 0) > 0)

  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Library</h1>
              <p className="text-sm text-muted-foreground mt-1">Upload and manage contract documents. AI auto-classifies and indexes for search.</p>
            </div>
            {documents.length > 0 && (
              <button
                onClick={async () => {
                  setReindexing(true)
                  try {
                    const res = await fetch('/api/documents/reembed', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ contract_id: contractId }),
                    })
                    if (res.ok) {
                      const data = await res.json()
                      toast.success(`Re-indexed ${data.documents_processed} documents (${data.total_chunks} chunks)`)
                    } else {
                      toast.error('Re-indexing failed')
                    }
                  } catch { toast.error('Re-indexing failed') }
                  finally { setReindexing(false) }
                }}
                disabled={reindexing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20 transition-colors disabled:opacity-50"
              >
                {reindexing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                {reindexing ? 'Re-indexing...' : 'Re-index All'}
              </button>
            )}
          </div>
        </div>
        {/* Upload zone */}
        <label
          htmlFor="library-file-upload"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`block border-2 border-dashed rounded-xl p-6 mb-6 text-center cursor-pointer transition-all ${
            isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-border hover:border-ring bg-muted/30'
          }`}
        >
          <input id="library-file-upload" ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.png,.jpg,.jpeg" onChange={e => { if (e.target.files) handleUpload(e.target.files); e.target.value = '' }} className="sr-only" />
          <Upload className={`h-6 w-6 mx-auto mb-2 ${isDragging ? 'text-blue-400' : 'text-muted-foreground/50'}`} strokeWidth={1.5} />
          <p className="text-sm font-medium text-foreground mb-0.5">{isDragging ? 'Drop files here' : 'Upload Documents'}</p>
          <p className="text-xs text-muted-foreground">Drag and drop files, or click to browse. PDFs will be analyzed by AI.</p>
        </label>

        {/* Upload progress */}
        {uploadingFiles.length > 0 && (
          <div className="mb-6 space-y-2">
            {uploadingFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                {f.status === 'uploading' && <Loader2 className="h-4 w-4 text-blue-400 animate-spin flex-shrink-0" />}
                {f.status === 'processing' && <div className="w-4 flex-shrink-0" />}
                {f.status === 'done' && <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                {f.status === 'error' && <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{f.name}</p>
                  {f.status === 'uploading' && <p className="text-xs text-muted-foreground">Uploading...</p>}
                  {f.status === 'processing' && (
                    <span
                      className="text-xs"
                      style={{
                        background: 'linear-gradient(90deg, #9ca3af 0%, #d1d5db 35%, #e5e7eb 50%, #d1d5db 65%, #9ca3af 100%)',
                        backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        animation: 'shimmer-sweep 2s ease-in-out infinite',
                      }}
                    >
                      Analysing...
                    </span>
                  )}
                  {f.status === 'done' && f.category && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${BADGE_COLORS[getCategoryColor(f.category)] || BADGE_COLORS.zinc}`}>{getCategoryLabel(f.category)}</span>
                      {f.summary && <span className="text-xs text-muted-foreground truncate">{f.summary}</span>}
                    </div>
                  )}
                  {f.status === 'error' && <p className="text-xs text-red-400">{f.error}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category filter chips — all categories shown */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selectedCategory === null ? 'bg-foreground text-background border-foreground' : 'bg-transparent text-muted-foreground border-border hover:border-foreground/20'
            }`}
          >
            All ({categoryCounts.total})
          </button>
          {DOCUMENT_CATEGORIES.map(cat => {
            const count = categoryCounts.counts[cat.value] || 0
            const isActive = selectedCategory === cat.value
            const isEmpty = count === 0
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(isActive ? null : cat.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isActive
                    ? 'bg-foreground text-background border-foreground'
                    : isEmpty
                      ? 'bg-transparent text-muted-foreground/40 border-border/60 hover:border-border hover:text-muted-foreground'
                      : 'bg-transparent text-muted-foreground border-border hover:border-foreground/20'
                }`}
              >
                {cat.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Document table */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-16">
            <File className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground mb-1">
              {selectedCategory ? `No documents in ${getCategoryLabel(selectedCategory)}` : 'No documents uploaded yet'}
            </p>
            <p className="text-xs text-muted-foreground/60">Upload PDFs to get AI-powered classification and summaries.</p>
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground">
              <div className="flex-1">Document</div>
              <div className="w-32 text-right hidden md:block">Category</div>
              <div className="w-20 text-right hidden lg:block">Size</div>
              <div className="w-24 text-right hidden lg:block">Date</div>
              <div className="w-16" />
            </div>
            {/* Table rows */}
            {filteredDocuments.map((doc, i) => (
              <div key={doc.id} className={`group flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors ${i < filteredDocuments.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{doc.filename}</p>
                    {doc.ai_summary && <p className="text-xs text-muted-foreground truncate mt-0.5">{doc.ai_summary}</p>}
                  </div>
                </div>
                <div className="w-32 text-right hidden md:block">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${BADGE_COLORS[getCategoryColor(doc.category)] || BADGE_COLORS.zinc}`}>
                    {getCategoryLabel(doc.category)}
                  </span>
                </div>
                <div className="w-20 text-right hidden lg:block">
                  <span className="text-xs text-muted-foreground">{formatFileSize(doc.file_size)}</span>
                </div>
                <div className="w-24 text-right hidden lg:block">
                  <span className="text-xs text-muted-foreground">{formatDate(doc.uploaded_at)}</span>
                </div>
                <div className="w-16 flex items-center justify-end gap-1">
                  <a href={`/api/documents/${doc.id}/file`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-all" title="View">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button onClick={() => handleDelete(doc.id)} disabled={deletingId === doc.id}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all disabled:opacity-50" title="Delete">
                    {deletingId === doc.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
