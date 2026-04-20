'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  Mail,
  Loader2,
  RefreshCw,
  X,
  Upload,
  FileText,
  ArrowDownLeft,
  ArrowUpRight,
  Minus,
  Search,
  Check,
  Eye,
  EyeOff,
  ChevronRight,
  Plug,
} from 'lucide-react'
import IntegrationConnectDialog from '@/components/integration-connect-dialog'
import IntegrationSyncStatus from '@/components/integration-sync-status'
import type { IntegrationCardData } from '@/components/integration-card'

// ─── Types ──────────────────────────────────────────────────────────────────

interface CorrespondenceItem {
  id: string
  subject: string
  from_party: string
  to_party: string | null
  content: string | null
  category: string
  correspondence_type: string | null
  clause_tags: string[]
  date_received: string
  ai_summary: string | null
  file_path: string | null
  file_type: string | null
  processed: boolean
  platform: string | null
}

// ─── Constants ──────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  letter: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  email: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
  notice: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  direction: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  rfi: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  payment_claim: 'bg-green-500/10 text-green-500 border-green-500/20',
  variation: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  eot_claim: 'bg-red-500/10 text-red-500 border-red-500/20',
  show_cause: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  other: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

const PLATFORMS = [
  { key: 'procore', name: 'Procore', logo: '/logos/procore_logo.png', description: 'Construction project management' },
  { key: 'aconex', name: 'Aconex (Oracle)', logo: '/logos/aconex_logo.png', description: 'Document management & collaboration' },
  { key: 'asite', name: 'Asite', logo: '/logos/asite_logo.webp', description: 'Cloud platform for construction' },
  { key: 'hammertech', name: 'Hammertech', logo: '/logos/hammertech_logo.jpeg', description: 'Safety and compliance management' },
  { key: 'ineight', name: 'InEight', logo: '/logos/ineight_logo.png', description: 'Capital project management software' },
]

// ─── Component ──────────────────────────────────────────────────────────────

