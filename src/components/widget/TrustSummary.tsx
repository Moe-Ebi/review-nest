'use client'

import type { WidgetStats } from './types'
import { FractionalStars, GoogleG } from './icons'

interface Props {
  stats: WidgetStats
  headline?: string
}

export default function TrustSummary({ stats, headline }: Props) {
  return (
    <div className="rn-summary">
      <h2 className="rn-headline">{headline || 'What our customers say'}</h2>
      <div className="rn-summary-row">
        <span className="rn-avg">{stats.average.toFixed(1)}</span>
        <FractionalStars average={stats.average} />
      </div>
      <div className="rn-count">
        <GoogleG />
        Based on {stats.total} Google review{stats.total === 1 ? '' : 's'}
      </div>
    </div>
  )
}
