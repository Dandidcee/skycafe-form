import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const statusConfig = {
  pending: { label: 'Menunggu Dikonfirmasi', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  confirmed: { label: 'Menunggu Pembayaran', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  paid: { label: 'Pesanan Sedang Dibuat', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  completed: { label: 'Selesai', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
}

const statusFlow = ['pending', 'confirmed', 'paid', 'completed']

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const audioRef = useRef(null)

  useEffect(() => {
    fetchOrders()

    // Realtime subscription for new orders & status changes
    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOrders((prev) => [payload.new, ...prev])
          playNotification()
        } else if (payload.eventType === 'UPDATE') {
          setOrders((prev) => prev.map((o) => o.id === payload.new.id ? payload.new : o))
          if (payload.new.status === 'paid') {
            playNotification()
          }
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }

  const updateStatus = async (orderId, newStatus) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o))
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }))
    }
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const formatRupiah = (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`
  const formatDate = (d) => new Date(d).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })

  if (loading) {
    return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span></div>
  }

  return (
    <div>
      {/* Notification sound */}
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Pesanan</h2>
        <span className="text-sm text-gray-400">{orders.length} total</span>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[{ id: 'all', label: 'Semua' }, ...Object.entries(statusConfig).map(([id, cfg]) => ({ id, label: cfg.label }))].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f.id ? 'bg-primary text-black' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Orders list */}
        <div className="xl:col-span-2 space-y-3">
          {filteredOrders.length === 0 && (
            <p className="text-gray-500 text-center py-12">Tidak ada pesanan.</p>
          )}
          {filteredOrders.map((order) => {
            const s = statusConfig[order.status] || statusConfig.pending
            return (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedOrder?.id === order.id ? 'border-primary bg-gray-800/50' : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{order.nama}</p>
                    <p className="text-xs text-gray-400 mt-1">{order.order_id} • {formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full border ${s.color}`}>{s.label}</span>
                    <p className="text-sm font-medium text-primary mt-2">{formatRupiah(order.total)}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Order detail */}
        <div className="xl:col-span-1">
          {selectedOrder ? (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 sticky top-8 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{selectedOrder.nama}</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Order ID</span><span className="font-mono">{selectedOrder.order_id}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Telepon</span><span>{selectedOrder.telepon}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Tipe</span><span className="capitalize">{selectedOrder.tipe}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Tanggal</span><span>{formatDate(selectedOrder.created_at)}</span></div>
              </div>

              {selectedOrder.menu_items && selectedOrder.menu_items.length > 0 && (
                <div className="border-t border-gray-800 pt-3 space-y-2">
                  <p className="text-xs text-gray-400 uppercase">Menu</p>
                  {selectedOrder.menu_items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.nama} <span className="text-gray-500">x{item.qty}</span></span>
                      <span className="text-primary">{formatRupiah(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedOrder.catatan && (
                <div className="border-t border-gray-800 pt-3">
                  <p className="text-xs text-gray-400 uppercase mb-1">Catatan</p>
                  <p className="text-sm text-gray-300">{selectedOrder.catatan}</p>
                </div>
              )}

              <div className="border-t border-gray-800 pt-3 flex justify-between items-center">
                <span className="text-gray-400">Total</span>
                <span className="text-xl font-bold text-primary">{formatRupiah(selectedOrder.total)}</span>
              </div>

              {/* Status update buttons */}
              <div className="border-t border-gray-800 pt-4 space-y-2">
                <p className="text-xs text-gray-400 uppercase">Ubah Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {statusFlow.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedOrder.id, s)}
                      disabled={selectedOrder.status === s}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        selectedOrder.status === s
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {statusConfig[s]?.label || s}
                    </button>
                  ))}
                  <button
                    onClick={() => updateStatus(selectedOrder.id, 'cancelled')}
                    disabled={selectedOrder.status === 'cancelled'}
                    className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-800 text-red-400 hover:bg-red-500/10 col-span-2"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center text-gray-500">
              <span className="material-symbols-outlined text-4xl mb-2">touch_app</span>
              <p className="text-sm">Pilih pesanan untuk melihat detail</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
