'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReviewData } from './types'
import { GoogleG, Stars } from './icons'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ReviewCard({ review }: { review: ReviewData }) {
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    const check = () => {
      if (!expanded) setOverflows(el.scrollHeight > el.clientHeight + 2)
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [review.review_text, expanded])

  const initial = (review.reviewer_name || '?').charAt(0).toUpperCase()

  return (
    <article className="rn-card" aria-label={`Review by ${review.reviewer_name || 'Anonymous'}`}>
      <div className="rn-card-head">
        {review.reviewer_photo_url && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="rn-avatar"
            src={review.reviewer_photo_url}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="rn-avatar-fb">{initial}</div>
        )}
        <div className="rn-who">
          <div className="rn-name">{review.reviewer_name || 'Anonymous'}</div>
          <div className="rn-date">{formatDate(review.review_date)}</div>
        </div>
      </div>

      <Stars rating={review.star_rating} />

      {review.review_text && (
        <>
          <p ref={textRef} className={`rn-text${expanded ? ' rn-open' : ''}`}>
            {review.review_text}
          </p>
          {(overflows || expanded) && (
            <button
              className="rn-readmore"
              aria-expanded={expanded}
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </>
      )}

      <div className="rn-verified">
        <GoogleG />
        Verified Google Review
      </div>
    </article>
  )
}
