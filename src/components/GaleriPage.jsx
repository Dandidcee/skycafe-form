import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, staggerItem } from './PageTransition'

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop', caption: 'Suasana Indoor' },
  { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop', caption: 'Area Outdoor' },
  { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop', caption: 'Signature Coffee' },
  { src: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=600&h=400&fit=crop', caption: 'VIP Room' },
  { src: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&h=400&fit=crop', caption: 'Villa View' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop', caption: 'Dessert Selection' },
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', caption: 'Interior' },
  { src: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&h=400&fit=crop', caption: 'Coffee Bar' },
]

export default function GaleriPage() {
  const [selected, setSelected] = useState(null)

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
        {galleryImages.map((img, idx) => (
          <motion.button
            key={idx}
            variants={staggerItem}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(img)}
            className="relative rounded-2xl overflow-hidden aspect-[4/3] group"
          >
            <img
              src={img.src}
              alt={img.caption}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.span
              initial={false}
              className="absolute bottom-3 left-3 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {img.caption}
            </motion.span>
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
              <img src={selected.src} alt={selected.caption} className="w-full rounded-2xl" />
              <div className="flex justify-between items-center mt-4">
                <p className="text-primary text-sm">{selected.caption}</p>
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
