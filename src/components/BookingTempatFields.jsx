import { tempatBooking, WHATSAPP_LINK } from '../data/menuData'
import { formatRupiah } from '../utils/format'

export default function BookingTempatFields({ data, onChange }) {
  const handleChange = (field) => (e) => {
    onChange({ ...data, [field]: e.target.value })
  }

  const inputClass =
    'w-full bg-transparent border-b border-white/10 py-2 focus:border-secondary focus:outline-none focus:ring-0 transition-colors text-on-surface'

  // Get today's date in YYYY-MM-DD format for min attribute
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

      {/* Pilih Tempat */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-on-surface-variant block">
          Pilih Tempat *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tempatBooking.map((tempat) => {
            const isActive = data.tempat === tempat.id
            return (
              <label
                key={tempat.id}
                className={`p-4 rounded-lg cursor-pointer transition-all border ${
                  isActive
                    ? 'border-secondary bg-secondary/10'
                    : 'border-white/10 hover:border-secondary/50 bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="tempat"
                  value={tempat.id}
                  checked={isActive}
                  onChange={handleChange('tempat')}
                  className="sr-only"
                  required
                />
                <div className="space-y-1">
                  <p className="font-semibold text-primary">{tempat.nama}</p>
                  <p className="text-[10px] text-on-surface-variant">
                    {tempat.deskripsi}
                  </p>
                  <p className="text-secondary text-sm font-medium">
                    {formatRupiah(tempat.hargaPerJam)}/jam
                  </p>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Tanggal & Waktu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-on-surface-variant block">
            Tanggal *
          </label>
          <input
            type="date"
            min={today}
            value={data.tanggal}
            onChange={handleChange('tanggal')}
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-on-surface-variant block">
            Jam Mulai *
          </label>
          <input
            type="time"
            value={data.waktu}
            onChange={handleChange('waktu')}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-on-surface-variant block">
            Durasi (Jam) *
          </label>
          <select
            value={data.durasi}
            onChange={handleChange('durasi')}
            className={`${inputClass} appearance-none`}
            required
          >
            <option value="" className="bg-background">Pilih durasi</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
              <option key={j} value={j} className="bg-background">
                {j} Jam
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-on-surface-variant block">
            Jumlah Orang *
          </label>
          <select
            value={data.jumlahOrang}
            onChange={handleChange('jumlahOrang')}
            className={`${inputClass} appearance-none`}
            required
          >
            <option value="" className="bg-background">Pilih jumlah</option>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'].map((n) => (
              <option key={n} value={n} className="bg-background">
                {n} Orang
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
