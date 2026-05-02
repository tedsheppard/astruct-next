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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const CONTRACT_FORMS: { group: string; items: { value: string; label: string }[] }[] = [
  { group: 'Standards Australia', items: [
    { value: 'AS4000-1997', label: 'AS4000-1997 — General Conditions' },
    { value: 'AS4902-2000', label: 'AS4902-2000 — Design & Construct' },
    { value: 'AS2124-1992', label: 'AS2124-1992 — General Conditions' },
    { value: 'AS4901-1998', label: 'AS4901-1998 — Subcontract' },
    { value: 'AS4905-2002', label: 'AS4905-2002 — Minor Works' },
  ]},
  { group: 'ABIC', items: [
    { value: 'ABIC-MW2018', label: 'ABIC MW-2018 — Major Works' },
    { value: 'ABIC-SW2018', label: 'ABIC SW-2018 — Simple Works' },
  ]},
  { group: 'HIA / MBA', items: [
    { value: 'HIA-LumpSum', label: 'HIA Lump Sum' },
    { value: 'HIA-CostPlus', label: 'HIA Cost Plus' },
    { value: 'MBA', label: 'MBA (Master Builders)' },
  ]},
  { group: 'International', items: [
    { value: 'NEC4-ECC', label: 'NEC4 — Engineering & Construction' },
    { value: 'FIDIC-Red', label: 'FIDIC Red Book' },
    { value: 'FIDIC-Yellow', label: 'FIDIC Yellow Book' },
    { value: 'JCT-SBC', label: 'JCT Standard Building' },
  ]},
  { group: 'Other', items: [
    { value: 'GC21', label: 'GC21 — NSW Government' },
    { value: 'AS-Amended', label: 'AS Standard (Amended)' },
    { value: 'Bespoke', label: 'Bespoke / Custom' },
    { value: 'Other', label: 'Other' },
  ]},
]
const CURRENCIES = ['AUD', 'USD', 'GBP', 'EUR', 'NZD', 'SGD', 'HKD', 'CAD', 'JPY', 'INR', 'AED', 'ZAR', 'MYR', 'CNY']

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
    const { name, reference_number, contract_form, contract_sum, currency, gst_type } = form
    const { error } = await supabase.from('contracts').update({
      name, reference_number, contract_form, contract_sum, currency, gst_type,
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

  // Find the label for the current contract_form so SelectValue can render it
  const currentForm = (form.contract_form as string) || ''
  const currentFormLabel = (() => {
    for (const g of CONTRACT_FORMS) {
      const m = g.items.find(i => i.value === currentForm)
      if (m) return m.label
    }
    return currentForm || ''
  })()
  const currentCurrency = (form.currency as string) || 'AUD'

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
          <Select
            value={currentForm}
            onValueChange={(v) => v && update('contract_form', v)}
          >
            <SelectTrigger className="w-full bg-main-panel border-border text-foreground">
              <SelectValue placeholder="Select a contract form">
                {() => currentFormLabel || 'Select a contract form'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CONTRACT_FORMS.map(g => (
                <SelectGroup key={g.group}>
                  <SelectLabel>{g.group}</SelectLabel>
                  {g.items.map(i => (
                    <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Contract Sum</Label>
          <div className="flex gap-2">
            <Select
              value={currentCurrency}
              onValueChange={(v) => v && update('currency', v)}
            >
              <SelectTrigger className="w-24 bg-main-panel border-border text-foreground flex-shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              step="0.01"
              value={(form.contract_sum as number) ?? ''}
              onChange={e => update('contract_sum', e.target.value ? Number(e.target.value) : null)}
              placeholder="0.00"
              className="flex-1 bg-main-panel border-border text-foreground"
            />
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
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}Save
        </Button>
      </div>
    </div>
  )
}
