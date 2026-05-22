import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { formatRupiah } from '../utils/format'
import { staggerContainer, staggerItem } from './PageTransition'

export default function MenuPage() {
  const [menuData, setMenuData] = useState([])
  const [kategoriMenu, setKategoriMenu] = useState(['Semua'])
  const [active, setActive] = useState('Semua')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .eq('tersedia', true)
      .order('urutan')
      .order('kategori')

    if (data) {
      setMenuData(data)
      const cats = ['Semua', ...new Set(data.map((d) => d.kategori))]
      setKategoriMenu(cats)
    }
    setLoading(false)
  }

  const filtered = useMemo(() => {
    if (active === 'Semua') return menuData
    return menuData.filter((m) => m.kategori === active)
  }, [active, menuData])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="material-symbols-outlined animate-spin text-secondary text-3xl">progress_activity</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-primary font-playfair"
        >
          Menu
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-3 h-[1px] w-16 bg-gradient-to-r from-[#FF8F00] to-transparent origin-left"
        />
      </div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 flex-wrap"
      >
        {kategoriMenu.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActive(cat)}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              active === cat
                ? 'bg-[#FF8F00] text-[#0A0A0A]'
                : 'text-on-surface-variant border border-white/10 hover:border-white/20'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
      >
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            variants={staggerItem}
            layout
            whileHover={{ y: -4 }}
            className="group rounded-2xl overflow-hidden border border-white/5 hover:border-[#FF8F00]/20 transition-colors bg-white/[0.02] p-4"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FF8F00]/10 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[#FF8F00]">coffee</span>
            </div>
            <p className="text-sm font-medium text-primary truncate">{item.nama}</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5">{item.kategori}</p>
            <p className="text-[#FF8F00] text-sm mt-2 font-medium">{formatRupiah(item.harga)}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
