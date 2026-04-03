'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex bg-sidebar">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1761287347585-9b4f871820fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwzfHxhYnN0cmFjdCUyMGNvbmNyZXRlJTIwbWluaW1hbGlzdCUyMGFyY2hpdGVjdHVyZSUyMGRldGFpbHxlbnwwfHx8fDE3NzExMzE3MDh8MA&ixlib=rb-4.1.0&q=85')`,
            filter: 'grayscale(100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a]/95 via-[#1a1a1a]/80 to-transparent" />
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Astruct
            </h1>
            <p className="mt-1 text-sm text-white/40">
              Contract Intelligence
            </p>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-light leading-tight text-white">
              Detect risk early.
              <br />
              <span className="accent-gradient-text font-medium">
                Comply automatically.
              </span>
            </h2>
            <p className="mt-6 leading-relaxed text-white/60">
              The operating system for construction contract administration.
              Convert information into required contractual actions.
            </p>
          </div>

          <div className="text-xs text-white/30">
            Trusted by contractors worldwide
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative bg-main-panel rounded-tl-2xl">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-12 text-center">
            <h1 className="text-2xl font-semibold text-main-fg">Astruct</h1>
            <p className="text-sm mt-1 text-main-fg/40">
              Contract Intelligence
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium text-main-fg">
                Create your account
              </h2>
              <p className="text-sm mt-1 text-main-fg/50">
                Start managing contracts intelligently
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-main-fg/60">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-main-fg/60">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-main-fg/60">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 font-medium accent-gradient text-white btn-press"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-main-fg/50 hover:text-main-fg transition-colors"
              >
                Already have an account?{' '}
                <span className="text-main-fg font-medium">Sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
