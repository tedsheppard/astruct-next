/**
 * Ported from auswitness/src/components/ui.tsx.
 *
 * These are the actual AusWitness Button/ButtonLink/Card/Container
 * primitives, mechanically adapted for this repo: the AusWitness build maps
 * its design tokens to real Tailwind utilities (`bg-brand`, `text-ink`, …)
 * via a Tailwind v4 `@theme inline` block in globals.css. Registering that
 * block globally here would leak square-corner, no-shadow utilities into
 * every other marketing page, so the same tokens are referenced instead as
 * CSS custom properties via Tailwind's arbitrary-value syntax
 * (`bg-[var(--aw-brand)]`). The token values, class structure, spacing and
 * variant names are otherwise unchanged from the source file.
 */
import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gold'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--aw-brand)] text-white hover:bg-[var(--aw-brand-strong)] disabled:opacity-50',
  secondary:
    'bg-[var(--aw-surface)] text-[var(--aw-ink)] border border-[var(--aw-border-strong)] hover:bg-[var(--aw-surface-muted)] disabled:opacity-50',
  ghost: 'text-[var(--aw-ink-soft)] hover:text-[var(--aw-ink)] hover:bg-[var(--aw-surface-muted)]',
  // On dark navy panels: inverted, white on navy-deep
  gold: 'bg-white text-[var(--aw-navy-deep)] hover:bg-[var(--aw-surface-muted)]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm rounded-none',
  md: 'h-11 px-5 text-[15px] rounded-none',
  lg: 'h-[3.25rem] px-7 text-base rounded-none',
  xl: 'h-14 px-8 text-[17px] rounded-none',
}

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aw-brand)]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed select-none'

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  href,
  ...props
}: ButtonBaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props} />
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-none border border-[var(--aw-border)] bg-[var(--aw-surface)]', className)} {...props} />
}

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8', className)} {...props} />
}
