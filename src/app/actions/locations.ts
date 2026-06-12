'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function addLocation(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const googleLocationId = formData.get('googleLocationId') as string
  const businessName = formData.get('businessName') as string
  const address = formData.get('address') as string
  const connectionId = formData.get('connectionId') as string

  const admin = createAdminClient()
  await admin.from('locations').upsert(
    {
      google_location_id: googleLocationId,
      business_name: businessName,
      address,
      google_connection_id: connectionId,
    },
    { onConflict: 'google_location_id' }
  )

  redirect('/dashboard')
}
