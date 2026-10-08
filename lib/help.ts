// The help centre at astruct.io/support. Articles are Markdown files in
// content/help/*.md with a small front matter block:
//
//   ---
//   title: Boolean search syntax
//   summary: One line shown in the index and in search results.
//   category: asking
//   order: 2
//   keywords: and or not near proximity wildcard
//   ---
//
// Everything is read at build time (the pages are statically generated), so
// the help video slot can check whether /media/help/<slug>.mp4 exists and
// leave itself out when it does not.
import fs from 'node:fs'
import path from 'node:path'

export type HelpCategory = { id: string; title: string; blurb: string; c: 'teal' | 'blue' | 'violet' | 'amber' | 'rose' | 'ink' }

export const HELP_CATEGORIES: HelpCategory[] = [
  { id: 'getting-started', title: 'Getting started', blurb: 'Sign up, your trial, your first project and your documents.', c: 'teal' },
  { id: 'connecting', title: 'Connecting', blurb: 'Outlook, SharePoint and OneDrive, admin consent, Gmail and the demo mailbox.', c: 'blue' },
  { id: 'asking', title: 'Asking and searching', blurb: 'Good questions, Boolean and plain-English search, page references.', c: 'teal' },
  { id: 'drafting', title: 'Drafting', blurb: 'Letters, emails, variation notices, notices of delay and EOT claims.', c: 'violet' },
  { id: 'agent', title: 'The agent', blurb: 'How Astruct watches mail, flags directions and delays, and works out deadlines.', c: 'amber' },
  { id: 'team', title: 'Team and access', blurb: 'Members, roles and who can search which mailbox.', c: 'rose' },
  { id: 'billing', title: 'Billing', blurb: 'The trial, your card, per-project pricing and cancelling.', c: 'ink' },
  { id: 'security', title: 'Security and privacy', blurb: 'Where your data lives and how models use it.', c: 'ink' },
]

export type HelpArticle = {
  slug: string
  title: string
  summary: string
  category: string
  order: number
  keywords: string
  body: string
}

const DIR = path.join(process.cwd(), 'content', 'help')

function parse(slug: string, raw: string): HelpArticle {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  const meta: Record<string, string> = {}
  let body = raw
  if (m) {
    for (const line of m[1].split('\n')) {
      const i = line.indexOf(':')
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
    }
    body = m[2]
  }
  return {
    slug,
    title: meta.title || slug,
    summary: meta.summary || '',
    category: meta.category || 'getting-started',
    order: Number(meta.order || 99),
    keywords: meta.keywords || '',
    body: body.trim(),
  }
}

let cache: HelpArticle[] | null = null

export function getArticles(): HelpArticle[] {
  if (cache) return cache
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.md')) : []
  const cats = HELP_CATEGORIES.map((c) => c.id)
  cache = files
    .map((f) => parse(f.replace(/\.md$/, ''), fs.readFileSync(path.join(DIR, f), 'utf8')))
    .sort((a, b) => cats.indexOf(a.category) - cats.indexOf(b.category) || a.order - b.order || a.title.localeCompare(b.title))
  return cache
}

export function getArticle(slug: string): HelpArticle | undefined {
  return getArticles().find((a) => a.slug === slug)
}

export function categoryOf(id: string): HelpCategory {
  return HELP_CATEGORIES.find((c) => c.id === id) || HELP_CATEGORIES[0]
}

/** The article's help video, if its file has been delivered to public/media/help. */
export function helpVideo(slug: string): { src: string; poster: string | null } | null {
  const dir = path.join(process.cwd(), 'public', 'media', 'help')
  if (!fs.existsSync(path.join(dir, `${slug}.mp4`))) return null
  const poster = fs.existsSync(path.join(dir, `${slug}.jpg`)) ? `/media/help/${slug}.jpg` : null
  return { src: `/media/help/${slug}.mp4`, poster }
}

/** Plain text for the search index: the body without Markdown punctuation. */
export function plainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
