'use client'

import type { ReviewData } from './types'
import ReviewCard from './ReviewCard'

/** Masonry-style review wall for dedicated review pages (columns follow container width). */
export default function ReviewWall({ reviews }: { reviews: ReviewData[] }) {
  return (
    <div className="rn-wall">
      {reviews.map((r, i) => (
        <ReviewCard key={i} review={r} />
      ))}
    </div>
  )
}
