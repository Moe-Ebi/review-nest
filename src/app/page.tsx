export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium px-4 py-2 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
          System online
        </div>

        <h1 className="text-5xl font-bold tracking-tight">
          Review<span className="text-blue-400">Nest</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-md">
          Google Reviews Widget Platform — Admin Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl mt-4">
        {[
          { label: 'Framework', value: 'Next.js 15 App Router' },
          { label: 'Database', value: 'Supabase (Postgres)' },
          { label: 'Styling', value: 'Tailwind CSS' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
          >
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-medium text-white">{value}</p>
          </div>
        ))}
      </div>

      <p className="text-gray-600 text-sm mt-4">Phase 1 — Skeleton ✓</p>
    </main>
  )
}
