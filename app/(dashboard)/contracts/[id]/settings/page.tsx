'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function GeneralSettingsPage() {
  const { id: contractId } = useParams()
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('contracts').select('*').eq('id', contractId).single().then(({ data }) => {
      if (data) setForm(data)
      setLoading(false)
    })
  }, [contractId])

  const update = (key: string, val: unknown) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const { name, reference_number, contract_form, contract_sum } = form
    const { error } = await supabase.from('contracts').update({
      name, reference_number, contract_form, contract_sum,
      updated_at: new Date().toISOString(),
    }).eq('id', contractId)
    if (error) toast.error('Failed to save')
    else toast.success('Saved')
    setSaving(false)
  }

  if (loading) return <div className="space-y-4 animate-pulse"><div className="h-6 w-32 bg-muted rounded" /><div className="h-40 bg-muted rounded-lg" /></div>

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">General</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Contract Name *</Label>
          <Input value={(form.name as string) || ''} onChange={e => update('name', e.target.value)} className="bg-main-panel border-border text-foreground" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Contract Reference Number</Label>
          <Input value={(form.reference_number as string) || ''} onChange={e => update('reference_number', e.target.value)} className="bg-main-panel border-border text-foreground" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Contract Form</Label>
          <select value={(form.contract_form as string) || ''} onChange={e => update('contract_form', e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-border bg-main-panel text-foreground text-sm">
            <optgroup label="Standards Australia">
              <option value="AS4000-1997">AS4000-1997 — General Conditions</option>
              <option value="AS4902-2000">AS4902-2000 — Design & Construct</option>
              <option value="AS2124-1992">AS2124-1992 — General Conditions</option>
              <option value="AS4901-1998">AS4901-1998 — Subcontract</option>
              <option value="AS4905-2002">AS4905-2002 — Minor Works</option>
            </optgroup>
            <optgroup label="ABIC">
              <option value="ABIC-MW2018">ABIC MW-2018 — Major Works</option>
              <option value="ABIC-SW2018">ABIC SW-2018 — Simple Works</option>
            </optgroup>
            <optgroup label="HIA / MBA">
              <option value="HIA-LumpSum">HIA Lump Sum</option>
              <option value="HIA-CostPlus">HIA Cost Plus</option>
              <option value="MBA">MBA (Master Builders)</option>
            </optgroup>
            <optgroup label="International">
              <option value="NEC4-ECC">NEC4 — Engineering & Construction</option>
              <option value="FIDIC-Red">FIDIC Red Book</option>
              <option value="FIDIC-Yellow">FIDIC Yellow Book</option>
              <option value="JCT-SBC">JCT Standard Building</option>
            </optgroup>
            <optgroup label="Other">
              <option value="GC21">GC21 — NSW Government</option>
              <option value="AS-Amended">AS Standard (Amended)</option>
              <option value="Bespoke">Bespoke / Custom</option>
              <option value="Other">Other</option>
            </optgroup>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Contract Sum</Label>
          <div className="flex gap-2">
            <select value={(form.currency as string) || 'AUD'} onChange={e => update('currency', e.target.value)}
              className="w-24 h-10 px-2 rounded-md border border-border bg-main-panel text-foreground text-sm flex-shrink-0">
              <option value="AUD">AUD</option><option value="USD">USD</option><option value="GBP">GBP</option>
              <option value="EUR">EUR</option><option value="NZD">NZD</option><option value="SGD">SGD</option>
              <option value="HKD">HKD</option><option value="CAD">CAD</option><option value="JPY">JPY</option>
              <option value="INR">INR</option><option value="AED">AED</option><option value="ZAR">ZAR</option>
              <option value="MYR">MYR</option><option value="CNY">CNY</option>
            </select>
            <Input type="number" step="0.01" value={(form.contract_sum as number) ?? ''} onChange={e => update('contract_sum', e.target.value ? Number(e.target.value) : null)} placeholder="0.00" className="flex-1 bg-main-panel border-border text-foreground" />
          </div>
          <div className="flex items-center gap-4 mt-1">
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
              <input type="radio" name="gst" checked={(form.gst_type as string || 'ex') === 'ex'} onChange={() => update('gst_type', 'ex')} className="accent-foreground" />Excluding GST
            </label>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
              <input type="radio" name="gst" checked={(form.gst_type as string) === 'inc'} onChange={() => update('gst_type', 'inc')} className="accent-foreground" />Including GST
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={saving} size="sm">{saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}Save</Button>
      </div>
    </div>
  )
}
