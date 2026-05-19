import { formatRupiah, formatTanggal } from '../utils/format'
import { tempatBooking, villaBooking, BIAYA_LAYANAN } from '../data/menuData'

export default function Summary({
  tipe,
  selectedItems,
  bookingTempat,
  bookingVilla,
  subtotal,
  jumlahMalam,
  durasi
}) {
  const tipeLabel = {
    dinein: 'Dine In',
    takeaway: 'Takeaway',
    tempat: 'Booking Tempat',
    villa: 'Booking Villa'
  }[tipe]

  const tempatInfo = tempatBooking.find((t) => t.id === bookingTempat.tempat)
  const total = subtotal + BIAYA_LAYANAN

  return (
    <div className="glass-panel-heavy rounded-xl p-6 md:p-8 sticky top-28">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-secondary">receipt_long</span>
        <h3 className="text-2xl font-semibold font-playfair">Ringkasan</h3>
      </div>

      <div className="space-y-4">
        <div className="glass-panel p-4 rounded-lg border border-white/10">
          <p className="text-xs text-on-surface-variant mb-1">Tipe Pemesanan</p>
          <p className="text-primary font-medium">{tipeLabel}</p>
        </div>

        {/* Tempat Booking Summary */}
        {tipe === 'tempat' && tempatInfo && (
          <div className="glass-panel p-4 rounded-lg border border-white/10 space-y-2">
            <p className="text-xs text-on-surface-variant">Detail Booking Tempat</p>
            <div className="flex justify-between text-sm">
              <span>Lokasi</span>
              <span className="text-primary">{tempatInfo.nama}</span>
            </div>
            {bookingTempat.tanggal && (
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Tanggal</span>
                <span className="text-on-surface text-right">
                  {formatTanggal(bookingTempat.tanggal)}
                </span>
              </div>
            )}
            {bookingTempat.waktu && (
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Jam</span>
                <span>{bookingTempat.waktu}</span>
              </div>
            )}
            {durasi > 0 && (
              <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                <span className="text-on-surface-variant">
                  {formatRupiah(tempatInfo.hargaPerJam)} × {durasi} jam
                </span>
                <span className="text-secondary">
                  {formatRupiah(tempatInfo.hargaPerJam * durasi)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Villa Booking Summary */}
        {tipe === 'villa' && (
          <div className="glass-panel p-4 rounded-lg border border-white/10 space-y-2">
            <p className="text-xs text-on-surface-variant">Detail Booking Villa</p>
            {bookingVilla.checkIn && (
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Check-in</span>
                <span className="text-on-surface text-right">
                  {formatTanggal(bookingVilla.checkIn)}
                </span>
              </div>
            )}
            {bookingVilla.checkOut && (
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Check-out</span>
                <span className="text-on-surface text-right">
                  {formatTanggal(bookingVilla.checkOut)}
                </span>
              </div>
            )}
            {jumlahMalam > 0 && (
              <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                <span className="text-on-surface-variant">
                  {formatRupiah(villaBooking.hargaPerMalam)} × {jumlahMalam} malam
                </span>
                <span className="text-secondary">
                  {formatRupiah(villaBooking.hargaPerMalam * jumlahMalam)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Menu Summary */}
        <div className="glass-panel p-4 rounded-lg border border-white/10">
          <p className="text-xs text-on-surface-variant mb-2">Menu Dipilih</p>
          {selectedItems.length === 0 ? (
            <p className="text-on-surface-variant text-sm">Belum ada menu dipilih</p>
          ) : (
            <div className="space-y-2">
              {selectedItems.map((item) => (
                <div key={item.nama} className="flex justify-between items-center text-sm">
                  <span className="text-on-surface">
                    {item.nama}{' '}
                    <span className="text-on-surface-variant text-xs">×{item.qty}</span>
                  </span>
                  <span className="text-secondary">{formatRupiah(item.harga * item.qty)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Biaya & Total */}
        <div className="glass-panel p-4 rounded-lg border border-white/10 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Subtotal</span>
            <span className="text-on-surface">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Biaya Layanan</span>
            <span className="text-on-surface">{formatRupiah(BIAYA_LAYANAN)}</span>
          </div>
          <div className="pt-2 border-t border-white/10 flex justify-between">
            <span className="text-xs text-on-surface-variant">Total</span>
            <span className="text-2xl text-secondary font-semibold">
              {formatRupiah(total)}
            </span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-lg border border-secondary/30 bg-secondary/5 space-y-2">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary text-sm mt-0.5">info</span>
            <p className="text-xs text-on-surface-variant">
              Pesanan akan dikonfirmasi melalui WhatsApp di nomor yang Anda berikan.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[#FF8F00] text-sm mt-0.5">paid</span>
            <p className="text-xs text-on-surface-variant">
              Total harga mungkin dikenakan biaya admin tambahan dari penyedia layanan pembayaran.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
