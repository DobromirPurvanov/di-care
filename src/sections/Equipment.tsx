import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const equipment = [
  {
    name: 'Fotona Dynamis',
    desc: 'Многофункционална Nd:YAG и Er:YAG лазерна система за подмладяване, пилинг и лечение.',
    features: ['4D Lifting', 'Лазерен пилинг', 'Ресърфейсинг'],
    img: './images/drdiclinic/fotona-dynamis.jpg',
  },
  {
    name: 'Fotona4D',
    desc: 'Комплексна система за 4D лифтинг и подмладяване на лице и тяло.',
    features: ['4D Лифтинг', 'Подмладяване', 'Стягане'],
    img: './images/drdiclinic/fotona4.jpg',
  },
  {
    name: 'Medozon',
    desc: 'Медицински апарат за озонотерапия и детоксикация.',
    features: ['Автохемотерапия', 'Системна озонотерапия', 'Детоксикация'],
    img: './images/drdiclinic/medozon.png',
  },
  {
    name: 'Fras 5',
    desc: 'Диагностична система за измерване на оксидативен стрес.',
    features: ['Антиоксидантен капацитет', 'Персонализирани терапии'],
    img: './images/drdiclinic/fras5.jpg',
  },
]

export default function Equipment() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
      gsap.utils.toArray<HTMLElement>('.eq-card').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.12,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
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
        background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.02) 40%, transparent 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          ref={titleRef}
          className="text-center font-extralight uppercase tracking-[0.12em] opacity-0 mb-4"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', transform: 'translateY(30px)' }}
        >
          Апаратура
        </h2>
        <p className="text-center text-xs tracking-[0.15em] uppercase mb-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Световно признати лазерни системи
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equipment.map((eq, i) => (
            <div
              key={i}
              className="eq-card group flex flex-col sm:flex-row overflow-hidden opacity-0 border transition-colors duration-500 hover:border-indigo-500/25"
              style={{
                background: 'rgba(255,255,255,0.015)',
                borderColor: 'rgba(255,255,255,0.05)',
                transform: 'translateY(30px)',
              }}
            >
              <div className="sm:w-2/5 overflow-hidden flex items-center justify-center p-4" style={{ minHeight: '180px', background: 'rgba(255,255,255,0.03)' }}>
                <img
                  src={eq.img}
                  alt={eq.name}
                  className="max-w-full max-h-[160px] object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  loading="lazy"
                />
              </div>
              <div className="sm:w-3/5 p-6 flex flex-col justify-center">
                <h3 className="font-light text-sm tracking-[0.1em] uppercase group-hover:text-indigo-300 transition-colors">
                  {eq.name}
                </h3>
                <p className="text-xs mt-2 font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {eq.desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {eq.features.map((f, j) => (
                    <span key={j} className="text-[10px] px-2 py-1 tracking-wider uppercase border"
                      style={{ borderColor: 'rgba(99,102,241,0.2)', color: 'rgba(129,140,248,0.7)' }}>
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
