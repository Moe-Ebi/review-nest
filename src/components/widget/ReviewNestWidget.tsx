'use client'

import { useEffect, useRef, useState } from 'react'
import {
  computeStats,
  resolveMode,
  type ReviewData,
  type WidgetMode,
  type WidgetSettings,
  type WidgetStats,
  type WidgetTheme,
} from './types'
import { SCOPED_CSS } from './theme'
import TrustSummary from './TrustSummary'
import LuxuryCarousel from './LuxuryCarousel'
import ReviewWall from './ReviewWall'
import TrustBadge from './TrustBadge'

interface Props {
  reviews: ReviewData[]
  settings: WidgetSettings
  stats?: WidgetStats
  /** Per-placement override of the dashboard-configured layout. */
  mode?: WidgetMode
  theme?: WidgetTheme
  headline?: string
  cta?: { text: string; url: string }
}

export default function ReviewNestWidget({
  reviews,
  settings,
  stats,
  mode,
  theme = 'light',
  headline,
  cta,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const apply = () => setWidth(el.clientWidth)
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const resolvedMode = resolveMode(mode, settings.layout)
  const resolvedStats = stats && stats.total ? stats : computeStats(reviews)
  const sizeClass = width >= 940 ? 'rn--lg' : width >= 640 ? 'rn--md' : 'rn--sm'

  // Dashboard colours become CSS-variable defaults — mirroring the embed,
  // the dark theme palette takes precedence over dashboard bg/text colours,
  // and a painted background (default white) is always honoured so the
  // preview matches what legacy embeds render on client sites.
  const vars: Record<string, string> = {}
  if (settings.accent_color) vars['--rn-primary'] = settings.accent_color
  let hasBg = false
  if (theme === 'light') {
    const bg = (settings.background_color || '').toLowerCase()
    if (bg && bg !== 'transparent') {
      vars['--rn-bg'] = settings.background_color
      hasBg = true
    }
    if (settings.text_color) vars['--rn-text'] = settings.text_color
  }

  return (
    <div className="rn-scope" data-rn-theme={theme} style={vars as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />
      <div ref={wrapRef} className={`rn-wrap ${sizeClass}${hasBg ? ' rn-has-bg' : ''}`}>
        {resolvedMode === 'badge' ? (
          <TrustBadge reviews={reviews} stats={resolvedStats} cta={cta} />
        ) : (
          <>
            <TrustSummary stats={resolvedStats} headline={headline} />
            {reviews.length === 0 ? (
              <div className="rn-note">No reviews to display yet.</div>
            ) : resolvedMode === 'grid' ? (
              <ReviewWall reviews={reviews} />
            ) : (
              <LuxuryCarousel reviews={reviews} containerWidth={width} />
            )}
            {cta && (
              <div className="rn-cta-row">
                <a className="rn-cta" href={cta.url} target="_blank" rel="noopener noreferrer">
                  {cta.text}
                </a>
              </div>
            )}
            {settings.show_agency_branding && settings.agency_name && (
              <div className="rn-footer">
                Powered by{' '}
                {settings.agency_url ? (
                  <a href={settings.agency_url} target="_blank" rel="noopener noreferrer">
                    {settings.agency_name}
                  </a>
                ) : (
                  <span>{settings.agency_name}</span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
