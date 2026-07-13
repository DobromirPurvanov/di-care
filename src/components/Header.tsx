import { useEffect, useRef, useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import ScrollProgress from './ScrollProgress'
import { scrollToTarget } from '../lib/scroll'

const navItems = [
  { label: 'Начало', href: '#hero' },
  { label: 'Процедури', href: '#procedures' },
  { label: 'Услуги', href: '#services' },
  { label: 'За нас', href: '#about' },
  { label: 'Апаратура', href: '#equipment' },
  { label: 'Контакти', href: '#contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('#hero')
  const lastY = useRef(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef<number | null>(null)

  // Smart header: крие се при скрол надолу, показва се при скрол нагоре
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 50)
      const delta = y - lastY.current
      if (y > 140 && delta > 6) setHidden(true)
      else if (delta < -6 || y <= 140) setHidden(false)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section highlighting чрез IntersectionObserver
  useEffect(() => {
    const sections = navItems
      .map(i => document.querySelector<HTMLElement>(i.href))
      .filter((el): el is HTMLElement => !!el)

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleNav = (href: string) => {
    setMenuOpen(false)
    scrollToTarget(href)
  }

  // Swipe-down за затваряне на мобилното меню
  const onTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return
    const delta = e.changedTouches[0].clientY - touchStartY.current
    if (delta > 70) setMenuOpen(false)
    touchStartY.current = null
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-50 will-change-transform"
        style={{
          backgroundColor: scrolled ? 'rgba(12,22,20,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(242,237,226,0.05)' : '1px solid transparent',
          transform: hidden && !menuOpen ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 400ms ease, background-color 500ms ease, border-color 500ms ease',
        }}
      >
        <ScrollProgress />
        <div className="flex items-center justify-between h-16 lg:h-[72px]" style={{ padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
          <a
            onClick={() => handleNav('#hero')}
            className="flex items-center gap-2 cursor-pointer"
            role="button"
            aria-label="Към началото"
          >
            <span className="text-[#f2ede2] font-light text-base tracking-[0.25em] uppercase">Dr. Di</span>
            <span className="text-xs tracking-[0.15em] uppercase" style={{ color: 'var(--accent-light)' }}>Clinic</span>
          </a>

          <nav className="hidden lg:flex items-center" style={{ gap: 'clamp(1.25rem, 2.5vw, 2.25rem)' }} aria-label="Основна навигация">
            {navItems.map(item => {
              const isActive = active === item.href
              return (
                <a
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className="relative text-xs tracking-[0.15em] uppercase cursor-pointer transition-colors duration-300 py-2"
                  style={{ color: isActive ? '#f2ede2' : 'rgba(242,237,226,0.45)' }}
                  aria-current={isActive ? 'true' : undefined}
                  role="button"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 -bottom-[2px] h-[1px] w-full transition-transform duration-300"
                    style={{
                      background: 'linear-gradient(90deg, #c8a05e, #ddbd82)',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left center',
                    }}
                  />
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:+359882708081"
              className="hidden md:flex items-center gap-2 px-5 py-2 text-[11px] tracking-[0.15em] uppercase border transition-all duration-300 hover:border-[#c8a05e]/60 hover:text-[#ddbd82]"
              style={{ borderColor: 'rgba(242,237,226,0.2)', color: 'rgba(242,237,226,0.8)' }}
              aria-label="Обади се на клиниката"
            >
              <Phone size={13} aria-hidden="true" />
              Обади се
            </a>
            <button
              onClick={() => handleNav('#contact')}
              className="hidden md:inline-flex px-5 py-2 text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:bg-[#ddbd82]"
              style={{ background: '#c8a05e', color: '#0c1614' }}
            >
              Запази час
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center"
              style={{ border: '1px solid rgba(242,237,226,0.15)' }}
              aria-label={menuOpen ? 'Затвори менюто' : 'Отвори менюто'}
              aria-expanded={menuOpen}
            >
              <span
                className="inline-flex transition-transform duration-[400ms]"
                style={{ transform: menuOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 400ms ease' }}
              >
                {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 lg:hidden"
        style={{
          clipPath: menuOpen ? 'circle(150% at 95% 5%)' : 'circle(0% at 95% 5%)',
          background: 'rgba(12,22,20,0.92)',
          backdropFilter: 'blur(30px) saturate(1.1)',
          WebkitBackdropFilter: 'blur(30px) saturate(1.1)',
          transition: menuOpen ? 'clip-path 500ms ease' : 'clip-path 400ms ease',
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-hidden={!menuOpen}
      >
        {navItems.map((item, i) => (
          <a
            key={item.href}
            onClick={() => handleNav(item.href)}
            className="text-xl tracking-[0.2em] uppercase font-extralight cursor-pointer transition-all duration-300"
            style={{
              color: active === item.href ? '#ddbd82' : '#f2ede2',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: menuOpen ? `${i * 80 + 120}ms` : '0ms',
            }}
            role="button"
          >
            {item.label}
          </a>
        ))}
        <span
          className="mt-4 text-[10px] tracking-[0.3em] uppercase"
          style={{
            color: 'rgba(242,237,226,0.25)',
            opacity: menuOpen ? 1 : 0,
            transition: 'opacity 300ms ease',
            transitionDelay: menuOpen ? `${navItems.length * 80 + 150}ms` : '0ms',
          }}
        >
          Плъзнете надолу за затваряне
        </span>
      </div>
    </>
  )
}
