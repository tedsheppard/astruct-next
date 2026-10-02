'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

export type HelpIndexItem = {
  slug: string
  title: string
  summary: string
  category: string
  categoryTitle: string
  c: string
  keywords: string
  text: string
}

function score(it: HelpIndexItem, terms: string[]): number {
  const title = it.title.toLowerCase()
  const kw = it.keywords.toLowerCase()
  const sum = it.summary.toLowerCase()
  const text = it.text.toLowerCase()
  let s = 0
  for (const t of terms) {
    const inTitle = title.includes(t), inKw = kw.includes(t), inSum = sum.includes(t), inText = text.includes(t)
    if (!inTitle && !inKw && !inSum && !inText) return 0
    s += (inTitle ? 8 : 0) + (inKw ? 5 : 0) + (inSum ? 3 : 0) + (inText ? 1 : 0)
  }
  return s
}

function snippet(text: string, terms: string[]): string {
  const low = text.toLowerCase()
  const at = terms.map((t) => low.indexOf(t)).filter((i) => i >= 0).sort((a, b) => a - b)[0]
  if (at === undefined) return ''
  const start = Math.max(0, at - 60)
  const end = Math.min(text.length, at + 120)
  return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '')
}

/** The help centre's search: instant, on the page, over every article's title, keywords and text. */
export function HelpSearch({ items, children }: { items: HelpIndexItem[]; children: React.ReactNode }) {
  const [q, setQ] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (e.key === '/' && el?.tagName !== 'INPUT' && el?.tagName !== 'TEXTAREA') { e.preventDefault(); ref.current?.focus() }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const terms = useMemo(() => q.toLowerCase().split(/\s+/).map((t) => t.replace(/[^\p{L}\p{N}/*"-]/gu, '')).filter((t) => t.length > 1), [q])
  const results = useMemo(() => {
    if (!terms.length) return []
    return items
      .map((it) => ({ it, s: score(it, terms) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
  }, [items, terms])

  return (
    <>
      <div className="mk-help-search">
        <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m10.5 10.5 3.3 3.3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        <input
          ref={ref}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the help centre"
          aria-label="Search the help centre"
          autoComplete="off"
          spellCheck={false}
        />
        {!q && <kbd aria-hidden="true">/</kbd>}
      </div>
      {terms.length > 0 ? (
        <div className="mk-help-results" aria-live="polite">
          <p className="mk-fine">{results.length ? `${results.length} ${results.length === 1 ? 'article' : 'articles'}` : 'No articles match. Try fewer words, or email info@astruct.io.'}</p>
          {results.length > 0 && (
            <ul>
              {results.map(({ it }) => (
                <li key={it.slug}>
                  <Link href={`/support/${it.slug}`}>
                    <small className="mk-help-res-cat">{it.categoryTitle}</small>
                    <b>{it.title}</b>
                    <span>{snippet(it.text, terms) || it.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : children}
    </>
  )
}
