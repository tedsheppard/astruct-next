'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Upload,
  Scale,
  FileText,
  BookOpen,
  Landmark,
  Building2,
  ChevronLeft,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface KBDocument {
  id: string
  filename: string
  file_size: number | null
  ai_summary: string | null
  uploaded_at: string | null
}

interface Category {
  key: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}

const categories: Category[] = [
  { key: 'standards', label: 'Standards', description: 'AS4000, AS4902, AS2124 reference texts', icon: Scale },
  { key: 'templates', label: 'Templates', description: 'Internal company templates and precedents', icon: FileText },
  { key: 'guides', label: 'Guides', description: 'Industry guides and publications', icon: BookOpen },
  { key: 'legislation', label: 'Legislation', description: 'Relevant acts and regulations', icon: Landmark },
  { key: 'internal', label: 'Internal', description: 'Company-specific reference materials', icon: Building2 },
]

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '—'
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${Math.round(bytes / 1024)} KB`
}

export default function KnowledgeBasePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [categoryDocs, setCategoryDocs] = useState<KBDocument[]>([])
  const [loadingDocs, setLoadingDocs] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('knowledge_base_documents')
      .select('category')
      .then(({ data }) => {
        const counts: Record<string, number> = {}
        for (const d of data || []) {
          counts[d.category] = (counts[d.category] || 0) + 1
        }
        setCategoryCounts(counts)
      })
  }, [])

  useEffect(() => {
    if (!selectedCategory) { setCategoryDocs([]); return }
    setLoadingDocs(true)
    const supabase = createClient()
    supabase
      .from('knowledge_base_documents')
      .select('id, filename, file_size, ai_summary, uploaded_at')
      .eq('category', selectedCategory)
      .order('filename')
      .then(({ data }) => {
        setCategoryDocs(data || [])
        setLoadingDocs(false)
      })
  }, [selectedCategory])

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }

  const activeCategory = selectedCategory ? categories.find((c) => c.key === selectedCategory) : null

  // ── Category detail view ──
  if (activeCategory) {
    const Icon = activeCategory.icon
    return (
      <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="text-muted-foreground hover:text-foreground -ml-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">{activeCategory.label}</h1>
              <p className="text-sm text-muted-foreground">{categoryCounts[activeCategory.key] || 0} documents</p>
            </div>
          </div>

          {loadingDocs ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading...</div>
          ) : categoryDocs.length === 0 ? (
            <Card className="bg-card border-border border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-muted-foreground">No documents in this category yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Document</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Summary</th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryDocs.map((doc, i) => (
                    <tr key={doc.id} className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-foreground">{doc.filename}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground line-clamp-1">{doc.ai_summary || '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs text-muted-foreground tabular-nums">{formatFileSize(doc.file_size)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Main KB view ──
  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Knowledge Base</h1>
        <p className="text-sm mt-1 text-muted-foreground">Firm-wide reference documents and templates</p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-border hover:border-ring bg-card'
        }`}
      >
        <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls" onChange={() => {}} className="hidden" />
        <Upload className={`h-8 w-8 mx-auto mb-3 ${isDragging ? 'text-blue-400' : 'text-muted-foreground'}`} strokeWidth={1.5} />
        <p className="text-sm font-medium text-foreground mb-1">
          {isDragging ? 'Drop files here' : 'Upload reference documents that apply across all your contracts'}
        </p>
        <p className="text-xs text-muted-foreground">
          Documents uploaded here will be available as a source in the Assistant when &quot;Knowledge Base&quot; is selected
        </p>
      </div>

      <div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card
                key={category.key}
                className="bg-card border rounded-xl cursor-pointer transition-colors border-border hover:border-ring"
                onClick={() => setSelectedCategory(category.key)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {categoryCounts[category.key] || 0} {(categoryCounts[category.key] || 0) === 1 ? 'doc' : 'docs'}
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground mb-0.5">{category.label}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      </div>
    </div>
  )
}
