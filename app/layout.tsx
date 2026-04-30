import type { Metadata } from 'next'
import { Inter, Manrope, JetBrains_Mono, DM_Serif_Display } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/lib/theme'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-heading',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif-display',
})

export const metadata: Metadata = {
  title: 'Astruct — AI contract intelligence. Try free, no signup.',
  description:
    'AI contract intelligence for Australian construction. Upload a contract, ask anything, draft notices in seconds — free for your first project, no credit card required.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable} ${dmSerifDisplay.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
