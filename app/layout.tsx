import type { Metadata } from 'next'
import { Inter, Manrope, JetBrains_Mono, DM_Serif_Display, Newsreader } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/lib/theme'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  axes: ['opsz'],
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-heading',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

// The marketing site's headings (astruct.io, 19 Oct 2026).
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  axes: ['opsz'],
})

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif-display',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://astruct.io'),
  title: 'Astruct: AI for Australian construction',
  description:
    'AI for Australian construction. Upload a project’s contract, drawings and correspondence and connect its mailbox. Search it, ask questions with the clause and page given, and draft notices and claims in Word. Astruct knows the Australian standard forms and the security of payment Act in each state.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable} ${dmSerifDisplay.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* The stored theme goes on before first paint, so the server-rendered page never flashes the wrong one. */}
        <script dangerouslySetInnerHTML={{ __html: "try{var t=localStorage.getItem('astruct-theme');if(t==='dark'||t==='light')document.documentElement.classList.add(t)}catch(e){}" }} />
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
