import { motion } from 'framer-motion'
import { useSettings } from '../lib/SettingsContext'

export default function Footer() {
  const { settings } = useSettings()
  const waLink = `https://wa.me/${settings.whatsapp_number}`

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="w-full py-10 px-6 md:px-12 mt-20 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img src={settings.logo_url} alt="" className="w-6 h-6 opacity-50 rounded-full object-cover" />
          <span className="text-xs text-on-surface-variant/50">
            {settings.cafe_name} {new Date().getFullYear()}
          </span>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-on-surface-variant/60 hover:text-secondary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">support_agent</span>
          Hubungi Bantuan
        </a>
      </div>
    </motion.footer>
  )
}
