'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Search, ChevronLeft, ChevronRight, Loader2, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PdfClauseViewerProps {
  documentId: string
  documentName: string
  searchText: string
  onClose: () => void
}

export default function PdfClauseViewer({
  documentId,
  documentName,
  searchText,
  onClose,
}: PdfClauseViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const highlightLayerRef = useRef<HTMLDivElement>(null)
  const [pdfDoc, setPdfDoc] = useState<unknown>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.3)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [matchedPage, setMatchedPage] = useState<number | null>(null)
  const renderTaskRef = useRef<unknown>(null)

  // Load PDF
  useEffect(() => {
    let cancelled = false

    async function loadPdf() {
      try {
        setLoading(true)
        setError(null)

        // Dynamic import pdfjs-dist
        const pdfjsLib = await import('pdfjs-dist')

        // Set worker
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
        }

        // Fetch PDF via API
        const response = await fetch(`/api/documents/${documentId}/file`)
        if (!response.ok) throw new Error('Failed to load PDF')
        const blob = await response.blob()
        const arrayBuffer = await blob.arrayBuffer()

        const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        if (cancelled) return

        setPdfDoc(doc)
        setTotalPages(doc.numPages)

        // Search for the text across pages to find the right page
        if (searchText && searchText.length >= 15) {
          const normalizedSearch = searchText.replace(/\s+/g, ' ').toLowerCase().slice(0, 80)
          for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i)
            const textContent = await page.getTextContent()
            const pageText = textContent.items
              .map((item: unknown) => (item as { str?: string }).str || '')
              .join(' ')
              .replace(/\s+/g, ' ')
              .toLowerCase()

            if (pageText.includes(normalizedSearch.slice(0, 40))) {
              setMatchedPage(i)
              setCurrentPage(i)
              break
            }
          }
        }

        setLoading(false)
      } catch (err) {
        if (!cancelled) {
          console.error('[PdfViewer] Load error:', err)
          setError('Could not load PDF. The file may not be available.')
          setLoading(false)
        }
      }
    }

    loadPdf()
    return () => { cancelled = true }
  }, [documentId, searchText])

  // Render current page
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return

    const doc = pdfDoc as { getPage: (n: number) => Promise<{
      getViewport: (opts: { scale: number }) => { width: number; height: number }
      render: (opts: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => { promise: Promise<void> }
      getTextContent: () => Promise<{ items: { str?: string; transform?: number[] }[] }>
    }> }

    try {
      const page = await doc.getPage(currentPage)
      const viewport = page.getViewport({ scale })
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.height = viewport.height
      canvas.width = viewport.width

      // Cancel previous render
      if (renderTaskRef.current) {
        try {
          (renderTaskRef.current as { cancel?: () => void }).cancel?.()
        } catch { /* ignore */ }
      }

      const renderTask = page.render({
        canvasContext: ctx,
        viewport,
      })
      renderTaskRef.current = renderTask
      await renderTask.promise

      // Highlight search text on the canvas
      if (searchText && highlightLayerRef.current && currentPage === matchedPage) {
        const textContent = await page.getTextContent()
        const normalizedSearch = searchText.replace(/\s+/g, ' ').toLowerCase().slice(0, 40)
        highlightLayerRef.current.innerHTML = ''
        highlightLayerRef.current.style.width = `${viewport.width}px`
        highlightLayerRef.current.style.height = `${viewport.height}px`

        // Find text items that contain part of the search
        let accumulated = ''
        for (const item of textContent.items) {
          const str = (item as { str?: string }).str || ''
          accumulated += str + ' '
          const normalizedAccum = accumulated.replace(/\s+/g, ' ').toLowerCase()

          if (normalizedAccum.includes(normalizedSearch)) {
            // Found it - highlight the item's position
            const transform = (item as { transform?: number[] }).transform
            if (transform) {
              const [, , , , x, y] = transform
              const highlight = document.createElement('div')
              highlight.style.position = 'absolute'
              highlight.style.left = `${x * scale}px`
              highlight.style.bottom = `${y * scale}px`
              highlight.style.width = `${Math.min(normalizedSearch.length * 6 * scale, viewport.width - x * scale)}px`
              highlight.style.height = `${14 * scale}px`
              highlight.style.backgroundColor = 'rgba(250, 204, 21, 0.3)'
              highlight.style.border = '1px solid rgba(250, 204, 21, 0.6)'
              highlight.style.borderRadius = '2px'
              highlight.style.pointerEvents = 'none'
              highlightLayerRef.current.appendChild(highlight)
            }
            break
          }
        }
      }
    } catch (err) {
      console.error('[PdfViewer] Render error:', err)
    }
  }, [pdfDoc, currentPage, scale, searchText, matchedPage])

  useEffect(() => {
    renderPage()
  }, [renderPage])

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-foreground truncate">{documentName}</span>
          {matchedPage && (
            <span className="text-xs text-muted-foreground flex-shrink-0">- Page {matchedPage}</span>
          )}
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Search text preview */}
      {searchText && (
        <div className="px-4 py-2 border-b border-border bg-amber-500/5">
          <p className="text-xs text-muted-foreground">Searching for:</p>
          <p className="text-xs text-foreground mt-0.5 italic line-clamp-2">"{searchText}"</p>
        </div>
      )}

      {/* PDF content */}
      <div className="flex-1 overflow-auto bg-[#525659]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading PDF...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <div className="flex justify-center py-4">
            <div className="relative">
              <canvas ref={canvasRef} className="shadow-lg" />
              <div
                ref={highlightLayerRef}
                className="absolute top-0 left-0 pointer-events-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {!loading && !error && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-border flex-shrink-0">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground min-w-[60px] text-center">
              {currentPage} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
              className="h-7 w-7 p-0"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground min-w-[40px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setScale(s => Math.min(3, s + 0.2))}
              className="h-7 w-7 p-0"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>
          {matchedPage && currentPage !== matchedPage && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentPage(matchedPage)}
              className="text-xs text-amber-500 hover:text-amber-400"
            >
              Jump to match
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
