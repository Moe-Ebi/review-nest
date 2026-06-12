import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { fetchGoogleLocations, formatAddress } from '@/lib/google/locations'
import { addClientLocation } from '@/app/actions/locations'

interface Props {
  params: Promise<{ connectionId: string }>
}

export default async function ClientConnectLocationsPage({ params }: Props) {
  const { connectionId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: connection } = await admin
    .from('google_connections')
    .select('google_account_email')
    .eq('id', connectionId)
    .single()

  if (!connection) redirect('/client')

  const locations = await fetchGoogleLocations(connectionId)

  const { data: existing } = await admin
    .from('locations')
    .select('google_location_id')
    .eq('owner_email', user.email!)

  const addedIds = new Set((existing ?? []).map((l) => l.google_location_id))

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Review<span className="text-blue-400">Nest</span></h1>
          <span className="text-sm text-gray-400">Connected: {connection.google_account_email}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Select your locations</h2>
          <p className="text-gray-400 text-sm">
            These are the Google Business Profile locations your account manages.
          </p>
        </div>

        {!locations || locations.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400 mb-2">No locations found for this Google account.</p>
            <a href="/client" className="text-sm text-blue-400 hover:text-blue-300">← Back</a>
          </div>
        ) : (
          <div className="space-y-3">
            {locations.map((loc) => {
              const alreadyAdded = addedIds.has(loc.name)
              const address = formatAddress(loc)
              return (
                <div key={loc.name} className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{loc.title}</p>
                    {address && <p className="text-sm text-gray-400 mt-0.5">{address}</p>}
                  </div>
                  {alreadyAdded ? (
                    <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-lg shrink-0">Added ✓</span>
                  ) : (
                    <form action={addClientLocation}>
                      <input type="hidden" name="googleLocationId" value={loc.name} />
                      <input type="hidden" name="businessName" value={loc.title} />
                      <input type="hidden" name="address" value={address} />
                      <input type="hidden" name="connectionId" value={connectionId} />
                      <input type="hidden" name="ownerEmail" value={user.email!} />
                      <button type="submit" className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-1.5 rounded-lg transition shrink-0">
                        Add
                      </button>
                    </form>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-8">
          <a href="/client" className="text-sm text-gray-400 hover:text-white transition">← Back</a>
        </div>
      </div>
    </main>
  )
}
