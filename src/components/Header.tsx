import { useState, useEffect } from 'react'
import { Menu, X, Phone } from 'lucide-react'

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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'rgba(12,22,20,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(242,237,226,0.05)' : '1px solid transparent',
        }}
      >
        <div className="flex items-center justify-between h-16 lg:h-[72px]" style={{ padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
          <a onClick={() => handleNav('#hero')} className="flex items-center gap-2 cursor-pointer">
            <span className="text-[#f2ede2] font-light text-base tracking-[0.25em] uppercase">Dr. Di</span>
            <span className="text-xs tracking-[0.15em] uppercase" style={{ color: 'var(--accent-light)' }}>Clinic</span>
          </a>

          <nav className="hidden lg:flex items-center" style={{ gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            {navItems.map(item => (
              <a
                key={item.href}
                onClick={() => handleNav(item.href)}
                className="text-xs tracking-[0.15em] uppercase cursor-pointer transition-colors duration-300 hover:text-[#f2ede2]"
                style={{ color: 'rgba(242,237,226,0.45)' }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:+359882708081"
              className="hidden md:flex items-center gap-2 px-5 py-2 text-[11px] tracking-[0.15em] uppercase border transition-all duration-300 hover:bg-[#c8a05e] hover:text-[#0c1614]"
              style={{ borderColor: 'rgba(242,237,226,0.2)', color: 'rgba(242,237,226,0.8)' }}
            >
              <Phone size={13} />
              Обади се
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center"
              style={{ border: '1px solid rgba(242,237,226,0.15)' }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 lg:hidden transition-all duration-500"
        style={{
          clipPath: menuOpen ? 'circle(150% at 95% 5%)' : 'circle(0% at 95% 5%)',
          background: 'rgba(12,22,20,0.97)',
          backdropFilter: 'blur(30px)',
        }}
      >
        {navItems.map((item, i) => (
          <a
            key={item.href}
            onClick={() => handleNav(item.href)}
            className="text-[#f2ede2] text-xl tracking-[0.2em] uppercase font-extralight cursor-pointer transition-all duration-300"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: `${i * 60 + 150}ms`,
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </>
  )
}