export default function CorrespondencePage() {
  const params = useParams()
  const contractId = params.id as string

  const [activeTab, setActiveTab] = useState<'manual' | 'integrations'>('manual')
  const [correspondence, setCorrespondence] = useState<CorrespondenceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CorrespondenceItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [integrations, setIntegrations] = useState<Record<string, IntegrationCardData>>({})
  const [connectDialogOpen, setConnectDialogOpen] = useState(false)
  const [connectDialogPlatform, setConnectDialogPlatform] = useState<
    'procore' | 'aconex' | 'asite' | 'hammertech' | 'ineight' | undefined
  >(undefined)
  const [syncingPlatform, setSyncingPlatform] = useState<string | null>(null)
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null)

  const loadIntegrations = useCallback(async () => {
    if (!contractId) return
    const res = await fetch(`/api/integrations?contract_id=${contractId}`)
    if (!res.ok) return
    const data = await res.json()
    const map: Record<string, IntegrationCardData> = {}
    for (const d of data.integrations || []) {
      map[d.platform] = {
        id: d.id,
        platform: d.platform,
        contract_id: d.contract_id,
        contract_name: null,
        status: d.status,
        last_synced_at: d.last_synced_at,
        last_sync_item_count: d.last_sync_item_count,
        total_items_synced: d.total_items_synced,
        sync_frequency_hours: d.sync_frequency_hours || 6,
        auto_create_obligations: d.auto_create_obligations ?? true,
        error_message: d.error_message,
      }
    }
    setIntegrations(map)
  }, [contractId])

  useEffect(() => { loadIntegrations() }, [loadIntegrations])

  const handleSyncNow = async (integrationId: string, platformKey: string) => {
    setSyncingPlatform(platformKey)
    try {
      const res = await fetch('/api/integrations/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integration_id: integrationId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Sync failed')
      } else {
        toast.success(
          `${platformKey} sync complete: ${data.new ?? 0} new items, ${data.obligations_created ?? 0} obligations detected`
        )
        loadIntegrations()
        fetchCorrespondence()
      }
    } catch {
      toast.error('Sync failed')
    } finally {
      setSyncingPlatform(null)
    }
  }

  const fetchCorrespondence = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/correspondence?contract_id=${contractId}`)
      if (res.ok) {
        const data = await res.json()
        setCorrespondence(data.correspondence || [])
      }
    } catch (err) {
      console.error('Failed to fetch correspondence:', err)
    } finally {
      setLoading(false)
    }
  }, [contractId])

  useEffect(() => { fetchCorrespondence() }, [fetchCorrespondence])

  const handleUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return
    setUploading(true)
    const formData = new FormData()
    formData.append('contract_id', contractId)
    for (const file of Array.from(files)) formData.append('files', file)

    try {
      const res = await fetch('/api/correspondence/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        const count = data.correspondence?.length || 0
        toast.success(`${count} item${count !== 1 ? 's' : ''} uploaded and classified`)
        fetchCorrespondence()
      } else {
        toast.error('Upload failed')
      }
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const filtered = correspondence.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return c.subject?.toLowerCase().includes(q) ||
      c.from_party?.toLowerCase().includes(q) ||
      c.to_party?.toLowerCase().includes(q) ||
      c.ai_summary?.toLowerCase().includes(q) ||
      c.content?.toLowerCase().includes(q)
  })

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) }
    catch { return d }
  }

  return (
    <div className={`${selectedItem ? 'flex' : ''} h-[calc(100vh-3.5rem)] overflow-hidden`}>
      {/* Main area */}
      <div className={`flex-1 flex flex-col min-w-0 ${selectedItem ? 'border-r border-border' : 'overflow-y-auto'}`}>
        <div className={`${selectedItem ? '' : 'max-w-4xl mx-auto w-full'} p-6 pb-0`}>
        {/* Tabs */}
        <div className="flex items-center gap-4 pb-0">
          <button
            onClick={() => setActiveTab('manual')}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === 'manual' ? 'text-foreground border-foreground' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
          >
            Correspondence
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors inline-flex items-center gap-1.5 ${activeTab === 'integrations' ? 'text-foreground border-foreground' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
          >
            <Plug className="h-3.5 w-3.5" />
            Integrations
          </button>
        </div>

        <div className="border-b border-border" />
        </div>

        {activeTab === 'manual' ? (
          <div className={`flex-1 overflow-y-auto p-6 ${selectedItem ? '' : ''}`}>
            <div className={`${selectedItem ? '' : 'max-w-4xl mx-auto'}`}>
            {/* Upload zone */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => { e.preventDefault(); setIsDragging(false); handleUpload(e.dataTransfer.files) }}
              onClick={() => fileInputRef.current?.click()}
              className={`mb-6 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-foreground/30 bg-muted/50' : 'border-border hover:border-foreground/20 hover:bg-muted/30'}`}
            >
              <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.eml,.msg" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files)} />
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Uploading and classifying...</span>
                </div>
              ) : (
                <>
                  <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Drop correspondence files here or click to browse</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">PDF, DOCX, TXT, EML. AI will extract date, parties, subject, and clause references.</p>
                </>
              )}
            </div>

            {/* Search */}
            {correspondence.length > 0 && (
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search correspondence..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            )}

            {/* List */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Mail className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground mb-1">{searchQuery ? 'No results found' : 'No correspondence yet'}</p>
                <p className="text-xs text-muted-foreground/60">{searchQuery ? 'Try a different search term' : 'Upload correspondence files above to get started'}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filtered.map(item => {
                  const typeColor = TYPE_COLORS[item.correspondence_type || 'other'] || TYPE_COLORS.other
                  const isSelected = selectedItem?.id === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(isSelected ? null : item)}
                      className={`w-full text-left rounded-lg px-4 py-3 transition-colors ${isSelected ? 'bg-accent border border-border' : 'hover:bg-muted/50'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-foreground truncate">{item.subject}</span>
                            {item.correspondence_type && (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${typeColor} shrink-0`}>
                                {item.correspondence_type.replace(/_/g, ' ')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{item.from_party || 'Unknown'}</span>
                            {item.to_party && <><span className="text-muted-foreground/30">→</span><span>{item.to_party}</span></>}
                          </div>
                          {item.ai_summary && (
                            <p className="text-xs text-muted-foreground/70 mt-1 truncate">{item.ai_summary}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-xs text-muted-foreground">{formatDate(item.date_received)}</span>
                          {item.clause_tags && item.clause_tags.length > 0 && (
                            <div className="flex gap-1">
                              {item.clause_tags.slice(0, 2).map((tag, i) => (
                                <span key={i} className="px-1 py-0.5 rounded text-[9px] bg-border text-muted-foreground">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          </div>
        ) : (
          /* Integrations tab */
          <div className="flex-1 overflow-y-auto p-6">
            <div className={`${selectedItem ? '' : 'max-w-4xl mx-auto'}`}>
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="flex items-center px-5 py-2.5 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground">
                <div className="flex-1">Platform</div>
                <div className="w-32 text-center">Status</div>
                <div className="w-40 text-right">Action</div>
              </div>
              {PLATFORMS.map((platform, i) => {
                const integration = integrations[platform.key]
                const isConnected = integration?.status === 'connected'
                const isErrored = integration?.status === 'error'
                const isExpanded = expandedPlatform === platform.key
                const isSyncing = syncingPlatform === platform.key
                return (
                <div key={platform.key} className={`${i < PLATFORMS.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className={`flex items-center px-5 py-3.5 hover:bg-muted/20 transition-colors`}>
                    <div className="flex items-center gap-3 flex-1">
                      <img src={platform.logo} alt={platform.name} className="h-8 w-8 rounded-lg object-contain" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{platform.name}</p>
                        <p className="text-xs text-muted-foreground">{platform.description}</p>
                      </div>
                    </div>
                    <div className="w-36 flex items-center justify-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : isErrored ? 'bg-red-500' : 'bg-muted-foreground/30'}`} />
                      <span className={`text-xs ${isConnected ? 'text-emerald-600 font-medium' : isErrored ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>{isConnected ? 'Connected' : isErrored ? 'Error' : 'Not set up'}</span>
                    </div>
                    <div className="w-40 text-right flex items-center justify-end gap-2">
                      {isConnected && integration ? (
                        <>
                          <button
                            onClick={() => handleSyncNow(integration.id, platform.key)}
                            disabled={isSyncing}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-md border border-border hover:border-foreground/20 disabled:opacity-50"
                          >
                            {isSyncing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                            Sync
                          </button>
                          <button
                            onClick={() => setExpandedPlatform(isExpanded ? null : platform.key)}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-md border border-border hover:border-foreground/20"
                          >
                            {isExpanded ? 'Hide' : 'Details'}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setConnectDialogPlatform(platform.key as 'procore' | 'aconex' | 'asite' | 'hammertech' | 'ineight')
                            setConnectDialogOpen(true)
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md border border-border hover:border-foreground/20"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                  {isConnected && integration && isExpanded && (
                    <div className="px-2 pb-3">
                      <IntegrationSyncStatus integration={integration} expanded={true} />
                    </div>
                  )}
                </div>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3">Connect your project management platform to automatically sync correspondence. New items run through the classifier and appear on the calendar as time-bar obligations.</p>
          </div>
          </div>
        )}

        <IntegrationConnectDialog
          open={connectDialogOpen}
          onOpenChange={setConnectDialogOpen}
          defaultContractId={contractId}
          defaultPlatform={connectDialogPlatform}
          onConnected={() => {
            loadIntegrations()
            fetchCorrespondence()
          }}
        />
      </div>

      {/* Reading pane */}
      {selectedItem && (
        <div className="w-[480px] flex flex-col border-l border-border bg-sidebar shrink-0">
          <div className="h-12 flex items-center justify-between px-4 border-b border-border shrink-0">
            <span className="text-sm font-medium text-foreground truncate">{selectedItem.subject}</span>
            <button onClick={() => setSelectedItem(null)} className="p-1 rounded hover:bg-muted transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="px-4 py-3 border-b border-border space-y-1.5 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">From</span>
              <span className="text-xs text-foreground">{selectedItem.from_party || '—'}</span>
            </div>
            {selectedItem.to_party && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">To</span>
                <span className="text-xs text-foreground">{selectedItem.to_party}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Date</span>
              <span className="text-xs text-foreground">{formatDate(selectedItem.date_received)}</span>
            </div>
            {selectedItem.correspondence_type && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Type</span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${TYPE_COLORS[selectedItem.correspondence_type] || TYPE_COLORS.other}`}>
                  {selectedItem.correspondence_type.replace(/_/g, ' ')}
                </span>
              </div>
            )}
            {selectedItem.clause_tags && selectedItem.clause_tags.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Clauses</span>
                <div className="flex gap-1">{selectedItem.clause_tags.map((t, i) => <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-border text-muted-foreground">{t}</span>)}</div>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {selectedItem.content ? (
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-['Georgia',_serif]">
                {selectedItem.content}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground text-sm">No text content extracted</div>
            )}
          </div>
          <div className="px-4 py-3 border-t border-border shrink-0">
            <a
              href={`/contracts/${contractId}/assistant?prompt=${encodeURIComponent(`Regarding the correspondence "${selectedItem.subject}" from ${selectedItem.from_party} dated ${formatDate(selectedItem.date_received)}: what are our obligations and response requirements?`)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20 transition-colors"
            >
              Ask about this <ChevronRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
