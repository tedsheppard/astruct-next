import type { Metadata } from 'next'
import Link from 'next/link'
import { HELP_CATEGORIES, categoryOf, getArticles, plainText } from '@/lib/help'
import { HelpSearch, type HelpIndexItem } from '@/components/mk/help-search'
import { IArrow } from '@/components/mk/icons'
import { CONTACT_EMAIL } from '@/components/mk/links'

export const metadata: Metadata = {
  title: 'Help centre',
  description: 'How to use Astruct: your free trial, connecting Outlook, Boolean search, drafting notices, project mail, deadlines, team access, billing and security.',
  alternates: { canonical: '/support' },
}

const START = ['sign-up-and-trial', 'your-first-project', 'connecting-outlook', 'boolean-search']

export default function SupportPage() {
  const articles = getArticles()
  const index: HelpIndexItem[] = articles.map((a) => {
    const cat = categoryOf(a.category)
    return { slug: a.slug, title: a.title, summary: a.summary, category: a.category, categoryTitle: cat.title, c: cat.c, keywords: a.keywords, text: plainText(a.body) }
  })
  const popular = START.map((s) => articles.find((a) => a.slug === s)).filter(Boolean) as typeof articles

  return (
    <>
      <section className="mk-help-hero">
        <div className="mk-field mk-field-help" aria-hidden="true"><i /><i /><i /></div>
        <div className="mk-wrap">
                    <h1 className="mk-h2">How can we help?</h1>
          <p className="mk-lede">Everything you need to set up Astruct, connect your project, and get good answers, searches and drafts.</p>
        </div>
      </section>
      <section className="mk-help-main">
        <div className="mk-wrap">
          <HelpSearch items={index}>
            <div className="mk-help-popular">
              <span className="mk-fine">Start here</span>
              <div>
                {popular.map((a) => (
                  <Link key={a.slug} href={`/support/${a.slug}`}>{a.title}<IArrow /></Link>
                ))}
              </div>
            </div>
            <div className="mk-help-cats">
              {HELP_CATEGORIES.map((c) => {
                const list = articles.filter((a) => a.category === c.id)
                if (!list.length) return null
                return (
                  <section className="mk-help-cat" key={c.id} id={c.id} aria-labelledby={`h-${c.id}`}>
                    <h2 className="mk-help-cat-h" id={`h-${c.id}`}>{c.title}</h2>
                    <p className="mk-help-cat-blurb">{c.blurb}</p>
                    <ul>
                      {list.map((a) => (
                        <li key={a.slug}><Link href={`/support/${a.slug}`}>{a.title}</Link></li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
          </HelpSearch>
          <div className="mk-help-contact">
            <div>
              <h2>Still stuck?</h2>
              <p>Email the Astruct team and we’ll reply within two business days.</p>
            </div>
            <a className="mk-btn mk-btn-ghost" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
        </div>
      </section>
    </>
  )
}
