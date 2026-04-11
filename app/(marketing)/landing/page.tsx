'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { FadeIn } from '../layout'

const USE_CASES = [
  'Contract Analysis',
  'Variation Orders',
  'Time-Bar Tracking',
  'Payment Claims',
  'EOT Claims',
  'Dispute Notices',
  'Clause Research',
  'Correspondence',
  'Notices of Delay',
  'Negotiating Departures',
  'Payment Schedules',
  'Email Drafting',
  'Bulk-Searching Documents',
]

// Synced: each prompt matches a sketch by index (mod 4)
const TYPEWRITER_PROMPTS = [
  'Draft a response to this variation notice',           // 0 → letter sketch
  'Is this direction outside the scope of works?',      // 1 → building sketch
  'When is the next payment claim due?',                // 2 → calendar sketch
  'What does clause 34 say about time bars?',           // 3 → contract sketch
]

// Shared state hook for syncing typewriter + sketch
function useHeroAnimation() {
  const [promptIndex, setPromptIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [userTyping, setUserTyping] = useState(false)
  const [userText, setUserText] = useState('')

  useEffect(() => {
    if (userTyping) return

    const currentPrompt = TYPEWRITER_PROMPTS[promptIndex]

    if (!isDeleting && displayText === currentPrompt) {
      const timer = setTimeout(() => setIsDeleting(true), 2200)
      return () => clearTimeout(timer)
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setPromptIndex(prev => (prev + 1) % TYPEWRITER_PROMPTS.length)
      return
    }

    const speed = isDeleting ? 20 : 50
    const timer = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(displayText.slice(0, -1))
      } else {
        setDisplayText(currentPrompt.slice(0, displayText.length + 1))
      }
    }, speed)

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, promptIndex, userTyping])

  return { promptIndex, displayText, isDeleting, userTyping, setUserTyping, userText, setUserText }
}

function TypewriterInput({ state }: { state: ReturnType<typeof useHeroAnimation> }) {
  const { displayText, userTyping, setUserTyping, userText, setUserText } = state

  return (
    <div className="flex items-center gap-3 bg-white border border-[#e5e5e3] rounded-lg px-5 py-3.5 max-w-[540px] shadow-sm">
      <div className="flex-1 relative">
        <input
          type="text"
          value={userTyping ? userText : ''}
          onChange={e => { setUserText(e.target.value); setUserTyping(true) }}
          onFocus={() => setUserTyping(true)}
          onBlur={() => { if (!userText) setUserTyping(false) }}
          className="w-full text-[15px] text-[#0f0e0d] bg-transparent outline-none placeholder:text-transparent"
          placeholder="Ask Astruct anything..."
        />
        {!userTyping && (
          <span className="absolute inset-0 flex items-center text-[15px] text-[#adaba5] pointer-events-none">
            {displayText}<span className="inline-block w-[2px] h-[1.1em] bg-[#adaba5] ml-[1px] align-text-bottom animate-pulse" />
          </span>
        )}
      </div>
      <Link href="/register" className="px-4 py-2 bg-[#0f0e0d] text-[#fafaf9] text-sm font-medium rounded-md hover:bg-[#33312c] transition-colors duration-300 whitespace-nowrap">
        Ask Astruct &uarr;
      </Link>
    </div>
  )
}

// Grid mouse trail effect — only active inside the hero
function useGridTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const cellsRef = useRef<Map<string, number>>(new Map())
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const CELL = 45
    const COLOR = [61, 79, 106]
    const FADE = 4

    const resize = () => {
      canvas.width = section.offsetWidth
      canvas.height = section.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Listen on the section, not the canvas — this way it works over all child elements
    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const col = Math.floor(x / CELL)
      const row = Math.floor(y / CELL)

      cellsRef.current.set(`${col},${row}`, 120)

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue
          if (Math.random() > 0.35) continue
          const key = `${col + dx},${row + dy}`
          const existing = cellsRef.current.get(key) || 0
          cellsRef.current.set(key, Math.max(existing, 60 + Math.random() * 40))
        }
      }
    }

    section.addEventListener('mousemove', handleMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      cellsRef.current.forEach((opacity, key) => {
        if (opacity <= 0) {
          cellsRef.current.delete(key)
          return
        }
        const [col, row] = key.split(',').map(Number)
        ctx.strokeStyle = `rgba(${COLOR[0]}, ${COLOR[1]}, ${COLOR[2]}, ${opacity / 255})`
        ctx.lineWidth = 1
        ctx.strokeRect(col * CELL + 0.5, row * CELL + 0.5, CELL - 1, CELL - 1)
        cellsRef.current.set(key, opacity - FADE)
      })

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      section.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { canvasRef, sectionRef }
}

