import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { HELP_CATEGORIES, categoryOf, getArticle, getArticles, helpVideo } from '@/lib/help'
import { IArrow, IChevron } from '@/components/mk/icons'
import { CONTACT_EMAIL } from '@/components/mk/links'

export const dynamicParams = false

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const a = getArticle(slug)
  if (!a) return {}
  return {
    title: `${a.title} · Help`,
    description: a.summary,
    alternates: { canonical: `/support/${a.slug}` },
  }
}

function MdLink({ href = '', children }: { href?: string; children?: React.ReactNode }) {
  if (href.startsWith('/')) return <Link href={href}>{children}</Link>
  if (href.startsWith('mailto:')) return <a href={href}>{children}</a>
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}

export default async function HelpArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = getArticle(slug)
  if (!a) notFound()
  const all = getArticles()
  const cat = categoryOf(a.category)
  const i = all.findIndex((x) => x.slug === a.slug)
  const prev = i > 0 ? all[i - 1] : null
  const next = i < all.length - 1 ? all[i + 1] : null
  const video = helpVideo(a.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: a.title,
    description: a.summary,
    inLanguage: 'en-AU',
    publisher: { '@type': 'Organization', name: 'Astruct', url: 'https://astruct.io' },
  }

  return (
    <div className="mk-wrap mk-help-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <aside className="mk-help-side" aria-label="Help articles">
        <Link href="/support" className="mk-help-side-home">Help centre</Link>
        {HELP_CATEGORIES.map((c) => {
          const list = all.filter((x) => x.category === c.id)
          if (!list.length) return null
          const open = c.id === a.category
          return (
            <details key={c.id} open={open}>
              <summary>{c.title}<IChevron /></summary>
              <ul>
                {list.map((x) => (
                  <li key={x.slug}>
                    <Link href={`/support/${x.slug}`} aria-current={x.slug === a.slug ? 'page' : undefined}>{x.title}</Link>
                  </li>
                ))}
              </ul>
            </details>
          )
        })}
      </aside>
      <article className="mk-help-article">
        <nav className="mk-crumbs" aria-label="Breadcrumb">
          <Link href="/support">Help centre</Link><IChevron /><Link href={`/support#${cat.id}`}>{cat.title}</Link>
        </nav>
        <h1 className="mk-help-h1">{a.title}</h1>
        <p className="mk-help-summary">{a.summary}</p>
        {video && (
          <div className="mk-help-video">
            <video controls playsInline preload="none" poster={video.poster ?? undefined} src={video.src} aria-label={`Video: ${a.title}`} />
          </div>
        )}
        <div className="mk-help-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: MdLink,
              table: ({ children }) => <div className="mk-help-table"><table>{children}</table></div>,
            }}
          >
            {a.body}
          </ReactMarkdown>
        </div>
        <div className="mk-help-foot">
          <p>Didn’t find what you needed? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
          <div className="mk-help-pn">
            {prev ? <Link href={`/support/${prev.slug}`} className="is-prev"><small>Previous</small>{prev.title}</Link> : <span />}
            {next ? <Link href={`/support/${next.slug}`} className="is-next"><small>Next</small>{next.title}<IArrow /></Link> : <span />}
          </div>
        </div>
      </article>
    </div>
  )
}
