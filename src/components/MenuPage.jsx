import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { menuData, kategoriMenu } from '../data/menuData'
import { formatRupiah } from '../utils/format'
import { staggerContainer, staggerItem } from './PageTransition'

const itemImages = {
  'Espresso': 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=300&h=300&fit=crop',
  'Double Espresso': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=300&h=300&fit=crop',
  'Americano': 'https://images.unsplash.com/photo-1532004491497-ba35c1b23956?w=300&h=300&fit=crop',
  'Cappuccino': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop',
  'Flat White': 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=300&h=300&fit=crop',
  'Latte': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop',
  'Mocha': 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=300&h=300&fit=crop',
  'Macchiato': 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=300&h=300&fit=crop',
  'Affogato': 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=300&h=300&fit=crop',
  'Cold Brew': 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300&h=300&fit=crop',
  'Iced Latte': 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300&h=300&fit=crop',
  'Sea Salt Caramel Latte': 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&h=300&fit=crop',
  'Hot Chocolate': 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=300&h=300&fit=crop',
  'Matcha Latte': 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=300&h=300&fit=crop',
  'Iced Lemon Tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop',
  'Mixed Berry Smoothie': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=300&fit=crop',
  'Tiramisu': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=300&fit=crop',
  'Cheesecake': 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=300&h=300&fit=crop',
  'Chocolate Lava Cake': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=300&fit=crop',
  'Red Velvet Slice': 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=300&h=300&fit=crop'
}

export default function MenuPage() {
  const [active, setActive] = useState('Semua')

  const filtered = useMemo(() => {
    if (active === 'Semua') return menuData
    return menuData.filter((m) => m.kategori === active)
  }, [active])

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
            key={item.nama}
            variants={staggerItem}
            layout
            whileHover={{ y: -4 }}
            className="group rounded-2xl overflow-hidden border border-white/5 hover:border-[#FF8F00]/20 transition-colors bg-white/[0.02]"
          >
            <div className="aspect-square overflow-hidden relative">
              <img
                src={itemImages[item.nama]}
                alt={item.nama}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-primary truncate">{item.nama}</p>
              <p className="text-[#FF8F00] text-xs mt-0.5">{formatRupiah(item.harga)}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
