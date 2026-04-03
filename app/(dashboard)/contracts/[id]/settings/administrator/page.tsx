'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function AdminSettingsPage() {
  const { id: contractId } = useParams()
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    createClient().from('contracts').select('*').eq('id', contractId).single().then(({ data }) => {
      if (data) setForm(data)
      setLoading(false)
    })
  }, [contractId])

  const update = (key: string, val: unknown) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await createClient().from('contracts').update({
      administrator_role: form.administrator_role, administrator_name: form.administrator_name, administrator_address: form.administrator_address,
      updated_at: new Date().toISOString(),
    }).eq('id', contractId)
    if (error) toast.error('Failed to save')
    else toast.success('Saved')
    setSaving(false)
  }

  if (loading) return <div className="space-y-4 animate-pulse"><div className="h-6 w-32 bg-muted rounded" /><div className="h-40 bg-muted rounded-lg" /></div>

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Contract Administrator</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Role</Label>
          <Input value={(form.administrator_role as string) || ''} onChange={e => update('administrator_role', e.target.value)} placeholder="e.g. Superintendent" className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Name</Label>
          <Input value={(form.administrator_name as string) || ''} onChange={e => update('administrator_name', e.target.value)} className="bg-main-panel border-border text-foreground" />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label className="text-xs text-muted-foreground">Address</Label>
          <Input value={(form.administrator_address as string) || ''} onChange={e => update('administrator_address', e.target.value)} className="bg-main-panel border-border text-foreground" />
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={saving} size="sm">{saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}Save</Button>
      </div>
    </div>
  )
}
