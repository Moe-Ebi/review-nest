'use client'

import { useCallback } from 'react'
import type { WidgetSettings } from './WidgetPreview'
import { saveWidgetSettings } from '@/app/actions/settings'

interface Props {
  locationId: string
  settings: WidgetSettings
  saved: boolean
}

function notify(patch: Partial<WidgetSettings>) {
  window.dispatchEvent(
    new CustomEvent('widget-settings-change', { detail: patch })
  )
}

export default function SettingsForm({ locationId, settings, saved }: Props) {
  const handle = useCallback(
    (field: keyof WidgetSettings) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const raw = e.target.type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : e.target.type === 'number'
          ? parseInt(e.target.value, 10)
          : e.target.value
        notify({ [field]: raw })
      },
    []
  )

  return (
    <form action={saveWidgetSettings} className="flex flex-col gap-5">
      <input type="hidden" name="locationId" value={locationId} />

      {saved && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-2.5">
          Settings saved ✓
        </div>
      )}

      {/* Layout */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Layout</label>
        <div className="grid grid-cols-4 gap-2">
          {(['grid', 'list', 'carousel', 'badge'] as const).map((l) => (
            <label key={l} className="cursor-pointer">
              <input
                type="radio"
                name="layout"
                value={l}
                defaultChecked={settings.layout === l}
                onChange={handle('layout')}
                className="sr-only peer"
              />
              <div className="text-center text-xs py-2 px-1 rounded-lg border border-gray-700 peer-checked:border-blue-500 peer-checked:bg-blue-500/10 peer-checked:text-blue-400 text-gray-400 transition capitalize">
                {l}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Colours */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Accent', name: 'accent_color', field: 'accent_color' as keyof WidgetSettings, def: settings.accent_color },
          { label: 'Background', name: 'background_color', field: 'background_color' as keyof WidgetSettings, def: settings.background_color },
          { label: 'Text', name: 'text_color', field: 'text_color' as keyof WidgetSettings, def: settings.text_color },
        ].map(({ label, name, field, def }) => (
          <div key={name}>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
            <input
              type="color"
              name={name}
              defaultValue={def}
              onChange={handle(field)}
              className="w-full h-9 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer p-0.5"
            />
          </div>
        ))}
      </div>

      {/* Count + Min stars */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Number of reviews
          </label>
          <input
            type="number"
            name="number_of_reviews"
            defaultValue={settings.number_of_reviews}
            min={1}
            max={50}
            onChange={handle('number_of_reviews')}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Min star rating
          </label>
          <select
            name="min_star_rating"
            defaultValue={settings.min_star_rating}
            onChange={handle('min_star_rating')}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} ★ and above</option>
            ))}
          </select>
        </div>
      </div>

      {/* Agency branding */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="show_agency_branding"
            value="true"
            defaultChecked={settings.show_agency_branding}
            onChange={(e) => notify({ show_agency_branding: e.target.checked })}
            className="w-4 h-4 rounded accent-blue-500"
          />
          {/* hidden field so unchecked still submits false */}
          <input type="hidden" name="show_agency_branding" value="false" />
          <span className="text-sm font-medium text-gray-300">Show agency branding</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Agency name</label>
            <input
              type="text"
              name="agency_name"
              defaultValue={settings.agency_name}
              onChange={handle('agency_name')}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Agency URL</label>
            <input
              type="text"
              name="agency_url"
              defaultValue={settings.agency_url}
              onChange={handle('agency_url')}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition"
      >
        Save settings
      </button>
    </form>
  )
}
