'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import {
  Loader2,
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Pencil,
  X,
} from 'lucide-react'
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

type Phase = 'upload' | 'processing' | 'review' | 'saving'

type ContractType =
  | 'dc_head_contract'
  | 'construct_only_head_contract'
  | 'dc_subcontract'
  | 'construct_only_subcontract'
  | 'consultancy_agreement'
  | 'other'

interface PartyFact {
  name?: string
  role?: string
  address?: string
  abn?: string
}

interface ExtractedFacts {
  contract_type?: { value?: ContractType; confidence?: number }
  contract_title?: { value?: string }
  project_name?: { value?: string }
  contract_form?: { value?: string }
  party_a?: PartyFact
  party_b?: PartyFact
  contract_administrator?: PartyFact
  reference_number?: { value?: string }
  // Legacy fallback shims surfaced by the extractor for older callers.
  principal?: PartyFact
  contractor?: PartyFact
  superintendent?: PartyFact
}

const CONTRACT_FORMS = [
  'AS4000-1997',
  'AS4902-2000',
  'AS2124-1992',
  'AS4901-1998',
  'AS4903-2000',
  'AS4300-1995',
  'AS4305-1996',
  'AS4905-2002',
  'AS4906-2002',
  'AS4910-2002',
  'AS4912-2002',
  'AS4915-2002',
  'AS4916-2002',
  'AS4949-2003',
  'AS4950-2006',
  'AS4970-2009',
  'AS4920-2003',
  'GC21',
  'MW21',
  'ABIC SW-2018',
  'ABIC MW-2018',
  'NEC4',
  'FIDIC Red Book',
  'FIDIC Yellow Book',
  'FIDIC Silver Book',
  'JCT',
  'bespoke',
]

const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  dc_head_contract: 'Design & Construct head contract',
  construct_only_head_contract: 'Construct only head contract',
  dc_subcontract: 'D&C subcontract',
  construct_only_subcontract: 'Construct only subcontract',
  consultancy_agreement: 'Consultancy agreement',
  other: 'Other',
}

const ROLE_OPTIONS = [
  'Principal',
  'Owner',
  'Developer',
  'Head Contractor',
  'Contractor',
  'Subcontractor',
  'Consultant',
  'Client',
  'Supplier',
  'Superintendent',
  'Other',
]

function normaliseRole(raw?: string): string {
  if (!raw) return ''
  const r = raw.trim()
  // Match against the dropdown options case-insensitively.
  for (const opt of ROLE_OPTIONS) {
    if (r.toLowerCase() === opt.toLowerCase()) return opt
  }
  if (/head\s*contractor|main\s*contractor/i.test(r)) return 'Head Contractor'
  if (/subcontractor/i.test(r)) return 'Subcontractor'
  if (/principal/i.test(r)) return 'Principal'
  if (/owner/i.test(r)) return 'Owner'
  if (/developer/i.test(r)) return 'Developer'
  if (/consultant/i.test(r)) return 'Consultant'
  if (/client/i.test(r)) return 'Client'
  if (/supplier/i.test(r)) return 'Supplier'
  if (/contractor/i.test(r)) return 'Contractor'
  return r // free-text fallback — rendered but won't match dropdown
}

function pickName(obj?: { name?: string }) {
  return (obj?.name || '').trim()
}

function matchContractForm(raw?: string): string {
  if (!raw) return 'bespoke'
  const r = raw.trim()
  for (const f of CONTRACT_FORMS) {
    if (r.toLowerCase() === f.toLowerCase()) return f
  }
  // Loose match on the standard prefix (AS4000, AS4902, ...)
  const prefix = r.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 7)
  for (const f of CONTRACT_FORMS) {
    const fp = f.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 7)
    if (fp && prefix.includes(fp.slice(0, 5))) return f
  }
  return 'bespoke'
}

/**
 * Contract intro modal.
 *
 * Mounts inside the contract assistant page. Decides itself whether to show
 * by checking:
 *  - ?intro=1 in the URL, OR
 *  - the contract has zero documents (fresh blank guest contract)
 *
 * Flow: drop PDF → /api/contracts/quick-init → review pre-filled fields with
 * party radio → Continue PATCHes /api/contracts/[id] and dismisses.
 */
