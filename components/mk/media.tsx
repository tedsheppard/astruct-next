'use client'

import { useEffect, useRef, useState } from 'react'
import { IPlay } from './icons'

/**
 * The hero's 15-second loop. The still frame (children) is the poster, drawn in
 * HTML so it is sharp at any size and follows the theme. The video fades in
 * over it only once it is actually playing, so until the files are delivered
 * (or if they fail, or the visitor prefers reduced motion) the still is the
 * finished picture. Phones get the vertical cut.
 */
export function HeroLoop({ desktop, phone, label }: { desktop: React.ReactNode; phone: React.ReactNode; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const isPhone = window.matchMedia('(max-width: 640px)').matches
    v.poster = isPhone ? '/media/explainer-15-vertical-poster.jpg' : '/media/explainer-15-poster.jpg'
    v.src = isPhone ? '/media/explainer-15-vertical.mp4' : '/media/explainer-15.mp4'
    v.play().catch(() => { /* autoplay refused or file missing: the still stays */ })
  }, [])

  return (
    <div className={`mk-media mk-hero-media${playing ? ' is-playing' : ''}`} role="img" aria-label={label}>
      <div className="mk-media-still mk-still-desktop" aria-hidden="true">{desktop}</div>
      <div className="mk-media-still mk-still-phone" aria-hidden="true">{phone}</div>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onPlaying={() => setPlaying(true)}
        onError={() => setPlaying(false)}
      />
    </div>
  )
}

/**
 * The walkthrough slot. Shows the still with a glass play control once the
 * video file exists; clicking plays it inline with controls. Until the file is
 * delivered the still stands on its own, with no control that goes nowhere.
 */
export function Walkthrough({ children, phone, label }: { children: React.ReactNode; phone: React.ReactNode; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [available, setAvailable] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let live = true
    fetch('/media/walkthrough.mp4', { method: 'HEAD' })
      .then((r) => { if (live && r.ok && (r.headers.get('content-type') || '').startsWith('video')) setAvailable(true) })
      .catch(() => {})
    return () => { live = false }
  }, [])

  const play = () => {
    const v = ref.current
    if (!v) return
    v.src = '/media/walkthrough.mp4'
    v.controls = true
    setOpen(true)
    v.play().catch(() => {})
  }

  return (
    <div className={`mk-media mk-media-16x9 mk-media-walk${open ? ' is-open' : ''}`}>
      <div className="mk-media-still mk-still-desktop" aria-hidden={open}>{children}</div>
      <div className="mk-media-still mk-still-phone" aria-hidden={open}>{phone}</div>
      <video ref={ref} playsInline preload="none" poster="/media/walkthrough-poster.jpg" aria-label={label} style={{ pointerEvents: open ? 'auto' : 'none' }} />
      {available && !open && (
        <button type="button" className="mk-play mk-glass" onClick={play} aria-label={`Play: ${label}`}>
          <IPlay />Watch the walkthrough
        </button>
      )}
    </div>
  )
}
