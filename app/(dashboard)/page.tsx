'use client'

// This page redirects to the selected contract's Assistant.
// The redirect logic is in layout.tsx useEffect.
// This component renders nothing while the redirect happens.

export default function HomePage() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
      <div className="w-6 h-6 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin" />
    </div>
  )
}
