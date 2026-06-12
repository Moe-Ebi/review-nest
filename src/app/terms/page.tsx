export const metadata = {
  title: 'Terms of Service — ReviewNest by EBI Consulting',
  description: 'Terms of service for ReviewNest, a Google Reviews widget platform by EBI Consulting.',
}

const LAST_UPDATED = 'June 2026'

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. About ReviewNest</h2>
            <p>
              ReviewNest is a Google Reviews widget platform operated by <strong>EBI Consulting</strong>,
              a digital agency based in South Africa. The service allows businesses to display their
              Google Business Profile reviews on their websites via an embeddable widget.
            </p>
            <p className="mt-2">
              By using ReviewNest, you agree to these Terms of Service. If you do not agree, do not
              use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Access and accounts</h2>
            <p>
              Access to ReviewNest is by invitation or approval only. You must submit a request and
              receive approval from an EBI Consulting administrator before using the dashboard.
            </p>
            <p className="mt-2">
              You are responsible for maintaining the confidentiality of your account credentials.
              You must notify us immediately at{' '}
              <a href="mailto:info@ebiconsulting.co.za" className="text-blue-600 underline">info@ebiconsulting.co.za</a>{' '}
              if you suspect unauthorised access to your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Google account connection</h2>
            <p>
              ReviewNest connects to your Google Business Profile via Google OAuth 2.0. By connecting
              your Google account, you authorise ReviewNest to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Read the list of business locations associated with your Google account</li>
              <li>Read the reviews posted on those locations</li>
              <li>Store an OAuth refresh token to periodically sync your reviews</li>
            </ul>
            <p className="mt-2">
              We do not post, edit, delete, or respond to reviews on your behalf. You may revoke
              access at any time via{' '}
              <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener" className="text-blue-600 underline">
                myaccount.google.com/permissions
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Use ReviewNest for any unlawful purpose</li>
              <li>Attempt to reverse-engineer, scrape, or disrupt the service</li>
              <li>Share your account credentials with others</li>
              <li>Use the service to display reviews you do not have the right to display</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Service availability</h2>
            <p>
              We aim to keep ReviewNest available at all times but do not guarantee uninterrupted
              access. We may perform maintenance, updates, or changes to the service at any time.
              We are not liable for any downtime or data loss.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Intellectual property</h2>
            <p>
              ReviewNest and all associated software, designs, and content are the property of
              EBI Consulting. The review content displayed through the widget belongs to the
              respective reviewers and is sourced via the Google Business Profile API in accordance
              with Google's Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, EBI Consulting is not liable for any indirect,
              incidental, or consequential damages arising from your use of ReviewNest, including
              loss of data, loss of revenue, or service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to ReviewNest at any time,
              with or without notice, if we believe you have violated these terms or if we discontinue
              the service. You may request account deletion at any time by emailing{' '}
              <a href="mailto:info@ebiconsulting.co.za" className="text-blue-600 underline">info@ebiconsulting.co.za</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to these terms</h2>
            <p>
              We may update these Terms of Service from time to time. The date at the top of this
              page reflects the most recent update. Continued use of ReviewNest after changes
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Governing law</h2>
            <p>
              These terms are governed by the laws of South Africa. Any disputes will be subject
              to the jurisdiction of the courts of South Africa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact</h2>
            <p>
              For any questions about these terms, contact EBI Consulting at{' '}
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
