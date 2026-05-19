const tipeOptions = [
  { value: 'dinein', label: 'Dine In', icon: 'restaurant', desc: 'Makan di tempat' },
  { value: 'takeaway', label: 'Takeaway', icon: 'shopping_bag', desc: 'Bawa pulang' },
  { value: 'tempat', label: 'Booking Tempat', icon: 'event_seat', desc: 'Outdoor/Indoor/VIP' },
  { value: 'villa', label: 'Booking Villa', icon: 'villa', desc: 'Per malam' }
]

export default function TipePemesanan({ value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs uppercase tracking-widest text-on-surface-variant block">
        Tipe Pemesanan
      </label>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
        {tipeOptions.map((opt) => {
          const isActive = value === opt.value
          return (
            <label
              key={opt.value}
              className={`glass-panel p-4 rounded-lg cursor-pointer transition-all border ${
                isActive
                  ? 'border-secondary bg-secondary/10 shadow-lg shadow-secondary/10'
                  : 'border-white/10 hover:border-secondary/50'
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
              <div className="flex flex-col items-start gap-1">
                <span className="material-symbols-outlined text-secondary text-2xl">
                  {opt.icon}
                </span>
                <span className="font-medium text-sm">{opt.label}</span>
                <span className="text-[10px] text-on-surface-variant">
                  {opt.desc}
                </span>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
