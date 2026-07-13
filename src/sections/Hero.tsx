import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown, Mouse } from 'lucide-react'
import { scrollToTarget } from '../lib/scroll'

gsap.registerPlugin(ScrollTrigger)

const BRANDS = [
  { name: 'Fotona\u00AE', tip: 'Водеща световна лазерна технология' },
  { name: '4D Lifting', tip: 'Неинвазивен лифтинг без възстановяване' },
  { name: 'Ozonoterapiya', tip: 'Детоксикация и клетъчно подмладяване' },
  { name: 'SmartXide', tip: 'CO2 лазер за прецизен ресърфейсинг' },
]

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const charsWrapRef = useRef<HTMLDivElement>(null)
  const brandsRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: reduced ? 0 : 1.3 }) // след loading screen-а

      tl.to(line1Ref.current, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 0)
        .to(line2Ref.current, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 0.2)

      // Character-by-character reveal на последния ред
      const chars = charsWrapRef.current?.querySelectorAll<HTMLElement>('.hero-char')
      if (chars && chars.length) {
        tl.set(charsWrapRef.current, { opacity: 1 }, 0.45)
        tl.to(chars, {
          opacity: 1, y: 0, rotateX: 0,
          duration: reduced ? 0.01 : 0.7,
          ease: 'power3.out',
          stagger: reduced ? 0 : 0.045,
        }, 0.45)
      }

      tl.to(brandsRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.35')
      if (brandsRef.current) {
        tl.to(brandsRef.current.querySelectorAll('.brand-item'), {
          opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08,
        }, '<')
      }
      tl.to(scrollHintRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2')

      // Parallax на фоновото изображение (0.3x скорост)
      if (!reduced && bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 22,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const lastLine = 'ЗАПОЧВА ТУК'

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative z-10 flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ height: '100svh', minHeight: '600px' }}
    >
      {/* Фоново изображение с parallax и двоен gradient за дълбочина */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={bgRef}
          src="./images/drdiclinic/hero3.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-[120%] object-cover opacity-20 will-change-transform"
          style={{ transform: 'translateY(-10%)' }}
        />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(12,22,20,0.35) 0%, #0c1614 70%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(200,160,94,0.06) 0%, transparent 55%)' }} />
      </div>

      <div className="relative px-6" style={{ marginTop: '-2vh' }}>
        <div
          ref={line1Ref}
          className="font-serif-luxe uppercase tracking-[0.18em] leading-[1.12] opacity-0"
          style={{ fontSize: 'clamp(1.7rem, 5vw, 3.9rem)', fontWeight: 400, transform: 'translateY(50px)' }}
        >
          БЪДЕЩЕТО
        </div>
        <div
          ref={line2Ref}
          className="font-serif-luxe uppercase tracking-[0.14em] leading-[1.12] opacity-0"
          style={{
            fontSize: 'clamp(1.7rem, 5vw, 3.9rem)',
            fontWeight: 500,
            transform: 'translateY(50px)',
            textShadow: '0 0 40px rgba(242,237,226,0.12)',
          }}
        >
          НА ВАШАТА КРАСОТА
        </div>
        <div
          ref={charsWrapRef}
          className="font-serif-luxe uppercase tracking-[0.14em] leading-[1.12] text-gradient glow-text glow-pulse opacity-0"
          style={{ fontSize: 'clamp(1.7rem, 5vw, 3.9rem)', fontWeight: 600, perspective: '600px' }}
          aria-label={lastLine}
        >
          {lastLine.split('').map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="hero-char inline-block opacity-0"
              style={{ transform: 'translateY(28px) rotateX(-55deg)', whiteSpace: 'pre' }}
            >
              {ch}
            </span>
          ))}
        </div>

        <div
          ref={brandsRef}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-0 mt-10 md:mt-14"
          style={{ transform: 'translateY(15px)' }}
        >
          {BRANDS.map(b => (
            <span key={b.name} className="brand-item group relative opacity-0" style={{ transform: 'translateY(10px)' }}>
              <span
                className="text-[11px] tracking-[0.2em] uppercase pb-1 cursor-default transition-all duration-300 group-hover:text-[#ddbd82]"
                style={{ color: 'rgba(242,237,226,0.35)', borderBottom: '1px solid rgba(242,237,226,0.08)' }}
              >
                {b.name}
              </span>
              {/* Мини tooltip */}
              <span
                role="tooltip"
                className="pointer-events-none absolute left-1/2 bottom-full mb-3 -translate-x-1/2 whitespace-nowrap px-3 py-2 text-[10px] tracking-[0.06em] opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                style={{
                  background: 'rgba(12,22,20,0.92)',
                  border: '1px solid rgba(200,160,94,0.3)',
                  color: 'rgba(242,237,226,0.85)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {b.tip}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div
        ref={scrollHintRef}
        className="group absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 cursor-pointer z-20"
        onClick={() => scrollToTarget('#procedures')}
        role="button"
        aria-label="Скролни надолу към процедурите"
      >
        <Mouse size={18} className="transition-colors duration-300 group-hover:!text-[#c8a05e]" style={{ color: 'rgba(242,237,226,0.4)' }} aria-hidden="true" />
        <span className="text-[9px] tracking-[0.4em] uppercase transition-colors duration-300 group-hover:text-[#ddbd82]" style={{ color: 'rgba(242,237,226,0.35)' }}>
          Scroll
        </span>
        <ChevronDown
          size={15}
          className="transition-colors duration-300 group-hover:!text-[#c8a05e]"
          style={{ color: 'rgba(242,237,226,0.4)', animation: 'heroBounce 1.8s cubic-bezier(0.28, 0.84, 0.42, 1) infinite' }}
          aria-hidden="true"
        />
      </div>

      <style>{`
        @keyframes heroBounce {
          0%, 100% { transform: translateY(0); }
          45% { transform: translateY(10px); }
          65% { transform: translateY(4px); }
        }
      `}</style>
    </section>
  )
}
