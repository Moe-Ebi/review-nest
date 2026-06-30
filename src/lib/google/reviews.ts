import { createAdminClient } from '@/lib/supabase/admin'
import { refreshAccessToken } from '@/lib/google/locations'

interface GoogleReview {
  name: string
  reviewer: { displayName: string; profilePhotoUrl?: string }
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE'
  comment?: string
  createTime: string
}

const STAR_MAP: Record<string, number> = {
  ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
}

export async function syncReviewsForLocation(locationId: string): Promise<{
  synced: number
  error?: string
}> {
  const admin = createAdminClient()

  // Load location + connection
  const { data: location } = await admin
    .from('locations')
    .select('google_location_id, google_connection_id')
    .eq('id', locationId)
    .single()

  if (!location?.google_connection_id) {
    return { synced: 0, error: 'No Google connection for this location' }
  }

  const accessToken = await refreshAccessToken(location.google_connection_id)
  if (!accessToken) {
    return { synced: 0, error: 'Could not refresh Google access token' }
  }

  // The Business Information API stores location ids as "locations/{id}" (no
  // account prefix), but the v4 reviews API needs the full resource path
  // "accounts/{accountId}/locations/{id}/reviews". Look up the account(s) for
  // this connection and find the one that owns this location.
  const accountsRes = await fetch(
    'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!accountsRes.ok) {
    const body = await accountsRes.text()
    console.error('[Reviews] accounts fetch failed:', accountsRes.status, body)
    return { synced: 0, error: `Google accounts error: ${accountsRes.status} ${body}` }
  }
  const accountsData = await accountsRes.json()
  const accounts: { name: string }[] = accountsData.accounts ?? []
  const locationNumericId = location.google_location_id.replace(/^locations\//, '')

  // Fetch all review pages. Try each account until one owns this location.
  const allReviews: GoogleReview[] = []
  let matched = false
  let lastError = ''

  for (const account of accounts) {
    let pageToken: string | undefined
    const accountReviews: GoogleReview[] = []
    let accountOk = true

    do {
      const params = new URLSearchParams({ pageSize: '50' })
      if (pageToken) params.set('pageToken', pageToken)

      const res = await fetch(
        `https://mybusiness.googleapis.com/v4/${account.name}/locations/${locationNumericId}/reviews?${params}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )

      if (!res.ok) {
        const body = await res.text()
        console.error('[Reviews] fetch failed for', account.name, ':', res.status, body)
        lastError = `Google API error: ${res.status} ${body}`
        accountOk = false
        break
      }

      const data = await res.json()
      accountReviews.push(...(data.reviews ?? []))
      pageToken = data.nextPageToken
    } while (pageToken)

    if (accountOk) {
      allReviews.push(...accountReviews)
      matched = true
      break
    }
  }

  if (!matched) {
    return { synced: 0, error: lastError || 'No Google account owns this location' }
  }

  if (allReviews.length === 0) {
    await admin
      .from('locations')
      .update({ last_synced_at: new Date().toISOString(), review_count: 0 })
      .eq('id', locationId)
    return { synced: 0 }
  }

  // Upsert all reviews
  const rows = allReviews.map((r) => ({
    location_id: locationId,
    google_review_id: r.name,
    reviewer_name: r.reviewer.displayName,
    reviewer_photo_url: r.reviewer.profilePhotoUrl ?? null,
    star_rating: STAR_MAP[r.starRating] ?? 0,
    review_text: r.comment ?? null,
    review_date: r.createTime,
    updated_at: new Date().toISOString(),
  }))

  const { error: upsertError } = await admin
    .from('reviews')
    .upsert(rows, { onConflict: 'google_review_id' })

  if (upsertError) {
    return { synced: 0, error: upsertError.message }
  }

  // Update last_synced_at and review_count on the location
  await admin
    .from('locations')
    .update({
      last_synced_at: new Date().toISOString(),
      review_count: allReviews.length,
    })
    .eq('id', locationId)

  return { synced: allReviews.length }
}
