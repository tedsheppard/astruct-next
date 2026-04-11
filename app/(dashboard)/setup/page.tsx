'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function SetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    company_name: '',
    company_role: '',
    company_abn: '',
    company_address: '',
    referral_source: '',
  })

  useEffect(() => {
    const supabase = createClient()
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('name, company_name, company_role, onboarding_completed')
        .eq('id', user.id)
        .single()

      // If already completed, redirect to dashboard
      if (profile?.onboarding_completed) {
        router.push('/contracts')
        return
      }

      setForm(prev => ({
        ...prev,
        name: profile?.name || user.user_metadata?.name || '',
      }))
      setLoading(false)
    }
    loadProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company_name.trim() || !form.company_role) {
      toast.error('Company name and role are required')
      return
    }

    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        name: form.name || null,
        company_name: form.company_name,
        company_role: form.company_role,
        company_abn: form.company_abn || null,
        company_address: form.company_address || null,
        referral_source: form.referral_source || null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      toast.error('Failed to save')
      setSaving(false)
      return
    }

    router.push('/contracts?walkthrough=1')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="w-5 h-5 border-2 border-[#e5e5e3] border-t-[#0f0e0d] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-6" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#0f0e0d]">Welcome to Astruct</h1>
          <p className="text-sm text-[#706d66] mt-2">Tell us a bit about yourself to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#e5e5e3] p-8 space-y-5">
          <div>
            <label className="block text-xs text-[#8f8b85] mb-1.5">Your name</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full h-11 px-3.5 rounded-md border border-[#e5e5e3] bg-[#fafaf9] text-sm text-[#0f0e0d] placeholder:text-[#adaba5] focus:outline-none focus:border-[#0f0e0d] transition-colors"
              placeholder="Full name" />
          </div>

          <div>
            <label className="block text-xs text-[#8f8b85] mb-1.5">Company name *</label>
            <input required value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))}
              className="w-full h-11 px-3.5 rounded-md border border-[#e5e5e3] bg-[#fafaf9] text-sm text-[#0f0e0d] placeholder:text-[#adaba5] focus:outline-none focus:border-[#0f0e0d] transition-colors"
              placeholder="e.g. Apex Construction Pty Ltd" />
          </div>

          <div>
            <label className="block text-xs text-[#8f8b85] mb-1.5">Your role *</label>
            <select required value={form.company_role} onChange={e => setForm(p => ({ ...p, company_role: e.target.value }))}
              className="w-full h-11 px-3.5 rounded-md border border-[#e5e5e3] bg-[#fafaf9] text-sm text-[#0f0e0d] focus:outline-none focus:border-[#0f0e0d] transition-colors">
              <option value="">Select your role</option>
              <option value="Contract Administrator">Contract Administrator</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Commercial Manager">Commercial Manager</option>
              <option value="Superintendent's Rep">Superintendent&apos;s Rep</option>
              <option value="Director/Owner">Director / Owner</option>
              <option value="Lawyer">Lawyer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#8f8b85] mb-1.5">Company ABN (optional)</label>
            <input value={form.company_abn} onChange={e => setForm(p => ({ ...p, company_abn: e.target.value }))}
              className="w-full h-11 px-3.5 rounded-md border border-[#e5e5e3] bg-[#fafaf9] text-sm text-[#0f0e0d] placeholder:text-[#adaba5] focus:outline-none focus:border-[#0f0e0d] transition-colors"
              placeholder="12 345 678 901" />
          </div>

          <div>
            <label className="block text-xs text-[#8f8b85] mb-1.5">Company address (optional)</label>
            <input value={form.company_address} onChange={e => setForm(p => ({ ...p, company_address: e.target.value }))}
              className="w-full h-11 px-3.5 rounded-md border border-[#e5e5e3] bg-[#fafaf9] text-sm text-[#0f0e0d] placeholder:text-[#adaba5] focus:outline-none focus:border-[#0f0e0d] transition-colors"
              placeholder="123 George St, Sydney NSW 2000" />
          </div>

          <div>
            <label className="block text-xs text-[#8f8b85] mb-1.5">How did you hear about Astruct? (optional)</label>
            <select value={form.referral_source} onChange={e => setForm(p => ({ ...p, referral_source: e.target.value }))}
              className="w-full h-11 px-3.5 rounded-md border border-[#e5e5e3] bg-[#fafaf9] text-sm text-[#0f0e0d] focus:outline-none focus:border-[#0f0e0d] transition-colors">
              <option value="">Select</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Google">Google</option>
              <option value="Word of mouth">Word of mouth</option>
              <option value="Industry event">Industry event</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit" disabled={saving}
            className="w-full h-11 rounded-md bg-[#0f0e0d] text-[#fafaf9] text-sm font-medium hover:bg-[#33312c] transition-colors disabled:opacity-60 flex items-center justify-center mt-2">
            {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
