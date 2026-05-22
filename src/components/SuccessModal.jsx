import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../lib/SettingsContext'
import { openReceipt } from '../utils/generateReceipt'

export default function SuccessModal({ open, orderId, payload, onClose }) {
  const { settings } = useSettings()
  const waLink = `https://wa.me/${settings.whatsapp_number}`
  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="glass-panel-heavy rounded-2xl w-full max-w-sm p-6 text-center space-y-5"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FF8F00]/10 border border-[#FF8F00]/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-[#FF8F00]">check_circle</span>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-primary font-playfair">Pesanan Terkirim</h3>
            <p className="text-xs text-on-surface-variant mt-1">Tim kami akan menghubungi Anda via WhatsApp.</p>
          </div>

          {orderId && (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[10px] text-on-surface-variant">Order ID</p>
              <p className="text-xs font-mono text-[#FF8F00] mt-0.5">{orderId}</p>
            </div>
          )}

          <div className="space-y-2">
            {payload && (
              <button
                type="button"
                onClick={() => openReceipt(payload)}
                className="w-full py-3 rounded-xl border border-[#FF8F00]/20 text-[#FF8F00] text-sm font-medium hover:bg-[#FF8F00]/5 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">receipt</span>
                Lihat Struk
              </button>
            )}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 rounded-xl border border-white/10 text-on-surface-variant text-sm hover:border-white/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                WhatsApp
              </a>
              <button
                type="button"
                onClick={onClose}
                className="py-3 rounded-xl bg-[#FF8F00] text-[#0A0A0A] text-sm font-semibold hover:bg-[#E67E00] transition-colors"
              >
                Selesai
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
