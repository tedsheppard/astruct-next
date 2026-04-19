'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  MessageSquare,
  FolderOpen,
  Zap,
  CalendarDays,
  Mail,
  Settings,
  LogOut,
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
  Search,
  Command,
  ChevronRight,
  ChevronDown,
  Plus,
  BookOpen,
  FileText,
  Clock,
  LayoutGrid,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ContractContext } from '@/lib/contract-context'

interface Contract {
  id: string
  name: string
  reference_number: string | null
  contract_form: string
  status: string
}

interface UserProfile {
  name: string
  email: string
  company_name?: string
}

// ─── Nav Item ────────────────────────────────────────────────────────────────

function NavItem({
  icon: Icon,
  label,
  href,
  isActive,
  collapsed,
  disabled,
  indent,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  href: string
  isActive: boolean
  collapsed: boolean
  disabled?: boolean
  indent?: boolean
}) {
  const content = (
    <Link
      href={disabled ? '#' : href}
      onClick={(e) => disabled && e.preventDefault()}
      className={`
        flex items-center rounded-lg text-sm transition-all duration-200 relative
        ${disabled ? 'opacity-35 cursor-not-allowed' : ''}
        ${isActive
          ? 'bg-sidebar-active text-sidebar-active-fg font-medium'
          : 'text-sidebar-fg/60 hover:text-sidebar-fg hover:bg-sidebar-active/50'
        }
      `}
      style={{
        paddingLeft: indent && !collapsed ? '28px' : '12px',
        paddingRight: '12px',
        paddingTop: '8px',
        paddingBottom: '8px',
      }}
    >
      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4" strokeWidth={1.5} />
      </div>
      <span className={`ml-3 whitespace-nowrap transition-all duration-300 ease-in-out ${
        collapsed ? 'opacity-0 w-0 max-w-0 ml-0 overflow-hidden' : 'opacity-100'
      }`}>
        {label}
      </span>
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={<div />}>{content}</TooltipTrigger>
        <TooltipContent side="right"><p>{label}</p></TooltipContent>
      </Tooltip>
    )
  }
  return content
}

