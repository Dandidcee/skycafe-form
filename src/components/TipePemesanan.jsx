import { motion } from 'framer-motion'

const tipeOptions = [
  { value: 'dinein', label: 'Makan di Tempat', icon: 'restaurant' },
  { value: 'takeaway', label: 'Bawa Pulang', icon: 'shopping_bag' },
  { value: 'tempat', label: 'Booking Tempat', icon: 'event_seat' },
  { value: 'villa', label: 'Booking Villa', icon: 'villa' }
]

export default function TipePemesanan({ value, onChange }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-on-surface-variant">Pilih tipe pemesanan</p>
      <div className="grid grid-cols-2 gap-2">
        {tipeOptions.map((opt) => {
          const isActive = value === opt.value
          return (
            <motion.label
              key={opt.value}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-colors ${
                isActive
                  ? 'bg-[#FF8F00]/10 border border-[#FF8F00]/30'
                  : 'border border-white/5 hover:border-white/15'
              }`}
            >
              <input
                type="radio"
                name="tipe"
                value={opt.value}
                checked={isActive}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
              />
              <span className={`material-symbols-outlined text-xl ${
                isActive ? 'text-[#FF8F00]' : 'text-on-surface-variant'
              }`}>
                {opt.icon}
              </span>
              <span className={`text-sm ${
                isActive ? 'text-[#FF8F00] font-medium' : 'text-on-surface-variant'
              }`}>
                {opt.label}
              </span>
            </motion.label>
          )
        })}
      </div>
    </div>
  )
}
