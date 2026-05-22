import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { staggerContainer, staggerItem } from './PageTransition'

export default function GaleriPage() {
  const [photos, setPhotos] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('urutan')
      .order('created_at', { ascending: false })

    setPhotos(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="material-symbols-outlined animate-spin text-secondary text-3xl">progress_activity</span>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">photo_library</span>
        <p className="text-on-surface-variant">Belum ada foto di galeri.</p>
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
          Galeri
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-3 h-[1px] w-16 bg-gradient-to-r from-[#FF8F00] to-transparent origin-left"
        />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
      >
        {photos.map((img) => (
          <motion.button
            key={img.id}
            variants={staggerItem}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(img)}
            className="relative rounded-2xl overflow-hidden aspect-[4/3] group"
          >
            <img
              src={img.url}
              alt={img.caption || ''}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {img.caption && (
              <motion.span
                initial={false}
                className="absolute bottom-3 left-3 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {img.caption}
              </motion.span>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selected.url} alt={selected.caption || ''} className="w-full rounded-2xl" />
              <div className="flex justify-between items-center mt-4">
                <p className="text-primary text-sm">{selected.caption || ''}</p>
                <button onClick={() => setSelected(null)} className="text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
