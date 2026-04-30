'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ANON_FIRST_ENABLED } from '@/lib/anon-flag'
import { AnonHardWall, type HardWallReason } from '@/components/anon-hard-wall'

interface AnonContextValue {
  isAnon: boolean
  ready: boolean
  messagesSent: number
  bytesUploaded: number
  refresh: () => Promise<void>
  triggerHardWall: (reason: HardWallReason) => void
}

const AnonContext = createContext<AnonContextValue>({
  isAnon: false,
  ready: false,
  messagesSent: 0,
  bytesUploaded: 0,
  refresh: async () => {},
  triggerHardWall: () => {},
})

export const ANON_MESSAGE_LIMIT = 50
export const ANON_UPLOAD_LIMIT_BYTES = 50 * 1024 * 1024

/**
 * Wraps the dashboard tree with anon-aware state + the hard-wall modal.
 *
 * Keeps a server-of-truth running counter from the profiles row, polled
 * lightly (no realtime — this is anon-launch v1) and refreshed after sends.
 */
export function AnonProvider({ children }: { children: React.ReactNode }) {
  const [isAnon, setIsAnon] = useState(false)
  const [ready, setReady] = useState(false)
  const [messagesSent, setMessagesSent] = useState(0)
  const [bytesUploaded, setBytesUploaded] = useState(0)
  const [hardWall, setHardWall] = useState<HardWallReason | null>(null)

  const refresh = useCallback(async () => {
    if (!ANON_FIRST_ENABLED) {
      setReady(true)
      return
    }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsAnon(false)
      setReady(true)
      return
    }
    setIsAnon(user.is_anonymous === true)

    const { data: profile } = await supabase
      .from('profiles')
      .select('messages_sent, bytes_uploaded')
      .eq('id', user.id)
      .maybeSingle()

    setMessagesSent(profile?.messages_sent || 0)
    setBytesUploaded(profile?.bytes_uploaded || 0)
    setReady(true)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Auto-trigger hard wall when threshold crossed.
  useEffect(() => {
    if (!isAnon) return
    if (messagesSent >= ANON_MESSAGE_LIMIT) {
      setHardWall('message_limit')
    } else if (bytesUploaded >= ANON_UPLOAD_LIMIT_BYTES) {
      setHardWall('upload_limit')
    }
  }, [isAnon, messagesSent, bytesUploaded])

  const triggerHardWall = useCallback((reason: HardWallReason) => {
    if (!isAnon) return
    setHardWall(reason)
  }, [isAnon])

  const value = useMemo<AnonContextValue>(
    () => ({ isAnon, ready, messagesSent, bytesUploaded, refresh, triggerHardWall }),
    [isAnon, ready, messagesSent, bytesUploaded, refresh, triggerHardWall],
  )

  return (
    <AnonContext.Provider value={value}>
      {children}
      <AnonHardWall
        open={!!hardWall}
        reason={hardWall || 'locked_feature'}
        onClose={() => {
          // Only soft reasons can be dismissed without action.
          if (hardWall === 'locked_feature') setHardWall(null)
        }}
        onConverted={() => {
          setHardWall(null)
          refresh()
        }}
      />
    </AnonContext.Provider>
  )
}

export function useAnon() {
  return useContext(AnonContext)
}
