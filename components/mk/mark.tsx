import Link from 'next/link'

// The Astruct mark, traced from astruct_logo_only_transparent_*.png, in
// currentColor so it follows the theme.
export function Mark({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'mk-mark'} viewBox="285 353 430 294" aria-hidden="true">
      <path d="M454 353h119l58 101H513L402 647H285Z" fill="currentColor" />
      <path d="M537 497h118l59 102H596l-28 48H451Z" fill="currentColor" />
    </svg>
  )
}

// The wordmark is the brand's own lettering, used as a mask so it takes the
// text colour in light and dark.
export function Wordmark() {
  return <span className="mk-wordmark" role="img" aria-label="Astruct" />
}

export function Brand() {
  return (
    <Link href="/" className="mk-brand" aria-label="Astruct home">
      <Mark />
      <Wordmark />
    </Link>
  )
}
