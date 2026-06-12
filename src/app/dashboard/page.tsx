import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Top nav */}
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

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-blue-400 rounded-full inline-block" />
          Authenticated
        </div>
        <h2 className="text-3xl font-bold mb-3">Welcome to your dashboard</h2>
        <p className="text-gray-400">
          Signed in as <span className="text-white font-medium">{user.email}</span>
        </p>
        <p className="text-gray-600 text-sm mt-8">Phase 2 — Team Login ✓ &nbsp;·&nbsp; More features coming in Phase 3</p>
      </div>
    </main>
  )
}
