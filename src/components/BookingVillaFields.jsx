import { villaBooking, WHATSAPP_LINK } from '../data/menuData'
import { formatRupiah } from '../utils/format'

export default function BookingVillaFields({ data, onChange }) {
  const handleChange = (field) => (e) => {
    onChange({ ...data, [field]: e.target.value })
  }

  const inputClass =
    'w-full bg-transparent border-b border-white/10 py-2 focus:border-secondary focus:outline-none focus:ring-0 transition-colors text-on-surface'

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-5 p-5 glass-panel rounded-lg border border-white/10">
      <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/5 border border-secondary/30">
        <span className="material-symbols-outlined text-secondary text-base mt-0.5">info</span>
        <p className="text-xs text-on-surface-variant">
          Mohon cek ketersediaan tanggal booking terlebih dahulu via{' '}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary underline hover:text-[#FF8F00] transition-colors"
          >
            WhatsApp
          </a>{' '}
          sebelum melanjutkan.
        </p>
      </div>

      {/* Info Villa */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">villa</span>
            <p className="font-semibold text-primary text-lg">{villaBooking.nama}</p>
          </div>
          <p className="text-secondary font-semibold">
            {formatRupiah(villaBooking.hargaPerMalam)}<span className="text-xs text-on-surface-variant">/malam</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">group</span>
          <span>Kapasitas: {villaBooking.kapasitas}</span>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-2">Fasilitas</p>
          <div className="flex flex-wrap gap-2">
            {villaBooking.fasilitas.map((f) => (
              <span
                key={f}
                className="text-[10px] px-2 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Check-in & Check-out */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-on-surface-variant block">
            Check-in *
          </label>
          <input
            type="date"
            min={today}
            value={data.checkIn}
            onChange={handleChange('checkIn')}
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-on-surface-variant block">
            Check-out *
          </label>
          <input
            type="date"
            min={data.checkIn || today}
            value={data.checkOut}
            onChange={handleChange('checkOut')}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs uppercase tracking-widest text-on-surface-variant block">
          Jumlah Tamu *
        </label>
        <select
          value={data.jumlahTamu}
          onChange={handleChange('jumlahTamu')}
          className={`${inputClass} appearance-none`}
          required
        >
          <option value="" className="bg-background">Pilih jumlah</option>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n} className="bg-background">
              {n} Orang
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
