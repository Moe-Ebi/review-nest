import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const stateParam = searchParams.get('state')

  // Decode state to know if this came from a client connect or admin connect
  let isClientConnect = false
  let clientEmail: string | null = null
  if (stateParam) {
    try {
      const decoded = JSON.parse(Buffer.from(stateParam, 'base64').toString())
      isClientConnect = decoded.source === 'client'
      clientEmail = decoded.email ?? null
    } catch { /* ignore malformed state */ }
  }

  const errorRedirect = isClientConnect ? '/client?error=google_denied' : '/dashboard?error=google_denied'

  if (error || !code) {
    return NextResponse.redirect(new URL(errorRedirect, process.env.NEXTAUTH_URL!))
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL!))

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
    return NextResponse.redirect(new URL(errorRedirect, process.env.NEXTAUTH_URL!))
  }

  const tokens = await tokenRes.json()

  const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  const profile = await profileRes.json()

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
    return NextResponse.redirect(new URL(errorRedirect, process.env.NEXTAUTH_URL!))
  }

  // For client connects, go to the client-specific locations picker
  if (isClientConnect) {
    return NextResponse.redirect(
      new URL(`/client/connect/${connection.id}`, process.env.NEXTAUTH_URL!)
    )
  }

  return NextResponse.redirect(
    new URL(`/dashboard/connect/${connection.id}`, process.env.NEXTAUTH_URL!)
  )
}
