'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Shared layout for the Settings area: Profile + Billing tabs.
 * Both /settings (Profile) and /settings/billing render under this layout
 * so the tab strip stays consistent and the user understands they're
 * still in the same area, not a different page.
 */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const onBilling = pathname.startsWith('/settings/billing')

  const tabClass = (active: boolean) =>
    `px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
      active
        ? 'border-foreground text-foreground'
        : 'border-transparent text-muted-foreground hover:text-foreground'
    }`

  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Manage your profile, company details, and billing.
          </p>
        </div>

        <div className="flex items-center gap-1 border-b border-border -mt-2">
          <Link href="/settings" className={tabClass(!onBilling)}>
            Profile
          </Link>
          <Link href="/settings/billing" className={tabClass(onBilling)}>
            Billing
          </Link>
        </div>

        <div className="pt-2">{children}</div>
      </div>
    </div>
  )
}
