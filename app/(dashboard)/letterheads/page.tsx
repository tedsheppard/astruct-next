'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FileText,
  Plus,
  Copy,
  Trash2,
  Edit,
  Settings,
  Type,
  Layout,
  AlignLeft,
  ArrowLeft,
  Check,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Letterhead {
  id: string
  name: string
  description: string
  pageSize: 'a4' | 'letter'
  margins: { top: number; right: number; bottom: number; left: number }
  font: string
  fontSize: number
  lineSpacing: number
  headerLogoPosition: 'left' | 'center' | 'right'
  headerShowOn: 'all' | 'first'
  footerPagination: 'page-x-of-y' | 'page-x' | 'none'
  footerPosition: 'left' | 'center' | 'right'
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'astruct_letterheads_v2'

const DEFAULT_TEMPLATES: Omit<Letterhead, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Standard Letterhead',
    description: 'Default letterhead with company logo, ABN, and address',
    pageSize: 'a4',
    margins: { top: 25, right: 25, bottom: 25, left: 25 },
    font: 'Arial',
    fontSize: 11,
    lineSpacing: 1.15,
    headerLogoPosition: 'left',
    headerShowOn: 'all',
    footerPagination: 'page-x-of-y',
    footerPosition: 'center',
  },
]

function createDefaultLetterhead(): Letterhead {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: 'Untitled Letterhead',
    description: '',
    pageSize: 'a4',
    margins: { top: 25, right: 25, bottom: 25, left: 25 },
    font: 'Arial',
    fontSize: 11,
    lineSpacing: 1.15,
    headerLogoPosition: 'left',
    headerShowOn: 'all',
    footerPagination: 'page-x-of-y',
    footerPosition: 'center',
    createdAt: now,
    updatedAt: now,
  }
}

function seedDefaults(): Letterhead[] {
  const now = new Date().toISOString()
  return DEFAULT_TEMPLATES.map((t) => ({
    ...t,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }))
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadLetterheads(): Letterhead[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const defaults = seedDefaults()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
      return defaults
    }
    return JSON.parse(raw) as Letterhead[]
  } catch {
    return []
  }
}

function saveLetterheads(letterheads: Letterhead[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letterheads))
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ---------------------------------------------------------------------------
// Preview component
// ---------------------------------------------------------------------------

