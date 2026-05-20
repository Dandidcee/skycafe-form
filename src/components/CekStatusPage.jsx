import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatRupiah, formatTanggal } from '../utils/format'
import { generateReceiptFromOrder } from '../utils/generateReceipt'

const statusConfig = {
  pending: { label: 'Menunggu Dikonfirmasi', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', icon: 'schedule' },
  confirmed: { label: 'Menunggu Pembayaran', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30', icon: 'payments' },
  paid: { label: 'Pesanan Sedang Dibuat', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30', icon: 'restaurant' },
  completed: { label: 'Pesanan Selesai', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30', icon: 'check_circle' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30', icon: 'cancel' }
}

export default function CekStatusPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('order_id') // order_id atau nama
  const [results, setResults] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheck = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setError('')
    setResults([])
    setSelectedOrder(null)

    try {
      let query = supabase.from('orders').select('*')

      if (searchType === 'order_id') {
        query = query.eq('order_id', searchQuery.trim().toUpperCase())
      } else {
        query = query.ilike('nama', `%${searchQuery.trim()}%`)
      }

      const { data, error: dbError } = await query.order('created_at', { ascending: false })

      if (dbError) {
        setError('Gagal mengecek status. Coba lagi.')
      } else if (!data || data.length === 0) {
        setError('Pesanan tidak ditemukan. Pastikan data yang dimasukkan benar.')
      } else if (data.length === 1) {
        setSelectedOrder(data[0])
      } else {
        setResults(data)
      }
    } catch (err) {
      setError('Gagal mengecek status. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleCetakStruk = (order) => {
    generateReceiptFromOrder(order)
  }

  const status = selectedOrder ? (statusConfig[selectedOrder.status] || statusConfig.pending) : null
  const tipeLabel = { dinein: 'Dine In', takeaway: 'Takeaway', tempat: 'Booking Tempat', villa: 'Booking Villa' }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="glass-panel-heavy rounded-2xl p-6 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF8F00]/10 to-transparent opacity-50" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-playfair mb-2">Cek Status</h2>
          <p className="text-on-surface-variant">Lacak pesanan dengan Order ID atau nama pemesan.</p>
        </div>
      </div>

      {/* Search form */}
      <div className="glass-panel-heavy rounded-xl p-6 md:p-8">
        <form onSubmit={handleCheck} className="space-y-5">
          {/* Search type toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSearchType('order_id')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${searchType === 'order_id' ? 'bg-[#FF8F00] text-[#0A0A0A]' : 'bg-white/5 text-on-surface-variant hover:bg-white/10'}`}
            >
              Order ID
            </button>
            <button
              type="button"
              onClick={() => setSearchType('nama')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${searchType === 'nama' ? 'bg-[#FF8F00] text-[#0A0A0A]' : 'bg-white/5 text-on-surface-variant hover:bg-white/10'}`}
            >
              Nama Pemesan
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-on-surface-variant block">
              {searchType === 'order_id' ? 'Order ID' : 'Nama Pemesan'}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchType === 'order_id' ? 'SKY-XXXXXX-XXXX' : 'Masukkan nama pemesan...'}
              className="w-full bg-transparent border-b-2 border-white/10 py-3 focus:border-secondary focus:outline-none focus:ring-0 transition-colors text-on-surface placeholder:text-white/30 font-mono text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
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

        {/* Multiple results list */}
        {results.length > 1 && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-on-surface-variant">Ditemukan {results.length} pesanan:</p>
            {results.map((order) => {
              const s = statusConfig[order.status] || statusConfig.pending
              return (
                <button
                  key={order.id}
                  onClick={() => { setSelectedOrder(order); setResults([]) }}
                  className="w-full text-left p-4 rounded-xl border border-white/10 hover:border-[#FF8F00]/40 hover:bg-white/5 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-on-surface">{order.order_id}</p>
                      <p className="text-xs text-on-surface-variant mt-1">{order.nama} — {tipeLabel[order.tipe] || order.tipe}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.bg} ${s.color}`}>{s.label}</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Selected order detail */}
        {selectedOrder && status && (
          <div className="mt-6 space-y-5">
            {/* Status badge */}
            <div className={`p-5 rounded-xl border ${status.bg} flex items-center gap-4`}>
              <span className={`material-symbols-outlined text-4xl ${status.color}`}>{status.icon}</span>
              <div>
                <p className={`font-bold text-xl ${status.color}`}>{status.label}</p>
                <p className="text-xs text-on-surface-variant mt-1">Order: {selectedOrder.order_id}</p>
              </div>
            </div>

            {/* Detail */}
            <div className="glass-panel rounded-xl border border-white/10 p-5 space-y-3">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant border-b border-white/10 pb-2">Detail Pesanan</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-on-surface-variant">Nama</span><span className="text-primary font-medium">{selectedOrder.nama}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">WhatsApp</span><span>{selectedOrder.telepon}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Tipe</span><span>{tipeLabel[selectedOrder.tipe] || selectedOrder.tipe}</span></div>
                {selectedOrder.tipe === 'tempat' && selectedOrder.tempat_nama && (
                  <>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Lokasi</span><span>{selectedOrder.tempat_nama}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Tanggal</span><span>{formatTanggal(selectedOrder.tempat_tanggal)}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Durasi</span><span>{selectedOrder.tempat_durasi} Jam</span></div>
                  </>
                )}
                {selectedOrder.tipe === 'villa' && selectedOrder.villa_checkin && (
                  <>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Check-in</span><span>{formatTanggal(selectedOrder.villa_checkin)}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Check-out</span><span>{formatTanggal(selectedOrder.villa_checkout)}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Malam</span><span>{selectedOrder.villa_malam} malam</span></div>
                  </>
                )}
                {selectedOrder.menu_items && selectedOrder.menu_items.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <p className="text-on-surface-variant text-xs uppercase">Menu</p>
                    {selectedOrder.menu_items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{item.nama} <span className="text-on-surface-variant">×{item.qty}</span></span>
                        <span className="text-secondary">{formatRupiah(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                  <span className="text-on-surface-variant">Total</span>
                  <span className="text-2xl font-semibold text-secondary">{formatRupiah(selectedOrder.total)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Dibuat</span>
                  <span>{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('id-ID') : '-'}</span>
                </div>
              </div>
            </div>

            {/* Cetak Struk button */}
            <button
              onClick={() => handleCetakStruk(selectedOrder)}
              className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-on-surface font-bold py-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">receipt_long</span>
              Cetak Struk
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
