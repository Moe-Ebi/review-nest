'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { syncReviewsForLocation } from '@/lib/google/reviews'

export async function syncLocation(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const locationId = formData.get('locationId') as string
  const result = await syncReviewsForLocation(locationId)
  if (result.error) {
    console.error('[Sync] location', locationId, 'failed:', result.error)
  } else {
    console.log('[Sync] location', locationId, 'synced', result.synced, 'reviews')
  }

  redirect('/dashboard')
}
