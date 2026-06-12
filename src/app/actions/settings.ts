'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function saveWidgetSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const locationId = formData.get('locationId') as string

  const admin = createAdminClient()
  await admin.from('widget_settings').upsert(
    {
      location_id: locationId,
      layout: formData.get('layout') as string,
      accent_color: formData.get('accent_color') as string,
      background_color: formData.get('background_color') as string,
      text_color: formData.get('text_color') as string,
      number_of_reviews: parseInt(formData.get('number_of_reviews') as string, 10),
      min_star_rating: parseInt(formData.get('min_star_rating') as string, 10),
      show_agency_branding: formData.get('show_agency_branding') === 'true',
      agency_name: formData.get('agency_name') as string,
      agency_url: formData.get('agency_url') as string,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'location_id' }
  )

  redirect(`/dashboard/locations/${locationId}?saved=1`)
}
