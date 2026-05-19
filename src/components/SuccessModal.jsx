import { WHATSAPP_LINK } from '../data/menuData'
import { openReceipt } from '../utils/generateReceipt'

export default function SuccessModal({ open, orderId, payload, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-black/70 backdrop-blur-sm">
      <div className="glass-panel-heavy modal-content rounded-2xl border border-secondary/30 w-full max-w-md p-8 text-center space-y-5">
        <div className="w-20 h-20 mx-auto rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-secondary">check_circle</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold font-playfair text-primary">Pesanan Terkirim!</h3>
          <p className="text-sm text-on-surface-variant">Terima kasih, pesanan Anda telah kami terima.</p>
        </div>

        {orderId && (
          <div className="glass-panel rounded-lg border border-white/10 p-4">
            <p className="text-xs text-on-surface-variant mb-1">ID Pesanan</p>
            <p className="text-sm font-mono text-secondary break-all">{orderId}</p>
          </div>
        )}

        <p className="text-xs text-on-surface-variant">
          Tim kami akan menghubungi Anda via WhatsApp untuk konfirmasi pesanan.
        </p>

        <div className="flex flex-col gap-3">
          {payload && (
            <button
              type="button"
              onClick={() => openReceipt(payload)}
              className="w-full py-3 rounded-lg border border-[#FF8F00]/40 bg-[#FF8F00]/10 hover:bg-[#FF8F00]/20 text-[#FF8F00] transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <span className="material-symbols-outlined">receipt</span>
              Lihat Struk
            </button>
          )}
          <div className="flex gap-3">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-lg border border-secondary/30 hover:border-secondary text-secondary transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">chat</span>
              WhatsApp
            </a>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg bg-[#FF8F00] hover:bg-[#E67E00] text-[#0A0A0A] font-bold transition-all active:scale-95"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
