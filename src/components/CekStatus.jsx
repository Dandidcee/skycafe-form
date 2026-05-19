import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatRupiah, formatTanggal } from '../utils/format'

const statusConfig = {
  pending: { label: 'Menunggu', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', icon: 'schedule' },
  confirmed: { label: 'Dikonfirmasi', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30', icon: 'thumb_up' },
  processing: { label: 'Diproses', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30', icon: 'sync' },
  paid: { label: 'Sudah Dibayar', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30', icon: 'payments' },
  completed: { label: 'Selesai', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30', icon: 'check_circle' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30', icon: 'cancel' }
}

export default function CekStatus({ open, onClose }) {
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
        .select('order_id, status, nama, tipe, total, created_at')
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

  if (!open) return null

  const status = result ? (statusConfig[result.status] || statusConfig.pending) : null
  const tipeLabel = { dinein: 'Dine In', takeaway: 'Takeaway', tempat: 'Booking Tempat', villa: 'Booking Villa' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-panel-heavy modal-content rounded-2xl border border-white/10 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">search</span>
              <h3 className="text-xl font-semibold font-playfair">Cek Status Pesanan</h3>
            </div>
            <button onClick={onClose} type="button" className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleCheck} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-on-surface-variant block">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="SKY-XXXXXX-XXXX"
                className="w-full bg-transparent border-b border-white/10 py-2 focus:border-secondary focus:outline-none focus:ring-0 transition-colors text-on-surface placeholder:text-white/30 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !orderId.trim()}
              className="w-full bg-[#FF8F00] hover:bg-[#E67E00] text-[#0A0A0A] font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span>Mengecek...</>
              ) : (
                <><span className="material-symbols-outlined text-base">search</span>Cek Status</>
              )}
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-sm flex items-start gap-2">
              <span className="material-symbols-outlined text-base mt-0.5">error</span>
              {error}
            </div>
          )}

          {result && status && (
            <div className="space-y-4">
              {/* Status badge */}
              <div className={`p-4 rounded-lg border ${status.bg} flex items-center gap-3`}>
                <span className={`material-symbols-outlined text-3xl ${status.color}`}>{status.icon}</span>
                <div>
                  <p className={`font-semibold text-lg ${status.color}`}>{status.label}</p>
                  <p className="text-xs text-on-surface-variant">Order: {result.order_id}</p>
                </div>
              </div>

              {/* Detail */}
              <div className="glass-panel rounded-lg border border-white/10 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Nama</span>
                  <span className="text-primary">{result.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Tipe</span>
                  <span>{tipeLabel[result.tipe] || result.tipe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Total</span>
                  <span className="text-secondary font-medium">{formatRupiah(result.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Tanggal</span>
                  <span className="text-xs">{formatTanggal(result.created_at?.split('T')[0])}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
