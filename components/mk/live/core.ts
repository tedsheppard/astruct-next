'use client'

import { useEffect, useRef, useState } from 'react'

// The live fragments run on one idea: a looping clock, in milliseconds, that
// only ticks while the fragment is on screen. Each fragment derives what it
// shows from that number, so a paused fragment resumes exactly where it was.
// Before JavaScript runs, and for visitors who prefer reduced motion, the
// clock reads FINAL and every fragment shows its finished state.

export const FINAL = 1e9

function prefersReduced(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useLoop<T extends HTMLElement = HTMLDivElement>(duration: number, threshold = 0.25) {
  const ref = useRef<T>(null)
  const [t, setT] = useState(FINAL)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return
    let raf = 0
    let last = 0
    let acc = 0
    let visible = false
    setT(0)
    const frame = (now: number) => {
      if (!visible) { raf = 0; return }
      if (last) acc += Math.min(now - last, 80)
      last = now
      setT(Math.floor((acc % duration) / 30) * 30)
      raf = requestAnimationFrame(frame)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) { last = 0; raf = requestAnimationFrame(frame) }
    }, { threshold })
    io.observe(el)
    const onChange = () => {
      if (!mq.matches) return
      visible = false
      cancelAnimationFrame(raf)
      raf = 0
      setT(FINAL)
    }
    mq.addEventListener?.('change', onChange)
    return () => { io.disconnect(); cancelAnimationFrame(raf); mq.removeEventListener?.('change', onChange) }
  }, [duration, threshold])
  return [ref, t] as const
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
  const ref = useRef<T>(null)
  const [t, setT] = useState(FINAL)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const narrow = window.matchMedia('(max-width: 900px)')
    let raf = 0
    const measure = () => {
      raf = 0
      if (reduce.matches || narrow.matches) { setT(FINAL); return }
      const r = el.getBoundingClientRect()
      const span = r.height - window.innerHeight
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1
      setT(Math.round((p * end) / 20) * 20)
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    reduce.addEventListener?.('change', on)
    narrow.addEventListener?.('change', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      reduce.removeEventListener?.('change', on)
      narrow.removeEventListener?.('change', on)
      cancelAnimationFrame(raf)
    }
  }, [end])
  return [ref, t] as const
}
