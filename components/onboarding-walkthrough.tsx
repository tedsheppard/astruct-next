'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const STEPS = [
  {
    title: 'Create your first project',
    description: 'Each project in Astruct represents a construction contract - your head contract, subcontract, or consultancy agreement. Click "New Contract" to get started.',
  },
  {
    title: 'Upload your contract documents',
    description: 'Upload your contract PDFs to the Library. Astruct reads every page, extracts clause references, and indexes everything for instant search. Drop in general conditions, special conditions, annexures - anything relevant.',
  },
  {
    title: 'Ask your contract anything',
    description: 'Go to the Assistant and ask questions in plain English. Astruct searches across all your documents and gives you cited answers grounded in your actual contract text. Try: "What are the time bars for variation claims?"',
  },
  {
    title: 'Draft notices and correspondence',
    description: 'Ask Astruct to draft notices, EOT claims, payment claims, or any contract correspondence. It uses your contract terms, party names, and clause references automatically.',
  },
  {
    title: 'Track your deadlines',
    description: 'The Calendar automatically tracks every contractual deadline and time-bar obligation extracted from your documents. You\'ll see warnings before deadlines expire.',
  },
  {
    title: 'You\'re ready',
    description: 'That\'s it. Upload your first contract and start asking questions. If you need help, email hello@astruct.io.',
  },
]

export function OnboardingWalkthrough({ onComplete }: { onComplete?: () => void }) {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    // Check if walkthrough should show
    const params = new URLSearchParams(window.location.search)
    if (params.get('walkthrough') === '1') {
      setShow(true)
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname)
      return
    }

    // Also check profile flag
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('walkthrough_completed').eq('id', user.id).single().then(({ data }) => {
        if (data && !data.walkthrough_completed) {
          setShow(true)
        }
      })
    })
  }, [])

  const completeWalkthrough = async () => {
    setShow(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ walkthrough_completed: true }).eq('id', user.id)
    }
    onComplete?.()
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      completeWalkthrough()
    }
  }

  if (!show) return null

  const currentStep = STEPS[step]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-[#f2f1f0]">
          <div className="h-full bg-[#0f0e0d] transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        <div className="p-8">
          {/* Step counter */}
          <p className="text-xs text-[#8f8b85] mb-4">Step {step + 1} of {STEPS.length}</p>

          {/* Content */}
          <h2 className="text-xl font-semibold text-[#0f0e0d] mb-3">{currentStep.title}</h2>
          <p className="text-sm text-[#706d66] leading-relaxed">{currentStep.description}</p>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8">
            <button onClick={completeWalkthrough} className="text-xs text-[#adaba5] hover:text-[#706d66] transition-colors">
              Skip tour
            </button>
            <button onClick={handleNext}
              className="px-6 py-2.5 rounded-md bg-[#0f0e0d] text-[#fafaf9] text-sm font-medium hover:bg-[#33312c] transition-colors">
              {step === STEPS.length - 1 ? 'Get started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
