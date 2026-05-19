import { useState, useMemo } from 'react'
import Header from './components/Header'
import BackgroundFX from './components/BackgroundFX'
import WelcomeBanner from './components/WelcomeBanner'
import TipePemesanan from './components/TipePemesanan'
import DataPemesan from './components/DataPemesan'
import BookingTempatFields from './components/BookingTempatFields'
import BookingVillaFields from './components/BookingVillaFields'
import MenuPicker from './components/MenuPicker'
import Summary from './components/Summary'
import ConfirmModal from './components/ConfirmModal'
import SuccessModal from './components/SuccessModal'
import CekStatus from './components/CekStatus'
import Footer from './components/Footer'
import { tempatBooking, villaBooking } from './data/menuData'
import { calculateDays } from './utils/format'
import { buildOrderPayload } from './utils/buildPayload'
import { insertOrder } from './lib/supabase'

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || ''

const initialPemesan = { nama: '', telepon: '', email: '' }
const initialTempat = { tempat: '', tanggal: '', waktu: '', durasi: '', jumlahOrang: '' }
const initialVilla = { checkIn: '', checkOut: '', jumlahTamu: '' }

export default function App() {
  const [tipe, setTipe] = useState('dinein')
  const [pemesan, setPemesan] = useState(initialPemesan)
  const [bookingTempat, setBookingTempat] = useState(initialTempat)
  const [bookingVilla, setBookingVilla] = useState(initialVilla)
  const [selectedItems, setSelectedItems] = useState([])
  const [catatan, setCatatan] = useState('')

  const [pendingPayload, setPendingPayload] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successOrderId, setSuccessOrderId] = useState(null)
  const [successPayload, setSuccessPayload] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [showCekStatus, setShowCekStatus] = useState(false)

  const durasi = parseInt(bookingTempat.durasi) || 0
  const jumlahMalam = calculateDays(bookingVilla.checkIn, bookingVilla.checkOut)

  const subtotal = useMemo(() => {
    const menuTotal = selectedItems.reduce((s, i) => s + i.harga * i.qty, 0)
    let bookingTotal = 0
    if (tipe === 'tempat') {
      const t = tempatBooking.find((x) => x.id === bookingTempat.tempat)
      bookingTotal = t ? t.hargaPerJam * durasi : 0
    } else if (tipe === 'villa') {
      bookingTotal = villaBooking.hargaPerMalam * jumlahMalam
    }
    return menuTotal + bookingTotal
  }, [selectedItems, tipe, bookingTempat, durasi, jumlahMalam])

  const validateBeforeConfirm = () => {
    setErrorMsg('')
    if (!pemesan.nama.trim()) return 'Nama lengkap wajib diisi.'
    if (!pemesan.telepon.trim()) return 'Nomor WhatsApp wajib diisi.'

    if (tipe === 'tempat') {
      if (!bookingTempat.tempat) return 'Pilih tempat booking terlebih dahulu.'
      if (!bookingTempat.tanggal) return 'Tanggal booking wajib diisi.'
      if (!bookingTempat.waktu) return 'Jam mulai wajib diisi.'
      if (!bookingTempat.durasi) return 'Durasi wajib diisi.'
      if (!bookingTempat.jumlahOrang) return 'Jumlah orang wajib diisi.'
    }

    if (tipe === 'villa') {
      if (!bookingVilla.checkIn) return 'Tanggal check-in wajib diisi.'
      if (!bookingVilla.checkOut) return 'Tanggal check-out wajib diisi.'
      if (jumlahMalam <= 0) return 'Tanggal check-out harus setelah check-in.'
      if (!bookingVilla.jumlahTamu) return 'Jumlah tamu wajib diisi.'
    }

    if ((tipe === 'dinein' || tipe === 'takeaway') && selectedItems.length === 0) {
      return 'Pilih minimal satu menu.'
    }

    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const error = validateBeforeConfirm()
    if (error) {
      setErrorMsg(error)
      return
    }
    const payload = buildOrderPayload({ tipe, pemesan, selectedItems, bookingTempat, bookingVilla, catatan })
    setPendingPayload(payload)
  }

  const handleConfirm = async () => {
    if (!pendingPayload) return
    setIsSubmitting(true)
    setErrorMsg('')

    // Log payload for debugging
    console.log('%c[Sky Cafe Order Payload]', 'color:#FF8F00;font-weight:bold;')
    console.log(JSON.stringify(pendingPayload, null, 2))

    try {
      // Kirim ke Supabase (simpan data) dan N8N (trigger workflow) bersamaan
      const tasks = [insertOrder(pendingPayload)]

      if (WEBHOOK_URL) {
        tasks.push(
          fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pendingPayload)
          })
        )
      }

      await Promise.all(tasks)

      // Success
      setSuccessOrderId(pendingPayload.orderId)
      setSuccessPayload(pendingPayload)
      setPendingPayload(null)
      // Reset form
      setTipe('dinein')
      setPemesan(initialPemesan)
      setBookingTempat(initialTempat)
      setBookingVilla(initialVilla)
      setSelectedItems([])
      setCatatan('')
    } catch (err) {
      console.error(err)
      setErrorMsg('Gagal mengirim pesanan. Silakan coba lagi atau hubungi kami via WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <BackgroundFX />
      <Header onCekStatus={() => setShowCekStatus(true)} />

      <main className="pt-20 min-h-screen relative">
        <div className="p-6 md:p-16 max-w-7xl mx-auto relative z-10">
          <WelcomeBanner />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form */}
            <div className="lg:col-span-8">
              <div className="glass-panel-heavy rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-secondary">restaurant</span>
                  <h3 className="text-2xl font-semibold font-playfair">Form Pemesanan</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <TipePemesanan value={tipe} onChange={setTipe} />
                  <DataPemesan data={pemesan} onChange={setPemesan} />

                  {tipe === 'tempat' && (
                    <BookingTempatFields data={bookingTempat} onChange={setBookingTempat} />
                  )}
                  {tipe === 'villa' && (
                    <BookingVillaFields data={bookingVilla} onChange={setBookingVilla} />
                  )}

                  <MenuPicker selectedItems={selectedItems} onChange={setSelectedItems} />

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant block">Catatan Tambahan</label>
                    <textarea
                      rows={3}
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      placeholder="Alergi, preferensi, atau permintaan khusus..."
                      className="w-full bg-transparent border-b border-white/10 py-2 focus:border-secondary focus:outline-none focus:ring-0 transition-colors text-on-surface resize-none placeholder:text-white/30"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-sm flex items-start gap-2">
                      <span className="material-symbols-outlined text-base mt-0.5">error</span>
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#FF8F00] hover:bg-[#E67E00] text-[#0A0A0A] font-bold py-4 rounded-lg transition-all active:scale-95 shadow-lg shadow-[#FF8F00]/20"
                  >
                    Kirim Pesanan
                  </button>
                </form>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-4">
              <Summary
                tipe={tipe}
                selectedItems={selectedItems}
                bookingTempat={bookingTempat}
                bookingVilla={bookingVilla}
                subtotal={subtotal}
                jumlahMalam={jumlahMalam}
                durasi={durasi}
              />
            </div>
          </div>
        </div>

        <Footer />
      </main>

      <ConfirmModal
        open={!!pendingPayload}
        payload={pendingPayload}
        onCancel={() => setPendingPayload(null)}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
      />

      <SuccessModal
        open={!!successOrderId}
        orderId={successOrderId}
        payload={successPayload}
        onClose={() => { setSuccessOrderId(null); setSuccessPayload(null) }}
      />

      <CekStatus
        open={showCekStatus}
        onClose={() => setShowCekStatus(false)}
      />
    </>
  )
}
