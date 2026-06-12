export const metadata = {
  title: 'Privacy Policy — ReviewNest by EBI Consulting',
  description: 'Privacy policy for ReviewNest, a Google Reviews widget platform by EBI Consulting.',
}

const LAST_UPDATED = 'June 2026'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gray-900">
            Review<span className="text-blue-600">Nest</span>
          </a>
          <span className="text-sm text-gray-500">by EBI Consulting</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Who we are</h2>
            <p>
              ReviewNest is a Google Reviews widget platform operated by <strong>EBI Consulting</strong>,
              a digital agency based in South Africa. We help businesses display their Google Business
              Profile reviews on their websites.
            </p>
            <p className="mt-2">
              Contact: <a href="mailto:info@ebiconsulting.co.za" className="text-blue-600 underline">info@ebiconsulting.co.za</a>
              {' '}·{' '}
              <a href="https://ebiconsulting.co.za" target="_blank" rel="noopener" className="text-blue-600 underline">ebiconsulting.co.za</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. What data we collect and why</h2>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">Google account data (via OAuth 2.0)</h3>
            <p>
              When you connect your Google account, we request access using the
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm mx-1">https://www.googleapis.com/auth/business.manage</code>
              scope. This allows us to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Read the list of Google Business Profile locations your account manages</li>
              <li>Read the reviews posted on those locations</li>
            </ul>
            <p className="mt-2">
              We do <strong>not</strong> post, edit, delete, or respond to reviews on your behalf.
              We do <strong>not</strong> access any other Google services, Gmail, Google Drive, or
              personal account information beyond what is listed above.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">OAuth tokens</h3>
            <p>
              We store an OAuth refresh token in our secure database (Supabase) to allow us to
              periodically refresh your review data without requiring you to reconnect. This token
              is used solely to fetch your Business Profile reviews. It is never sold, shared with
              third parties, or used for advertising.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">Review data</h3>
            <p>
              We store a cached copy of your Google reviews (reviewer name, photo, star rating,
              review text, and date) in our database. This cached data is served to your website
              visitors via the ReviewNest widget. It is refreshed automatically once per day.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">Account information</h3>
            <p>
              If you create a ReviewNest account, we store your name, email address, and
              encrypted password. This information is used only to authenticate you and provide
              access to the dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How we use your data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To display your Google reviews on your website via the embeddable widget</li>
              <li>To refresh your review data daily using the stored OAuth token</li>
              <li>To authenticate you when you log in to the dashboard</li>
              <li>To communicate with you about your account (if necessary)</li>
            </ul>
            <p className="mt-3">We do not use your data for advertising, profiling, or any purpose beyond operating the ReviewNest service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data sharing</h2>
            <p>
              We do not sell or share your personal data with third parties. We use the following
              sub-processors to operate the service:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Supabase</strong> — database and authentication (supabase.com)</li>
              <li><strong>Vercel</strong> — hosting and infrastructure (vercel.com)</li>
              <li><strong>Google APIs</strong> — for reading your Business Profile reviews</li>
            </ul>
            <p className="mt-3">Each of these providers operates under their own privacy policies and GDPR-compliant data processing agreements.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data retention and deletion</h2>
            <p>
              We retain your data for as long as your account is active. You may request deletion
              of your account and all associated data at any time by emailing{' '}
              <a href="mailto:info@ebiconsulting.co.za" className="text-blue-600 underline">info@ebiconsulting.co.za</a>.
              We will action deletion requests within 30 days.
            </p>
            <p className="mt-2">
              You may also revoke ReviewNest's access to your Google account at any time by visiting{' '}
              <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener" className="text-blue-600 underline">
                myaccount.google.com/permissions
              </a>{' '}
              and removing ReviewNest. Revoking access will stop review syncing but will not
              automatically delete your cached review data — email us to request that as well.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Security</h2>
            <p>
              All data is stored in an encrypted database with row-level security. OAuth tokens
              are never exposed to the public. Our infrastructure uses HTTPS exclusively. Access
              to the admin dashboard is restricted to approved users only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Revoke Google OAuth access at any time</li>
              <li>Object to processing of your data</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{' '}
              <a href="mailto:info@ebiconsulting.co.za" className="text-blue-600 underline">info@ebiconsulting.co.za</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to this policy</h2>
            <p>
              We may update this privacy policy from time to time. The date at the top of this
              page will reflect the most recent update. Continued use of the service after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact</h2>
            <p>
              For any privacy-related questions or requests, contact EBI Consulting at{' '}
              <a href="mailto:info@ebiconsulting.co.za" className="text-blue-600 underline">info@ebiconsulting.co.za</a>
              {' '}or visit{' '}
              <a href="https://ebiconsulting.co.za" target="_blank" rel="noopener" className="text-blue-600 underline">ebiconsulting.co.za</a>.
            </p>
          </section>

        </div>
      </div>

      <footer className="border-t border-gray-200 py-6 mt-12">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between text-sm text-gray-400">
          <span>© {new Date().getFullYear()} EBI Consulting. All rights reserved.</span>
          <a href="/" className="hover:text-gray-600 transition">ReviewNest</a>
        </div>
      </footer>
    </main>
  )
}
