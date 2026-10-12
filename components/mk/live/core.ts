'use client'

import { useEffect, useRef, useState } from 'react'

// The live fragments run on one idea: a looping clock, in milliseconds, that
// only ticks while the fragment is on screen. Each fragment derives what it
// shows from that number, so a paused fragment resumes exactly where it was.
// Before JavaScript runs, and for visitors who prefer reduced motion, the
// clock reads FINAL and every fragment shows its finished state.

export const FINAL = 1e9

export function prefersReduced(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * The fragments rest on their finished state. Ted saw panels sit empty while
 * a loop restarted from zero, so the clock no longer runs: every fragment
 * shows its complete content on first paint and stays that way. Motion lives
 * in CSS accents (live dots, a sweep across rows) that never hide content.
 */
export function useLoop<T extends HTMLElement = HTMLDivElement>(duration: number, threshold = 0.25) {
  void duration; void threshold
  const ref = useRef<T>(null)
  return [ref, FINAL] as const
}

/** True while the element is on screen (and motion is allowed). */
export function useActive<T extends HTMLElement = HTMLDivElement>(threshold = 0.25) {
  const ref = useRef<T>(null)
  const [active, setActive] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, active] as const
}

/** The part of `s` typed by time t, starting at `start`, one character every `ms`. */
export function typed(s: string, t: number, start: number, ms = 36): string {
  if (t < start) return ''
  return s.slice(0, Math.floor((t - start) / ms))
}

/** When typing `s` from `start` finishes. */
export const typedEnd = (s: string, start: number, ms = 36) => start + s.length * ms

/** 0 to 1 across [a, b], eased. */
export function prog(t: number, a: number, b: number): number {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)))
  return 1 - Math.pow(1 - x, 3)
}

export const fmt = (n: number) => n.toLocaleString('en-AU')

/**
 * Time on a timeline driven by scroll instead of the clock: the element is a
 * tall track whose child sticks; as the track scrolls past, t runs from 0 to
 * `end`, and back again when scrolling up. Phones (below 900 px), reduced
 * motion and no-JS all get FINAL, the finished state.
 */
export function useScrollTime<T extends HTMLElement = HTMLDivElement>(end: number) {
  void end
  const ref = useRef<T>(null)
  return [ref, FINAL] as const
}
