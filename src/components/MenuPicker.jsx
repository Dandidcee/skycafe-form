import { useState, useMemo } from 'react'
import { menuData, kategoriMenu } from '../data/menuData'
import { formatRupiah } from '../utils/format'

export default function MenuPicker({ selectedItems, onChange }) {
  const [activeCategory, setActiveCategory] = useState('Semua')

  const filteredMenu = useMemo(() => {
    if (activeCategory === 'Semua') return menuData
    return menuData.filter((m) => m.kategori === activeCategory)
  }, [activeCategory])

  const getQty = (nama) => {
    const found = selectedItems.find((i) => i.nama === nama)
    return found ? found.qty : 0
  }

  const updateQty = (item, delta) => {
    const current = getQty(item.nama)
    const next = Math.max(0, current + delta)
    let updated
    if (next === 0) {
      updated = selectedItems.filter((i) => i.nama !== item.nama)
    } else if (current === 0) {
      updated = [...selectedItems, { ...item, qty: next }]
    } else {
      updated = selectedItems.map((i) =>
        i.nama === item.nama ? { ...i, qty: next } : i
      )
    }
    onChange(updated)
  }

  return (
    <div className="space-y-1">
      <label className="text-xs uppercase tracking-widest text-on-surface-variant block">
        Pilih Menu (Opsional)
      </label>

      {/* Kategori Filter */}
      <div className="flex gap-2 mt-3 mb-4 flex-wrap">
        {kategoriMenu.map((cat) => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs transition-all border ${
                isActive
                  ? 'bg-[#FF8F00]/20 border-[#FF8F00] text-[#FF8F00]'
                  : 'border-white/10 hover:border-secondary/50 text-on-surface-variant'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Menu list */}
      <div className="menu-scroll space-y-3 max-h-96 overflow-y-auto pr-2">
        {filteredMenu.map((item) => {
          const qty = getQty(item.nama)
          const isSelected = qty > 0
          return (
            <div
              key={item.nama}
              className={`glass-panel p-4 rounded-lg transition-all border flex items-center justify-between ${
                isSelected ? 'border-secondary/60' : 'border-white/10'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-on-surface">{item.nama}</span>
                <span className="text-xs text-on-surface-variant">
                  {item.kategori}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-secondary text-sm md:text-base">
                  {formatRupiah(item.harga)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQty(item, -1)}
                    disabled={qty === 0}
                    className="w-8 h-8 rounded-md border border-white/10 hover:border-secondary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-base">remove</span>
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(item, 1)}
                    className="w-8 h-8 rounded-md border border-white/10 hover:border-secondary/50 transition-colors flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
