import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { categories, procedures } from '../data/procedures'
import { serviceContent } from '../data/services'

gsap.registerPlugin(ScrollTrigger)

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
      gsap.utils.toArray<HTMLElement>('.svc-card').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: (i % 3) * 0.12,
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
          className="text-center font-extralight uppercase tracking-[0.15em] opacity-0 mb-16"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', transform: 'translateY(40px)' }}
        >
          Нашите услуги
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(242,237,226,0.05)' }}>
          {categories.map((cat, i) => {
            const count = procedures.filter((p) => p.category === cat.id).length
            const tagline = serviceContent[cat.id].tagline
            return (
              <Link
                key={cat.id}
                to={`/uslugi/${cat.slug}`}
                className="svc-card group relative overflow-hidden opacity-0 border border-transparent transition-all duration-[400ms] hover:border-[#c8a05e]/40 hover:-translate-y-1"
                style={{
                  minHeight: '260px',
                  background: 'var(--bg)',
                  transform: 'translateY(60px)',
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  boxShadow: '0 0 0 rgba(0,0,0,0)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 40px rgba(0,0,0,0.4)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 rgba(0,0,0,0)' }}
                aria-label={`${cat.label} — ${tagline}`}
              >
                {/* Дискретно златно сияние при hover */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(120% 100% at 0% 0%, rgba(200,160,94,0.10), transparent 55%)' }}
                />

                {/* Златен номер */}
                <span
                  aria-hidden="true"
                  className="font-mono-luxe absolute top-5 left-6 z-10 text-sm tracking-[0.1em] transition-opacity duration-[400ms] opacity-40 group-hover:opacity-90"
                  style={{ color: '#c8a05e' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Брой процедури */}
                <span
                  className="absolute top-5 right-6 z-10 text-[11px] tabular-nums tracking-[0.1em]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {count} процедури
                </span>

                <div className="relative z-10 h-full flex flex-col justify-end p-6" style={{ minHeight: '260px' }}>
                  <h3 className="font-light text-lg tracking-wider uppercase group-hover:text-[#ddbd82] transition-colors duration-300">
                    {cat.label}
                  </h3>
                  <p className="text-sm mt-2 font-light leading-relaxed" style={{ color: 'rgba(242,237,226,0.68)' }}>
                    {tagline}
                  </p>
                  <div
                    className="flex items-center gap-2 mt-4 text-xs tracking-wider uppercase opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                    style={{ color: 'var(--accent-light)' }}
                  >
                    <span>Научете повече</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-[6px]" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
