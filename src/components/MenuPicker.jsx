import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    <div className="space-y-3">
      <p className="text-xs text-on-surface-variant">Pilih menu</p>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {kategoriMenu.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeCategory === cat
                ? 'bg-[#FF8F00] text-[#0A0A0A] font-medium'
                : 'text-on-surface-variant border border-white/10 hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid layout — compact cards instead of long list */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-80 overflow-y-auto menu-scroll pr-1">
        <AnimatePresence mode="popLayout">
          {filteredMenu.map((item) => {
            const qty = getQty(item.nama)
            const isSelected = qty > 0
            return (
              <motion.div
                key={item.nama}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`p-3 rounded-xl border transition-colors ${
                  isSelected
                    ? 'border-[#FF8F00]/30 bg-[#FF8F00]/5'
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                <p className="text-xs text-on-surface truncate font-medium">{item.nama}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{formatRupiah(item.harga)}</p>
                
                {/* Quantity controls */}
                <div className="flex items-center justify-between mt-2">
                  <button
                    type="button"
                    onClick={() => updateQty(item, -1)}
                    disabled={qty === 0}
                    className="w-6 h-6 rounded-md border border-white/10 flex items-center justify-center disabled:opacity-20 hover:border-white/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">remove</span>
                  </button>
                  <span className={`text-xs tabular-nums font-medium ${isSelected ? 'text-[#FF8F00]' : 'text-on-surface-variant'}`}>
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(item, 1)}
                    className="w-6 h-6 rounded-md border border-white/10 flex items-center justify-center hover:border-[#FF8F00]/30 hover:text-[#FF8F00] transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">add</span>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Selected summary chips */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          {selectedItems.map((item) => (
            <span key={item.nama} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FF8F00]/10 text-[#FF8F00] text-[10px]">
              {item.nama} x{item.qty}
              <button type="button" onClick={() => updateQty(item, -item.qty)} className="hover:opacity-70">
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
