import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  convertMillimetersToTwip,
} from 'docx'

export const dynamic = 'force-dynamic'

interface LetterheadInput {
  logoDataUrl?: string
  logoWidthMm?: number
  headerLogoPosition?: 'left' | 'center' | 'right'
}

// Decode a data URL (data:image/png;base64,...) into a Buffer + mime type.
// Returns null if the input isn't a recognisable image data URL.
function decodeDataUrl(dataUrl: string): { buffer: Buffer; mime: string } | null {
  const match = /^data:(image\/(?:png|jpe?g|webp|svg\+xml));base64,(.+)$/i.exec(dataUrl)
  if (!match) return null
  try {
    return { mime: match[1].toLowerCase(), buffer: Buffer.from(match[2], 'base64') }
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, metadata, title, letterhead } = (await request.json()) as {
      content?: string
      metadata?: unknown
      title?: string
      letterhead?: LetterheadInput | null
    }

    if (!content) {
      return Response.json({ error: 'content is required' }, { status: 400 })
    }

    // Load user profile for letterhead
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_name, company_abn, company_address, company_phone, signatory_name, signatory_title')
      .eq('id', user.id)
      .single()

    // Build document sections
    const children: (Paragraph | Table)[] = []

    // ─── Logo (from user-uploaded letterhead) ─────────────────────────────
    // The image lives in browser localStorage as a base64 data URL; decode it
    // server-side and embed it via docx ImageRun. Fails silently if the data
    // URL is malformed — the rest of the document still renders.
    if (letterhead?.logoDataUrl) {
      const decoded = decodeDataUrl(letterhead.logoDataUrl)
      // ImageRun expects pixels; convert mm → px at 96 DPI (1mm = 3.7795px).
      const widthMm = Math.max(10, Math.min(120, letterhead.logoWidthMm || 40))
      const widthPx = Math.round(widthMm * 3.7795)
      // Aspect ratio is unknown server-side — assume 4:3 which is a safe
      // default for company logos. Users can tune the width slider if needed.
      const heightPx = Math.round((widthPx * 3) / 4)
      if (decoded && decoded.mime !== 'image/svg+xml') {
        // ImageRun.type accepts 'png' | 'jpg' | 'gif' | 'bmp'. Map our mime.
        const imgType: 'png' | 'jpg' = decoded.mime === 'image/png' ? 'png' : 'jpg'
        const align = letterhead.headerLogoPosition === 'right'
          ? AlignmentType.RIGHT
          : letterhead.headerLogoPosition === 'center'
            ? AlignmentType.CENTER
            : AlignmentType.LEFT
        children.push(
          new Paragraph({
            alignment: align,
            children: [
              new ImageRun({
                data: decoded.buffer,
                transformation: { width: widthPx, height: heightPx },
                type: imgType,
              }),
            ],
          })
        )
      }
    }

    // Letterhead (text from profile)
    if (profile?.company_name) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: profile.company_name, bold: true, size: 28, font: 'Arial' }),
          ],
          alignment: AlignmentType.LEFT,
        })
      )
      if (profile.company_abn) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `ABN: ${profile.company_abn}`, size: 18, font: 'Arial', color: '666666' }),
            ],
          })
        )
      }
      if (profile.company_address) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: profile.company_address, size: 18, font: 'Arial', color: '666666' }),
            ],
          })
        )
      }
      if (profile.company_phone) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `Phone: ${profile.company_phone}`, size: 18, font: 'Arial', color: '666666' }),
            ],
          })
        )
      }
      // Horizontal rule
      children.push(
        new Paragraph({
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          },
          spacing: { after: 300 },
        })
      )
    }

    // Parse inline markdown (bold, italic) into TextRuns
    function parseInline(text: string): TextRun[] {
      const runs: TextRun[] = []
      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)
      for (const part of parts) {
        if (part.startsWith('**') && part.endsWith('**')) {
          runs.push(new TextRun({ text: part.slice(2, -2), bold: true, size: 22, font: 'Arial' }))
        } else if (part.startsWith('*') && part.endsWith('*')) {
          runs.push(new TextRun({ text: part.slice(1, -1), italics: true, size: 22, font: 'Arial' }))
        } else if (part) {
          runs.push(new TextRun({ text: part, size: 22, font: 'Arial' }))
        }
      }
      return runs
    }

    // Parse markdown tables into docx Table objects
    function parseMarkdownTable(tableLines: string[]): Table {
      const rows = tableLines
        .filter(l => !l.match(/^\|[\s-:|]+\|$/)) // skip separator rows
        .map(l => l.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()))

      const isHeader = (idx: number) => idx === 0
      const colCount = rows[0]?.length || 1

      return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: rows.map((cells, rowIdx) =>
          new TableRow({
            children: cells.map(cell =>
              new TableCell({
                width: { size: Math.floor(100 / colCount), type: WidthType.PERCENTAGE },
                children: [new Paragraph({
                  children: parseInline(cell),
                  spacing: { before: 40, after: 40 },
                })],
                shading: isHeader(rowIdx) ? { fill: 'F2F2F2' } : undefined,
              })
            ),
          })
        ),
      })
    }

    // Parse markdown content into paragraphs
    const lines = content.split('\n')
    let i = 0
    while (i < lines.length) {
      const trimmed = lines[i].trim()

      if (!trimmed) {
        children.push(new Paragraph({ spacing: { after: 120 } }))
        i++
        continue
      }

      // Detect markdown table (starts with |)
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const tableLines: string[] = []
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i].trim())
          i++
        }
        if (tableLines.length >= 2) {
          children.push(parseMarkdownTable(tableLines))
          children.push(new Paragraph({ spacing: { after: 120 } }))
        }
        continue
      }

      // Headings
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
      if (headingMatch) {
        const level = headingMatch[1].length
        const text = headingMatch[2]
        const sizes: Record<number, number> = { 1: 28, 2: 26, 3: 24, 4: 22, 5: 22, 6: 20 }
        const headingLevels: Record<number, typeof HeadingLevel[keyof typeof HeadingLevel]> = {
          1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3,
          4: HeadingLevel.HEADING_4, 5: HeadingLevel.HEADING_5, 6: HeadingLevel.HEADING_6,
        }
        children.push(
          new Paragraph({
            children: [new TextRun({ text, bold: true, size: sizes[level] || 22, font: 'Arial' })],
            heading: headingLevels[level] || HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          })
        )
      } else if (trimmed.match(/^---+$/) || trimmed.match(/^\*\*\*+$/) || trimmed.match(/^___+$/)) {
        children.push(
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
            spacing: { before: 200, after: 200 },
          })
        )
      } else if (trimmed.match(/^[-*]\s+/)) {
        const text = trimmed.replace(/^[-*]\s+/, '')
        children.push(
          new Paragraph({
            children: parseInline(text),
            bullet: { level: 0 },
            spacing: { after: 60 },
          })
        )
      } else if (trimmed.match(/^\d+\.\s+/)) {
        const text = trimmed.replace(/^\d+\.\s+/, '')
        children.push(
          new Paragraph({
            children: parseInline(text),
            numbering: { reference: 'default-numbering', level: 0 },
            spacing: { after: 60 },
          })
        )
      } else {
        children.push(
          new Paragraph({
            children: parseInline(trimmed),
            spacing: { after: 120 },
          })
        )
      }
      i++
    }

    // Signatory block
    if (profile?.signatory_name) {
      children.push(new Paragraph({ spacing: { after: 400 } }))
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'Yours faithfully,', size: 22, font: 'Arial' })],
          spacing: { after: 600 },
        })
      )
      children.push(
        new Paragraph({
          children: [new TextRun({ text: '______________________________', size: 22, font: 'Arial', color: 'AAAAAA' })],
        })
      )
      children.push(
        new Paragraph({
          children: [new TextRun({ text: profile.signatory_name, bold: true, size: 22, font: 'Arial' })],
        })
      )
      if (profile.signatory_title) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: profile.signatory_title, size: 20, font: 'Arial', color: '666666' })],
          })
        )
      }
      if (profile.company_name) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: profile.company_name, size: 20, font: 'Arial', color: '666666' })],
          })
        )
      }
    }

    const doc = new Document({
      numbering: {
        config: [
          {
            reference: 'default-numbering',
            levels: [
              {
                level: 0,
                format: 'decimal' as const,
                text: '%1.',
                alignment: AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: { left: convertMillimetersToTwip(10), hanging: convertMillimetersToTwip(5) },
                  },
                },
              },
            ],
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertMillimetersToTwip(25),
                right: convertMillimetersToTwip(25),
                bottom: convertMillimetersToTwip(25),
                left: convertMillimetersToTwip(25),
              },
            },
          },
          children,
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)
    const uint8 = new Uint8Array(buffer)

    const filename = (title || 'document').replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_')

    return new Response(uint8, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}.docx"`,
      },
    })
  } catch (error) {
    console.error('DOCX generation error:', error)
    return Response.json({ error: 'Failed to generate document' }, { status: 500 })
  }
}
