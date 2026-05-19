export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none grain">
      {/* Base */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      
      {/* Subtle warm gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0e08]/50 via-transparent to-[#0a0a0a]" />

      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Top line glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#FF8F00]/30 to-transparent" />
    </div>
  )
}