// Blueprint-style sketchy SVG illustrations that draw themselves
const SKETCH_COLOR = '#3d4f6a' // Dark blue-grey, blueprinty

function BlueprintSketch({ activeSketch, isErasing }: { activeSketch: number; isErasing: boolean }) {
  const [displayIndex, setDisplayIndex] = useState(activeSketch)
  const [phase, setPhase] = useState<'hidden' | 'drawing' | 'erasing'>('hidden')

  // Initial draw
  useEffect(() => {
    const t = setTimeout(() => setPhase('drawing'), 50)
    return () => clearTimeout(t)
  }, [])

  // Start erasing when typewriter starts deleting
  useEffect(() => {
    if (isErasing && phase === 'drawing') {
      setPhase('erasing')
    }
  }, [isErasing, phase])

  // When activeSketch changes (typewriter finished deleting), switch to new sketch
  useEffect(() => {
    if (activeSketch === displayIndex) return
    // If not already erasing, start erasing first
    if (phase !== 'erasing') {
      setPhase('erasing')
    }
    const timer = setTimeout(() => {
      setDisplayIndex(activeSketch)
      setPhase('hidden')
      setTimeout(() => setPhase('drawing'), 30)
    }, 500)
    return () => clearTimeout(timer)
  }, [activeSketch]) // eslint-disable-line react-hooks/exhaustive-deps

  // Letter/Notice template
  const letterPath = `
    M 40 30 L 260 30 L 260 270 L 40 270 Z
    M 60 55 L 240 55
    M 60 75 L 240 75
    M 60 95 L 200 95
    M 60 130 L 240 130
    M 60 150 L 240 150
    M 60 170 L 240 170
    M 60 190 L 220 190
    M 60 210 L 180 210
    M 60 240 L 120 240
    M 130 235 C 135 245, 145 250, 160 240 C 170 235, 175 245, 180 240
  `

  // Building/crane outline
  const buildingPath = `
    M 80 270 L 80 100 L 180 100 L 180 270
    M 80 140 L 180 140
    M 80 180 L 180 180
    M 80 220 L 180 220
    M 100 100 L 100 140
    M 130 100 L 130 140
    M 160 100 L 160 140
    M 100 180 L 100 220
    M 130 180 L 130 220
    M 160 180 L 160 220
    M 200 270 L 200 60 L 280 60
    M 200 60 L 200 40 L 205 40
    M 200 80 L 280 60
    M 240 70 L 240 120
    M 230 120 L 250 120
    M 240 120 L 240 160
  `

  // Calendar with deadline dots
  const calendarPath = `
    M 50 50 L 250 50 L 250 250 L 50 250 Z
    M 50 80 L 250 80
    M 80 50 L 80 40
    M 140 50 L 140 40
    M 200 50 L 200 40
    M 50 120 L 250 120
    M 50 160 L 250 160
    M 50 200 L 250 200
    M 117 50 L 117 250
    M 183 50 L 183 250
    M 90 98 A 4 4 0 1 1 90.1 98
    M 160 138 A 4 4 0 1 1 160.1 138
    M 220 178 A 6 6 0 1 1 220.1 178
    M 75 218 A 4 4 0 1 1 75.1 218
    M 140 98 A 6 6 0 1 1 140.1 98
  `

  // Contract with magnifying glass
  const contractPath = `
    M 50 30 L 220 30 L 220 270 L 50 270 Z
    M 70 55 L 200 55
    M 70 75 L 200 75
    M 70 95 L 160 95
    M 70 120 L 200 120
    M 70 140 L 200 140
    M 70 160 L 200 160
    M 70 180 L 200 180
    M 70 200 L 170 200
    M 70 230 L 120 230
    M 70 250 L 100 250
    M 210 170 A 35 35 0 1 1 210.1 170
    M 237 197 L 270 230
    M 265 225 L 275 235
    M 190 158 L 210 168
    M 195 175 L 215 165
  `

  const paths = [letterPath, buildingPath, calendarPath, contractPath]

  const currentPath = paths[displayIndex]

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        key={displayIndex}
        viewBox="0 0 300 300"
        className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px]"
      >
        <path
          d={currentPath}
          fill="none"
          stroke={SKETCH_COLOR}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: phase === 'drawing' ? 0 : 2000,
            transition: phase === 'drawing'
              ? 'stroke-dashoffset 3s steps(55, end)'
              : phase === 'erasing'
              ? 'stroke-dashoffset 1s steps(35, end)'
              : 'none',
            filter: `url(#sketchy-${displayIndex})`,
          }}
        />
        <defs>
          <filter id={`sketchy-${displayIndex}`}>
            <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="4" result="noise" seed={displayIndex * 13 + 3} />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}

