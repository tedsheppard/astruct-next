import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  convertMillimetersToTwip,
} from 'docx'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, metadata, title } = await request.json()

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
    const children: Paragraph[] = []

    // Letterhead
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

    // Parse markdown content into paragraphs
    const lines = content.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()

      if (!trimmed) {
        children.push(new Paragraph({ spacing: { after: 120 } }))
        continue
      }

      // Headings — check from most # to least
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
      } else if (trimmed.startsWith('---')) {
        children.push(
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
            spacing: { before: 200, after: 200 },
          })
        )
      } else if (trimmed.match(/^[-*]\s+/)) {
        // Bullet list item
        const text = trimmed.replace(/^[-*]\s+/, '')
        children.push(
          new Paragraph({
            children: parseInline(text),
            bullet: { level: 0 },
            spacing: { after: 60 },
          })
        )
      } else if (trimmed.match(/^\d+\.\s+/)) {
        // Numbered list item
        const text = trimmed.replace(/^\d+\.\s+/, '')
        children.push(
          new Paragraph({
            children: parseInline(text),
            numbering: { reference: 'default-numbering', level: 0 },
            spacing: { after: 60 },
          })
        )
      } else {
        // Regular paragraph
        children.push(
          new Paragraph({
            children: parseInline(trimmed),
            spacing: { after: 120 },
          })
        )
      }
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
