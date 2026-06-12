'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Check allowlist first using the admin client (bypasses RLS)
  const admin = createAdminClient()
  const { data: allowed } = await admin
    .from('team_allowlist')
    .select('email')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (!allowed) {
    redirect('/login?error=not_allowed')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect('/login?error=invalid_credentials')
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
