export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Nav */}
      <header className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold">
            Review<span className="text-blue-400">Nest</span>
          </span>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm text-gray-400 hover:text-white transition">Sign in</a>
            <a href="/signup" className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg transition">
              Request access
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium px-4 py-2 rounded-full">
          Powered by EBI Consulting
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          Display your Google reviews.<br />
          <span className="text-blue-400">Build trust. Grow faster.</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-xl">
          ReviewNest connects your Google Business Profile and embeds your best reviews on your website — automatically updated every day, fully customisable, zero maintenance.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <a href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition text-sm">
            Get started
          </a>
          <a href="/login" className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition text-sm">
            Sign in to dashboard
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'One line of code',
              desc: 'Paste a single script tag anywhere on your website. The widget does the rest.',
            },
            {
              title: 'Always up to date',
              desc: 'Reviews sync automatically from Google every 24 hours. No manual work needed.',
            },
            {
              title: 'Fully customisable',
              desc: 'Choose from 4 layouts, set your colours, filter by star rating, and add your branding.',
            },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
          <span>© {new Date().getFullYear()} EBI Consulting. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-gray-400 transition">Privacy Policy</a>
            <a href="https://ebiconsulting.co.za" target="_blank" rel="noopener" className="hover:text-gray-400 transition">EBI Consulting</a>
          </div>
        </div>
      </footer>

    </main>
  )
}
