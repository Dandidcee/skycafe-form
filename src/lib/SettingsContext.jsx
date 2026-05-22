import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabase'

const SettingsContext = createContext({})

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    cafe_name: 'Cafe',
    cafe_tagline: '',
    logo_url: '/logo.png',
    address: '',
    whatsapp_number: '6285947522947',
    biaya_layanan: '4000',
    primary_color: '#FF8F00',
    footer_text: 'Terima kasih telah memesan',
  })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    supabase.from('settings').select('*').then(({ data }) => {
      if (data) {
        const map = {}
        data.forEach((row) => { map[row.key] = row.value })
        setSettings((prev) => ({ ...prev, ...map }))
      }
      setLoaded(true)
    })
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loaded }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
