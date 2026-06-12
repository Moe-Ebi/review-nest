'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: record } = await admin
    .from('team_allowlist')
    .select('role')
    .eq('email', user.email!)
    .single()

  if (record?.role !== 'admin') redirect('/client')
  return user
}

export async function approveRequest(formData: FormData) {
  await assertAdmin()
  const email = formData.get('email') as string
  const admin = createAdminClient()
  await admin.from('team_allowlist').update({ status: 'approved' }).eq('email', email)
  redirect('/dashboard?approved=1')
}

export async function denyRequest(formData: FormData) {
  await assertAdmin()
  const email = formData.get('email') as string
  const admin = createAdminClient()
  await admin.from('team_allowlist').update({ status: 'denied' }).eq('email', email)
  redirect('/dashboard')
}
