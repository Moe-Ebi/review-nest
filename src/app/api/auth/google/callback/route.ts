import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(
      new URL('/dashboard?error=google_denied', process.env.NEXTAUTH_URL!)
    )
  }

  // Verify the user is logged in to our dashboard
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL!))
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(
      new URL('/dashboard?error=token_exchange', process.env.NEXTAUTH_URL!)
    )
  }

  const tokens = await tokenRes.json()

  // Get the Google account email
  const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  const profile = await profileRes.json()

  // Save connection to Supabase (upsert so reconnecting updates tokens)
  const admin = createAdminClient()
  const { data: connection, error: dbError } = await admin
    .from('google_connections')
    .upsert(
      {
        google_account_email: profile.email,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        connected_by: user.email,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'google_account_email' }
    )
    .select()
    .single()

  if (dbError || !connection) {
    return NextResponse.redirect(
      new URL('/dashboard?error=db_save', process.env.NEXTAUTH_URL!)
    )
  }

  // Redirect to the locations picker for this connection
  return NextResponse.redirect(
    new URL(`/dashboard/connect/${connection.id}`, process.env.NEXTAUTH_URL!)
  )
}
