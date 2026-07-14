import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Cookie } from 'lucide-react'

const STORAGE_KEY = 'dicare-cookie-consent'
type Consent = 'all' | 'essential'

/** Прочита запазения избор (ако има) — извън компонента, за да не мига банерът. */
function storedConsent(): Consent | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'all' || v === 'essential' ? v : null
  } catch {
    return null
  }
}

/**
 * Ненатрапчив банер за съгласие с бисквитки — показва се само при първо
 * посещение (или докато не е направен избор) и запазва решението локално.
 */
export default function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false) // управлява входящата анимация

  useEffect(() => {
    if (storedConsent()) return
    setOpen(true)
    // Изчакваме кадър, за да се задейства transition-ът при появяване.
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  function choose(value: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* localStorage може да е недостъпен — банерът просто се скрива за сесията */
    }
    setShown(false)
    // Изчакваме изходящата анимация, преди да демонтираме.
    setTimeout(() => setOpen(false), 400)
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Съгласие за бисквитки"
      className="fixed inset-x-0 bottom-0 z-[1000] flex justify-center px-4 pb-4 sm:pb-6 pointer-events-none"
    >
      <div
        className="pointer-events-auto w-full max-w-2xl flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 sm:p-6"
        style={{
          background: 'rgba(12,22,20,0.92)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(200,160,94,0.28)',
          borderLeft: '2px solid #c8a05e',
          boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
          borderRadius: '3px',
          transform: shown ? 'translateY(0)' : 'translateY(24px)',
          opacity: shown ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease',
        }}
      >
        <div className="flex items-start gap-3.5 min-w-0">
          <Cookie size={20} className="flex-none mt-[2px]" style={{ color: 'var(--accent-light)' }} aria-hidden="true" />
          <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(242,237,226,0.75)' }}>
            Използваме бисквитки за коректната работа на сайта и за вградени услуги
            (календар за резервации и карта). Вижте{' '}
            <Link
              to="/poveritelnost"
              className="underline underline-offset-2 transition-colors hover:text-[#ddbd82]"
              style={{ color: 'rgba(242,237,226,0.95)' }}
            >
              Политиката за поверителност
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-none items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => choose('essential')}
            className="whitespace-nowrap px-4 py-2.5 text-[11px] tracking-[0.12em] uppercase transition-all duration-300 border"
            style={{ borderColor: 'rgba(242,237,226,0.45)', color: '#f2ede2' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c8a05e'; e.currentTarget.style.color = '#ddbd82' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(242,237,226,0.45)'; e.currentTarget.style.color = '#f2ede2' }}
          >
            Само необходимите
          </button>
          <button
            type="button"
            onClick={() => choose('all')}
            className="whitespace-nowrap px-5 py-2.5 text-[11px] tracking-[0.12em] uppercase font-medium transition-all duration-300"
            style={{ background: '#c8a05e', color: '#0c1614' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ddbd82' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#c8a05e' }}
          >
            Приемам
          </button>
        </div>
      </div>
    </div>
  )
}