const CONTRACT_FORMS = [
  'Bespoke Contracts',
  'AS 4000 – 1997',
  'AS 4000 – 2025',
  'AS 2124 – 1992',
  'AS 4902 – 2000',
  'AS 4901 – 2024',
  'AS 4903 – 2000',
  'AS 4300 – 1995',
  'Master Builders',
  'HIA Contracts',
  'FIDIC Red Book',
  'FIDIC Yellow Book',
  'FIDIC Silver Book',
  'NEC4 ECC',
]

const ROW_HEIGHT = 4.5 // rem
const VISIBLE_ROWS = 7
const HALF_VISIBLE = Math.floor(VISIBLE_ROWS / 2)
// Repeat list enough times to scroll for ages without running out
const WHEEL_ITEMS: string[] = []
for (let r = 0; r < 50; r++) WHEEL_ITEMS.push(...USE_CASES)
const WHEEL_START = 25 * USE_CASES.length

const CONTRACT_WHEEL_ITEMS: string[] = []
for (let r = 0; r < 50; r++) CONTRACT_WHEEL_ITEMS.push(...CONTRACT_FORMS)
const CONTRACT_WHEEL_START = 25 * CONTRACT_FORMS.length

function UseCaseWheel() {
  const dark = false
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setTick(prev => prev + 1), 2500)
    return () => clearInterval(timer)
  }, [])

  const activePosition = WHEEL_START + tick

  return (
    <div className="relative overflow-hidden" style={{ height: `${VISIBLE_ROWS * ROW_HEIGHT}rem` }}>
      {/* Fade masks */}
      <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${dark ? 'from-[#0f0e0d]' : 'from-[#fafaf9]'} to-transparent z-10 pointer-events-none`} />
      <div className={`absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t ${dark ? 'from-[#0f0e0d]' : 'from-[#fafaf9]'} to-transparent z-10 pointer-events-none`} />
      <div
        style={{
          fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif",
          transform: `translateY(-${(activePosition - HALF_VISIBLE) * ROW_HEIGHT}rem)`,
          transition: tick === 0 ? 'none' : 'transform 0.6s cubic-bezier(0, 0.7, 0.3, 1)',
        }}
      >
        {WHEEL_ITEMS.map((text, i) => (
          <p
            key={i}
            className="text-[clamp(1.25rem,2.5vw,2rem)] leading-none"
            style={{
              height: `${ROW_HEIGHT}rem`,
              display: 'flex',
              alignItems: 'center',
              color: i === activePosition ? (dark ? '#fafaf9' : '#0f0e0d') : (dark ? '#33312c' : '#d5d3cf'),
              fontWeight: i === activePosition ? 500 : 400,
              transition: 'color 0.6s cubic-bezier(0, 0.7, 0.3, 1)',
            }}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  )
}

function ContractFormWheel({ light, offset }: { light?: boolean; offset?: boolean }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    const timeout = setTimeout(() => {
      interval = setInterval(() => setTick(prev => prev + 1), 2500)
    }, offset ? 1250 : 0)
    return () => { clearTimeout(timeout); clearInterval(interval) }
  }, [offset])

  const activePosition = CONTRACT_WHEEL_START + tick

  return (
    <div className="relative overflow-hidden" style={{ height: `${VISIBLE_ROWS * ROW_HEIGHT}rem` }}>
      <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${light ? 'from-[#fafaf9]' : 'from-[#0f0e0d]'} to-transparent z-10 pointer-events-none`} />
      <div className={`absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t ${light ? 'from-[#fafaf9]' : 'from-[#0f0e0d]'} to-transparent z-10 pointer-events-none`} />
      <div
        style={{
          fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif",
          transform: `translateY(-${(activePosition - HALF_VISIBLE) * ROW_HEIGHT}rem)`,
          transition: tick === 0 ? 'none' : 'transform 0.6s cubic-bezier(0, 0.7, 0.3, 1)',
        }}
      >
        {CONTRACT_WHEEL_ITEMS.map((text, i) => (
          <p
            key={i}
            className="text-[clamp(1.25rem,2.5vw,2rem)] leading-none"
            style={{
              height: `${ROW_HEIGHT}rem`,
              display: 'flex',
              alignItems: 'center',
              color: i === activePosition ? (light ? '#0f0e0d' : '#fafaf9') : (light ? '#d5d3cf' : '#33312c'),
              fontWeight: i === activePosition ? 500 : 400,
              transition: 'color 0.6s cubic-bezier(0, 0.7, 0.3, 1)',
            }}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  )
}

function HeroSection() {
  const heroState = useHeroAnimation()
  const { canvasRef, sectionRef } = useGridTrail()

  return (
    <section ref={sectionRef} className="bg-[#eae6e0] min-h-[80vh] flex items-center px-7 sm:px-10 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.5 }} />
      <div className="max-w-[1200px] mx-auto w-full py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <FadeIn>
            <h1 className="text-[clamp(2.5rem,5vw,4.25rem)] text-[#0f0e0d] font-normal leading-[1.1] max-w-[500px]" style={{ letterSpacing: '-0.02em', fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif" }}>
              For building in the modern era
            </h1>
          </FadeIn>
          <FadeIn delay={150}>
            <p className="mt-5 text-lg text-[#706d66] leading-relaxed max-w-[480px]">
              World's first full-suite artificial intelligence platform for the construction industry.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="mt-8">
              <TypewriterInput state={heroState} />
            </div>
          </FadeIn>
        </div>
        <div className="hidden lg:flex items-center justify-center h-[400px]">
          <BlueprintSketch activeSketch={heroState.promptIndex} isErasing={heroState.isDeleting} />
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const { canvasRef, sectionRef } = useGridTrail()

  return (
    <section ref={sectionRef} className="bg-[#eae6e0] py-32 px-7 sm:px-10 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.5 }} />
      <div className="max-w-[1200px] mx-auto relative z-10 flex items-center justify-between">
        <FadeIn>
          <h2 className="text-[clamp(2.5rem,5vw,4.25rem)] text-[#0f0e0d] font-normal leading-[1.1] max-w-[700px]" style={{ fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
            Start managing your contracts with AI
          </h2>
        </FadeIn>
        <FadeIn delay={150}>
          <Link href="/register" className="inline-block px-6 py-3 bg-[#0f0e0d] text-[#fafaf9] text-sm font-medium hover:bg-[#33312c] transition-colors duration-300 whitespace-nowrap">
            Create your free account
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}

export default function HomePage() {

  return (
    <div>
      {/* ─── HERO (light, Claude-style, vertically centered) ─────────── */}
      <HeroSection />

      {/* ─── MISSION + PRODUCT (light, Harvey-style) ──────────────────── */}
      <section className="bg-[#fafaf9] pt-32 pb-0 px-7 sm:px-10">
        <div className="max-w-[1200px] mx-auto">
          <FadeIn>
            <p className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.35] max-w-[600px]">
              <span className="text-[#0f0e0d] font-semibold">AI designed for developers, builders and subcontractors.</span>
              <span className="text-[#adaba5]"> Manage the admin side of your projects more than 100x faster.</span>
            </p>
          </FadeIn>
        </div>

        {/* Product screenshot below the text, full-width, like Harvey */}
        <FadeIn>
          <div className="max-w-[1200px] mx-auto mt-16">
            <div className="rounded-t-sm overflow-hidden border border-b-0 border-[#e5e5e3] aspect-video bg-[#f2f1f0] flex items-center justify-center" style={{ boxShadow: '0 -10px 40px -10px rgba(0,0,0,0.06)' }}>
              <img src="/marketing/app-assistant.webp" alt="Astruct AI Assistant" className="w-full block" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── USE CASES + CONTRACT FORMS (combined wheel) ──────────────── */}
      <section className="bg-[#fafaf9] py-32 px-7 sm:px-10">
        <div className="max-w-[1200px] mx-auto flex items-center gap-8">
          <div className="hidden lg:block shrink-0 w-[130px]">
            <FadeIn>
              <p className="text-xl font-medium text-[#0f0e0d] leading-snug">
                Construction teams use Astruct for
              </p>
            </FadeIn>
          </div>
          <div className="flex-1 min-w-0">
            <FadeIn delay={100}>
              <UseCaseWheel />
            </FadeIn>
          </div>
          <div className="hidden lg:block shrink-0 w-[40px] text-center">
            <FadeIn delay={200}>
              <p className="text-xl font-medium text-[#706d66]">with</p>
            </FadeIn>
          </div>
          <div className="flex-1 min-w-0">
            <FadeIn delay={300}>
              <ContractFormWheel light offset />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── TECHNOLOGY (dark, Harvey-style) ──────────────────────── */}
      <section className="bg-[#0f0e0d] py-32 px-7 sm:px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <FadeIn>
                <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] text-[#fafaf9] font-normal leading-[1.25]" style={{ fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
                  Cutting-edge technology, applied purposefully to construction
                </h2>
              </FadeIn>
            </div>
            <div className="lg:col-span-7 flex items-start">
              <FadeIn delay={100}>
                <p className="text-[#8f8b85] text-base sm:text-lg leading-relaxed max-w-[540px]">
                  Astruct combines frontier AI research with deep construction domain expertise. Every capability is designed for the way construction teams actually work &ndash; contracts, notices, deadlines and documents.
                </p>
              </FadeIn>
            </div>
          </div>
          <div className="mt-16 pt-16 border-t border-[#33312c]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-0">
              {[
                { title: 'Auto-Classification', desc: 'Documents automatically categorised into 15+ construction document types.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8f8b85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
                { title: 'Intelligent Search', desc: 'Vector embeddings and RAG across thousands of project documents and standards.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8f8b85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /><path d="M8 11h6" /><path d="M11 8v6" /></svg> },
                { title: 'Frontier AI Models', desc: 'The most advanced large language models for contractually precise drafting.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8f8b85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4" /><path d="M12 18v4" /><path d="m4.93 4.93 2.83 2.83" /><path d="m16.24 16.24 2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="m4.93 19.07 2.83-2.83" /><path d="m16.24 4.76 2.83-2.83" /></svg> },
                { title: 'Platform Integrations', desc: 'Connects with Procore, Aconex, Asite and other construction platforms.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8f8b85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="5" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" /><path d="M5 7v10" /><path d="M19 7v10" /><path d="M7 5h10" /><path d="M7 19h10" /></svg> },
                { title: 'Citation Verification', desc: 'Every AI response grounded in source documents with verifiable citations.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8f8b85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><path d="M4 6h16" /><path d="M4 10h16" /><path d="M4 14h10" /><path d="M4 18h8" /></svg> },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <div className={`${i > 0 ? 'lg:border-l lg:border-[#33312c] lg:pl-8' : ''}`}>
                    <div className="mb-4">{item.icon}</div>
                    <h3 className="text-[#fafaf9] text-sm font-medium mb-2">{item.title}</h3>
                    <p className="text-[#8f8b85] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PLATFORM PRODUCTS (light) ───────────────────────────────── */}
      <section className="bg-[#fafaf9] py-32 px-7 sm:px-10">
        <div className="max-w-[1200px] mx-auto">
          <FadeIn>
            <p className="text-sm text-[#706d66] mb-3">The Platform</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] text-[#0f0e0d] font-normal max-w-[600px] mb-20" style={{ fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
              One platform for your entire contract lifecycle
            </h2>
          </FadeIn>

          <div className="space-y-24">
            {[
              {
                title: 'AI Assistant',
                desc: 'Ask questions, analyse documents, and draft notices with AI that reads your actual contract text and cites every answer.',
                href: '/platform/assistant',
                video: '/marketing/assistant-movie.mp4',
              },
              {
                title: 'Document Library',
                desc: 'Upload, classify, and search your entire project document set. AI auto-categorises into 13 construction document types.',
                href: '/platform/library',
                video: '/marketing/library-movie.mp4',
              },
              {
                title: 'Time-Bar Calendar',
                desc: 'Every contractual deadline and notice obligation, automatically extracted and tracked. One click to draft the required response.',
                href: '/platform/calendar',
                video: '/marketing/timebars-movie.mp4',
              },
              {
                title: 'Correspondence',
                desc: 'Upload project letters and emails. AI extracts metadata, makes them searchable, and cross-references against contract deadlines.',
                href: '/platform/correspondence',
                video: '/marketing/corro-movie.mp4',
              },
            ].map((product, i) => (
              <FadeIn key={i}>
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-start ${i % 2 === 1 ? '' : ''}`}>
                  <div className={`lg:col-span-4 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <h3 className="text-2xl font-medium text-[#0f0e0d] mb-3" style={{ letterSpacing: '-0.01em' }}>{product.title}</h3>
                    <p className="text-[15px] text-[#706d66] leading-[1.7] mb-5">{product.desc}</p>
                    <Link href={product.href} className="text-sm text-[#0f0e0d] underline underline-offset-4 hover:text-[#706d66] transition-colors">
                      Learn more &rarr;
                    </Link>
                  </div>
                  <div className={`lg:col-span-8 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="rounded-sm overflow-hidden border border-[#e5e5e3] aspect-video bg-[#f2f1f0] flex items-center justify-center" style={{ boxShadow: '0 20px 50px -12px rgba(0,0,0,0.08)' }}>
                      <p className="text-sm text-[#adaba5]">{product.title}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <CTASection />
    </div>
  )
}
