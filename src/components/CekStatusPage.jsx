import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatRupiah, formatTanggal } from '../utils/format'

const statusConfig = {
  pending: { label: 'Menunggu Dikonfirmasi', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', icon: 'schedule' },
  confirmed: { label: 'Menunggu Pembayaran', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30', icon: 'payments' },
  paid: { label: 'Pesanan Sedang Dibuat', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30', icon: 'restaurant' },
  completed: { label: 'Pesanan Selesai', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30', icon: 'check_circle' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30', icon: 'cancel' }
}

export default function CekStatusPage() {
  const [orderId, setOrderId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheck = async (e) => {
    e.preventDefault()
    if (!orderId.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const { data, error: dbError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId.trim().toUpperCase())
        .single()

      if (dbError || !data) {
        setError('Pesanan tidak ditemukan. Pastikan Order ID benar.')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('Gagal mengecek status. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const status = result ? (statusConfig[result.status] || statusConfig.pending) : null
  const tipeLabel = { dinein: 'Dine In', takeaway: 'Takeaway', tempat: 'Booking Tempat', villa: 'Booking Villa' }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="glass-panel-heavy rounded-2xl p-6 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF8F00]/10 to-transparent opacity-50" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-playfair mb-2">Cek Status</h2>
          <p className="text-on-surface-variant">Lacak pesanan atau booking Anda dengan Order ID.</p>
        </div>
      </div>

      {/* Search form */}
      <div className="glass-panel-heavy rounded-xl p-6 md:p-8">
        <form onSubmit={handleCheck} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-on-surface-variant block">Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="SKY-XXXXXX-XXXX"
              className="w-full bg-transparent border-b-2 border-white/10 py-3 focus:border-secondary focus:outline-none focus:ring-0 transition-colors text-on-surface placeholder:text-white/30 font-mono text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !orderId.trim()}
            className="w-full bg-[#FF8F00] hover:bg-[#E67E00] text-[#0A0A0A] font-bold py-4 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="material-symbols-outlined animate-spin">progress_activity</span>Mengecek...</>
            ) : (
              <><span className="material-symbols-outlined">search</span>Cek Status</>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-5 p-4 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-sm flex items-start gap-2">
            <span className="material-symbols-outlined text-base mt-0.5">error</span>
            {error}
          </div>
        )}

        {result && status && (
          <div className="mt-6 space-y-5">
            {/* Status badge */}
            <div className={`p-5 rounded-xl border ${status.bg} flex items-center gap-4`}>
              <span className={`material-symbols-outlined text-4xl ${status.color}`}>{status.icon}</span>
              <div>
                <p className={`font-bold text-xl ${status.color}`}>{status.label}</p>
                <p className="text-xs text-on-surface-variant mt-1">Order: {result.order_id}</p>
              </div>
            </div>

            {/* Detail */}
            <div className="glass-panel rounded-xl border border-white/10 p-5 space-y-3">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant border-b border-white/10 pb-2">Detail Pesanan</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-on-surface-variant">Nama</span><span className="text-primary font-medium">{result.nama}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">WhatsApp</span><span>{result.telepon}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Tipe</span><span>{tipeLabel[result.tipe] || result.tipe}</span></div>
                {result.tipe === 'tempat' && result.tempat_nama && (
                  <>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Lokasi</span><span>{result.tempat_nama}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Tanggal</span><span>{formatTanggal(result.tempat_tanggal)}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Durasi</span><span>{result.tempat_durasi} Jam</span></div>
                  </>
                )}
                {result.tipe === 'villa' && result.villa_checkin && (
                  <>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Check-in</span><span>{formatTanggal(result.villa_checkin)}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Check-out</span><span>{formatTanggal(result.villa_checkout)}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Malam</span><span>{result.villa_malam} malam</span></div>
                  </>
                )}
                {result.menu_items && result.menu_items.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <p className="text-on-surface-variant text-xs uppercase">Menu</p>
                    {result.menu_items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{item.nama} <span className="text-on-surface-variant">×{item.qty}</span></span>
                        <span className="text-secondary">{formatRupiah(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                  <span className="text-on-surface-variant">Total</span>
                  <span className="text-2xl font-semibold text-secondary">{formatRupiah(result.total)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Dibuat</span>
                  <span>{result.created_at ? new Date(result.created_at).toLocaleString('id-ID') : '-'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
