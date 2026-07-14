import { useEffect, useState } from 'react'

/**
 * Минималистичен loading screen — златно "Dr. Di" с пулсираща анимация.
 * Изчезва след като шрифтовете са заредени + минимум 1.2s показване.
 */
export default function LoadingScreen() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible')

  useEffect(() => {
    const minTime = new Promise(res => setTimeout(res, 1200))
    const fonts = 'fonts' in document ? document.fonts.ready : Promise.resolve()

    let fadeTimer: ReturnType<typeof setTimeout>
    Promise.all([minTime, fonts]).then(() => {
      setPhase('fading')
      fadeTimer = setTimeout(() => setPhase('gone'), 650)
    })
    return () => clearTimeout(fadeTimer)
  }, [])

  if (phase === 'gone') return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
      style={{
        background: 'var(--bg)',
        opacity: phase === 'fading' ? 0 : 1,
        transition: 'opacity 600ms ease',
        pointerEvents: phase === 'fading' ? 'none' : 'auto',
      }}
    >
      <img
        src="/images/logo-di-care-gold.png"
        alt="Dr. Di Clinic"
        width={200}
        height={129}
        className="w-auto select-none"
        style={{ height: '56px', animation: 'loaderPulse 1.6s ease-in-out infinite' }}
        draggable={false}
      />
      <div className="mt-6 flex items-center gap-2">
        <span
          className="text-[10px] tracking-[0.45em] uppercase"
          style={{ color: 'rgba(242,237,226,0.35)' }}
        >
          Dr. Di Clinic
        </span>
      </div>
      <style>{`
        @keyframes loaderPulse {
          0%, 100% { opacity: 0.55; transform: scale(0.97); filter: drop-shadow(0 0 12px rgba(200,160,94,0.15)); }
          50% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 28px rgba(200,160,94,0.4)); }
        }
      `}</style>
    </div>
  )
}
