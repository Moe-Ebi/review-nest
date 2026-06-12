import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import WidgetPreview from '@/components/widget-preview/WidgetPreview'
import SettingsForm from '@/components/widget-preview/SettingsForm'
import type { WidgetSettings } from '@/components/widget-preview/WidgetPreview'

interface Props {
  params: Promise<{ locationId: string }>
  searchParams: Promise<{ saved?: string }>
}

const DEFAULT_SETTINGS: WidgetSettings = {
  layout: 'grid',
  accent_color: '#3b82f6',
  background_color: '#ffffff',
  text_color: '#111827',
  number_of_reviews: 10,
  min_star_rating: 4,
  show_agency_branding: true,
  agency_name: 'ReviewNest',
  agency_url: 'https://reviewnest.com',
}

export default async function LocationSettingsPage({ params, searchParams }: Props) {
  const { locationId } = await params
  const { saved } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  const { data: location } = await admin
    .from('locations')
    .select('id, business_name, address')
    .eq('id', locationId)
    .single()

  if (!location) redirect('/dashboard')

  const { data: dbSettings } = await admin
    .from('widget_settings')
    .select('*')
    .eq('location_id', locationId)
    .single()

  const settings: WidgetSettings = dbSettings
    ? {
        layout: dbSettings.layout,
        accent_color: dbSettings.accent_color,
        background_color: dbSettings.background_color,
        text_color: dbSettings.text_color,
        number_of_reviews: dbSettings.number_of_reviews,
        min_star_rating: dbSettings.min_star_rating,
        show_agency_branding: dbSettings.show_agency_branding,
        agency_name: dbSettings.agency_name,
        agency_url: dbSettings.agency_url,
      }
    : DEFAULT_SETTINGS

  const { data: reviews } = await admin
    .from('reviews')
    .select('reviewer_name, reviewer_photo_url, star_rating, review_text, review_date')
    .eq('location_id', locationId)
    .order('star_rating', { ascending: false })
    .order('review_date', { ascending: false })
    .limit(50)

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <a href="/dashboard" className="text-gray-400 hover:text-white transition text-sm">
            ← Dashboard
          </a>
          <span className="text-gray-700">/</span>
          <h1 className="text-sm font-semibold text-white truncate">{location.business_name}</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{location.business_name}</h2>
          {location.address && (
            <p className="text-gray-400 text-sm mt-1">{location.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* Settings panel */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-base font-semibold mb-5">Widget settings</h3>
            <SettingsForm
              locationId={locationId}
              settings={settings}
              saved={saved === '1'}
            />
          </div>

          {/* Right column: preview + embed snippet */}
          <div className="flex flex-col gap-6">
            {/* Live preview */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Live preview</h3>
                <span className="text-xs text-gray-500">Updates as you change settings</span>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <WidgetPreview initialSettings={settings} reviews={reviews ?? []} />
              </div>
            </div>

            {/* Embed snippet */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-base font-semibold mb-1">Embed on your client's website</h3>
              <p className="text-gray-400 text-sm mb-4">
                Paste this single line of HTML anywhere on the client's website where you want the widget to appear.
              </p>
              <div className="bg-gray-950 border border-gray-700 rounded-xl p-4 font-mono text-xs text-green-400 break-all select-all">
                {`<script src="${process.env.NEXTAUTH_URL}/widget.js" data-location="${locationId}" async></script>`}
              </div>
              <p className="text-gray-600 text-xs mt-3">
                The widget auto-updates every 24 hours. No other changes needed after pasting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