// ─── Layout ──────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [selectedContractId, setSelectedContractIdRaw] = useState<string>('')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [contractDropdownOpen, setContractDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Cmd+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  const [loaded, setLoaded] = useState(false)

  const setSelectedContractId = useCallback((id: string) => {
    setSelectedContractIdRaw(id)
    if (id) localStorage.setItem('astruct_selected_contract', id)
    else localStorage.removeItem('astruct_selected_contract')
  }, [])

  const selectContractAndNavigate = useCallback((id: string, path?: string) => {
    setSelectedContractId(id)
    router.push(path || `/contracts/${id}/assistant`)
  }, [setSelectedContractId, router])

  useEffect(() => {
    const saved = localStorage.getItem('astruct_selected_contract')
    if (saved) setSelectedContractIdRaw(saved)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    async function loadData() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return
      const { data: profile } = await supabase.from('profiles').select('name, email, company_name, onboarding_completed').eq('id', authUser.id).single()
      if (profile) {
        // Redirect to setup if onboarding not completed (skip if already on setup page)
        if (!profile.onboarding_completed && !window.location.pathname.startsWith('/setup')) {
          router.push('/setup')
          return
        }
        setUser(profile)
      }
      const { data: contractData } = await supabase.from('contracts').select('id, name, reference_number, contract_form, status').order('created_at', { ascending: false })
      if (contractData) {
        setContracts(contractData)
        const savedId = localStorage.getItem('astruct_selected_contract')
        const savedIsValid = savedId && contractData.some(c => c.id === savedId)
        if (contractData.length > 0 && !savedIsValid) setSelectedContractId(contractData[0].id)
      }
      setLoaded(true)
    }
    loadData()
  }, [setSelectedContractId, pathname])

  // Redirect / to the selected contract's assistant
  useEffect(() => {
    if (!loaded) return
    if (pathname === '/') {
      if (selectedContractId) {
        router.replace(`/contracts/${selectedContractId}/assistant`)
      } else if (contracts.length > 0) {
        const id = contracts[0].id
        setSelectedContractId(id)
        router.replace(`/contracts/${id}/assistant`)
      } else {
        router.replace('/contracts/new')
      }
    }
  }, [pathname, loaded, selectedContractId, contracts, router, setSelectedContractId])

  // Sync selected contract from URL
  useEffect(() => {
    const match = pathname.match(/^\/contracts\/([a-f0-9-]+)/)
    if (match && match[1] !== 'new' && match[1] !== selectedContractId) {
      setSelectedContractId(match[1])
    }
  }, [pathname, selectedContractId, setSelectedContractId])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const switchContract = (id: string) => {
    setSelectedContractId(id)
    setContractDropdownOpen(false)
    const subPageMatch = pathname.match(/^\/contracts\/[^/]+\/(.+)/)
    const subPage = subPageMatch ? subPageMatch[1] : 'assistant'
    router.push(`/contracts/${id}/${subPage}`)
  }

  const selectedContract = contracts.find(c => c.id === selectedContractId)
  const hasContracts = contracts.length > 0
  const isOnContractPage = pathname.startsWith('/contracts/') && !pathname.endsWith('/new')

  const contractNavItems = [
    { icon: MessageSquare, label: 'Assistant', subpath: 'assistant' },
    { icon: Clock, label: 'History', subpath: 'history' },
    { icon: FolderOpen, label: 'Library', subpath: 'library' },
    { icon: Mail, label: 'Correspondence', subpath: 'correspondence' },
    { icon: FileText, label: 'Templates', subpath: 'templates' },
    { icon: CalendarDays, label: 'Calendar', subpath: 'calendar' },
    { icon: Settings, label: 'Contract Settings', subpath: 'settings' },
  ]

  const getBreadcrumb = () => {
    if (isOnContractPage && selectedContract) {
      const subMatch = pathname.match(/^\/contracts\/[^/]+\/(.+)/)
      const sub = subMatch ? subMatch[1] : ''
      const item = contractNavItems.find(i => i.subpath === sub)
      return { contract: selectedContract.name, page: item?.label || '' }
    }
    return null
  }
  const breadcrumb = getBreadcrumb()

  const getPageTitle = () => {
    if (pathname === '/history') return 'History'
    if (pathname === '/knowledge-base') return 'Knowledge Base'
    if (pathname === '/settings') return 'Settings'
    if (pathname === '/contracts') return 'Browse Contracts'
    if (pathname === '/contracts/new') return 'New Contract'
    if (pathname === '/letterheads' || pathname === '/templates') return 'Letterheads'
    return 'Astruct'
  }

  return (
    <ContractContext.Provider value={{ selectedContractId, setSelectedContractId, selectContractAndNavigate }}>
    <TooltipProvider>
      <div className="min-h-screen flex bg-sidebar">
        {/* ─── Sidebar ─── */}
        <aside className={`${collapsed ? 'w-16' : 'w-64'} flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out overflow-x-hidden overflow-y-auto bg-sidebar`}>
          {/* Logo — matches header height */}
          <div className="h-14 flex items-center px-4 border-b border-sidebar-fg/8">
            <div className={`transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              <h1 className="text-lg font-semibold tracking-tight text-sidebar-fg">Astruct</h1>
            </div>
            <span className={`text-lg font-bold transition-all duration-300 ${collapsed ? 'opacity-100' : 'opacity-0 absolute'} text-sidebar-fg`}>A</span>
          </div>

          <nav className="flex-1 px-2 overflow-y-auto overflow-x-hidden flex flex-col">
            {/* ═══ TOP: Contract Section ═══ */}
            <div className="pt-3 mb-1">
              {!collapsed && (
                <div className="px-2 mb-2">
                  {hasContracts ? (
                    <Popover open={contractDropdownOpen} onOpenChange={setContractDropdownOpen}>
                      <PopoverTrigger className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm bg-sidebar-active/40 hover:bg-sidebar-active/70 transition-colors text-sidebar-fg">
                        <span className="truncate font-medium">{selectedContract?.name || 'Select contract'}</span>
                        <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 ml-2 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent align="start" side="bottom" className="w-56 p-1.5">
                        {contracts.map(c => (
                          <button key={c.id} onClick={() => switchContract(c.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${c.id === selectedContractId ? 'bg-accent font-medium' : 'hover:bg-accent'}`}>
                            {c.name}
                          </button>
                        ))}
                        <div className="border-t mt-1 pt-1">
                          <button onClick={() => { setContractDropdownOpen(false); router.push('/contracts/new') }}
                            className="w-full text-left px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center gap-2">
                            <Plus className="h-3.5 w-3.5" />New Contract
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <div className="px-1">
                      <p className="text-xs text-sidebar-fg/30 mb-2">No contracts yet</p>
                      <Button onClick={() => router.push('/contracts/new')} variant="outline" size="sm"
                        className="w-full text-xs border-sidebar-fg/15 text-sidebar-fg/50 hover:text-sidebar-fg bg-transparent">
                        <Plus className="h-3 w-3 mr-1.5" />Create your first contract
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {selectedContractId && (
                <div className="space-y-0.5">
                  {contractNavItems.map(({ icon, label, subpath }) => {
                    const href = `/contracts/${selectedContractId}/${subpath}`
                    const isActive = pathname === href || pathname.startsWith(href + '/')
                    return (
                      <NavItem key={subpath} icon={icon} label={label} href={href} isActive={isActive} collapsed={collapsed} />
                    )
                  })}
                </div>
              )}

              {collapsed && selectedContractId && (
                <NavItem icon={FileText} label="Contract" href={`/contracts/${selectedContractId}/assistant`} isActive={isOnContractPage} collapsed={collapsed} />
              )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* ═══ BOTTOM: Global Items ═══ */}
            <div className="border-t border-sidebar-fg/8 pt-3 space-y-0.5">
              <NavItem icon={LayoutGrid} label="Browse Contracts" href="/contracts" isActive={pathname === '/contracts'} collapsed={collapsed} />
              <NavItem icon={FileText} label="Letterheads" href="/letterheads" isActive={pathname.startsWith('/letterheads') || pathname.startsWith('/templates')} collapsed={collapsed} />
              <NavItem icon={BookOpen} label="Knowledge Base" href="/knowledge-base" isActive={pathname.startsWith('/knowledge-base')} collapsed={collapsed} />
              <NavItem icon={Settings} label="Settings" href="/settings" isActive={pathname === '/settings'} collapsed={collapsed} />
            </div>
          </nav>

          {/* User section */}
          <div className="p-3 border-t border-sidebar-fg/8">
            <button onClick={() => setCollapsed(prev => !prev)}
              className="w-full mb-2 flex items-center rounded-lg text-sm transition-all text-sidebar-fg/35 hover:text-sidebar-fg hover:bg-sidebar-active/50"
              style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '7px', paddingBottom: '7px' }}>
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </div>
              <span className={`ml-2 whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 max-w-0 ml-0 overflow-hidden' : 'opacity-100'}`}>Collapse</span>
            </button>
            {user && (
              <Popover>
                <PopoverTrigger className="w-full flex items-center rounded-lg transition-all hover:bg-sidebar-active/50" style={{ padding: '8px' }}>
                  <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                  <div className={`text-left truncate ml-3 transition-all duration-300 ${collapsed ? 'opacity-0 w-0 max-w-0 ml-0 overflow-hidden' : 'opacity-100'}`}>
                    <p className="text-sm truncate text-sidebar-fg">{user.name || 'User'}</p>
                    <p className="text-xs truncate text-sidebar-fg/35">{user.email}</p>
                  </div>
                </PopoverTrigger>
                <PopoverContent align={collapsed ? 'center' : 'start'} side="top" className="w-64 p-2">
                  <div className="px-3 py-2 mb-2">
                    <p className="font-medium">{user.name || 'User'}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="border-t pt-2">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/settings')} className="w-full justify-start"><Settings className="h-4 w-4 mr-2" />Settings</Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start"><HelpCircle className="h-4 w-4 mr-2" />Help & Support</Button>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"><LogOut className="h-4 w-4 mr-2" />Log out</Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </aside>

        {/* ─── Main Content ─── */}
        <div className="flex-1 flex flex-col min-h-screen bg-main-panel rounded-tl-2xl">
          <header className="h-14 border-b border-main-border flex items-center justify-between px-6 sticky top-0 z-40 bg-main-panel/95 backdrop-blur-sm rounded-tl-2xl">
            <div className="flex items-center gap-2">
              {breadcrumb ? (
                <>
                  <Link href="/contracts" className="text-sm hover:underline text-main-fg/40">Contracts</Link>
                  <ChevronRight className="h-3.5 w-3.5 text-main-fg/20" />
                  <span className="text-sm text-main-fg/60">{breadcrumb.contract}</span>
                  {breadcrumb.page && (
                    <>
                      <ChevronRight className="h-3.5 w-3.5 text-main-fg/20" />
                      <span className="text-sm font-medium text-main-fg">{breadcrumb.page}</span>
                    </>
                  )}
                </>
              ) : (
                <h2 className="text-sm font-medium text-main-fg">{getPageTitle()}</h2>
              )}
            </div>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 h-9 w-72 px-3 rounded-lg border text-sm transition-colors bg-main-panel border-main-border text-main-fg/35 hover:border-main-fg/20"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left hidden sm:inline">Search documents, chats...</span>
              <kbd className="text-xs px-1.5 py-0.5 rounded hidden sm:flex items-center gap-0.5 bg-main-fg/5">
                <Command className="h-3 w-3" /><span>K</span>
              </kbd>
            </button>

            {/* Search modal */}
            {searchOpen && (
              <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={() => setSearchOpen(false)}>
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
                <div className="relative w-full max-w-lg bg-main-panel border border-main-border rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-main-border">
                    <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search documents, conversations, pages..."
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      onKeyDown={e => { if (e.key === 'Escape') setSearchOpen(false) }}
                    />
                    <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">ESC</kbd>
                  </div>
                  <div className="p-2 max-h-[300px] overflow-y-auto">
                    {searchQuery.trim() ? (
                      <div className="space-y-1">
                        {/* Quick nav results */}
                        {[
                          { label: 'Assistant', path: selectedContractId ? `/contracts/${selectedContractId}/assistant` : '#' },
                          { label: 'Library', path: selectedContractId ? `/contracts/${selectedContractId}/library` : '#' },
                          { label: 'Correspondence', path: selectedContractId ? `/contracts/${selectedContractId}/correspondence` : '#' },
                          { label: 'Calendar', path: selectedContractId ? `/contracts/${selectedContractId}/calendar` : '#' },
                          { label: 'Contract Settings', path: selectedContractId ? `/contracts/${selectedContractId}/settings` : '#' },
                          { label: 'Browse Contracts', path: '/contracts' },
                          { label: 'Letterheads', path: '/letterheads' },
                          { label: 'Knowledge Base', path: '/knowledge-base' },
                          { label: 'Settings', path: '/settings' },
                        ].filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                          <Link key={item.path} href={item.path} onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-sm text-foreground">
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            {item.label}
                          </Link>
                        ))}
                        {/* Contracts */}
                        {contracts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                          <Link key={c.id} href={`/contracts/${c.id}/assistant`} onClick={() => { setSearchOpen(false); setSelectedContractId(c.id) }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-sm text-foreground">
                            <FolderOpen className="h-3 w-3 text-muted-foreground" />
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-6">Type to search pages, contracts, and documents</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </TooltipProvider>
    </ContractContext.Provider>
  )
}
