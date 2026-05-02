import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const PAGE_WIDTH = 595.28 // A4 in pts
const PAGE_HEIGHT = 841.89
const MARGIN = 56 // ~20mm
const LINE_HEIGHT = 14
const BODY_SIZE = 11
const HEADING_SIZE = 14
const TITLE_SIZE = 18

function wrap(text: string, font: import('pdf-lib').PDFFont, size: number, maxWidth: number): string[] {
  if (!text) return ['']
  const out: string[] = []
  const paragraphs = text.split('\n')
  for (const para of paragraphs) {
    if (!para) {
      out.push('')
      continue
    }
    const words = para.split(/\s+/)
    let line = ''
    for (const w of words) {
      const candidate = line ? `${line} ${w}` : w
      const width = font.widthOfTextAtSize(candidate, size)
      if (width > maxWidth && line) {
        out.push(line)
        line = w
      } else {
        line = candidate
      }
    }
    if (line) out.push(line)
  }
  return out
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { content, title, metadata } = await request.json()
    if (!content) return Response.json({ error: 'content is required' }, { status: 400 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_name, company_abn, company_address, company_phone, signatory_name, signatory_title')
      .eq('id', user.id)
      .single()

    const pdf = await PDFDocument.create()
    const font = await pdf.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)
    const fontItalic = await pdf.embedFont(StandardFonts.HelveticaOblique)

    let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    let cursorY = PAGE_HEIGHT - MARGIN
    const usableWidth = PAGE_WIDTH - MARGIN * 2

    function ensureSpace(needed: number) {
      if (cursorY - needed < MARGIN) {
        page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
        cursorY = PAGE_HEIGHT - MARGIN
      }
    }

    function drawLine(text: string, opts: { font?: import('pdf-lib').PDFFont; size?: number; gap?: number } = {}) {
      const f = opts.font || font
      const s = opts.size || BODY_SIZE
      ensureSpace(s + 4)
      page.drawText(text, { x: MARGIN, y: cursorY - s, size: s, font: f, color: rgb(0.1, 0.1, 0.1) })
      cursorY -= s + (opts.gap ?? 4)
    }

    function drawWrapped(text: string, opts: { font?: import('pdf-lib').PDFFont; size?: number } = {}) {
      const f = opts.font || font
      const s = opts.size || BODY_SIZE
      const lines = wrap(text, f, s, usableWidth)
      for (const line of lines) {
        ensureSpace(s + 4)
        page.drawText(line, { x: MARGIN, y: cursorY - s, size: s, font: f, color: rgb(0.1, 0.1, 0.1) })
        cursorY -= LINE_HEIGHT
      }
    }

    // Letterhead
    if (profile?.company_name) {
      drawLine(profile.company_name, { font: fontBold, size: HEADING_SIZE, gap: 2 })
      const meta: string[] = []
      if (profile.company_abn) meta.push(`ABN ${profile.company_abn}`)
      if (profile.company_address) meta.push(profile.company_address)
      if (profile.company_phone) meta.push(profile.company_phone)
      if (meta.length) drawLine(meta.join('  ·  '), { size: 9, gap: 12 })
    }

    if (metadata?.date) drawLine(metadata.date, { size: 10, gap: 12 })

    if (title) {
      drawWrapped(title, { font: fontBold, size: TITLE_SIZE })
      cursorY -= 8
    }

    // Strip docx fences and process body
    const cleaned = content
      .replace(/---DOCUMENT_START---|---DOCUMENT_END---/g, '')
      .trim()

    for (const rawPara of cleaned.split(/\n{2,}/)) {
      const para = rawPara.trim()
      if (!para) continue
      if (/^#{1,3}\s/.test(para)) {
        const level = (para.match(/^#+/) || [''])[0].length
        const txt = para.replace(/^#+\s*/, '')
        const size = level === 1 ? TITLE_SIZE : HEADING_SIZE
        ensureSpace(size + 8)
        cursorY -= 4
        drawWrapped(txt, { font: fontBold, size })
        cursorY -= 4
      } else if (/^[*-]\s/.test(para)) {
        for (const line of para.split('\n')) {
          const item = line.replace(/^[*-]\s*/, '')
          drawWrapped(`•  ${item}`)
        }
        cursorY -= 4
      } else if (/^>\s/.test(para)) {
        const quote = para.replace(/^>\s?/gm, '')
        drawWrapped(quote, { font: fontItalic })
        cursorY -= 4
      } else {
        drawWrapped(para.replace(/\*\*(.+?)\*\*/g, '$1'))
        cursorY -= 6
      }
    }

    if (profile?.signatory_name) {
      cursorY -= 24
      drawLine('Yours sincerely,', { gap: 36 })
      drawLine(profile.signatory_name, { font: fontBold, gap: 2 })
      if (profile.signatory_title) drawLine(profile.signatory_title, { size: 10 })
    }

    const bytes = await pdf.save()
    const filename = (title || 'document').replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_')

    return new Response(bytes as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}.pdf"`,
      },
    })
  } catch (err) {
    console.error('[generate-pdf] error', err)
    return Response.json({ error: err instanceof Error ? err.message : 'PDF failed' }, { status: 500 })
  }
}
