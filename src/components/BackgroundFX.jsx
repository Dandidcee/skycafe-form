export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {/* Base gradient - warm dark */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1c100a] to-[#0d0805]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.06,
          backgroundImage:
            'linear-gradient(rgba(255,143,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,143,0,0.6) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Animated glowing orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Decorative floating icons */}
      <div className="absolute top-[10%] left-[5%] opacity-[0.07] text-[130px] rotate-12 select-none">
        <span className="material-symbols-outlined" style={{ fontSize: 'inherit', color: '#FF8F00' }}>coffee</span>
      </div>
      <div className="absolute bottom-[15%] right-[6%] opacity-[0.07] text-[160px] -rotate-12 select-none">
        <span className="material-symbols-outlined" style={{ fontSize: 'inherit', color: '#FF8F00' }}>local_cafe</span>
      </div>
      <div className="absolute top-[55%] left-[3%] opacity-[0.05] text-[100px] rotate-[25deg] select-none">
        <span className="material-symbols-outlined" style={{ fontSize: 'inherit', color: '#e3beb8' }}>cake</span>
      </div>
      <div className="absolute top-[30%] right-[15%] opacity-[0.04] text-[90px] -rotate-[20deg] select-none">
        <span className="material-symbols-outlined" style={{ fontSize: 'inherit', color: '#FF8F00' }}>emoji_food_beverage</span>
      </div>

      {/* Radial spotlight glow at center-top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]"
        style={{
          background: 'radial-gradient(ellipse at top center, rgba(255,143,0,0.08) 0%, transparent 70%)'
        }}
      />

      {/* Bottom warm glow */}
      <div
        className="absolute bottom-0 left-1/3 w-[700px] h-[400px]"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(227,190,184,0.05) 0%, transparent 70%)'
        }}
      />

      {/* Vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)'
        }}
      />

      {/* Grain/noise overlay for texture */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          opacity: 0.035,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
        }}
      />
    </div>
  )
}
