import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// 'email' is required: the callback identifies which Google account connected
// by reading profile.email from the userinfo endpoint (upsert key on
// google_connections.google_account_email). 'profile' is not needed.
const SCOPES = [
  'https://www.googleapis.com/auth/business.manage',
  'email',
].join(' ')

// Same as the admin connect but uses a different state param so the
// callback knows to tag the resulting locations with the client's email
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL!))
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',
    prompt: 'select_account consent',
    // Encode who triggered this so the callback can tag locations correctly
    state: Buffer.from(JSON.stringify({ source: 'client', email: user.email })).toString('base64'),
  })

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  )
}
