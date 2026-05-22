import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const menuItems = [
  { id: 'order', label: 'Pesan', icon: 'shopping_cart' },
  { id: 'menu', label: 'Menu', icon: 'restaurant_menu' },
  { id: 'galeri', label: 'Galeri', icon: 'photo_library' },
  { id: 'cek-status', label: 'Status', icon: 'receipt_long' },
]

export default function Header({ onNavigate, currentPage }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNav = (id) => {
    onNavigate(id)
    setMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 h-16 md:h-20 glass-panel-heavy px-6 md:px-12 flex justify-between items-center z-50"
      >
        {/* Logo */}
        <motion.button
          onClick={() => handleNav('order')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2.5"
        >
          <img src="/logo.png" alt="Sky Cafe" className="w-9 h-9 rounded-full" />
          <span className="text-lg font-bold text-[#FF8F00] font-playfair tracking-wide">SKY</span>
        </motion.button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => {
            const active = currentPage === item.id
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNav(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                  active ? 'text-[#FF8F00]' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-[#FF8F00]/10 border border-[#FF8F00]/20 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </motion.button>
            )
          })}
        </nav>

        {/* Hamburger */}
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.9 }}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-white/10"
        >
          <span className="material-symbols-outlined text-secondary text-xl">
            {menuOpen ? 'close' : 'menu'}
          </span>
        </motion.button>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute top-16 left-4 right-4 glass-panel-heavy rounded-2xl p-3 space-y-1"
              onClick={(e) => e.stopPropagation()}
            >
              {menuItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all ${
                    currentPage === item.id
                      ? 'text-[#FF8F00] bg-[#FF8F00]/10'
                      : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  {item.label}
                </motion.button>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
