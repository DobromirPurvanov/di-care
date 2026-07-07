import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const services = [
  { title: 'Лазерно подмладяване', desc: '4D Lifting, лазерен пилинг, ресърфейсинг', img: './images/drdiclinic/hero1.jpg' },
  { title: 'Процедури за тяло', desc: 'Лазерна липолиза, Skin Tightening', img: './images/drdiclinic/hero2.jpg' },
  { title: 'Стоматология', desc: 'Естетична стоматология, холивудска усмивка', img: './images/drdiclinic/hero4.jpg' },
  { title: 'Озонотерапия', desc: 'Цялостна детоксикация и подмладяване', img: './images/drdiclinic/clinic-banner.jpg' },
  { title: 'Интимна грижа', desc: 'Лазерно лечение и подмладяване', img: './images/drdiclinic/about1.jpg' },
  { title: 'Диагностика', desc: 'FRAS 5 Test за оксидативен стрес', img: './images/drdiclinic/fras5.jpg' },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
      gsap.utils.toArray<HTMLElement>('.svc-card').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.1,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="services"
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
          className="text-center font-extralight uppercase tracking-[0.12em] opacity-0 mb-16"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', transform: 'translateY(30px)' }}
        >
          Нашите услуги
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(242,237,226,0.05)' }}>
          {services.map((s, i) => (
            <div
              key={i}
              className="svc-card group relative overflow-hidden cursor-pointer bg-black opacity-0"
              style={{ minHeight: '280px', transform: 'translateY(40px)' }}
            >
              <div className="absolute inset-0">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0c1614 0%, rgba(12,22,20,0.75) 40%, transparent 100%)' }} />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-end p-6" style={{ minHeight: '280px' }}>
                <h3 className="font-light text-base tracking-wider uppercase group-hover:text-[#ddbd82] transition-colors duration-300">
                  {s.title}
                </h3>
                <p className="text-sm mt-2 font-light" style={{ color: 'rgba(242,237,226,0.4)' }}>
                  {s.desc}
                </p>
                <div className="flex items-center gap-2 mt-4 text-xs tracking-wider uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  style={{ color: 'var(--accent-light)' }}>
                  <span>Научете повече</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
