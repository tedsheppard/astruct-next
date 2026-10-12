import type { Metadata } from 'next'
import { Inter, Manrope, JetBrains_Mono, DM_Serif_Display } from 'next/font/google'
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

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif-display',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://astruct.io'),
  title: 'Astruct: the project brain for Australian construction contracts',
  description:
    'Astruct reads your construction contract, answers with the clause and page, drafts notices on your letterhead and reads Outlook mail for variations, delays and claims.',
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
