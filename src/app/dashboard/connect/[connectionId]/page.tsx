import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { fetchGoogleLocations, formatAddress } from '@/lib/google/locations'
import { addLocation } from '@/app/actions/locations'

interface Props {
  params: Promise<{ connectionId: string }>
}

export default async function ConnectLocationsPage({ params }: Props) {
  const { connectionId } = await params

  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Load the connection
  const admin = createAdminClient()
  const { data: connection } = await admin
    .from('google_connections')
    .select('google_account_email')
    .eq('id', connectionId)
    .single()

  if (!connection) redirect('/dashboard')

  // Fetch locations from Google
  const locations = await fetchGoogleLocations(connectionId)

  // Get already-added location IDs so we can mark them
  const { data: existing } = await admin
    .from('locations')
    .select('google_location_id')

  const addedIds = new Set((existing ?? []).map((l) => l.google_location_id))

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            Review<span className="text-blue-400">Nest</span>
          </h1>
          <span className="text-sm text-gray-400">
            Connected: {connection.google_account_email}
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Select locations to add</h2>
          <p className="text-gray-400 text-sm">
            These are the Google Business Profile locations your account manages.
            Click "Add" to start tracking reviews for a location.
          </p>
        </div>

        {!locations || locations.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400 mb-2">No locations found for this Google account.</p>
            <p className="text-gray-600 text-sm">
              Make sure your Google account manages at least one Business Profile location.
            </p>
            <a
              href="/dashboard"
              className="inline-block mt-4 text-sm text-blue-400 hover:text-blue-300"
            >
              ← Back to dashboard
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {locations.map((loc) => {
              const alreadyAdded = addedIds.has(loc.name)
              const address = formatAddress(loc)
              return (
                <div
                  key={loc.name}
                  className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-white">{loc.title}</p>
                    {address && (
                      <p className="text-sm text-gray-400 mt-0.5">{address}</p>
                    )}
                  </div>
                  {alreadyAdded ? (
                    <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-lg shrink-0">
                      Added ✓
                    </span>
                  ) : (
                    <form action={addLocation}>
                      <input type="hidden" name="googleLocationId" value={loc.name} />
                      <input type="hidden" name="businessName" value={loc.title} />
                      <input type="hidden" name="address" value={address} />
                      <input type="hidden" name="connectionId" value={connectionId} />
                      <button
                        type="submit"
                        className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-1.5 rounded-lg transition shrink-0"
                      >
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
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">
            ← Back to dashboard
          </a>
        </div>
      </div>
    </main>
  )
}
