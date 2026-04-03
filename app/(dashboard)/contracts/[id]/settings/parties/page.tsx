'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function PartiesSettingsPage() {
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
      party1_role: form.party1_role, party1_name: form.party1_name, party1_address: form.party1_address,
      party2_role: form.party2_role, party2_name: form.party2_name, party2_address: form.party2_address,
      user_is_party: form.user_is_party,
      updated_at: new Date().toISOString(),
    }).eq('id', contractId)
    if (error) toast.error('Failed to save')
    else toast.success('Saved')
    setSaving(false)
  }

  if (loading) return <div className="space-y-4 animate-pulse"><div className="h-6 w-32 bg-muted rounded" /><div className="h-60 bg-muted rounded-lg" /></div>

  const p1Label = `Party 1${form.party1_role ? ` — ${form.party1_role}` : ''}${form.party1_name ? ` — ${form.party1_name}` : ''}`
  const p2Label = `Party 2${form.party2_role ? ` — ${form.party2_role}` : ''}${form.party2_name ? ` — ${form.party2_name}` : ''}`

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-foreground">Parties</h2>

      {/* Party 1 */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">{p1Label}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Role *</Label>
            <Input value={(form.party1_role as string) || ''} onChange={e => update('party1_role', e.target.value)} placeholder="e.g. Principal, Head Contractor" className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Company / Entity Name *</Label>
            <Input value={(form.party1_name as string) || ''} onChange={e => update('party1_name', e.target.value)} className="bg-main-panel border-border text-foreground" />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-xs text-muted-foreground">Address</Label>
            <Input value={(form.party1_address as string) || ''} onChange={e => update('party1_address', e.target.value)} placeholder="Start typing an address..." className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">ABN / Company Number</Label>
            <Input value={(form.party1_abn as string) || ''} onChange={e => update('party1_abn', e.target.value)} placeholder="e.g. 11 004 282 268" className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Phone</Label>
            <Input value={(form.party1_phone as string) || ''} onChange={e => update('party1_phone', e.target.value)} className="bg-main-panel border-border text-foreground" />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input type="email" value={(form.party1_email as string) || ''} onChange={e => update('party1_email', e.target.value)} className="bg-main-panel border-border text-foreground" />
          </div>
          <div className="sm:col-span-2 border-t border-border pt-3 mt-1">
            <p className="text-xs text-muted-foreground font-medium mb-3">Representative</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Name</Label><Input value={(form.party1_rep_name as string) || ''} onChange={e => update('party1_rep_name', e.target.value)} className="bg-main-panel border-border text-foreground" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Email</Label><Input type="email" value={(form.party1_rep_email as string) || ''} onChange={e => update('party1_rep_email', e.target.value)} className="bg-main-panel border-border text-foreground" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Phone</Label><Input value={(form.party1_rep_phone as string) || ''} onChange={e => update('party1_rep_phone', e.target.value)} className="bg-main-panel border-border text-foreground" /></div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Party 2 */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">{p2Label}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Role *</Label>
            <Input value={(form.party2_role as string) || ''} onChange={e => update('party2_role', e.target.value)} placeholder="e.g. Contractor, Subcontractor" className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Company / Entity Name *</Label>
            <Input value={(form.party2_name as string) || ''} onChange={e => update('party2_name', e.target.value)} className="bg-main-panel border-border text-foreground" />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-xs text-muted-foreground">Address</Label>
            <Input value={(form.party2_address as string) || ''} onChange={e => update('party2_address', e.target.value)} placeholder="Start typing an address..." className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">ABN / Company Number</Label>
            <Input value={(form.party2_abn as string) || ''} onChange={e => update('party2_abn', e.target.value)} className="bg-main-panel border-border text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Phone</Label>
            <Input value={(form.party2_phone as string) || ''} onChange={e => update('party2_phone', e.target.value)} className="bg-main-panel border-border text-foreground" />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input type="email" value={(form.party2_email as string) || ''} onChange={e => update('party2_email', e.target.value)} className="bg-main-panel border-border text-foreground" />
          </div>
          <div className="sm:col-span-2 border-t border-border pt-3 mt-1">
            <p className="text-xs text-muted-foreground font-medium mb-3">Representative</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Name</Label><Input value={(form.party2_rep_name as string) || ''} onChange={e => update('party2_rep_name', e.target.value)} className="bg-main-panel border-border text-foreground" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Email</Label><Input type="email" value={(form.party2_rep_email as string) || ''} onChange={e => update('party2_rep_email', e.target.value)} className="bg-main-panel border-border text-foreground" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Phone</Label><Input value={(form.party2_rep_phone as string) || ''} onChange={e => update('party2_rep_phone', e.target.value)} className="bg-main-panel border-border text-foreground" /></div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Your Role */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Your Role</h3>
        <Select value={(form.user_is_party as string) || 'party2'} onValueChange={val => update('user_is_party', val)}>
          <SelectTrigger className="w-full max-w-md bg-main-panel border-border text-foreground"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="party1">{p1Label}</SelectItem>
            <SelectItem value="party2">{p2Label}</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={saving} size="sm">{saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}Save</Button>
      </div>
    </div>
  )
}