function LetterheadPreview({ letterhead }: { letterhead: Letterhead }) {
  // A4 aspect ratio is 210:297
  const pageW = 340
  const pageH = Math.round(pageW * (297 / 210))

  // Scale margins from mm to preview px (210mm -> pageW px)
  const scale = pageW / 210
  const mt = letterhead.margins.top * scale
  const mr = letterhead.margins.right * scale
  const mb = letterhead.margins.bottom * scale
  const ml = letterhead.margins.left * scale

  const contentW = pageW - ml - mr
  const baseFontPx = letterhead.fontSize * scale * 0.45
  const lineH = letterhead.lineSpacing

  const logoJustify =
    letterhead.headerLogoPosition === 'left'
      ? 'flex-start'
      : letterhead.headerLogoPosition === 'right'
        ? 'flex-end'
        : 'center'

  const footerJustify =
    letterhead.footerPosition === 'left'
      ? 'flex-start'
      : letterhead.footerPosition === 'right'
        ? 'flex-end'
        : 'center'

  return (
    <div className="flex items-start justify-center pt-4">
      <div
        className="bg-white shadow-lg border border-gray-200 relative overflow-hidden"
        style={{
          width: pageW,
          height: pageH,
          fontFamily: letterhead.font,
          fontSize: baseFontPx,
          lineHeight: lineH,
        }}
      >
        {/* Content area */}
        <div
          className="absolute flex flex-col"
          style={{
            top: mt,
            left: ml,
            width: contentW,
            height: pageH - mt - mb,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-1.5 pb-2 border-b border-gray-200 mb-2 shrink-0"
            style={{ justifyContent: logoJustify }}
          >
            <div className="bg-gray-300 rounded flex items-center justify-center text-gray-500"
              style={{ width: baseFontPx * 3.5, height: baseFontPx * 3.5, fontSize: baseFontPx * 0.6 }}
            >
              LOGO
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="bg-gray-400 rounded-sm" style={{ width: baseFontPx * 8, height: baseFontPx * 0.9 }} />
              <div className="bg-gray-300 rounded-sm" style={{ width: baseFontPx * 5, height: baseFontPx * 0.6 }} />
            </div>
          </div>

          {/* Date */}
          <div className="shrink-0 mb-1.5">
            <div className="bg-gray-300 rounded-sm" style={{ width: baseFontPx * 6, height: baseFontPx * 0.7 }} />
          </div>

          {/* Addressee block */}
          <div className="shrink-0 mb-2 flex flex-col gap-0.5">
            <div className="bg-gray-300 rounded-sm" style={{ width: baseFontPx * 9, height: baseFontPx * 0.7 }} />
            <div className="bg-gray-200 rounded-sm" style={{ width: baseFontPx * 7, height: baseFontPx * 0.6 }} />
            <div className="bg-gray-200 rounded-sm" style={{ width: baseFontPx * 8, height: baseFontPx * 0.6 }} />
          </div>

          {/* Reference */}
          <div className="shrink-0 mb-2">
            <div className="bg-gray-400 rounded-sm" style={{ width: baseFontPx * 10, height: baseFontPx * 0.8 }} />
          </div>

          {/* Body text */}
          <div className="flex-1 flex flex-col gap-1 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-sm"
                style={{
                  width: i === 7 ? '60%' : '100%',
                  height: baseFontPx * 0.6,
                }}
              />
            ))}
            <div className="h-2" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`p2-${i}`}
                className="bg-gray-200 rounded-sm"
                style={{
                  width: i === 3 ? '45%' : '100%',
                  height: baseFontPx * 0.6,
                }}
              />
            ))}
          </div>

          {/* Signatory */}
          <div className="shrink-0 mt-auto pt-3 flex flex-col gap-0.5">
            <div className="bg-gray-300 rounded-sm" style={{ width: baseFontPx * 5, height: baseFontPx * 0.7 }} />
            <div className="bg-gray-300 rounded-sm" style={{ width: baseFontPx * 7, height: baseFontPx * 0.7 }} />
            <div className="bg-gray-200 rounded-sm" style={{ width: baseFontPx * 4, height: baseFontPx * 0.6 }} />
          </div>
        </div>

        {/* Footer */}
        {letterhead.footerPagination !== 'none' && (
          <div
            className="absolute bottom-0 left-0 right-0 flex px-4 pb-2 text-gray-400"
            style={{
              justifyContent: footerJustify,
              fontSize: baseFontPx * 0.7,
              paddingLeft: ml,
              paddingRight: mr,
            }}
          >
            {letterhead.footerPagination === 'page-x-of-y' ? 'Page 1 of 1' : 'Page 1'}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Editor panel
// ---------------------------------------------------------------------------

function LetterheadEditor({
  letterhead,
  onChange,
  onSave,
  onCancel,
}: {
  letterhead: Letterhead
  onChange: (updated: Letterhead) => void
  onSave: () => void
  onCancel: () => void
}) {
  const update = useCallback(
    (patch: Partial<Letterhead>) => {
      onChange({ ...letterhead, ...patch, updatedAt: new Date().toISOString() })
    },
    [letterhead, onChange]
  )

  const updateMargin = useCallback(
    (side: keyof Letterhead['margins'], value: number) => {
      update({ margins: { ...letterhead.margins, [side]: value } })
    },
    [letterhead.margins, update]
  )

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-0">
      {/* Settings panel */}
      <div className="w-[380px] shrink-0 overflow-y-auto border-r border-border bg-card p-5 space-y-6">
        {/* Back / title */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={onCancel}>
            <ArrowLeft className="size-4" />
          </Button>
          <h2 className="text-base font-semibold text-foreground">Edit Letterhead</h2>
        </div>

        {/* Name & description */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="tpl-name" className="text-xs text-muted-foreground">
              Letterhead Name
            </Label>
            <Input
              id="tpl-name"
              value={letterhead.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="Letterhead name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tpl-desc" className="text-xs text-muted-foreground">
              Description
            </Label>
            <Textarea
              id="tpl-desc"
              value={letterhead.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="What is this letterhead for?"
              rows={2}
            />
          </div>
        </div>

        <Separator />

        {/* Page setup */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Layout className="size-3.5" />
            Page Setup
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Page Size</Label>
            <Select
              value={letterhead.pageSize}
              onValueChange={(val) => update({ pageSize: val as 'a4' | 'letter' })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">A4 (210 x 297 mm)</SelectItem>
                <SelectItem value="letter">US Letter (216 x 279 mm)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Margins (mm)</Label>
            <div className="grid grid-cols-4 gap-2">
              {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                <div key={side} className="space-y-1">
                  <span className="text-[10px] text-muted-foreground capitalize">{side}</span>
                  <Input
                    type="number"
                    min={5}
                    max={50}
                    value={letterhead.margins[side]}
                    onChange={(e) => updateMargin(side, Number(e.target.value))}
                    className="text-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Typography */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Type className="size-3.5" />
            Typography
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Font Family</Label>
            <Select
              value={letterhead.font}
              onValueChange={(val) => update({ font: val as string })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Calibri">Calibri</SelectItem>
                <SelectItem value="Garamond">Garamond</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Font Size (pt)</Label>
              <Select
                value={String(letterhead.fontSize)}
                onValueChange={(val) => update({ fontSize: Number(val) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 11, 12, 13, 14].map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      {s} pt
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Line Spacing</Label>
              <Select
                value={String(letterhead.lineSpacing)}
                onValueChange={(val) => update({ lineSpacing: Number(val) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['1', '1.15', '1.5', '2'].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <AlignLeft className="size-3.5" />
            Header
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Logo Position</Label>
            <Select
              value={letterhead.headerLogoPosition}
              onValueChange={(val) =>
                update({ headerLogoPosition: val as 'left' | 'center' | 'right' })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Show Logo On</Label>
            <Select
              value={letterhead.headerShowOn}
              onValueChange={(val) =>
                update({ headerShowOn: val as 'all' | 'first' })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All pages</SelectItem>
                <SelectItem value="first">First page only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Settings className="size-3.5" />
            Footer
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Pagination Format</Label>
            <Select
              value={letterhead.footerPagination}
              onValueChange={(val) =>
                update({
                  footerPagination: val as 'page-x-of-y' | 'page-x' | 'none',
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="page-x-of-y">Page X of Y</SelectItem>
                <SelectItem value="page-x">Page X</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Position</Label>
            <Select
              value={letterhead.footerPosition}
              onValueChange={(val) =>
                update({ footerPosition: val as 'left' | 'center' | 'right' })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Save */}
        <div className="flex gap-2 pb-2">
          <Button onClick={onSave} className="flex-1 gap-1.5">
            <Check className="size-3.5" />
            Save Letterhead
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Preview panel */}
      <div className="flex-1 overflow-y-auto bg-muted/40 p-6">
        <div className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">
          Preview
        </div>
        <LetterheadPreview letterhead={letterhead} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Letterhead card
// ---------------------------------------------------------------------------

function LetterheadCard({
  letterhead,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  letterhead: Letterhead
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 flex items-center justify-center size-9 rounded-lg bg-muted text-muted-foreground">
              <FileText className="size-4" />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate">{letterhead.name}</CardTitle>
              <CardDescription className="mt-0.5 line-clamp-1">
                {letterhead.description || 'No description'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon-sm" onClick={onEdit} title="Edit">
              <Edit className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={onDuplicate} title="Duplicate">
              <Copy className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={onDelete} title="Delete">
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardFooter>
        <div className="flex items-center gap-4 text-xs text-muted-foreground w-full">
          <span>{letterhead.font}, {letterhead.fontSize}pt</span>
          <span className="text-border">|</span>
          <span>{letterhead.pageSize === 'a4' ? 'A4' : 'US Letter'}</span>
          <span className="text-border">|</span>
          <span className="ml-auto">Edited {formatDate(letterhead.updatedAt)}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function LetterheadsPage() {
  const [letterheads, setLetterheads] = useState<Letterhead[]>([])
  const [editingLetterhead, setEditingLetterhead] = useState<Letterhead | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setLetterheads(loadLetterheads())
    setLoaded(true)
  }, [])

  // Persist on change (skip initial load)
  useEffect(() => {
    if (loaded) {
      saveLetterheads(letterheads)
    }
  }, [letterheads, loaded])

  const handleCreate = useCallback(() => {
    const t = createDefaultLetterhead()
    setEditingLetterhead(t)
  }, [])

  const handleEdit = useCallback((t: Letterhead) => {
    setEditingLetterhead({ ...t })
  }, [])

  const handleDuplicate = useCallback(
    (t: Letterhead) => {
      const now = new Date().toISOString()
      const dup: Letterhead = {
        ...t,
        id: crypto.randomUUID(),
        name: `${t.name} (Copy)`,
        createdAt: now,
        updatedAt: now,
      }
      setLetterheads((prev) => [...prev, dup])
    },
    []
  )

  const handleDelete = useCallback((id: string) => {
    setLetterheads((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const handleSave = useCallback(() => {
    if (!editingLetterhead) return
    setLetterheads((prev) => {
      const idx = prev.findIndex((t) => t.id === editingLetterhead.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = editingLetterhead
        return next
      }
      return [...prev, editingLetterhead]
    })
    setEditingLetterhead(null)
  }, [editingLetterhead])

  const handleCancel = useCallback(() => {
    setEditingLetterhead(null)
  }, [])

  // ---- Editor view ----
  if (editingLetterhead) {
    return (
      <LetterheadEditor
        letterhead={editingLetterhead}
        onChange={setEditingLetterhead}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  // ---- List view ----
  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]"><div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Letterheads</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage letterheads for notices and correspondence
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-1.5 shrink-0">
          <Plus className="size-3.5" />
          New Letterhead
        </Button>
      </div>

      <Separator />

      {/* Letterhead list */}
      {!loaded ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin" />
        </div>
      ) : letterheads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex items-center justify-center size-12 rounded-xl bg-muted text-muted-foreground mb-3">
            <FileText className="size-5" />
          </div>
          <p className="text-sm font-medium text-foreground">No letterheads yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Create your first letterhead to get started
          </p>
          <Button onClick={handleCreate} variant="outline" className="mt-4 gap-1.5">
            <Plus className="size-3.5" />
            New Letterhead
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {letterheads.map((t) => (
            <LetterheadCard
              key={t.id}
              letterhead={t}
              onEdit={() => handleEdit(t)}
              onDuplicate={() => handleDuplicate(t)}
              onDelete={() => handleDelete(t.id)}
            />
          ))}
        </div>
      )}
    </div></div>
  )
}
