'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function DatesSettingsPage() {
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
      date_of_contract: form.date_of_contract || null,
      date_practical_completion: form.date_practical_completion || null,
      updated_at: new Date().toISOString(),
    }).eq('id', contractId)
    if (error) toast.error('Failed to save')
    else toast.success('Saved')
    setSaving(false)
  }

  if (loading) return <div className="space-y-4 animate-pulse"><div className="h-6 w-32 bg-muted rounded" /><div className="h-20 bg-muted rounded-lg" /></div>

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Key Dates</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Date of Contract</Label>
          <Input type="date" value={(form.date_of_contract as string) || ''} onChange={e => update('date_of_contract', e.target.value || null)} className="bg-main-panel border-border text-foreground" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Date for Practical Completion</Label>
          <Input type="date" value={(form.date_practical_completion as string) || ''} onChange={e => update('date_practical_completion', e.target.value || null)} className="bg-main-panel border-border text-foreground" />
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={saving} size="sm">{saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}Save</Button>
      </div>
    </div>
  )
}
