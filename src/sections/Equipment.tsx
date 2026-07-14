import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Zap, Sparkles, Droplets, Activity, type LucideIcon } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Device {
  name: string
  desc: string
  features: string[]
  Icon: LucideIcon
}

const equipment: Device[] = [
  {
    name: 'Fotona Dynamis',
    desc: 'Многофункционална Nd:YAG и Er:YAG лазерна система за подмладяване, пилинг и лечение.',
    features: ['4D Lifting', 'Лазерен пилинг', 'Ресърфейсинг'],
    Icon: Zap,
  },
  {
    name: 'Fotona4D',
    desc: 'Комплексна система за 4D лифтинг и подмладяване на лице и тяло.',
    features: ['4D Лифтинг', 'Подмладяване', 'Стягане'],
    Icon: Sparkles,
  },
  {
    name: 'Medozon',
    desc: 'Медицински апарат за озонотерапия и детоксикация.',
    features: ['Автохемотерапия', 'Системна озонотерапия', 'Детоксикация'],
    Icon: Droplets,
  },
  {
    name: 'Fras 5',
    desc: 'Диагностична система за измерване на оксидативен стрес.',
    features: ['Антиоксидантен капацитет', 'Персонализирани терапии'],
    Icon: Activity,
  },
]

export default function Equipment() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
      // Редуващ се stagger: нечетните идват отляво, четните отдясно
      gsap.utils.toArray<HTMLElement>('.eq-card').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, x: i % 2 === 0 ? -44 : 44, y: 20 },
          {
            opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out', delay: (i % 2) * 0.12,
            scrollTrigger: { trigger: el, start: 'top 88%' },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="equipment"
      ref={sectionRef}
      className="relative z-10"
      style={{
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 4vw, 3rem)',
        background: 'linear-gradient(180deg, transparent 0%, rgba(200,160,94,0.03) 40%, transparent 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          ref={titleRef}
          className="text-center font-extralight uppercase tracking-[0.15em] opacity-0 mb-4"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', transform: 'translateY(40px)' }}
        >
          Апаратура
        </h2>
        <p className="text-center text-xs tracking-[0.15em] uppercase mb-16" style={{ color: 'rgba(242,237,226,0.4)' }}>
          Световно признати лазерни системи
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equipment.map((eq, i) => (
            <div
              key={i}
              className="eq-card group flex flex-col sm:flex-row overflow-hidden opacity-0 border transition-all duration-[400ms] hover:border-[#c8a05e]/40 hover:-translate-y-[3px]"
              style={{
                background: 'rgba(242,237,226,0.04)',
                borderColor: 'rgba(242,237,226,0.06)',
                transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(242,237,226,0.06)'
                el.style.boxShadow = '0 12px 34px rgba(0,0,0,0.38)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(242,237,226,0.04)'
                el.style.boxShadow = 'none'
              }}
            >
              <div
                className="sm:w-2/5 overflow-hidden flex items-center justify-center p-4 sm:border-r"
                style={{
                  minHeight: '200px',
                  background: 'radial-gradient(120% 100% at 50% 0%, rgba(200,160,94,0.08), rgba(242,237,226,0.02))',
                  borderColor: 'rgba(242,237,226,0.05)',
                }}
              >
                <span
                  className="flex items-center justify-center w-20 h-20 rounded-full transition-transform duration-500 group-hover:scale-110"
                  style={{ border: '1px solid rgba(200,160,94,0.3)', background: 'rgba(12,22,20,0.4)' }}
                >
                  <eq.Icon size={34} strokeWidth={1.4} aria-hidden="true" style={{ color: 'var(--accent-light)' }} />
                </span>
              </div>
              <div className="sm:w-3/5 p-6 flex flex-col justify-center">
                <h3 className="font-light text-sm tracking-[0.1em] uppercase group-hover:text-[#ddbd82] transition-colors">
                  {eq.name}
                </h3>
                <p className="text-xs mt-2 font-light leading-relaxed" style={{ color: 'rgba(242,237,226,0.5)' }}>
                  {eq.desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {eq.features.map((f, j) => (
                    <span
                      key={j}
                      className="text-[11px] px-2.5 py-1 uppercase border transition-all duration-300 group-hover:border-[#c8a05e]/60"
                      style={{
                        letterSpacing: '0.08em',
                        borderColor: 'rgba(200,160,94,0.3)',
                        color: 'rgba(221,189,130,0.85)',
                        background: 'transparent',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(200,160,94,0.08)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
