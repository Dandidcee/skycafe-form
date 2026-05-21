import { useState, useMemo } from 'react'
import Header from './components/Header'
import BackgroundFX from './components/BackgroundFX'
import WelcomeBanner from './components/WelcomeBanner'
import TipePemesanan from './components/TipePemesanan'
import DataPemesan from './components/DataPemesan'
import MenuPicker from './components/MenuPicker'
import Summary from './components/Summary'
import ConfirmModal from './components/ConfirmModal'
import SuccessModal from './components/SuccessModal'
import MenuPage from './components/MenuPage'
import GaleriPage from './components/GaleriPage'
import CekStatusPage from './components/CekStatusPage'
import UlasanPage from './components/UlasanPage'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import { buildOrderPayload } from './utils/buildPayload'
import { insertOrder } from './lib/supabase'

const initialPemesan = { nama: '', telepon: '', email: '' }

export default function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [tipe, setTipe] = useState('dinein')
  const [pemesan, setPemesan] = useState(initialPemesan)
  const [selectedItems, setSelectedItems] = useState([])
  const [catatan, setCatatan] = useState('')

  const [pendingPayload, setPendingPayload] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successOrderId, setSuccessOrderId] = useState(null)
  const [successPayload, setSuccessPayload] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const subtotal = useMemo(() => {
    return selectedItems.reduce((s, i) => s + i.harga * i.qty, 0)
  }, [selectedItems])

  const validateBeforeConfirm = () => {
    setErrorMsg('')
    if (!pemesan.nama.trim()) return 'Nama lengkap wajib diisi.'
    if (!pemesan.telepon.trim()) return 'Nomor WhatsApp wajib diisi.'
    if (selectedItems.length === 0) return 'Pilih minimal satu menu.'
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const error = validateBeforeConfirm()
    if (error) {
      setErrorMsg(error)
      return
    }
    const payload = buildOrderPayload({ tipe, pemesan, selectedItems, bookingTempat: {}, bookingVilla: {}, catatan })
    setPendingPayload(payload)
  }

  const handleConfirm = async () => {
    if (!pendingPayload) return
    setIsSubmitting(true)
    setErrorMsg('')

    console.log('%c[Sky Cafe Order Payload]', 'color:#FF8F00;font-weight:bold;')
    console.log(JSON.stringify(pendingPayload, null, 2))

    try {
      await insertOrder(pendingPayload)

      setSuccessOrderId(pendingPayload.orderId)
      setSuccessPayload(pendingPayload)
      setPendingPayload(null)
      setTipe('dinein')
      setPemesan(initialPemesan)
      setSelectedItems([])
      setCatatan('')
    } catch (err) {
      console.error(err)
      setErrorMsg('Gagal mengirim pesanan. Silakan coba lagi atau hubungi kami via WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderOrderPage = () => (
    <>
      <WelcomeBanner />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="glass-panel-heavy rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-secondary">restaurant</span>
              <h3 className="text-2xl font-semibold font-playfair">Form Pemesanan</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <TipePemesanan value={tipe} onChange={setTipe} />
              <DataPemesan data={pemesan} onChange={setPemesan} />

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

        <div className="lg:col-span-4">
          <Summary
            tipe={tipe}
            selectedItems={selectedItems}
            subtotal={subtotal}
          />
        </div>
      </div>
    </>
  )

  const renderPage = () => {
    switch (currentPage) {
      case 'menu': return <MenuPage />
      case 'galeri': return <GaleriPage />
      case 'ulasan': return <UlasanPage />
      case 'cek-status': return <CekStatusPage />
      default: return renderOrderPage()
    }
  }

  return (
    <>
      <BackgroundFX />
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />

      <main className="pt-16 md:pt-20 min-h-screen relative">
        <div className="p-5 md:p-12 lg:p-16 max-w-7xl mx-auto relative z-10">
          <PageTransition pageKey={currentPage}>
            {renderPage()}
          </PageTransition>
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
    </>
  )
}
