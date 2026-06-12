import { createAdminClient } from '@/lib/supabase/admin'

interface GoogleLocation {
  name: string          // e.g. "accounts/123/locations/456"
  title: string         // business name
  storefrontAddress?: { addressLines?: string[]; locality?: string; regionCode?: string }
}

export async function refreshAccessToken(connectionId: string): Promise<string | null> {
  const admin = createAdminClient()
  const { data: conn } = await admin
    .from('google_connections')
    .select('refresh_token, token_expires_at')
    .eq('id', connectionId)
    .single()

  if (!conn) return null

  // If token still valid, fetch and return current access token
  if (new Date(conn.token_expires_at) > new Date(Date.now() + 60_000)) {
    const { data } = await admin
      .from('google_connections')
      .select('access_token')
      .eq('id', connectionId)
      .single()
    return data?.access_token ?? null
  }

  // Refresh
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: conn.refresh_token,
      grant_type: 'refresh_token',
    }),
  })

  if (!res.ok) return null
  const tokens = await res.json()

  await admin
    .from('google_connections')
    .update({
      access_token: tokens.access_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', connectionId)

  return tokens.access_token
}

export async function fetchGoogleLocations(connectionId: string) {
  const accessToken = await refreshAccessToken(connectionId)
  if (!accessToken) return null

  // Step 1: get accounts
  const accountsRes = await fetch(
    'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!accountsRes.ok) return null
  const accountsData = await accountsRes.json()
  const accounts: { name: string }[] = accountsData.accounts ?? []

  const allLocations: GoogleLocation[] = []

  // Step 2: get locations for each account
  for (const account of accounts) {
    let pageToken: string | undefined
    do {
      const params = new URLSearchParams({
        readMask: 'name,title,storefrontAddress',
        pageSize: '100',
      })
      if (pageToken) params.set('pageToken', pageToken)

      const locRes = await fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?${params}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (!locRes.ok) break
      const locData = await locRes.json()
      allLocations.push(...(locData.locations ?? []))
      pageToken = locData.nextPageToken
    } while (pageToken)
  }

  return allLocations
}

export function formatAddress(loc: GoogleLocation): string {
  const a = loc.storefrontAddress
  if (!a) return ''
  const parts = [...(a.addressLines ?? []), a.locality, a.regionCode].filter(Boolean)
  return parts.join(', ')
}
