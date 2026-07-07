import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProcedureSphere from '../components/ProcedureSphere'

gsap.registerPlugin(ScrollTrigger)

export default function ProcedureSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const sphereWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(headerRef.current, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
      gsap.to(sphereWrapRef.current, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: sphereWrapRef.current, start: 'top 85%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="procedures"
      ref={sectionRef}
      className="relative z-10"
      style={{ padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 4vw, 3rem)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div
          ref={headerRef}
          className="flex flex-col items-center opacity-0 mb-12"
          style={{ transform: 'translateY(30px)' }}
        >
          {/* Златна емблема */}
          <img
            src="/images/logo-gold.png"
            alt="Dr. Di Clinic"
            className="w-auto mb-6 select-none"
            style={{
              height: 'clamp(44px, 6vw, 60px)',
              filter: 'drop-shadow(0 0 24px rgba(200,160,94,0.35))',
            }}
            draggable={false}
          />

          <h2
            className="text-gradient text-center font-extralight uppercase tracking-[0.14em]"
            style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.4rem)', lineHeight: 1.2 }}
          >
            Изберете процедура
          </h2>

          {/* Тънък златен разделител */}
          <div
            className="my-5"
            style={{
              width: '72px',
              height: '1px',
              background:
                'linear-gradient(90deg, transparent, rgba(200,160,94,0.9), transparent)',
            }}
          />

          <p
            className="text-center text-[11px] tracking-[0.22em] uppercase"
            style={{ color: 'rgba(242,237,226,0.6)' }}
          >
            Завъртете сферата, за да разгледате всички процедури
          </p>
        </div>

        <div
          ref={sphereWrapRef}
          className="opacity-0"
          style={{ transform: 'translateY(40px)' }}
        >
          <ProcedureSphere />
        </div>
      </div>
    </section>
  )
}
