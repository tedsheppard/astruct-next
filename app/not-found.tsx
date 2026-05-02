import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] px-6">
      <div className="max-w-md text-center">
        <p className="text-sm uppercase tracking-wider text-[#8f8b85]">404</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-[#0f0e0d]"
            style={{ fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 text-[#706d66] leading-relaxed">
          The link may be stale, or the page may have moved. From here you can head back to the marketing site or jump straight into the assistant.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg bg-[#fafaf9] text-[#0f0e0d] border border-[#e5e5e3] hover:bg-[#eae6e0] text-sm font-medium transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/assistant"
            className="px-5 py-2.5 rounded-lg bg-[#0f0e0d] text-[#fafaf9] hover:bg-[#2a2826] text-sm font-medium transition-colors"
          >
            Try the assistant
          </Link>
        </div>
      </div>
    </div>
  )
}
