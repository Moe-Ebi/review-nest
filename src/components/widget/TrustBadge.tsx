'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReviewData, WidgetStats } from './types'
import ReviewCard from './ReviewCard'
import { CloseIcon, GoogleG, Stars } from './icons'

interface Props {
  reviews: ReviewData[]
  stats: WidgetStats
  cta?: { text: string; url: string }
}

/** Compact trust badge for headers, product, cart and checkout pages. */
export default function TrustBadge({ reviews, stats, cta }: Props) {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    setIsMobile(window.matchMedia('(max-width: 640px)').matches)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onClick = (e: MouseEvent) => {
      if (hostRef.current && !hostRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick, true)
    }
  }, [open])

  return (
    <div className="rn-badge-host" ref={hostRef}>
      <button
        className="rn-badge"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Rated ${stats.average.toFixed(1)} out of 5 from ${stats.total} Google reviews. Open reviews.`}
        onClick={() => setOpen((o) => !o)}
      >
        <GoogleG />
        <span className="rn-badge-score">{stats.average.toFixed(1)}</span>
        <Stars rating={Math.round(stats.average)} />
        <span className="rn-badge-n">({stats.total})</span>
      </button>

      {open && (
        <>
          {isMobile && <div className="rn-overlay rn-in" onClick={() => setOpen(false)} aria-hidden="true" />}
          <div
            className={`rn-panel ${isMobile ? 'rn-panel-sheet' : 'rn-panel-down'}`}
            role="dialog"
            aria-label="Google reviews"
          >
            <div className="rn-panel-head">
              <div className="rn-panel-title">
                ★ {stats.average.toFixed(1)} · {stats.total} Google reviews
              </div>
              <button className="rn-close" aria-label="Close reviews" onClick={() => setOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            {reviews.length ? (
              reviews.map((r, i) => <ReviewCard key={i} review={r} />)
            ) : (
              <div className="rn-note">No reviews yet.</div>
            )}
            {cta && (
              <div className="rn-cta-row">
                <a className="rn-cta" href={cta.url} target="_blank" rel="noopener noreferrer">
                  {cta.text}
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
