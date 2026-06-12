import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  const { locationId } = await params
  const admin = createAdminClient()

  const [{ data: location }, { data: settings }, { data: reviews }] = await Promise.all([
    admin.from('locations').select('id, business_name').eq('id', locationId).single(),
    admin.from('widget_settings').select('*').eq('location_id', locationId).single(),
    admin
      .from('reviews')
      .select('reviewer_name, reviewer_photo_url, star_rating, review_text, review_date')
      .eq('location_id', locationId)
      .order('star_rating', { ascending: false })
      .order('review_date', { ascending: false }),
  ])

  if (!location) {
    return NextResponse.json({ error: 'Location not found' }, { status: 404, headers: CORS })
  }

  const minRating = settings?.min_star_rating ?? 4
  const count = settings?.number_of_reviews ?? 10
  const filtered = (reviews ?? [])
    .filter((r) => r.star_rating >= minRating)
    .slice(0, count)

  return NextResponse.json(
    {
      location: { id: location.id, name: location.business_name },
      settings: settings ?? {
        layout: 'grid',
        accent_color: '#3b82f6',
        background_color: '#ffffff',
        text_color: '#111827',
        number_of_reviews: 10,
        min_star_rating: 4,
        show_agency_branding: true,
        agency_name: 'ReviewNest',
        agency_url: 'https://reviewnest.com',
      },
      reviews: filtered,
    },
    { headers: { ...CORS, 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
  )
}
