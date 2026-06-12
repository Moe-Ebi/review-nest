import { signup } from '@/app/actions/auth'

interface Props {
  searchParams: Promise<{ error?: string; success?: string }>
}

const errorMessages: Record<string, string> = {
  already_registered: 'An account with this email already exists.',
  create_failed: 'Could not create your account. Please try again.',
}

export default async function SignupPage({ searchParams }: Props) {
  const { error, success } = await searchParams

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Review<span className="text-blue-400">Nest</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">Request access</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
          {success === '1' ? (
            <div className="text-center space-y-3">
              <div className="text-4xl">✓</div>
              <h2 className="text-lg font-semibold text-white">Request submitted</h2>
              <p className="text-gray-400 text-sm">
                Your account is pending approval. You'll be able to log in once an admin approves your request.
              </p>
              <a
                href="/login"
                className="inline-block mt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Back to login
              </a>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                  {errorMessages[error] ?? 'Something went wrong. Please try again.'}
                </div>
              )}

              <form action={signup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Full name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jane Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="At least 8 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">I am a…</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'client', label: 'Client', desc: 'I want to display my reviews' },
                      { value: 'admin', label: 'Team member', desc: 'I work at the agency' },
                    ].map(({ value, label, desc }) => (
                      <label key={value} className="cursor-pointer">
                        <input type="radio" name="role" value={value} defaultChecked={value === 'client'} className="sr-only peer" />
                        <div className="border border-gray-700 rounded-xl p-3 text-center peer-checked:border-blue-500 peer-checked:bg-blue-500/10 transition">
                          <p className="text-sm font-medium text-white peer-checked:text-blue-400">{label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition mt-1"
                >
                  Request access
                </button>
              </form>

              <p className="text-center text-gray-600 text-xs mt-5">
                Already have an account?{' '}
                <a href="/login" className="text-blue-400 hover:text-blue-300">Sign in</a>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
