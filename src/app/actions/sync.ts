'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { syncReviewsForLocation } from '@/lib/google/reviews'

export async function syncLocation(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const locationId = formData.get('locationId') as string
  await syncReviewsForLocation(locationId)

  redirect('/dashboard')
}
