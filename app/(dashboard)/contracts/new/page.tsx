'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useContract } from '@/lib/contract-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const CONTRACT_FORMS = [
  { value: 'as4000', label: 'AS4000-1997 (General Conditions)' },
  { value: 'as4902', label: 'AS4902-2000 (Design & Construct)' },
  { value: 'as2124', label: 'AS2124-1992 (General Conditions)' },
  { value: 'as4901', label: 'AS4901-1998 (Subcontract)' },
  { value: 'hia', label: 'HIA Lump Sum Building Contract' },
  { value: 'mba', label: 'MBA (Master Builders)' },
  { value: 'nec', label: 'NEC4' },
  { value: 'fidic', label: 'FIDIC' },
  { value: 'bespoke', label: 'Bespoke / Other' },
]

const PARTY_ROLE_PRESETS = [
  { value: 'Principal', label: 'Principal' },
  { value: 'Contractor', label: 'Contractor' },
  { value: 'Head Contractor', label: 'Head Contractor' },
  { value: 'Subcontractor', label: 'Subcontractor' },
  { value: 'Owner', label: 'Owner' },
  { value: 'Developer', label: 'Developer' },
  { value: 'Builder', label: 'Builder' },
  { value: 'Employer', label: 'Employer' },
  { value: 'custom', label: 'Custom...' },
]

const ADMIN_ROLE_PRESETS = [
  { value: 'none', label: 'None' },
  { value: 'Superintendent', label: 'Superintendent' },
  { value: 'Engineer', label: 'Engineer' },
  { value: 'Project Manager', label: 'Project Manager' },
  { value: "Principal's Representative", label: "Principal's Representative" },
  { value: "Contractor's Representative", label: "Contractor's Representative" },
  { value: 'Contract Administrator', label: 'Contract Administrator' },
  { value: 'custom', label: 'Custom...' },
]

