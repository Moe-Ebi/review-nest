import type { SupabaseClient } from '@supabase/supabase-js'

const PAGE = 1000
const DELETE_CHUNK = 100

/**
 * Delete stored reviews for a location that Google did not return in the
 * latest full fetch (reviews removed on Google, or leftover copies stored
 * under an older google_review_id). Returns how many rows were removed.
 */
export async function pruneStaleReviews(
  admin: SupabaseClient,
  locationId: string,
  keepGoogleIds: Set<string>
): Promise<{ removed: number; error?: string }> {
  const staleIds: string[] = []

  for (let from = 0; ; from += PAGE) {
    const { data, error } = await admin
      .from('reviews')
      .select('id, google_review_id')
      .eq('location_id', locationId)
      .order('id')
      .range(from, from + PAGE - 1)

    if (error) return { removed: 0, error: error.message }
    for (const row of data ?? []) {
      if (!keepGoogleIds.has(row.google_review_id)) staleIds.push(row.id)
    }
    if (!data || data.length < PAGE) break
  }

  let removed = 0
  for (let i = 0; i < staleIds.length; i += DELETE_CHUNK) {
    const chunk = staleIds.slice(i, i + DELETE_CHUNK)
    const { error } = await admin.from('reviews').delete().in('id', chunk)
    if (error) return { removed, error: error.message }
    removed += chunk.length
  }

  return { removed }
}
