import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container, Eyebrow, Button, CheckItem } from '@/components/site/primitives'
import { startFreeHref, DEMO_HREF } from '@/lib/site/brand'

/* Page hero — used on every interior page. */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
  primary,
  primaryLabel = 'Start free',
  tone = 'light',
}: {
  eyebrow?: string
  title: React.ReactNode
  lede?: React.ReactNode
  children?: React.ReactNode
  primary?: 'start' | 'demo' | 'none'
  primaryLabel?: string
  tone?: 'light' | 'paper'
}) {
  return (
    <section className={cn('relative overflow-hidden', tone === 'paper' ? 'bg-[var(--site-paper)]' : 'bg-white')}>
      <div className="site-grid-bg pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]" />
      <Container wide className="relative py-16 sm:py-20">
        <div className="max-w-3xl site-fade">
          {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
          <h1 className="text-[40px] font-bold leading-[1.04] tracking-tight text-[var(--site-text)] sm:text-[52px]">{title}</h1>
          {lede && <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-[var(--site-body)]">{lede}</p>}
          {primary !== 'none' && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primary === 'demo' ? (
                <>
                  <Button href={DEMO_HREF} size="lg">{primaryLabel} <ArrowRight size={18} /></Button>
                  <Button href={startFreeHref()} external variant="ghost" size="lg">Start free</Button>
                </>
              ) : (
                <>
                  <Button href={startFreeHref()} external size="lg">{primaryLabel} <ArrowRight size={18} /></Button>
                  <Button href={DEMO_HREF} variant="ghost" size="lg">Book a demo</Button>
                </>
              )}
            </div>
          )}
          {children}
        </div>
      </Container>
    </section>
  )
}

/* Alternating text + visual split. */
export function Split({
  eyebrow,
  title,
  body,
  points,
  visual,
  reverse,
  tone = 'white',
}: {
  eyebrow?: string
  title: React.ReactNode
  body?: React.ReactNode
  points?: string[]
  visual: React.ReactNode
  reverse?: boolean
  tone?: 'white' | 'paper'
}) {
  return (
    <section className={cn('site-section-sm', tone === 'paper' ? 'bg-[var(--site-paper)]' : 'bg-white')}>
      <Container wide>
        <div className={cn('grid items-center gap-12 lg:grid-cols-2')}>
          <div className={cn(reverse && 'lg:order-2')}>
            {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
            <h2 className="text-[28px] font-bold leading-tight text-[var(--site-text)] sm:text-[34px]">{title}</h2>
            {body && <p className="mt-4 text-[16px] leading-relaxed text-[var(--site-body)]">{body}</p>}
            {points && (
              <ul className="mt-6 space-y-3">
                {points.map((p) => (
                  <CheckItem key={p}>{p}</CheckItem>
                ))}
              </ul>
            )}
          </div>
          <div className={cn(reverse && 'lg:order-1')}>{visual}</div>
        </div>
      </Container>
    </section>
  )
}

/* Numbered / icon feature cards grid. */
export function CardGrid({
  cols = 3,
  items,
}: {
  cols?: 2 | 3
  items: { title: string; body: string; tag?: string }[]
}) {
  return (
    <div className={cn('grid gap-4', cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3')}>
      {items.map((it) => (
        <div key={it.title} className="site-card p-6">
          {it.tag && <span className="font-mono text-[12px] font-semibold text-[var(--site-brand)]">{it.tag}</span>}
          <h3 className={cn('text-[18px] font-bold text-[var(--site-text)]', it.tag && 'mt-3')}>{it.title}</h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--site-body)]">{it.body}</p>
        </div>
      ))}
    </div>
  )
}

/* Final CTA band (light). */
export function CTASection({
  title = "Ready to get your claims right?",
  body = 'Start free on your first project, or book a walkthrough with us.',
}: {
  title?: string
  body?: string
}) {
  return (
    <section className="site-section">
      <Container wide>
        <div className="relative overflow-hidden rounded-3xl bg-[var(--site-ink)] px-8 py-14 text-center sm:px-16">
          <div className="site-grid-bg-dark pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-[30px] font-bold text-white sm:text-[38px]">{title}</h2>
            <p className="mx-auto mt-4 max-w-lg text-[16px] text-white/65">{body}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href={startFreeHref()} external variant="on-dark" size="lg">Start free <ArrowRight size={18} /></Button>
              <Button href={DEMO_HREF} size="lg" className="border border-white/25 bg-transparent text-white hover:bg-white/10">Book a demo</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
