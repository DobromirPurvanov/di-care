export default function Footer() {
  return (
    <footer
      className="relative z-10"
      style={{ padding: '3rem clamp(1.5rem, 4vw, 3rem)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="font-light text-sm tracking-[0.3em] uppercase text-white">Dr. Di</span>
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--accent-light)' }}>Clinic</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="text-[11px] tracking-wider transition-colors duration-300 hover:text-white/60"
            style={{ color: 'rgba(255,255,255,0.25)' }}>
            Политика за лични данни
          </a>
          <a href="#" className="text-[11px] tracking-wider transition-colors duration-300 hover:text-white/60"
            style={{ color: 'rgba(255,255,255,0.25)' }}>
            GDPR
          </a>
        </div>

        <p className="text-[11px] tracking-wider" style={{ color: 'rgba(255,255,255,0.15)' }}>
          © 2025 Dr. Di Clinic. Всички права запазени.
        </p>
      </div>
    </footer>
  )
}
