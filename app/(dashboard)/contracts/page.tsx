'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useContract } from '@/lib/contract-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  FileText,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'

interface Contract {
  id: string
  name: string
  reference_number: string | null
  contract_form: string
  principal_name: string | null
  contractor_name: string | null
  status: string
  created_at: string
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const router = useRouter()
  const { selectContractAndNavigate } = useContract()

  async function startNewProject() {
    if (creating) return
    setCreating(true)
    try {
      const r = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New project' }),
      })
      const d = await r.json()
      if (!r.ok || !d?.id) {
        // 403 = anon contract limit; route to existing-project page so the
        // sign-up CTA surfaces. 503 = service issue.
        router.push('/contracts/new')
        return
      }
      selectContractAndNavigate(d.id, `/contracts/${d.id}/assistant?intro=1`)
    } catch {
      router.push('/contracts/new')
    } finally {
      setCreating(false)
    }
  }

  useEffect(() => {
    const supabase = createClient()

    async function loadContracts() {
      const { data } = await supabase
        .from('contracts')
        .select(
          'id, name, reference_number, contract_form, principal_name, contractor_name, status, created_at'
        )
        .order('created_at', { ascending: false })

      if (data) {
        setContracts(data)
      }
      setLoading(false)
    }

    loadContracts()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <>
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Your projects
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Each project is one construction contract — head contract or subcontract.
          </p>
        </div>
        <Button
          onClick={startNewProject}
          disabled={creating}
          className="bg-foreground text-background hover:bg-foreground/90 btn-press"
          data-testid="create-contract-btn"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {contracts.length === 0 ? (
        <Card className="bg-card border-border border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText
                className="h-8 w-8 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Create your first project
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Upload your contract — Astruct reads it and pre-fills the project details so you can start asking questions in seconds.
            </p>
            <Button
              onClick={startNewProject}
              disabled={creating}
              className="bg-foreground text-background hover:bg-foreground/90 btn-press"
              data-testid="onboarding-create-contract"
            >
              Upload Contract
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {contracts.map((contract) => (
            <Card
              key={contract.id}
              className="bg-card border-border card-hover cursor-pointer"
              onClick={() => router.push(`/contracts/${contract.id}`)}
              data-testid={`contract-${contract.id}`}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <FileText
                      className="h-5 w-5 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {contract.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {contract.reference_number &&
                        `${contract.reference_number} · `}
                      {(contract.contract_form || 'bespoke').toUpperCase()}
                      {contract.principal_name &&
                        ` · ${contract.principal_name}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      contract.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {contract.status}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
    </>
  )
}
