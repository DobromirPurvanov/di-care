import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProcedureSphere from '../components/ProcedureSphere'

gsap.registerPlugin(ScrollTrigger)

export default function ProcedureSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const sphereWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
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
        <h2
          ref={titleRef}
          className="text-center font-extralight uppercase tracking-[0.12em] opacity-0 mb-4"
          style={{
            fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
            transform: 'translateY(30px)',
          }}
        >
          Изберете процедура
        </h2>
        <p
          className="text-center text-xs tracking-[0.15em] uppercase mb-12"
          style={{ color: 'rgba(242,237,226,0.3)' }}
        >
          Завъртете сферата, за да разгледате всички процедури
        </p>

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
