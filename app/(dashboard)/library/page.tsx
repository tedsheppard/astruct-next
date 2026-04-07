'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useContract } from '@/lib/contract-context'
import {
  DOCUMENT_CATEGORIES,
  getCategoryLabel,
  getCategoryColor,
  BADGE_COLORS,
} from '@/lib/document-categories'
import {
  Upload,
  FileText,
  Folder,
  FolderOpen,
  Trash2,
  Loader2,
  Sparkles,
  X,
  ExternalLink,
  File,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Document {
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
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function LibraryPage() {
  const { selectedContractId } = useContract()
  const [documents, setDocuments] = useState<Document[]>([])
  const [categoryCounts, setCategoryCounts] = useState<CategoryCounts>({ counts: {}, total: 0 })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch documents and category counts
  const fetchData = useCallback(async () => {
    if (!selectedContractId) {
      setDocuments([])
      setCategoryCounts({ counts: {}, total: 0 })
      setLoading(false)
      return
    }

    setLoading(true)

    const [docsRes, catsRes] = await Promise.all([
      fetch(`/api/documents?contract_id=${selectedContractId}`),
      fetch(`/api/documents/categories?contract_id=${selectedContractId}`),
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
  }, [selectedContractId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Upload handler
  const handleUpload = async (files: FileList | File[]) => {
    if (!selectedContractId || files.length === 0) return

    const fileArray = Array.from(files)

    // Show uploading state
    setUploadingFiles(
      fileArray.map((f) => ({
        name: f.name,
        size: f.size,
        status: 'uploading' as const,
      }))
    )

    const formData = new FormData()
    formData.append('contract_id', selectedContractId)
    for (const file of fileArray) {
      formData.append('files', file)
    }

    // Update to processing state
    setUploadingFiles((prev) =>
      prev.map((f) => ({ ...f, status: 'processing' as const }))
    )

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        const uploaded = data.documents || []

        // Show results
        setUploadingFiles((prev) =>
          prev.map((f) => {
            const match = uploaded.find(
              (d: Document) => d.filename === f.name
            )
            if (match) {
              return {
                ...f,
                status: 'done' as const,
                category: match.category,
                summary: match.ai_summary,
              }
            }
            return { ...f, status: 'error' as const, error: 'Upload failed' }
          })
        )

        // Refresh data
        await fetchData()

        // Clear upload results after 8 seconds
        setTimeout(() => setUploadingFiles([]), 8000)
      } else {
        const err = await res.json()
        setUploadingFiles((prev) =>
          prev.map((f) => ({
            ...f,
            status: 'error' as const,
            error: err.error || 'Upload failed',
          }))
        )
      }
    } catch {
      setUploadingFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: 'error' as const,
          error: 'Network error',
        }))
      )
    }
  }

  // Delete handler
  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch('/api/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        await fetchData()
      }
    } catch {
      console.error('Delete failed')
    }
    setDeletingId(null)
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files)
    }
  }

  // Filter documents by category
  const filteredDocuments = selectedCategory
    ? documents.filter((d) => d.category === selectedCategory)
    : documents

  // No contract selected state
  if (!selectedContractId) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" strokeWidth={1.5} />
          <h2 className="text-lg font-medium text-foreground mb-2">No contract selected</h2>
          <p className="text-sm text-muted-foreground">
            Select a contract from the sidebar to view its document library.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] overflow-hidden">
      {/* Left Sidebar - Category Folders */}
      <div className="w-64 flex-shrink-0 overflow-y-auto">
        <h3 className="text-xs font-medium uppercase tracking-wider mb-3 px-2 text-muted-foreground">
          Categories
        </h3>

        {/* All Documents */}
        <button
          onClick={() => setSelectedCategory(null)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 ${
            selectedCategory === null
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FolderOpen className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
            <span>All Documents</span>
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {categoryCounts.total}
          </span>
        </button>

        <div className="h-px bg-border my-2" />

        {/* Category folders */}
        {DOCUMENT_CATEGORIES.map((cat) => {
          const count = categoryCounts.counts[cat.value] || 0
          const isActive = selectedCategory === cat.value
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 ${
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {isActive ? (
                  <FolderOpen className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
                ) : (
                  <Folder className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
                )}
                <span className="truncate">{cat.label}</span>
              </div>
              {count > 0 && (
                <span className="text-xs tabular-nums ml-2 text-muted-foreground">{count}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {/* Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-500/5'
              : 'border-border hover:border-border bg-sidebar'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
            onChange={(e) => {
              if (e.target.files) handleUpload(e.target.files)
              e.target.value = ''
            }}
            className="hidden"
          />
          <Upload
            className={`h-8 w-8 mx-auto mb-3 ${
              isDragging ? 'text-blue-400' : 'text-muted-foreground'
            }`}
            strokeWidth={1.5}
          />
          <p className="text-sm font-medium text-foreground mb-1">
            {isDragging ? 'Drop files here' : 'Upload Documents'}
          </p>
          <p className="text-xs text-muted-foreground">
            Drag and drop files, or click to browse. PDFs will be analyzed by AI.
          </p>
        </div>

        {/* Upload Progress / Results */}
        {uploadingFiles.length > 0 && (
          <div className="mb-6 space-y-2">
            {uploadingFiles.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
              >
                {f.status === 'uploading' && (
                  <Loader2 className="h-4 w-4 text-blue-400 animate-spin flex-shrink-0" />
                )}
                {f.status === 'processing' && (
                  <div className="w-4 flex-shrink-0" />
                )}
                {f.status === 'done' && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                )}
                {f.status === 'error' && (
                  <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{f.name}</p>
                  {f.status === 'uploading' && (
                    <p className="text-xs text-muted-foreground">Uploading...</p>
                  )}
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
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${
                          BADGE_COLORS[getCategoryColor(f.category)] || BADGE_COLORS.zinc
                        }`}
                      >
                        {getCategoryLabel(f.category)}
                      </span>
                      {f.summary && (
                        <span className="text-xs text-muted-foreground truncate">
                          {f.summary}
                        </span>
                      )}
                    </div>
                  )}
                  {f.status === 'error' && (
                    <p className="text-xs text-red-400">{f.error}</p>
                  )}
                </div>

                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {formatFileSize(f.size)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Document List */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-16">
            <File className="h-10 w-10 mx-auto mb-3 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground mb-1">
              {selectedCategory
                ? `No documents in ${getCategoryLabel(selectedCategory)}`
                : 'No documents uploaded yet'}
            </p>
            <p className="text-xs text-muted-foreground">
              Upload PDFs to get AI-powered classification and summaries.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="group flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-border transition-colors"
              >
                {/* File icon */}
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {doc.filename}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border flex-shrink-0 ${
                        BADGE_COLORS[getCategoryColor(doc.category)] || BADGE_COLORS.zinc
                      }`}
                    >
                      {getCategoryLabel(doc.category)}
                    </span>
                  </div>
                  {doc.ai_summary && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-[500px]">
                      {doc.ai_summary}
                    </p>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(doc.file_size)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(doc.uploaded_at)}
                  </span>

                  {/* View button */}
                  <a
                    href={`/api/documents/${doc.id}/file`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                    title="View file"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400 disabled:opacity-50"
                    title="Delete document"
                  >
                    {deletingId === doc.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
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
