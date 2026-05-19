import { motion } from 'framer-motion'
import { villaBooking, WHATSAPP_LINK } from '../data/menuData'
import { formatRupiah } from '../utils/format'

export default function BookingVillaFields({ data, onChange }) {
  const handleChange = (field) => (e) => {
    onChange({ ...data, [field]: e.target.value })
  }

  const today = new Date().toISOString().split('T')[0]
  const inputClass = 'w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#FF8F00]/50 focus:outline-none focus:ring-0 transition-colors text-on-surface'

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4 p-4 rounded-xl border border-white/5 bg-white/[0.01]"
    >
      {/* Info WA */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-[#FF8F00]/5 border border-[#FF8F00]/10">
        <span className="material-symbols-outlined text-[#FF8F00] text-base mt-0.5">info</span>
        <p className="text-xs text-on-surface-variant">
          Cek ketersediaan via{' '}
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-[#FF8F00] underline">
            WhatsApp
          </a>{' '}terlebih dahulu.
        </p>
      </div>

      {/* Villa info */}
      <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-primary">{villaBooking.nama}</p>
          <p className="text-[#FF8F00] text-sm font-medium">{formatRupiah(villaBooking.hargaPerMalam)}/malam</p>
        </div>
        <p className="text-[10px] text-on-surface-variant mt-1">
          Kapasitas {villaBooking.kapasitas} | {villaBooking.fasilitas.join(', ')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Check-in</label>
          <input type="date" min={today} value={data.checkIn} onChange={handleChange('checkIn')} className={inputClass} required />
        </div>
        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Check-out</label>
          <input type="date" min={data.checkIn || today} value={data.checkOut} onChange={handleChange('checkOut')} className={inputClass} required />
        </div>
      </div>

      <div>
        <label className="text-xs text-on-surface-variant block mb-1">Jumlah tamu</label>
        <select value={data.jumlahTamu} onChange={handleChange('jumlahTamu')} className={`${inputClass} appearance-none`} required>
          <option value="" className="bg-[#141313]">Pilih</option>
          {[1,2,3,4,5,6].map(n => <option key={n} value={n} className="bg-[#141313]">{n} Orang</option>)}
        </select>
      </div>
    </motion.div>
  )
}