export default function NewContractPage() {
  const router = useRouter()
  const { selectContractAndNavigate } = useContract()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customParty1Role, setCustomParty1Role] = useState('')
  const [customParty2Role, setCustomParty2Role] = useState('')
  const [customAdminRole, setCustomAdminRole] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    reference_number: '',
    contract_form: 'bespoke',
    party1_role: 'Principal',
    party1_name: '',
    party1_address: '',
    party2_role: 'Contractor',
    party2_name: '',
    party2_address: '',
    user_is_party: 'party2',
    administrator_role: 'none',
    administrator_name: '',
    administrator_address: '',
    date_of_contract: '',
    date_practical_completion: '',
    contract_sum: '',
  })

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Auto-set party roles based on contract form
  const handleFormChange = (value: string) => {
    updateField('contract_form', value)
    if (value === 'as4901') {
      updateField('party1_role', 'Head Contractor')
      updateField('party2_role', 'Subcontractor')
      updateField('administrator_role', "Contractor's Representative")
    } else if (value === 'as4000' || value === 'as4902' || value === 'as2124') {
      updateField('party1_role', 'Principal')
      updateField('party2_role', 'Contractor')
      updateField('administrator_role', 'Superintendent')
    } else if (value === 'nec') {
      updateField('party1_role', 'Employer')
      updateField('party2_role', 'Contractor')
      updateField('administrator_role', 'Project Manager')
    } else if (value === 'fidic') {
      updateField('party1_role', 'Employer')
      updateField('party2_role', 'Contractor')
      updateField('administrator_role', 'Engineer')
    }
  }

  const getParty1RoleDisplay = () => formData.party1_role === 'custom' ? customParty1Role : formData.party1_role
  const getParty2RoleDisplay = () => formData.party2_role === 'custom' ? customParty2Role : formData.party2_role
  const getAdminRoleDisplay = () => {
    if (formData.administrator_role === 'custom') return customAdminRole
    if (formData.administrator_role === 'none') return ''
    return formData.administrator_role
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in.')
      setLoading(false)
      return
    }

    const { data: inserted, error: insertError } = await supabase.from('contracts').insert({
      user_id: user.id,
      name: formData.name,
      reference_number: formData.reference_number || null,
      contract_form: formData.contract_form,
      party1_role: getParty1RoleDisplay() || 'Party 1',
      party1_name: formData.party1_name || null,
      party1_address: formData.party1_address || null,
      party2_role: getParty2RoleDisplay() || 'Party 2',
      party2_name: formData.party2_name || null,
      party2_address: formData.party2_address || null,
      user_is_party: formData.user_is_party,
      administrator_role: getAdminRoleDisplay() || null,
      administrator_name: formData.administrator_name || null,
      administrator_address: formData.administrator_address || null,
      // Legacy fields for backward compat
      principal_name: formData.party1_role === 'Principal' ? formData.party1_name : null,
      contractor_name: formData.party2_role === 'Contractor' ? formData.party2_name : null,
      superintendent_name: formData.administrator_role === 'Superintendent' ? formData.administrator_name : null,
      date_of_contract: formData.date_of_contract || null,
      date_practical_completion: formData.date_practical_completion || null,
      contract_sum: formData.contract_sum ? parseFloat(formData.contract_sum) : null,
    }).select('id').single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    // Auto-select the new contract and navigate to its assistant
    if (inserted?.id) {
      selectContractAndNavigate(inserted.id, `/contracts/${inserted.id}/assistant`)
    } else {
      router.push('/contracts')
    }
    router.refresh()
  }

  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]"><div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create Contract
        </h1>
        <p className="text-sm mt-1 text-muted-foreground">
          Set up a new construction contract for administration.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Basic Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground">Contract Name *</Label>
                <Input
                  placeholder="e.g. Sydney CBD Office Tower — Head Contract"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="h-11 bg-main-panel border-border focus:border-ring text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Reference Number</Label>
                <Input
                  placeholder="e.g. CON-2026-001"
                  value={formData.reference_number}
                  onChange={(e) => updateField('reference_number', e.target.value)}
                  className="h-11 bg-main-panel border-border focus:border-ring text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Contract Form</Label>
                <Select
                  value={formData.contract_form}
                  onValueChange={(v) => handleFormChange(v ?? 'bespoke')}
                >
                  <SelectTrigger className="h-11 bg-main-panel border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {CONTRACT_FORMS.map((form) => (
                      <SelectItem key={form.value} value={form.value}>
                        {form.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parties */}
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Parties
            </h2>

            {/* Party 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-2">
                  <Label className="text-muted-foreground">Party 1 Role</Label>
                  <Select
                    value={PARTY_ROLE_PRESETS.some(p => p.value === formData.party1_role) ? formData.party1_role : 'custom'}
                    onValueChange={(v) => {
                      if (v === 'custom') {
                        updateField('party1_role', 'custom')
                      } else {
                        updateField('party1_role', v ?? 'Principal')
                        setCustomParty1Role('')
                      }
                    }}
                  >
                    <SelectTrigger className="h-11 bg-main-panel border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {PARTY_ROLE_PRESETS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.party1_role === 'custom' && (
                  <div className="flex-1 space-y-2">
                    <Label className="text-muted-foreground">Custom Role</Label>
                    <Input
                      placeholder="e.g. Franchisee"
                      value={customParty1Role}
                      onChange={(e) => setCustomParty1Role(e.target.value)}
                      className="h-11 bg-main-panel border-border focus:border-ring text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{getParty1RoleDisplay() || 'Party 1'} Name</Label>
                  <Input
                    placeholder="Entity name"
                    value={formData.party1_name}
                    onChange={(e) => updateField('party1_name', e.target.value)}
                    className="h-11 bg-main-panel border-border focus:border-ring text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{getParty1RoleDisplay() || 'Party 1'} Address</Label>
                  <Input
                    placeholder="Address"
                    value={formData.party1_address}
                    onChange={(e) => updateField('party1_address', e.target.value)}
                    className="h-11 bg-main-panel border-border focus:border-ring text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Party 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-2">
                  <Label className="text-muted-foreground">Party 2 Role</Label>
                  <Select
                    value={PARTY_ROLE_PRESETS.some(p => p.value === formData.party2_role) ? formData.party2_role : 'custom'}
                    onValueChange={(v) => {
                      if (v === 'custom') {
                        updateField('party2_role', 'custom')
                      } else {
                        updateField('party2_role', v ?? 'Contractor')
                        setCustomParty2Role('')
                      }
                    }}
                  >
                    <SelectTrigger className="h-11 bg-main-panel border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {PARTY_ROLE_PRESETS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.party2_role === 'custom' && (
                  <div className="flex-1 space-y-2">
                    <Label className="text-muted-foreground">Custom Role</Label>
                    <Input
                      placeholder="e.g. Design Consultant"
                      value={customParty2Role}
                      onChange={(e) => setCustomParty2Role(e.target.value)}
                      className="h-11 bg-main-panel border-border focus:border-ring text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{getParty2RoleDisplay() || 'Party 2'} Name</Label>
                  <Input
                    placeholder="Entity name"
                    value={formData.party2_name}
                    onChange={(e) => updateField('party2_name', e.target.value)}
                    className="h-11 bg-main-panel border-border focus:border-ring text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{getParty2RoleDisplay() || 'Party 2'} Address</Label>
                  <Input
                    placeholder="Address"
                    value={formData.party2_address}
                    onChange={(e) => updateField('party2_address', e.target.value)}
                    className="h-11 bg-main-panel border-border focus:border-ring text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Which party is the user */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">You are</Label>
              <Select
                value={formData.user_is_party}
                onValueChange={(v) => updateField('user_is_party', v ?? 'party2')}
              >
                <SelectTrigger className="h-11 bg-main-panel border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="party1">{getParty1RoleDisplay() || 'Party 1'}</SelectItem>
                  <SelectItem value="party2">{getParty2RoleDisplay() || 'Party 2'}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This tells the AI which side of the contract you're administering from.
              </p>
            </div>

            <div className="border-t border-border" />

            {/* Administrator */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-2">
                  <Label className="text-muted-foreground">Contract Administrator Role</Label>
                  <Select
                    value={ADMIN_ROLE_PRESETS.some(p => p.value === formData.administrator_role) ? formData.administrator_role : 'custom'}
                    onValueChange={(v) => {
                      if (v === 'custom') {
                        updateField('administrator_role', 'custom')
                      } else {
                        updateField('administrator_role', v ?? 'none')
                        setCustomAdminRole('')
                      }
                    }}
                  >
                    <SelectTrigger className="h-11 bg-main-panel border-border text-foreground">
                      <SelectValue placeholder="Select if applicable" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {ADMIN_ROLE_PRESETS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.administrator_role === 'custom' && (
                  <div className="flex-1 space-y-2">
                    <Label className="text-muted-foreground">Custom Role</Label>
                    <Input
                      placeholder="e.g. Certifier"
                      value={customAdminRole}
                      onChange={(e) => setCustomAdminRole(e.target.value)}
                      className="h-11 bg-main-panel border-border focus:border-ring text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                )}
              </div>
              {(formData.administrator_role && formData.administrator_role !== 'none') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">{getAdminRoleDisplay()} Name</Label>
                    <Input
                      placeholder="Name"
                      value={formData.administrator_name}
                      onChange={(e) => updateField('administrator_name', e.target.value)}
                      className="h-11 bg-main-panel border-border focus:border-ring text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">{getAdminRoleDisplay()} Address</Label>
                    <Input
                      placeholder="Address"
                      value={formData.administrator_address}
                      onChange={(e) => updateField('administrator_address', e.target.value)}
                      className="h-11 bg-main-panel border-border focus:border-ring text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dates & Value */}
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Dates & Value
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Date of Contract</Label>
                <Input
                  type="date"
                  value={formData.date_of_contract}
                  onChange={(e) => updateField('date_of_contract', e.target.value)}
                  className="h-11 bg-main-panel border-border focus:border-ring text-foreground [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Date for Practical Completion</Label>
                <Input
                  type="date"
                  value={formData.date_practical_completion}
                  onChange={(e) => updateField('date_practical_completion', e.target.value)}
                  className="h-11 bg-main-panel border-border focus:border-ring text-foreground [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Contract Sum ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.contract_sum}
                  onChange={(e) => updateField('contract_sum', e.target.value)}
                  className="h-11 bg-main-panel border-border focus:border-ring text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !formData.name}
            className="accent-gradient text-white btn-press"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create Contract
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div></div>
  )
}
