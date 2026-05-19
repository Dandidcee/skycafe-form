import { formatRupiah, formatTanggal } from '../utils/format'

export default function ConfirmModal({
  open,
  payload,
  onCancel,
  onConfirm,
  isSubmitting
}) {
  if (!open || !payload) return null

  const { pemesan, pemesanan } = payload
  const tipeLabel = {
    dinein: 'Dine In',
    takeaway: 'Takeaway',
    tempat: 'Booking Tempat',
    villa: 'Booking Villa'
  }[pemesanan.tipe]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="glass-panel-heavy modal-content rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto menu-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">fact_check</span>
              <h3 className="text-xl md:text-2xl font-semibold font-playfair">
                Konfirmasi Pesanan
              </h3>
            </div>
            <button onClick={onCancel} type="button" className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <p className="text-sm text-on-surface-variant">
            Mohon periksa kembali detail pesanan Anda sebelum mengirim.
          </p>

          {/* Pemesan */}
          <section className="glass-panel rounded-lg border border-white/10 p-4 space-y-2">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant">Data Pemesan</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-on-surface-variant">Nama</span><span className="text-primary">{pemesan.nama}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">WhatsApp</span><span>{pemesan.telepon}</span></div>
              {pemesan.email && <div className="flex justify-between"><span className="text-on-surface-variant">Email</span><span className="break-all text-right">{pemesan.email}</span></div>}
            </div>
          </section>

          {/* Tipe */}
          <section className="glass-panel rounded-lg border border-white/10 p-4 space-y-2">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant">Tipe</p>
            <p className="text-primary font-medium">{tipeLabel}</p>
          </section>

          {/* Booking Tempat */}
          {pemesanan.bookingTempat && (
            <section className="glass-panel rounded-lg border border-white/10 p-4 space-y-2">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant">Detail Booking Tempat</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-on-surface-variant">Lokasi</span><span className="text-primary">{pemesanan.bookingTempat.namaTempat}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Tanggal</span><span>{formatTanggal(pemesanan.bookingTempat.tanggal)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Jam Mulai</span><span>{pemesanan.bookingTempat.waktu}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Durasi</span><span>{pemesanan.bookingTempat.durasiJam} Jam</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Jumlah Orang</span><span>{pemesanan.bookingTempat.jumlahOrang}</span></div>
                <div className="flex justify-between pt-2 border-t border-white/10"><span className="text-on-surface-variant">Subtotal Tempat</span><span className="text-secondary">{formatRupiah(pemesanan.bookingTempat.subtotal)}</span></div>
              </div>
            </section>
          )}

          {/* Booking Villa */}
          {pemesanan.bookingVilla && (
            <section className="glass-panel rounded-lg border border-white/10 p-4 space-y-2">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant">Detail Booking Villa</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-on-surface-variant">Check-in</span><span>{formatTanggal(pemesanan.bookingVilla.checkIn)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Check-out</span><span>{formatTanggal(pemesanan.bookingVilla.checkOut)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Jumlah Malam</span><span>{pemesanan.bookingVilla.jumlahMalam} malam</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Jumlah Tamu</span><span>{pemesanan.bookingVilla.jumlahTamu}</span></div>
                <div className="flex justify-between pt-2 border-t border-white/10"><span className="text-on-surface-variant">Subtotal Villa</span><span className="text-secondary">{formatRupiah(pemesanan.bookingVilla.subtotal)}</span></div>
              </div>
            </section>
          )}

          {/* Menu */}
          {pemesanan.menu && pemesanan.menu.items.length > 0 && (
            <section className="glass-panel rounded-lg border border-white/10 p-4 space-y-2">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant">Menu Pesanan</p>
              <div className="space-y-1 text-sm">
                {pemesanan.menu.items.map((item) => (
                  <div key={item.nama} className="flex justify-between">
                    <span>{item.nama} <span className="text-on-surface-variant">×{item.qty}</span></span>
                    <span className="text-secondary">{formatRupiah(item.subtotal)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-white/10"><span className="text-on-surface-variant">Subtotal Menu</span><span className="text-secondary">{formatRupiah(pemesanan.menu.subtotal)}</span></div>
              </div>
            </section>
          )}

          {/* Catatan */}
          {pemesanan.catatan && (
            <section className="glass-panel rounded-lg border border-white/10 p-4 space-y-2">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant">Catatan</p>
              <p className="text-sm text-on-surface">{pemesanan.catatan}</p>
            </section>
          )}

          {/* Total */}
          <section className="rounded-lg border border-secondary/40 bg-secondary/10 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Subtotal</span>
              <span>{formatRupiah(pemesanan.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Biaya Layanan</span>
              <span>{formatRupiah(pemesanan.biayaLayanan)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-secondary/30">
              <span className="text-on-surface-variant uppercase tracking-widest text-xs">Total Pembayaran</span>
              <span className="text-2xl font-semibold text-secondary">{formatRupiah(pemesanan.total)}</span>
            </div>
          </section>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4 flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary text-base mt-0.5">info</span>
            <p className="text-xs text-on-surface-variant">
              Setelah konfirmasi, pesanan akan dikirim ke sistem dan tim kami akan menghubungi Anda via WhatsApp di {pemesan.telepon}.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="button" onClick={onCancel} disabled={isSubmitting} className="flex-1 py-3 rounded-lg border border-white/10 hover:border-white/30 transition-colors text-on-surface disabled:opacity-50">
              Periksa Lagi
            </button>
            <button type="button" onClick={onConfirm} disabled={isSubmitting} className="flex-1 py-3 rounded-lg bg-[#FF8F00] hover:bg-[#E67E00] text-[#0A0A0A] font-bold transition-all active:scale-95 shadow-lg shadow-[#FF8F00]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? (
                <><span className="material-symbols-outlined animate-spin">progress_activity</span>Mengirim...</>
              ) : (
                <><span className="material-symbols-outlined">check_circle</span>Konfirmasi & Kirim</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
