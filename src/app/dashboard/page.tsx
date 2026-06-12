import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logout } from '@/app/actions/auth'
import { syncLocation } from '@/app/actions/sync'
import { approveRequest, denyRequest } from '@/app/actions/admin'

interface Props {
  searchParams: Promise<{ error?: string; approved?: string }>
}

const connectErrors: Record<string, string> = {
  google_denied: 'Google authorisation was cancelled.',
  token_exchange: 'Could not get a token from Google. Please try again.',
  db_save: 'Could not save the connection. Please try again.',
}

export default async function DashboardPage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error, approved } = await searchParams

  const admin = createAdminClient()

  const { data: pendingRequests } = await admin
    .from('team_allowlist')
    .select('email, name, role, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  const { data: locations } = await admin
    .from('locations')
    .select('id, business_name, address, google_connection_id, last_synced_at, review_count')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            Review<span className="text-blue-400">Nest</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 transition"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
            {connectErrors[error] ?? 'Something went wrong.'}
          </div>
        )}

        {approved && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-3">
            Access approved — the user can now log in.
          </div>
        )}

        {/* Pending access requests */}
        {pendingRequests && pendingRequests.length > 0 && (
          <div className="mb-8 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-yellow-400 mb-4">
              Pending access requests ({pendingRequests.length})
            </h3>
            <div className="flex flex-col gap-3">
              {pendingRequests.map((req) => (
                <div key={req.email} className="flex items-center justify-between gap-4 bg-gray-900 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{req.name ?? 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{req.email}</p>
                    <span className="text-xs text-gray-600 capitalize">{req.role}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <form action={approveRequest}>
                      <input type="hidden" name="email" value={req.email} />
                      <button type="submit" className="text-xs bg-green-600 hover:bg-green-500 text-white font-medium px-3 py-1.5 rounded-lg transition">
                        Approve
                      </button>
                    </form>
                    <form action={denyRequest}>
                      <input type="hidden" name="email" value={req.email} />
                      <button type="submit" className="text-xs bg-gray-700 hover:bg-red-600 text-white font-medium px-3 py-1.5 rounded-lg transition">
                        Deny
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Locations</h2>
            <p className="text-gray-400 text-sm mt-1">
              Connect a Google account to add Business Profile locations.
            </p>
          </div>
          <a
            href="/api/auth/google"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
          >
            + Connect Google
          </a>
        </div>

        {!locations || locations.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 border-dashed rounded-xl p-12 text-center">
            <p className="text-gray-400 mb-1">No locations added yet.</p>
            <p className="text-gray-600 text-sm">
              Click "Connect Google" above to link a Google Business Profile.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-2 hover:border-gray-600 transition"
              >
                <a
                  href={`/dashboard/locations/${loc.id}`}
                  className="font-semibold text-white hover:text-blue-400 transition"
                >
                  {loc.business_name}
                </a>
                {loc.address && (
                  <p className="text-sm text-gray-400">{loc.address}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-yellow-400">★</span>
                  <span className="text-xs text-gray-400">
                    {loc.review_count ?? 0} reviews cached
                  </span>
                </div>
                {loc.last_synced_at && (
                  <p className="text-xs text-gray-600">
                    Last synced: {new Date(loc.last_synced_at).toLocaleString()}
                  </p>
                )}
                <div className="mt-auto pt-3 flex items-center gap-2 flex-wrap">
                  <a
                    href={`/dashboard/locations/${loc.id}`}
                    className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400 px-2.5 py-1 rounded-full transition"
                  >
                    Settings & preview
                  </a>
                  <form action={syncLocation}>
                    <input type="hidden" name="locationId" value={loc.id} />
                    <button
                      type="submit"
                      className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-2.5 py-1 rounded-full transition"
                    >
                      Sync reviews
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
