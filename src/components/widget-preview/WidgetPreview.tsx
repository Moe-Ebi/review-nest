'use client'

import { useEffect, useState } from 'react'
import ReviewNestWidget from '@/components/widget/ReviewNestWidget'
import type { ReviewData, WidgetSettings, WidgetTheme } from '@/components/widget/types'

// Re-exported so existing imports (SettingsForm, dashboard pages) keep working.
export type { WidgetSettings, ReviewData }

const PLACEHOLDER_REVIEWS: ReviewData[] = [
  {
    reviewer_name: 'Sarah M.',
    reviewer_photo_url: null,
    star_rating: 5,
    review_text: 'Absolutely fantastic service! The team was professional and incredibly helpful. Would highly recommend to anyone looking for quality work.',
    review_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    reviewer_name: 'James T.',
    reviewer_photo_url: null,
    star_rating: 5,
    review_text: 'Outstanding experience from start to finish. Very impressed with the attention to detail and the friendly staff. From the first phone call to the final handover everything was communicated clearly, deadlines were met, and the pricing was exactly as quoted with no surprises at all. Genuinely impressed and will absolutely be using them again.',
    review_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    reviewer_name: 'Priya K.',
    reviewer_photo_url: null,
    star_rating: 4,
    review_text: 'Really great overall. A few minor things could be improved but the core service is excellent and I will definitely be back.',
    review_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    reviewer_name: 'Michael B.',
    reviewer_photo_url: null,
    star_rating: 5,
    review_text: 'Exceeded all my expectations. Fast, reliable, and the results speak for themselves. 10/10.',
    review_date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    reviewer_name: 'Emma L.',
    reviewer_photo_url: null,
    star_rating: 4,
    review_text: 'Very professional service. I appreciated how they kept me informed throughout the whole process.',
    review_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

interface Props {
  initialSettings: WidgetSettings
  reviews: ReviewData[]
}

export default function WidgetPreview({ initialSettings, reviews }: Props) {
  const [settings, setSettings] = useState<WidgetSettings>(initialSettings)
  const [theme, setTheme] = useState<WidgetTheme>('light')

  // Listen for settings changes from the form via a custom event
  useEffect(() => {
    const handler = (e: CustomEvent<Partial<WidgetSettings>>) => {
      setSettings((prev) => ({ ...prev, ...e.detail }))
    }
    window.addEventListener('widget-settings-change', handler as EventListener)
    return () => window.removeEventListener('widget-settings-change', handler as EventListener)
  }, [])

  const source = reviews.length > 0 ? reviews : PLACEHOLDER_REVIEWS
  const displayReviews = source
    .filter((r) => r.star_rating >= settings.min_star_rating)
    .slice(0, settings.number_of_reviews)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end gap-1">
        {(['light', 'dark'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`text-xs px-3 py-1 rounded-full border transition ${
              theme === t
                ? 'bg-gray-900 text-white border-gray-900'
                : 'text-gray-500 border-gray-300 hover:border-gray-400'
            }`}
          >
            {t === 'light' ? 'Light' : 'Dark'}
          </button>
        ))}
      </div>

      <div className={`rounded-2xl p-3 sm:p-5 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <ReviewNestWidget reviews={displayReviews} settings={settings} theme={theme} />
      </div>

      {reviews.length === 0 && (
        <p className="text-xs text-gray-500 text-center">
          Showing placeholder reviews — real reviews will appear after syncing.
        </p>
      )}
    </div>
  )
}
