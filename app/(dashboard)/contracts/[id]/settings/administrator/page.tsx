'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

// Standard administrator roles you'll find in Australian construction
// contracts. Order roughly by frequency. "Other (specify)" lets the user
// type a free-text role that doesn't match any preset.
const ADMIN_ROLES = [
  'Superintendent',
  "Principal's Representative",
  "Contractor's Representative",
  'Project Manager',
  'Engineer',
  'Architect',
  'Contract Administrator',
  'Employer\'s Agent',
  'Programme Director',
  'Program Director',
  'Project Director',
] as const

export default function AdminSettingsPage() {
  const { id: contractId } = useParams()
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [customRole, setCustomRole] = useState('')

  useEffect(() => {
    createClient().from('contracts').select('*').eq('id', contractId).single().then(({ data }) => {
      if (data) {
        setForm(data)
        // If the saved role isn't one of the presets, route it through "Other"
        const r = (data.administrator_role as string) || ''
        if (r && !ADMIN_ROLES.includes(r as typeof ADMIN_ROLES[number])) {
          setCustomRole(r)
        }
      }
      setLoading(false)
    })
  }, [contractId])

  const update = (key: string, val: unknown) => setForm(prev => ({ ...prev, [key]: val }))

  const currentRole = (form.administrator_role as string) || ''
  const isCustom = !!currentRole && !ADMIN_ROLES.includes(currentRole as typeof ADMIN_ROLES[number])
  const selectValue = isCustom ? '__custom__' : currentRole

  const handleRoleChange = (value: string | null) => {
    if (!value) return
    if (value === '__custom__') {
      // Switch to custom mode, clear the saved role until they type
      update('administrator_role', customRole)
    } else {
      update('administrator_role', value)
    }
  }

  const handleCustomChange = (value: string) => {
    setCustomRole(value)
    update('administrator_role', value)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await createClient().from('contracts').update({
      administrator_role: form.administrator_role,
      administrator_name: form.administrator_name,
      administrator_address: form.administrator_address,
      updated_at: new Date().toISOString(),
    }).eq('id', contractId)
    if (error) toast.error('Failed to save')
    else toast.success('Saved')
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-40 bg-muted rounded-lg" />
      </div>
    )
  }

  const noAdministrator = !((form.administrator_role as string) || '').trim()
    && !((form.administrator_name as string) || '').trim()
    && !((form.administrator_address as string) || '').trim()

  const clearAdministrator = () => {
    setForm(prev => ({
      ...prev,
      administrator_role: null,
      administrator_name: null,
      administrator_address: null,
    }))
    setCustomRole('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Contract Administrator</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Most head contracts have one (Superintendent, Principal&apos;s Rep, etc).
            Many small subcontracts don&apos;t — leave it empty if so.
          </p>
        </div>
        {!noAdministrator && (
          <Button onClick={clearAdministrator} variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            Set to none
          </Button>
        )}
      </div>

      {noAdministrator ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground space-y-3">
          <p>No contract administrator on this project.</p>
          <Button
            onClick={() => update('administrator_role', 'Superintendent')}
            variant="outline"
            size="sm"
          >
            Add an administrator
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Role</Label>
            <Select value={selectValue} onValueChange={handleRoleChange}>
              <SelectTrigger className="bg-main-panel border-border text-foreground">
                <SelectValue placeholder="Select a role">
                  {() => isCustom ? (customRole || 'Other (specify)') : (currentRole || 'Select a role')}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ADMIN_ROLES.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
                <SelectItem value="__custom__">Other (specify)…</SelectItem>
              </SelectContent>
            </Select>
            {isCustom && (
              <Input
                value={customRole}
                onChange={e => handleCustomChange(e.target.value)}
                placeholder="Type the role as it appears in the contract"
                className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground mt-2"
              />
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input
              value={(form.administrator_name as string) || ''}
              onChange={e => update('administrator_name', e.target.value)}
              className="bg-main-panel border-border text-foreground"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-xs text-muted-foreground">Address</Label>
            <Input
              value={(form.administrator_address as string) || ''}
              onChange={e => update('administrator_address', e.target.value)}
              className="bg-main-panel border-border text-foreground"
            />
          </div>
        </div>
      )}

      <div className="pt-4">
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}Save
        </Button>
      </div>
    </div>
  )
}
