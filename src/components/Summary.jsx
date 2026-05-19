import { motion } from 'framer-motion'
import { formatRupiah } from '../utils/format'
import { tempatBooking, villaBooking, BIAYA_LAYANAN } from '../data/menuData'

export default function Summary({ tipe, selectedItems, bookingTempat, bookingVilla, subtotal, jumlahMalam, durasi }) {
  const total = subtotal + BIAYA_LAYANAN
  const tempatInfo = tempatBooking.find((t) => t.id === bookingTempat.tempat)
  const tipeLabel = { dinein: 'Makan di Tempat', takeaway: 'Bawa Pulang', tempat: 'Booking Tempat', villa: 'Booking Villa' }[tipe]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-panel rounded-2xl p-5 sticky top-20"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-[#FF8F00] text-lg">receipt_long</span>
        <p className="text-sm font-medium text-primary">Ringkasan</p>
      </div>

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Tipe</span>
          <span className="text-primary">{tipeLabel}</span>
        </div>

        {tipe === 'tempat' && tempatInfo && durasi > 0 && (
          <div className="flex justify-between">
            <span className="text-on-surface-variant">{tempatInfo.nama} ({durasi} jam)</span>
            <span className="text-secondary">{formatRupiah(tempatInfo.hargaPerJam * durasi)}</span>
          </div>
        )}

        {tipe === 'villa' && jumlahMalam > 0 && (
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Villa ({jumlahMalam} malam)</span>
            <span className="text-secondary">{formatRupiah(villaBooking.hargaPerMalam * jumlahMalam)}</span>
          </div>
        )}

        {selectedItems.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            {selectedItems.map((item) => (
              <div key={item.nama} className="flex justify-between text-xs">
                <span className="text-on-surface-variant truncate mr-2">{item.nama} x{item.qty}</span>
                <span className="text-secondary shrink-0">{formatRupiah(item.harga * item.qty)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-white/5 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-on-surface-variant">Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-on-surface-variant">Biaya layanan</span>
            <span>{formatRupiah(BIAYA_LAYANAN)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/5">
            <span className="text-xs text-on-surface-variant">Total</span>
            <motion.span
              key={total}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-lg font-semibold text-[#FF8F00]"
            >
              {formatRupiah(total)}
            </motion.span>
          </div>
        </div>

        <p className="text-[10px] text-on-surface-variant/50 pt-2 leading-relaxed">
          Mungkin dikenakan biaya admin tambahan dari penyedia layanan pembayaran.
        </p>
      </div>
    </motion.div>
  )
}
