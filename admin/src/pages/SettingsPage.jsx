import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const settingLabels = {
  cafe_name: { label: 'Nama Cafe', type: 'text' },
  cafe_tagline: { label: 'Tagline', type: 'text' },
  logo_url: { label: 'Logo URL', type: 'text', hint: 'Upload logo di Galeri, lalu paste URL-nya di sini' },
  address: { label: 'Alamat', type: 'text' },
  whatsapp_number: { label: 'Nomor WhatsApp', type: 'text', hint: 'Format: 62xxx (tanpa +)' },
  biaya_layanan: { label: 'Biaya Layanan (Rp)', type: 'number' },
  primary_color: { label: 'Warna Utama', type: 'color' },
  footer_text: { label: 'Teks Footer', type: 'text' },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('*')
    const map = {}
    ;(data || []).forEach((row) => { map[row.key] = row.value })
    setSettings(map)
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)

    const updates = Object.entries(settings).map(([key, value]) =>
      supabase.from('settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key)
    )

    await Promise.all(updates)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const ext = file.name.split('.').pop()
    const fileName = `logo/logo.${ext}`

    // Upload (overwrite if exists)
    await supabase.storage.from('assets').upload(fileName, file, { upsert: true })
    const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(fileName)

    setSettings({ ...settings, logo_url: publicUrl })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Pengaturan</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-500 transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">{saved ? 'check' : 'save'}</span>
          {saving ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan'}
        </button>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Logo preview */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Logo</p>
          <div className="flex items-center gap-4">
            {settings.logo_url && (
              <img src={settings.logo_url} alt="Logo" className="w-16 h-16 rounded-lg bg-gray-800 object-contain" />
            )}
            <label className="flex items-center gap-2 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-700 transition-colors">
              <span className="material-symbols-outlined text-lg">upload</span>
              Upload Logo Baru
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Settings fields */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-5">
          {Object.entries(settingLabels).map(([key, config]) => (
            <div key={key}>
              <label className="text-xs text-gray-400 uppercase tracking-wider">{config.label}</label>
              {config.type === 'color' ? (
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="color"
                    value={settings[key] || '#FF8F00'}
                    onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-gray-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings[key] || ''}
                    onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              ) : (
                <input
                  type={config.type}
                  value={settings[key] || ''}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                />
              )}
              {config.hint && <p className="text-xs text-gray-500 mt-1">{config.hint}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
