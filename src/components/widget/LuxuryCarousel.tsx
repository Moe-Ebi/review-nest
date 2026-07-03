'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReviewData } from './types'
import ReviewCard from './ReviewCard'
import { Chevron } from './icons'

interface Props {
  reviews: ReviewData[]
  /** Measured width of the widget container (drives cards-per-view). */
  containerWidth: number
}

function perViewFor(w: number): number {
  return w >= 940 ? 3 : w >= 640 ? 2 : 1
}

export default function LuxuryCarousel({ reviews, containerWidth }: Props) {
  const perView = perViewFor(containerWidth)
  const pageCount = Math.max(1, Math.ceil(reviews.length / perView))
  const [page, setPage] = useState(0)
  const [translate, setTranslate] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const touch = useRef({ x: 0, y: 0, t: 0, horizontal: null as boolean | null })

  const clampedPage = Math.min(page, pageCount - 1)

  const measureTranslate = useCallback(
    (p: number) => {
      const track = trackRef.current
      const slide = track?.firstElementChild as HTMLElement | null
      if (!track || !slide) return 0
      const styles = getComputedStyle(track)
      const gap = parseFloat(styles.columnGap || styles.gap) || 18
      const step = slide.getBoundingClientRect().width + gap
      const max = Math.max(0, track.scrollWidth - track.clientWidth)
      return Math.min(p * perView * step, max)
    },
    [perView]
  )

  useLayoutEffect(() => {
    setTranslate(measureTranslate(clampedPage))
  }, [clampedPage, containerWidth, measureTranslate, reviews.length])

  useEffect(() => {
    // Keep roughly the same reviews in view when the column count changes.
    setPage((p) => Math.min(p, pageCount - 1))
  }, [pageCount])

  const go = (delta: number) =>
    setPage((p) => Math.max(0, Math.min(p + delta, pageCount - 1)))

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now(), horizontal: null }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    if (Math.abs(dx) < Math.abs(dy)) return
    const dt = Date.now() - touch.current.t
    const flick = Math.abs(dx) > 30 && dt < 280
    if (dx < -60 || (flick && dx < 0)) go(1)
    else if (dx > 60 || (flick && dx > 0)) go(-1)
  }

  const from = clampedPage * perView + 1
  const to = Math.min(reviews.length, from + perView - 1)
  const showNav = reviews.length > perView

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Customer reviews">
      <div
        className="rn-viewport"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
          if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className="rn-track"
          style={{ transform: `translateX(${-translate}px)` }}
        >
          {reviews.map((r, i) => (
            <div
              key={i}
              className="rn-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`Review ${i + 1} of ${reviews.length}`}
            >
              <ReviewCard review={r} />
            </div>
          ))}
        </div>
      </div>

      {showNav && (
        <div className="rn-nav">
          <button className="rn-arrow" aria-label="Previous reviews" disabled={clampedPage === 0} onClick={() => go(-1)}>
            <Chevron left />
          </button>
          <div className="rn-dots" role="tablist" aria-label="Review pages">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === clampedPage}
                aria-label={`Go to review page ${i + 1}`}
                className={`rn-dot${i === clampedPage ? ' rn-on' : ''}`}
                onClick={() => setPage(i)}
              >
                <span />
              </button>
            ))}
          </div>
          <button className="rn-arrow" aria-label="Next reviews" disabled={clampedPage >= pageCount - 1} onClick={() => go(1)}>
            <Chevron />
          </button>
        </div>
      )}

      <div className="rn-sr" aria-live="polite">
        Showing reviews {from} to {to} of {reviews.length}
      </div>
    </div>
  )
}
