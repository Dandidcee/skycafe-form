export default function Header({ onCekStatus }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 glass-panel border-b border-white/10 px-8 md:px-16 flex justify-between items-center z-40">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-primary font-playfair">Sky Cafe</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onCekStatus}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-on-surface-variant hover:text-secondary hover:bg-secondary/10 border border-white/10 hover:border-secondary/30 transition-all"
        >
          <span className="material-symbols-outlined text-base">receipt_long</span>
          <span className="hidden sm:inline">Cek Pesanan</span>
        </button>
        <a
          href="https://wa.me/6285947522947"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 text-xs text-on-surface-variant hover:text-secondary transition-colors"
        >
          <span className="material-symbols-outlined text-base">support_agent</span>
          Bantuan
        </a>
      </div>
    </header>
  )
}
