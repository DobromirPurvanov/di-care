import { ArrowUp, Instagram, Facebook } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router'
import { scrollToPosition, scrollToTarget } from '../lib/scroll'

const QUICK_LINKS = [
  { label: 'Начало', href: '#hero' },
  { label: 'Процедури', href: '#procedures' },
  { label: 'Услуги', href: '#services' },
  { label: 'Апаратура', href: '#equipment' },
  { label: 'Контакти', href: '#contact' },
]

export default function Footer() {
  const navigate = useNavigate()
  const onHome = useLocation().pathname === '/'

  // Котвите съществуват само на началната страница — от подстраница първо
  // навигираме натам, после скролваме.
  const goToAnchor = (href: string) => {
    if (onHome) scrollToTarget(href)
    else navigate('/', { state: { scrollTo: href } })
  }

  return (
    <footer className="relative z-10" style={{ padding: '4rem clamp(1.5rem, 4vw, 3rem)' }}>
      {/* Gradient top border */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(200,160,94,0.6) 50%, transparent 100%)' }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          {/* Лого + социални */}
          <div className="flex flex-col items-center md:items-start gap-5">
            <div className="flex items-center gap-2">
              <span className="font-light text-sm tracking-[0.3em] uppercase text-[#f2ede2]">Dr. Di</span>
              <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--accent-light)' }}>Clinic</span>
            </div>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, name: 'Instagram', href: 'https://www.instagram.com/drdiclinic/' },
                { icon: Facebook, name: 'Facebook', href: 'http://www.facebook.com/DrDiClinic/' },
              ].map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center rounded-full border transition-all duration-300 hover:border-[#c8a05e]/50 hover:bg-[#c8a05e]/10"
                  style={{ borderColor: 'rgba(242,237,226,0.18)' }}
                  aria-label={`${s.name} (отваря се в нов раздел)`}
                >
                  <s.icon size={16} style={{ color: 'rgba(242,237,226,0.7)' }} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Бързи връзки */}
          <nav className="flex flex-col items-center md:items-start gap-3" aria-label="Бързи връзки">
            <span className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: 'rgba(242,237,226,0.5)' }}>
              Навигация
            </span>
            {QUICK_LINKS.map(l => (
              <button
                key={l.href}
                type="button"
                onClick={() => goToAnchor(l.href)}
                className="text-xs tracking-[0.12em] uppercase cursor-pointer transition-colors duration-300 hover:text-[#ddbd82] text-left"
                style={{ color: 'rgba(242,237,226,0.7)' }}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Правни */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <span className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: 'rgba(242,237,226,0.5)' }}>
              Информация
            </span>
            <Link to="/poveritelnost" className="text-xs tracking-[0.12em] transition-colors duration-300 hover:text-[#ddbd82]" style={{ color: 'rgba(242,237,226,0.7)' }}>
              Политика за лични данни
            </Link>
            <Link to="/poveritelnost" className="text-xs tracking-[0.12em] transition-colors duration-300 hover:text-[#ddbd82]" style={{ color: 'rgba(242,237,226,0.7)' }}>
              GDPR
            </Link>
          </div>

          {/* Обратно към началото */}
          <button
            onClick={() => scrollToPosition(0)}
            className="group w-12 h-12 flex-none flex items-center justify-center rounded-full border transition-all duration-300 hover:border-[#c8a05e]/60 hover:-translate-y-1"
            style={{ borderColor: 'rgba(242,237,226,0.12)' }}
            aria-label="Обратно към началото"
          >
            <ArrowUp size={17} className="transition-colors duration-300 group-hover:!text-[#c8a05e]" style={{ color: 'rgba(242,237,226,0.5)' }} aria-hidden="true" />
          </button>
        </div>

        <p className="mt-12 text-center md:text-left text-[11px] tracking-wider" style={{ color: 'rgba(242,237,226,0.5)' }}>
          © 2026 Dr. Di Clinic. Всички права запазени.
        </p>
      </div>
    </footer>
  )
}
