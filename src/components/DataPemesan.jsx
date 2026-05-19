export default function DataPemesan({ data, onChange }) {
  const handleChange = (field) => (e) => {
    onChange({ ...data, [field]: e.target.value })
  }

  const inputClass =
    'w-full bg-transparent border-b border-white/10 py-2 focus:border-secondary focus:outline-none focus:ring-0 transition-colors text-on-surface placeholder:text-white/30'

  return (
    <div className="space-y-4">
      <p className="text-xs text-on-surface-variant">Data diri</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-on-surface-variant block">Nama lengkap</label>
          <input
            required
            type="text"
            value={data.nama}
            onChange={handleChange('nama')}
            placeholder="Masukkan nama Anda"
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-on-surface-variant block">No. WhatsApp</label>
          <input
            required
            type="tel"
            value={data.telepon}
            onChange={handleChange('telepon')}
            placeholder="08xxxxxxxxxx"
            className={inputClass}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-on-surface-variant block">Email (opsional)</label>
        <input
          type="email"
          value={data.email}
          onChange={handleChange('email')}
          placeholder="email@contoh.com"
          className={inputClass}
        />
      </div>
    </div>
  )
}
