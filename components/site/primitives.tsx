import Link from 'next/link'
import { cn } from '@/lib/utils'

/* Layout ------------------------------------------------------------------ */

export function Container({ wide, className, children }: { wide?: boolean; className?: string; children: React.ReactNode }) {
  return <div className={cn(wide ? 'site-container-wide' : 'site-container', className)}>{children}</div>
}

export function Section({
  tone = 'white',
  className,
  children,
  id,
}: {
  tone?: 'white' | 'paper' | 'ink'
  className?: string
  children: React.ReactNode
  id?: string
}) {
  const bg =
    tone === 'paper' ? 'bg-[var(--site-paper)]' : tone === 'ink' ? 'bg-[var(--site-ink)] text-white' : 'bg-white'
  return (
    <section id={id} className={cn('site-section', bg, className)}>
      {children}
    </section>
  )
}

/* Typography -------------------------------------------------------------- */

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('site-eyebrow', className)}>{children}</p>
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  tone = 'light',
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  intro?: React.ReactNode
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}) {
  return (
    <div className={cn(align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl', className)}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h2 className={cn('text-[32px] sm:text-[40px] font-bold', tone === 'dark' ? 'text-white' : 'text-[var(--site-text)]')}>
        {title}
      </h2>
      {intro && (
        <p className={cn('mt-4 text-[17px] leading-relaxed', tone === 'dark' ? 'text-white/70' : 'text-[var(--site-body)]')}>
          {intro}
        </p>
      )}
    </div>
  )
}

/* Atoms ------------------------------------------------------------------- */

export function Pill({ children, tint, className }: { children: React.ReactNode; tint?: boolean; className?: string }) {
  return <span className={cn('site-pill', tint && 'site-pill-tint', className)}>{children}</span>
}

type BtnVariant = 'primary' | 'dark' | 'ghost' | 'on-dark'
type BtnSize = 'sm' | 'md' | 'lg'

export function Button({
  href,
  variant = 'primary',
  size = 'md',
  external,
  className,
  children,
}: {
  href: string
  variant?: BtnVariant
  size?: BtnSize
  external?: boolean
  className?: string
  children: React.ReactNode
}) {
  const classes = cn(
    'site-btn',
    variant === 'primary' && 'site-btn-primary',
    variant === 'dark' && 'site-btn-dark',
    variant === 'ghost' && 'site-btn-ghost',
    variant === 'on-dark' && 'site-btn-on-dark',
    size === 'sm' && 'site-btn-sm',
    size === 'lg' && 'site-btn-lg',
    className,
  )
  if (external) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

/* Compliance tick row ----------------------------------------------------- */

export function CheckItem({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full"
        style={{ background: 'rgba(18,160,106,.14)' }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.5l2.2 2.2L9.5 3.8" stroke="#12a06a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={cn('text-[15px] leading-relaxed', tone === 'dark' ? 'text-white/80' : 'text-[var(--site-body)]')}>
        {children}
      </span>
    </li>
  )
}
