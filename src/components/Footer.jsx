export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 md:px-16 glass-panel border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-xs font-bold text-primary mb-2 font-playfair">
            SKY CAFE LUXURY ROASTERY
          </p>
          <p className="text-xs text-on-surface-variant opacity-40">
            © {new Date().getFullYear()} Sky Cafe. All rights reserved.
          </p>
        </div>
        <div className="flex gap-8">
          <a
            className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  )
}
