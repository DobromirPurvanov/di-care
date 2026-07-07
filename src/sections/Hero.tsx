import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const linesRef = useRef<HTMLDivElement[]>([])
  const brandsRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 })

    linesRef.current.forEach((line, i) => {
      if (!line) return
      tl.to(line, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
      }, i * 0.2)
    })

    if (brandsRef.current) {
      tl.to(brandsRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
    }
    if (scrollHintRef.current) {
      tl.to(scrollHintRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2')
    }

    return () => { tl.kill() }
  }, [])

  const lines = [
    { text: 'БЪДЕЩЕТО', className: '' },
    { text: 'НА ВАШАТА КРАСОТА', className: '' },
    { text: 'ЗАПОЧВА ТУК', className: 'text-gradient glow-text' },
  ]

  const brands = ['Fotona\u00AE', '4D Lifting', 'Ozonoterapiya', 'SmartXide']

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative z-10 flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ height: '100svh', minHeight: '600px' }}
    >
      {/* Background image from original site */}
      <div className="absolute inset-0">
        <img
          src="./images/drdiclinic/hero3.jpg"
          alt="Dr. Di Clinic"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, #000 70%)' }} />
      </div>

      <div className="relative px-6" style={{ marginTop: '-2vh' }}>
        {lines.map((line, i) => (
          <div
            key={i}
            ref={el => { if (el) linesRef.current[i] = el }}
            className={`font-extralight uppercase tracking-[0.12em] leading-[1.05] opacity-0 ${line.className}`}
            style={{ fontSize: 'clamp(1.8rem, 5.5vw, 4.2rem)', transform: 'translateY(50px)' }}
          >
            {line.text}
          </div>
        ))}

        <div
          ref={brandsRef}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 opacity-0 mt-10 md:mt-14"
          style={{ transform: 'translateY(15px)' }}
        >
          {brands.map((b) => (
            <span
              key={b}
              className="text-[11px] tracking-[0.2em] uppercase pb-1 cursor-default transition-all duration-300 hover:text-white"
              style={{ color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 cursor-pointer z-20"
        onClick={() => document.getElementById('procedures')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>Scroll</span>
        <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.2)', animation: 'bounce 2s infinite' }} />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(8px); }
          60% { transform: translateY(4px); }
        }
      `}</style>
    </section>
  )
}
