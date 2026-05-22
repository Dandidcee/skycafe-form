import { motion } from 'framer-motion'
import { useSettings } from '../lib/SettingsContext'

export default function WelcomeBanner() {
  const { settings } = useSettings()

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <h2 className="text-2xl md:text-3xl font-semibold text-primary font-playfair">
        Pemesanan {settings.cafe_name}
      </h2>
      <p className="mt-1 text-sm text-on-surface-variant">
        Isi form di bawah untuk memesan menu.
      </p>
      <div className="mt-4 h-[1px] w-12 bg-[#FF8F00]/50" />
    </motion.section>
  )
}
