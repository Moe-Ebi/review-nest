import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { syncReviewsForLocation } from '@/lib/google/reviews'

// Vercel Cron calls this every day at 3am UTC
// Vercel sets the Authorization header automatically for cron routes
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: locations } = await admin
    .from('locations')
    .select('id, business_name')

  if (!locations || locations.length === 0) {
    return NextResponse.json({ message: 'No locations to sync', synced: 0 })
  }

  const results = await Promise.allSettled(
    locations.map((loc) => syncReviewsForLocation(loc.id))
  )

  const summary = results.map((r, i) => ({
    location: locations[i].business_name,
    ...(r.status === 'fulfilled' ? r.value : { synced: 0, error: String(r.reason) }),
  }))

  return NextResponse.json({ summary })
}
