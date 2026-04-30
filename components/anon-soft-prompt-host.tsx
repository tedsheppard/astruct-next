'use client'

import { useRouter } from 'next/navigation'
import { useAnon } from '@/lib/anon-context'
import { AnonSoftPrompt } from '@/components/anon-soft-prompt'

/**
 * Bridges the anon context into AnonSoftPrompt — keeps the soft-prompt
 * component itself dumb / testable while letting the assistant page just
 * drop <AnonSoftPromptHost messageCount={N} /> wherever it wants the banner.
 */
export function AnonSoftPromptHost({ messageCount }: { messageCount: number }) {
  const router = useRouter()
  const { isAnon, triggerHardWall } = useAnon()

  if (!isAnon) return null

  const hasFirstResponse = messageCount >= 2

  return (
    <AnonSoftPrompt
      isAnon={isAnon}
      hasFirstResponse={hasFirstResponse}
      messageCount={messageCount}
      onSignUp={() => triggerHardWall('save_action')}
      onLogin={() => router.push('/login')}
    />
  )
}
