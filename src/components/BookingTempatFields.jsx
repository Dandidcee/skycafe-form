import { motion } from 'framer-motion'
import { tempatBooking, WHATSAPP_LINK } from '../data/menuData'
import { formatRupiah } from '../utils/format'

export default function BookingTempatFields({ data, onChange }) {
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
          Cek ketersediaan tanggal via{' '}
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-[#FF8F00] underline">
            WhatsApp
          </a>{' '}terlebih dahulu.
        </p>
      </div>

      {/* Pilih tempat */}
      <div>
        <p className="text-xs text-on-surface-variant mb-2">Pilih tempat</p>
        <div className="grid grid-cols-3 gap-2">
          {tempatBooking.map((t) => (
            <label
              key={t.id}
              className={`p-3 rounded-xl cursor-pointer text-center transition-colors border ${
                data.tempat === t.id
                  ? 'border-[#FF8F00]/30 bg-[#FF8F00]/10'
                  : 'border-white/5 hover:border-white/15'
              }`}
            >
              <input type="radio" name="tempat" value={t.id} checked={data.tempat === t.id} onChange={handleChange('tempat')} className="sr-only" required />
              <p className={`text-sm font-medium ${data.tempat === t.id ? 'text-[#FF8F00]' : 'text-primary'}`}>{t.nama}</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{formatRupiah(t.hargaPerJam)}/jam</p>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Tanggal</label>
          <input type="date" min={today} value={data.tanggal} onChange={handleChange('tanggal')} className={inputClass} required />
        </div>
        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Jam mulai</label>
          <input type="time" value={data.waktu} onChange={handleChange('waktu')} className={inputClass} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Durasi (jam)</label>
          <select value={data.durasi} onChange={handleChange('durasi')} className={`${inputClass} appearance-none`} required>
            <option value="" className="bg-[#141313]">Pilih</option>
            {[1,2,3,4,5,6,7,8].map(j => <option key={j} value={j} className="bg-[#141313]">{j} Jam</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Jumlah orang</label>
          <select value={data.jumlahOrang} onChange={handleChange('jumlahOrang')} className={`${inputClass} appearance-none`} required>
            <option value="" className="bg-[#141313]">Pilih</option>
            {['1','2','3','4','5','6','7','8','9','10+'].map(n => <option key={n} value={n} className="bg-[#141313]">{n}</option>)}
          </select>
        </div>
      </div>
    </motion.div>
  )
}
