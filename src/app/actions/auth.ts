'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const admin = createAdminClient()
  const { data: record } = await admin
    .from('team_allowlist')
    .select('status, role')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (!record) redirect('/login?error=not_allowed')
  if (record.status === 'pending') redirect('/login?error=pending')
  if (record.status === 'denied') redirect('/login?error=denied')

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect('/login?error=invalid_credentials')

  redirect(record.role === 'admin' ? '/dashboard' : '/client')
}

export async function signup(formData: FormData) {
  const name = (formData.get('name') as string).trim()
  const email = (formData.get('email') as string).toLowerCase().trim()
  const password = formData.get('password') as string
  const role = formData.get('role') as 'admin' | 'client'

  const admin = createAdminClient()

  // Check not already registered
  const { data: existing } = await admin
    .from('team_allowlist')
    .select('email')
    .eq('email', email)
    .single()

  if (existing) redirect('/signup?error=already_registered')

  // Create Supabase Auth user (admin-created so no confirmation email needed)
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) redirect('/signup?error=create_failed')

  // Insert pending allowlist record
  await admin.from('team_allowlist').insert({
    email,
    name,
    role,
    status: 'pending',
  })

  redirect('/signup?success=1')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
