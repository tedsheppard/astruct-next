'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { User, Building2, Save, Image, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme'

interface Profile {
  id: string
  name: string | null
  email: string | null
  role: string | null
  company_name: string | null
  company_abn: string | null
  company_address: string | null
  company_phone: string | null
  company_logo_url: string | null
  signatory_name: string | null
  signatory_title: string | null
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState('')
  const [form, setForm] = useState({
    name: '',
    company_name: '',
    company_abn: '',
    company_address: '',
    company_phone: '',
    company_logo_url: '',
    signatory_name: '',
    signatory_title: '',
  })

  useEffect(() => {
    const supabase = createClient()

    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      setEmail(user.email ?? '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setForm({
          name: profile.name ?? '',
          company_name: profile.company_name ?? '',
          company_abn: profile.company_abn ?? '',
          company_address: profile.company_address ?? '',
          company_phone: profile.company_phone ?? '',
          company_logo_url: profile.company_logo_url ?? '',
          signatory_name: profile.signatory_name ?? '',
          signatory_title: profile.signatory_title ?? '',
        })
      }

      setLoading(false)
    }

    loadProfile()
  }, [])

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({
          name: form.name || null,
          company_name: form.company_name || null,
          company_abn: form.company_abn || null,
          company_address: form.company_address || null,
          company_phone: form.company_phone || null,
          signatory_name: form.signatory_name || null,
          signatory_title: form.signatory_title || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Settings saved successfully')
    } catch (err) {
      toast.error('Failed to save settings')
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-7 w-32 bg-muted rounded" />
          <div className="h-48 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm mt-1 text-muted-foreground">
          Manage your profile and company details.
        </p>
      </div>

      {/* Profile Section */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-foreground text-base">
            <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-muted-foreground">
              Name
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Your full name"
              className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              disabled
              className="bg-main-panel border-border text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email is managed through your authentication provider.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Company & Letterhead Section */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-foreground text-base">
            <Building2 className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            Company &amp; Letterhead
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company_name" className="text-sm text-muted-foreground">
              Company Name
            </Label>
            <Input
              id="company_name"
              value={form.company_name}
              onChange={(e) => handleChange('company_name', e.target.value)}
              placeholder="Acme Construction Pty Ltd"
              className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_abn" className="text-sm text-muted-foreground">
                ABN
              </Label>
              <Input
                id="company_abn"
                value={form.company_abn}
                onChange={(e) => handleChange('company_abn', e.target.value)}
                placeholder="12 345 678 901"
                className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_phone" className="text-sm text-muted-foreground">
                Phone
              </Label>
              <Input
                id="company_phone"
                value={form.company_phone}
                onChange={(e) => handleChange('company_phone', e.target.value)}
                placeholder="+61 2 9000 0000"
                className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_address" className="text-sm text-muted-foreground">
              Address
            </Label>
            <Input
              id="company_address"
              value={form.company_address}
              onChange={(e) => handleChange('company_address', e.target.value)}
              placeholder="123 George St, Sydney NSW 2000"
              className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
            />
          </div>

          <Separator className="bg-border" />

          {/* Logo */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Company Logo</Label>
            {form.company_logo_url ? (
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-main-panel border border-border flex items-center justify-center overflow-hidden">
                  <img
                    src={form.company_logo_url}
                    alt="Company logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Logo upload coming soon. Current logo is set.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-lg border border-dashed border-border bg-main-panel">
                <Image className="h-8 w-8 text-muted-foreground/30" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-muted-foreground">No logo set</p>
                  <p className="text-xs text-muted-foreground">
                    Logo upload coming soon
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-border" />

          {/* Signatory */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Signatory Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="signatory_name"
                  className="text-sm text-muted-foreground"
                >
                  Signatory Name
                </Label>
                <Input
                  id="signatory_name"
                  value={form.signatory_name}
                  onChange={(e) =>
                    handleChange('signatory_name', e.target.value)
                  }
                  placeholder="John Smith"
                  className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="signatory_title"
                  className="text-sm text-muted-foreground"
                >
                  Signatory Title
                </Label>
                <Input
                  id="signatory_title"
                  value={form.signatory_title}
                  onChange={(e) =>
                    handleChange('signatory_title', e.target.value)
                  }
                  placeholder="Project Manager"
                  className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-foreground text-base">
            {theme === 'dark' ? <Moon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /> : <Sun className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />}
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Dark mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">Switch between light and dark themes</p>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-foreground' : 'bg-border'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-foreground text-background hover:bg-foreground/90 btn-press"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      </div>
    </div>
  )
}