export function ContractIntroModal({
  contractId,
  onDone,
}: {
  contractId: string
  onDone?: () => void
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [show, setShow] = useState(false)
  const [isAnon, setIsAnon] = useState(false)
  const [phase, setPhase] = useState<Phase>('upload')
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [progress, setProgress] = useState('Reading your contract…')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Detect anon vs signed-in so the footer copy can adapt
  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data }) => {
      setIsAnon(data.user?.is_anonymous === true)
    })
  }, [])

  // Form state — starts empty, fills after extraction.
  const [projectName, setProjectName] = useState('')
  const [contractType, setContractType] = useState<ContractType>('dc_head_contract')
  const [contractForm, setContractForm] = useState('bespoke')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [party1Name, setParty1Name] = useState('')
  const [party1Role, setParty1Role] = useState('Principal')
  const [party2Name, setParty2Name] = useState('')
  const [party2Role, setParty2Role] = useState('Contractor')
  const [administratorName, setAdministratorName] = useState('')
  const [administratorRole, setAdministratorRole] = useState('Superintendent')
  const [userIsParty, setUserIsParty] = useState<'party1' | 'party2'>('party2')

  // Decide on mount whether to show.
  useEffect(() => {
    const intro = searchParams.get('intro') === '1'
    const supabase = createClient()
    let cancelled = false

    ;(async () => {
      const { count } = await supabase
        .from('documents')
        .select('id', { count: 'exact', head: true })
        .eq('contract_id', contractId)
      if (cancelled) return
      const empty = (count || 0) === 0
      if (intro || empty) setShow(true)

      // If the contract was already populated (e.g. sample clone) but ?intro=1
      // is present, jump straight to review.
      if (intro && !empty) {
        const { data: contract } = await supabase
          .from('contracts')
          .select('name, contract_form, party1_name, party1_role, party2_name, party2_role, administrator_name, administrator_role, user_is_party, extracted_facts')
          .eq('id', contractId)
          .maybeSingle()
        if (contract) {
          if (contract.name) setProjectName(contract.name)
          if (contract.contract_form) setContractForm(contract.contract_form)
          if (contract.party1_name) setParty1Name(contract.party1_name)
          if (contract.party1_role) setParty1Role(normaliseRole(contract.party1_role))
          if (contract.party2_name) setParty2Name(contract.party2_name)
          if (contract.party2_role) setParty2Role(normaliseRole(contract.party2_role))
          if (contract.administrator_name) setAdministratorName(contract.administrator_name)
          if (contract.administrator_role) setAdministratorRole(contract.administrator_role)
          if (contract.user_is_party === 'party1' || contract.user_is_party === 'party2') {
            setUserIsParty(contract.user_is_party)
          }
          const facts = contract.extracted_facts as ExtractedFacts | null
          if (facts?.contract_type?.value) setContractType(facts.contract_type.value)
          setPhase('review')
        }
      }
    })()

    return () => { cancelled = true }
  }, [contractId, searchParams])

  // Lock background scroll while modal is open.
  useEffect(() => {
    if (!show) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [show])

  const close = useCallback(() => {
    setShow(false)
    // Strip the ?intro=1 if present.
    if (searchParams.get('intro')) {
      const url = new URL(window.location.href)
      url.searchParams.delete('intro')
      window.history.replaceState({}, '', url.toString())
    }
    onDone?.()
  }, [onDone, searchParams])

  const handleFile = async (file: File) => {
    if (!file) return
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File too large — 50MB max for guest accounts.')
      return
    }
    setError(null)
    setPhase('processing')
    setProgress('Uploading your contract…')

    try {
      // 1. Direct-to-Storage upload from the browser. Bypasses Vercel's 4.5MB
      //    function payload limit; the function only sees JSON metadata.
      const supabase = createClient()
      const filePath = `${contractId}/${Date.now()}_${file.name}`
      const { error: uploadErr } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          contentType: file.type || 'application/pdf',
          upsert: false,
        })
      if (uploadErr) {
        setError(uploadErr.message || 'Upload failed.')
        setPhase('upload')
        return
      }

      // 2. Tell the function to process the file already in storage.
      const tick1 = setTimeout(() => setProgress('Extracting clauses and parties…'), 1500)
      const tick2 = setTimeout(() => setProgress('Identifying contract form and key dates…'), 6000)

      const res = await fetch('/api/contracts/quick-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_id: contractId,
          file_path: filePath,
          filename: file.name,
          file_type: file.type || 'application/pdf',
          file_size: file.size,
        }),
      })
      clearTimeout(tick1)
      clearTimeout(tick2)

      let data: Record<string, unknown> = {}
      const ct = res.headers.get('content-type') || ''
      if (ct.includes('application/json')) {
        data = await res.json()
      } else {
        const text = await res.text()
        data = { error: text.slice(0, 200) || `HTTP ${res.status}` }
      }
      if (!res.ok || !data.ok) {
        setError((data.error as string) || 'Could not process your contract.')
        setPhase('upload')
        return
      }

      const facts = (data.facts || {}) as ExtractedFacts
      const aiTitle = (data.project_title as string | undefined)?.trim()

      // Project name: prefer extractor's project_name (cited from text), fall
      // back to the AI-generated short title from the title generator. Never
      // leave the field empty if we have either signal.
      if (facts.project_name?.value) {
        setProjectName(facts.project_name.value)
      } else if (aiTitle) {
        setProjectName(aiTitle)
      }

      if (facts.contract_type?.value) setContractType(facts.contract_type.value)
      if (facts.contract_form?.value) setContractForm(matchContractForm(facts.contract_form.value))
      if (facts.reference_number?.value) setReferenceNumber(facts.reference_number.value)

      // Use party_a / party_b directly — the model identifies their actual
      // roles for THIS document (Head Contractor + Subcontractor for a
      // subcontract; Principal + Contractor for a head contract; etc).
      const a = facts.party_a
      const b = facts.party_b
      if (a?.name) setParty1Name(pickName(a))
      if (a?.role) setParty1Role(normaliseRole(a.role))
      if (b?.name) setParty2Name(pickName(b))
      if (b?.role) setParty2Role(normaliseRole(b.role))

      const admin = facts.contract_administrator
      if (admin?.name) setAdministratorName(admin.name)
      if (admin?.role) setAdministratorRole(normaliseRole(admin.role) || 'Superintendent')

      setPhase('review')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error.')
      setPhase('upload')
    }
  }

  const handleSave = async () => {
    if (!projectName.trim()) {
      setError('Give your project a name.')
      return
    }
    if (!party1Name.trim() || !party2Name.trim()) {
      setError('Enter both party names.')
      return
    }
    setPhase('saving')
    setError(null)
    try {
      const res = await fetch(`/api/contracts/${contractId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName.trim(),
          contract_form: contractForm,
          reference_number: referenceNumber.trim() || null,
          party1_name: party1Name.trim(),
          party1_role: party1Role,
          party2_name: party2Name.trim(),
          party2_role: party2Role,
          administrator_name: administratorName.trim() || null,
          administrator_role: administratorName.trim() ? administratorRole : null,
          user_is_party: userIsParty,
          facts_verified_by_user: true,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Could not save.')
        setPhase('review')
        return
      }
      toast.success("You're set — ask Astruct anything about this contract.")
      // Notify the dashboard layout so the contract picker refetches and
      // shows the new project name (was "Untitled project" until the modal
      // ran the PATCH).
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('astruct:contract-updated', { detail: { contractId } }))
      }
      close()
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error.')
      setPhase('review')
    }
  }

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { if (phase === 'upload' || phase === 'review') close() }} />
      <div className="relative w-full sm:max-w-2xl max-h-screen sm:max-h-[90vh] overflow-y-auto bg-card sm:rounded-2xl shadow-2xl border border-border">
        {(phase === 'upload' || phase === 'review') && (
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {phase === 'upload' && (
          <UploadStep
            dragOver={dragOver}
            setDragOver={setDragOver}
            fileInputRef={fileInputRef}
            handleFile={handleFile}
            error={error}
            isAnon={isAnon}
          />
        )}

        {phase === 'processing' && (
          <div className="p-10 sm:p-14 text-center">
            <Loader2 className="h-8 w-8 mx-auto mb-4 text-foreground/70 animate-spin" />
            <p className="text-base font-medium text-foreground">{progress}</p>
            <p className="text-xs text-muted-foreground mt-2">
              This usually takes 5–15 seconds.
            </p>
          </div>
        )}

        {(phase === 'review' || phase === 'saving') && (
          <ReviewStep
            projectName={projectName}
            setProjectName={setProjectName}
            contractType={contractType}
            setContractType={setContractType}
            contractForm={contractForm}
            setContractForm={setContractForm}
            referenceNumber={referenceNumber}
            setReferenceNumber={setReferenceNumber}
            party1Name={party1Name}
            setParty1Name={setParty1Name}
            party1Role={party1Role}
            setParty1Role={setParty1Role}
            party2Name={party2Name}
            setParty2Name={setParty2Name}
            party2Role={party2Role}
            setParty2Role={setParty2Role}
            administratorName={administratorName}
            setAdministratorName={setAdministratorName}
            administratorRole={administratorRole}
            setAdministratorRole={setAdministratorRole}
            userIsParty={userIsParty}
            setUserIsParty={setUserIsParty}
            saving={phase === 'saving'}
            onSave={handleSave}
            error={error}
          />
        )}
      </div>
    </div>
  )
}

// ─── Upload step ──────────────────────────────────────────────────────────
function UploadStep({
  dragOver,
  setDragOver,
  fileInputRef,
  handleFile,
  error,
  isAnon,
}: {
  dragOver: boolean
  setDragOver: (b: boolean) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleFile: (f: File) => void
  error: string | null
  isAnon: boolean
}) {
  return (
    <div className="p-6 sm:p-10">
      <div className="flex items-center gap-2 mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <Sparkles className="h-3.5 w-3.5" />
        Set up your project
      </div>
      <h2
        id="intro-title"
        className="text-2xl sm:text-3xl text-foreground font-normal leading-tight mb-3"
        style={{
          fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif",
          letterSpacing: '-0.02em',
        }}
      >
        Upload your contract to start.
      </h2>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Drop in your head contract or subcontract — Astruct reads it and pre-fills the project
        details so you can start asking questions in seconds.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-foreground/40 bg-foreground/[0.04]'
            : 'border-border hover:border-foreground/25 hover:bg-muted/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
        <Upload className="h-7 w-7 mx-auto mb-3 text-muted-foreground/60" strokeWidth={1.5} />
        <p className="text-sm font-medium text-foreground">Drop your contract here</p>
        <p className="text-xs text-muted-foreground mt-1">
          or click to browse — PDF, DOCX or TXT, up to 50MB
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-600">
          {error}
        </div>
      )}

      <p className="text-xs text-muted-foreground/70 mt-6 text-center">
        {isAnon
          ? 'No signup, no credit card. Free forever for your first project.'
          : 'Astruct will read the contract and pre-fill the project details so you can start in seconds.'}
      </p>
    </div>
  )
}

// ─── Review step ─────────────────────────────────────────────────────────
function ReviewStep(props: {
  projectName: string
  setProjectName: (v: string) => void
  contractType: ContractType
  setContractType: (v: ContractType) => void
  contractForm: string
  setContractForm: (v: string) => void
  referenceNumber: string
  setReferenceNumber: (v: string) => void
  party1Name: string
  setParty1Name: (v: string) => void
  party1Role: string
  setParty1Role: (v: string) => void
  party2Name: string
  setParty2Name: (v: string) => void
  party2Role: string
  setParty2Role: (v: string) => void
  administratorName: string
  setAdministratorName: (v: string) => void
  administratorRole: string
  setAdministratorRole: (v: string) => void
  userIsParty: 'party1' | 'party2'
  setUserIsParty: (v: 'party1' | 'party2') => void
  saving: boolean
  onSave: () => void
  error: string | null
}) {
  const {
    projectName, setProjectName, contractType, setContractType,
    contractForm, setContractForm, referenceNumber, setReferenceNumber,
    party1Name, setParty1Name, party1Role, setParty1Role,
    party2Name, setParty2Name, party2Role, setParty2Role,
    administratorName, setAdministratorName, administratorRole, setAdministratorRole,
    userIsParty, setUserIsParty,
    saving, onSave, error,
  } = props

  return (
    <div className="p-6 sm:p-10">
      <div className="flex items-center gap-2 mb-3 text-xs font-medium text-emerald-600 uppercase tracking-wider">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Auto-filled from your contract
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-1">
        Confirm the project details
      </h2>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Astruct read your contract and pulled out the key facts. Tweak anything that&apos;s wrong,
        then tell us which party you are.
      </p>

      <div className="space-y-5">
        {/* Contract type + form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Contract type</Label>
            <Select value={contractType} onValueChange={(v) => setContractType((v || 'other') as ContractType)}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select…">
                  {contractType in CONTRACT_TYPE_LABELS ? CONTRACT_TYPE_LABELS[contractType] : contractType}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CONTRACT_TYPE_LABELS) as ContractType[]).map((k) => (
                  <SelectItem key={k} value={k} label={CONTRACT_TYPE_LABELS[k]}>{CONTRACT_TYPE_LABELS[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Contract form</Label>
            <Select value={contractForm} onValueChange={(v) => setContractForm(v || 'bespoke')}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {CONTRACT_FORMS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Project name */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Project name</Label>
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. Cross River Rail — Albert Street Station"
          />
          {!projectName && (
            <p className="text-[11px] text-amber-600">
              We couldn&apos;t find the project name in your contract — please enter it.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Reference number (optional)</Label>
          <Input value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} placeholder="e.g. CON-2026-001" />
        </div>

        {/* Party 1 */}
        <div className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Party 1 {party1Role && `— ${party1Role}`}
            </span>
            <Pencil className="h-3 w-3 text-muted-foreground/60" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Input value={party1Name} onChange={(e) => setParty1Name(e.target.value)} placeholder="Entity name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Role</Label>
              <Select
                value={ROLE_OPTIONS.includes(party1Role) ? party1Role : 'Other'}
                onValueChange={(v) => setParty1Role(v || 'Other')}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Party 2 */}
        <div className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Party 2 {party2Role && `— ${party2Role}`}
            </span>
            <Pencil className="h-3 w-3 text-muted-foreground/60" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Input value={party2Name} onChange={(e) => setParty2Name(e.target.value)} placeholder="Entity name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Role</Label>
              <Select
                value={ROLE_OPTIONS.includes(party2Role) ? party2Role : 'Other'}
                onValueChange={(v) => setParty2Role(v || 'Other')}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {administratorName && (
          <div className="rounded-lg border border-border p-4 space-y-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Contract administrator
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Name</Label>
                <Input value={administratorName} onChange={(e) => setAdministratorName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Role</Label>
                <Select
                  value={administratorRole}
                  onValueChange={(v) => setAdministratorRole(v || 'Superintendent')}
                >
                  <SelectTrigger className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Superintendent">Superintendent</SelectItem>
                    <SelectItem value="Principal's Representative">Principal&apos;s Representative</SelectItem>
                    <SelectItem value="Contract Administrator">Contract Administrator</SelectItem>
                    <SelectItem value="Engineer">Engineer</SelectItem>
                    <SelectItem value="Project Manager">Project Manager</SelectItem>
                    <SelectItem value="Architect">Architect</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Which party is the user */}
        <div className="rounded-lg border-2 border-foreground/15 bg-foreground/[0.02] p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Which party are you?</p>
          <p className="text-xs text-muted-foreground -mt-1">
            We use this to frame answers from your perspective and draft notices from your side.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label
              className={`cursor-pointer rounded-md border p-3 text-sm transition-colors ${
                userIsParty === 'party1'
                  ? 'border-foreground bg-foreground/[0.04]'
                  : 'border-border hover:border-foreground/30'
              }`}
            >
              <input
                type="radio"
                checked={userIsParty === 'party1'}
                onChange={() => setUserIsParty('party1')}
                className="sr-only"
              />
              <div className="font-medium text-foreground">{party1Name || 'Party 1'}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{party1Role}</div>
            </label>
            <label
              className={`cursor-pointer rounded-md border p-3 text-sm transition-colors ${
                userIsParty === 'party2'
                  ? 'border-foreground bg-foreground/[0.04]'
                  : 'border-border hover:border-foreground/30'
              }`}
            >
              <input
                type="radio"
                checked={userIsParty === 'party2'}
                onChange={() => setUserIsParty('party2')}
                className="sr-only"
              />
              <div className="font-medium text-foreground">{party2Name || 'Party 2'}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{party2Role}</div>
            </label>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border sticky bottom-0 bg-background pb-2">
          <Button onClick={onSave} disabled={saving} size="lg" className="w-full sm:w-auto min-h-[44px]">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
            Continue to assistant
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ContractIntroModal
