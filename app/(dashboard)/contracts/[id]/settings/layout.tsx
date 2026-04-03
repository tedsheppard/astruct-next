'use client'

import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'

const SETTINGS_NAV = [
  { label: 'General', slug: '' },
  { label: 'Parties', slug: '/parties' },
  { label: 'Administrator', slug: '/administrator' },
  { label: 'Key Dates', slug: '/dates' },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams()
  const pathname = usePathname()
  const basePath = `/contracts/${id}/settings`

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Settings side nav */}
      <div className="w-44 flex-shrink-0 border-r border-border py-4 px-2.5 overflow-y-auto">
        <div className="space-y-0.5">
          {SETTINGS_NAV.map(item => {
            const href = `${basePath}${item.slug}`
            const isActive = item.slug === ''
              ? pathname === basePath || pathname === basePath + '/'
              : pathname.startsWith(href)
            return (
              <Link
                key={item.slug}
                href={href}
                className={`block px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  isActive
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl">
          {children}
        </div>
      </div>
    </div>
  )
}
