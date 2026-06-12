import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logout } from '@/app/actions/auth'
import { syncLocation } from '@/app/actions/sync'

export default async function ClientDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Confirm this user is a client (not an admin sneaking in here)
  const admin = createAdminClient()
  const { data: record } = await admin
    .from('team_allowlist')
    .select('role, name, status')
    .eq('email', user.email!)
    .single()

  if (!record || record.status !== 'approved') redirect('/login')
  if (record.role === 'admin') redirect('/dashboard')

  // Load only locations owned by this client
  const { data: locations } = await admin
    .from('locations')
    .select('id, business_name, address, last_synced_at, review_count')
    .eq('owner_email', user.email!)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            Review<span className="text-blue-400">Nest</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{record.name ?? user.email}</span>
            <form action={logout}>
              <button type="submit" className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 transition">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Your locations</h2>
            <p className="text-gray-400 text-sm mt-1">
              Connect your Google account to add your Business Profile locations.
            </p>
          </div>
          <a
            href="/api/auth/google/client"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
          >
            + Connect Google
          </a>
        </div>

        {!locations || locations.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 border-dashed rounded-xl p-12 text-center">
            <p className="text-gray-400 mb-1">No locations connected yet.</p>
            <p className="text-gray-600 text-sm">
              Click "Connect Google" above to link your Google Business Profile.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((loc) => (
              <div key={loc.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-2">
                <p className="font-semibold text-white">{loc.business_name}</p>
                {loc.address && <p className="text-sm text-gray-400">{loc.address}</p>}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-yellow-400">★</span>
                  <span className="text-xs text-gray-400">{loc.review_count ?? 0} reviews cached</span>
                </div>
                {loc.last_synced_at && (
                  <p className="text-xs text-gray-600">
                    Last synced: {new Date(loc.last_synced_at).toLocaleString()}
                  </p>
                )}
                <div className="mt-auto pt-3">
                  <form action={syncLocation}>
                    <input type="hidden" name="locationId" value={loc.id} />
                    <button type="submit" className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-2.5 py-1 rounded-full transition">
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
