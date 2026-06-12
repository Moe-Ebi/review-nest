'use client'

import { useState, useEffect } from 'react'

export interface WidgetSettings {
  layout: 'carousel' | 'grid' | 'list' | 'badge'
  accent_color: string
  background_color: string
  text_color: string
  number_of_reviews: number
  min_star_rating: number
  show_agency_branding: boolean
  agency_name: string
  agency_url: string
}

export interface ReviewData {
  reviewer_name: string
  reviewer_photo_url: string | null
  star_rating: number
  review_text: string | null
  review_date: string
}

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
    review_text: 'Outstanding experience from start to finish. Very impressed with the attention to detail and the friendly staff.',
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

function StarRating({ rating, color }: { rating: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-4 h-4" fill={s <= rating ? color : '#d1d5db'} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function Avatar({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photoUrl} alt={name} className="w-10 h-10 rounded-full object-cover" />
  }
  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function ReviewCard({
  review,
  settings,
  compact = false,
}: {
  review: ReviewData
  settings: WidgetSettings
  compact?: boolean
}) {
  const date = new Date(review.review_date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-3"
      style={{
        backgroundColor: settings.background_color,
        borderColor: `${settings.accent_color}33`,
        color: settings.text_color,
      }}
    >
      <div className="flex items-start gap-3">
        <Avatar name={review.reviewer_name} photoUrl={review.reviewer_photo_url} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{review.reviewer_name}</p>
          <StarRating rating={review.star_rating} color={settings.accent_color} />
        </div>
        <span className="text-xs opacity-50 shrink-0">{date}</span>
      </div>
      {review.review_text && (
        <p className={`text-sm opacity-80 leading-relaxed ${compact ? 'line-clamp-3' : 'line-clamp-4'}`}>
          {review.review_text}
        </p>
      )}
    </div>
  )
}

function GridLayout({ reviews, settings }: { reviews: ReviewData[]; settings: WidgetSettings }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {reviews.slice(0, settings.number_of_reviews).map((r, i) => (
        <ReviewCard key={i} review={r} settings={settings} compact />
      ))}
    </div>
  )
}

function ListLayout({ reviews, settings }: { reviews: ReviewData[]; settings: WidgetSettings }) {
  return (
    <div className="flex flex-col gap-3">
      {reviews.slice(0, settings.number_of_reviews).map((r, i) => (
        <ReviewCard key={i} review={r} settings={settings} />
      ))}
    </div>
  )
}

function CarouselLayout({ reviews, settings }: { reviews: ReviewData[]; settings: WidgetSettings }) {
  const [idx, setIdx] = useState(0)
  const visible = reviews.slice(0, settings.number_of_reviews)

  return (
    <div className="relative">
      <ReviewCard review={visible[idx]} settings={settings} />
      <div className="flex items-center justify-center gap-2 mt-3">
        <button
          onClick={() => setIdx((i) => (i - 1 + visible.length) % visible.length)}
          className="w-8 h-8 rounded-full border flex items-center justify-center text-sm hover:opacity-70 transition"
          style={{ borderColor: settings.accent_color, color: settings.accent_color }}
        >
          ‹
        </button>
        <span className="text-xs opacity-50" style={{ color: settings.text_color }}>
          {idx + 1} / {visible.length}
        </span>
        <button
          onClick={() => setIdx((i) => (i + 1) % visible.length)}
          className="w-8 h-8 rounded-full border flex items-center justify-center text-sm hover:opacity-70 transition"
          style={{ borderColor: settings.accent_color, color: settings.accent_color }}
        >
          ›
        </button>
      </div>
    </div>
  )
}

function BadgeLayout({ reviews, settings }: { reviews: ReviewData[]; settings: WidgetSettings }) {
  const [open, setOpen] = useState(false)
  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.star_rating, 0) / reviews.length).toFixed(1)
    : '5.0'

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full px-4 py-2 shadow-lg text-sm font-semibold"
        style={{ backgroundColor: settings.accent_color, color: '#fff' }}
      >
        <span>★ {avg}</span>
        <span className="opacity-80">· Google Reviews</span>
      </button>
      {open && (
        <div
          className="absolute bottom-12 left-0 w-80 rounded-xl shadow-2xl border p-4 flex flex-col gap-3 max-h-96 overflow-y-auto z-10"
          style={{ backgroundColor: settings.background_color, borderColor: `${settings.accent_color}33` }}
        >
          {reviews.slice(0, settings.number_of_reviews).map((r, i) => (
            <ReviewCard key={i} review={r} settings={settings} compact />
          ))}
        </div>
      )}
    </div>
  )
}

interface Props {
  initialSettings: WidgetSettings
  reviews: ReviewData[]
}

export default function WidgetPreview({ initialSettings, reviews }: Props) {
  const [settings, setSettings] = useState<WidgetSettings>(initialSettings)

  // Listen for settings changes from the form via a custom event
  useEffect(() => {
    const handler = (e: CustomEvent<Partial<WidgetSettings>>) => {
      setSettings((prev) => ({ ...prev, ...e.detail }))
    }
    window.addEventListener('widget-settings-change', handler as EventListener)
    return () => window.removeEventListener('widget-settings-change', handler as EventListener)
  }, [])

  const displayReviews = reviews.length > 0
    ? reviews.filter((r) => r.star_rating >= settings.min_star_rating)
    : PLACEHOLDER_REVIEWS.filter((r) => r.star_rating >= settings.min_star_rating)

  const isEmpty = displayReviews.length === 0

  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-2xl p-5 min-h-48"
        style={{ backgroundColor: settings.background_color }}
      >
        {isEmpty ? (
          <p className="text-center text-sm opacity-40 py-8" style={{ color: settings.text_color }}>
            No reviews match the minimum star rating.
          </p>
        ) : settings.layout === 'grid' ? (
          <GridLayout reviews={displayReviews} settings={settings} />
        ) : settings.layout === 'list' ? (
          <ListLayout reviews={displayReviews} settings={settings} />
        ) : settings.layout === 'carousel' ? (
          <CarouselLayout reviews={displayReviews} settings={settings} />
        ) : (
          <BadgeLayout reviews={displayReviews} settings={settings} />
        )}

        {settings.show_agency_branding && (
          <div className="mt-4 pt-3 border-t flex items-center gap-1.5" style={{ borderColor: `${settings.text_color}15` }}>
            <span className="text-xs opacity-40" style={{ color: settings.text_color }}>
              Powered by{' '}
              <a href={settings.agency_url} className="underline" style={{ color: settings.accent_color }}>
                {settings.agency_name}
              </a>
            </span>
            <span className="text-xs opacity-30 ml-auto" style={{ color: settings.text_color }}>
              Reviews from Google
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 && (
        <p className="text-xs text-gray-500 text-center">
          Showing placeholder reviews — real reviews will appear after syncing.
        </p>
      )}
    </div>
  )
}
