export default function WelcomeBanner() {
  return (
    <section className="mb-12">
      <div className="glass-panel-heavy rounded-2xl p-6 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF8F00]/10 to-transparent opacity-50"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2 font-playfair">
            Pemesanan & Booking
          </h2>
          <p className="text-lg text-on-surface-variant max-w-md">
            Pesan menu favorit Anda atau booking tempat untuk pengalaman kuliner yang tak terlupakan.
          </p>
        </div>
      </div>
    </section>
  )
}
