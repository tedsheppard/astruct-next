'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Upload,
  Scale,
  FileText,
  BookOpen,
  Landmark,
  Building2,
  FolderOpen,
} from 'lucide-react'

interface Category {
  key: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  docCount: number
}

const categories: Category[] = [
  {
    key: 'standards',
    label: 'Standards',
    description: 'AS4000, AS4902, AS2124 reference texts',
    icon: Scale,
    docCount: 0,
  },
  {
    key: 'templates',
    label: 'Templates',
    description: 'Internal company templates and precedents',
    icon: FileText,
    docCount: 0,
  },
  {
    key: 'guides',
    label: 'Guides',
    description: 'Industry guides, QBCC, SOP Act',
    icon: BookOpen,
    docCount: 0,
  },
  {
    key: 'legislation',
    label: 'Legislation',
    description: 'Relevant acts and regulations',
    icon: Landmark,
    docCount: 0,
  },
  {
    key: 'internal',
    label: 'Internal',
    description: 'Company-specific reference materials',
    icon: Building2,
    docCount: 0,
  },
]

export default function KnowledgeBasePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    // Placeholder — upload logic will be added when knowledge_base bucket is configured
  }

  const activeCategory = selectedCategory
    ? categories.find((c) => c.key === selectedCategory)
    : null

  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Knowledge Base
        </h1>
        <p className="text-sm mt-1 text-muted-foreground">
          Firm-wide reference documents and templates
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-500/5'
            : 'border-border hover:border-ring bg-card'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
          onChange={() => {
            // Placeholder — upload logic will be added when knowledge_base bucket is configured
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
          {isDragging
            ? 'Drop files here'
            : 'Upload reference documents that apply across all your contracts'}
        </p>
        <p className="text-xs text-muted-foreground">
          Documents uploaded here will be available as a source in the Assistant
          when &quot;Knowledge Base&quot; is selected
        </p>
      </div>

      {/* Category Grid */}
      <div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
          Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = selectedCategory === category.key
            return (
              <Card
                key={category.key}
                className={`bg-card border rounded-xl cursor-pointer transition-colors ${
                  isActive
                    ? 'border-ring'
                    : 'border-border hover:border-ring'
                }`}
                onClick={() =>
                  setSelectedCategory(
                    isActive ? null : category.key
                  )
                }
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon
                        className="h-5 w-5 text-muted-foreground"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {category.docCount}{' '}
                      {category.docCount === 1 ? 'doc' : 'docs'}
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground mb-0.5">
                    {category.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Expanded Category / Empty State */}
      {activeCategory && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderOpen
                className="h-4 w-4 text-muted-foreground"
                strokeWidth={1.5}
              />
              <h2 className="text-sm font-medium text-foreground">
                {activeCategory.label}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedCategory(null)}
            >
              Close
            </Button>
          </div>

          <Card className="bg-card border-border border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <activeCategory.icon
                  className="h-6 w-6 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                No documents in this category yet.
              </p>
              <p className="text-xs text-muted-foreground">
                Drag and drop files here to add them to{' '}
                {activeCategory.label}.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </div>
  )
}
