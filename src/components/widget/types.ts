// Canonical widget types — mirrors the data returned by /api/widget/[locationId]

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

export interface WidgetStats {
  total: number
  average: number
}

export type WidgetMode = 'carousel' | 'grid' | 'badge'
export type WidgetTheme = 'light' | 'dark' | 'auto'

export function computeStats(reviews: ReviewData[]): WidgetStats {
  const n = reviews.length
  if (!n) return { total: 0, average: 0 }
  const sum = reviews.reduce((s, r) => s + (r.star_rating || 0), 0)
  return { total: n, average: Math.round((sum / n) * 10) / 10 }
}

export function resolveMode(
  override: WidgetMode | undefined,
  layout: WidgetSettings['layout']
): WidgetMode {
  const raw = override ?? (layout === 'list' ? 'grid' : layout)
  return raw === 'grid' || raw === 'badge' ? raw : 'carousel'
}
