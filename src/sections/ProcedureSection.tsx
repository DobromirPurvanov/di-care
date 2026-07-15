import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Orbit, LayoutGrid } from 'lucide-react'
import ProcedureGrid from '../components/ProcedureGrid'

gsap.registerPlugin(ScrollTrigger)

// Code-splitting на тежката Three.js сфера
const ProcedureSphere = lazy(() => import('../components/ProcedureSphere'))

type View = 'sphere' | 'list'

function SphereFallback() {
  return (
    <div
      className="w-full flex items-center justify-center"
      style={{ height: 'min(80svh, 800px)' }}
      aria-label="Зареждане на 3D сферата"
      role="status"
    >
      <span
        className="w-10 h-10 rounded-full animate-spin"
        style={{ border: '2px solid rgba(200,160,94,0.15)', borderTopColor: '#c8a05e' }}
        aria-hidden="true"
      />
    </div>
  )
}

export default function ProcedureSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const sphereWrapRef = useRef<HTMLDivElement>(null)
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  )
  // По подразбиране списъчният изглед на тъч устройства (там 30-те етикета на
  // сферата се застъпват/отрязват и трудно се уцелват) и при reduced-motion.
  // На десктоп с мишка стартираме с ефектната 3D сфера.
  const [view, setView] = useState<View>(() => {
    if (typeof window === 'undefined') return 'sphere'
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return coarse || reduced ? 'list' : 'sphere'
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(headerRef.current, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
      // Разделителят се "разтваря" от центъра при влизане
      gsap.fromTo(dividerRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.1, ease: 'power3.out', delay: 0.35,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )
      gsap.to(sphereWrapRef.current, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: sphereWrapRef.current, start: 'top 85%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const hint =
    view === 'list'
      ? 'Разгледайте всички процедури, групирани по категория'
      : isTouch
        ? 'Докоснете процедура, за да отворите услугата'
        : 'Завъртете сферата и кликнете процедура за детайли'

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
          className="flex flex-col items-center opacity-0 mb-10"
          style={{ transform: 'translateY(30px)' }}
        >
          {/* Златна емблема */}
          <img
            src="/images/logo-di-care-gold.png"
            alt="Dr. Di Clinic"
            width={200}
            height={129}
            className="w-auto mb-6 select-none"
            style={{
              height: 'clamp(44px, 6vw, 60px)',
              filter: 'drop-shadow(0 0 24px rgba(200,160,94,0.35))',
            }}
            draggable={false}
          />

          {/* Заглавие с декоративни странични линии (линиите се крият на мобилно,
              за да не изтласкват заглавието извън екрана) */}
          <div className="flex items-center justify-center gap-5 sm:gap-8 w-full max-w-3xl">
            <span aria-hidden="true" className="hidden sm:block flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,160,94,0.4))' }} />
            <h2
              className="text-gradient text-center font-extralight uppercase tracking-[0.15em]"
              style={{ fontSize: 'clamp(1.4rem, 3.2vw, 2.4rem)', lineHeight: 1.2 }}
            >
              Изберете процедура
            </h2>
            <span aria-hidden="true" className="hidden sm:block flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(200,160,94,0.4), transparent)' }} />
          </div>

          {/* Анимиран златен разделител — разтваря се от центъра */}
          <div
            ref={dividerRef}
            aria-hidden="true"
            className="my-5 will-change-transform"
            style={{
              width: '72px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(200,160,94,0.9), transparent)',
              transform: 'scaleX(0)',
              transformOrigin: 'center',
            }}
          />

          <p
            className="text-center text-[11px] tracking-[0.22em] uppercase"
            style={{ color: 'rgba(242,237,226,0.7)', textShadow: '0 1px 12px rgba(0,0,0,0.5)' }}
          >
            {hint}
          </p>

          {/* Превключвател на изгледа: Сфера / Списък */}
          <div className="proc-toggle mt-7" role="group" aria-label="Изглед на процедурите">
            <button
              type="button"
              onClick={() => setView('sphere')}
              aria-pressed={view === 'sphere'}
              className={`proc-toggle-btn${view === 'sphere' ? ' is-active' : ''}`}
            >
              <Orbit size={14} aria-hidden="true" />
              Сфера
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
              className={`proc-toggle-btn${view === 'list' ? ' is-active' : ''}`}
            >
              <LayoutGrid size={14} aria-hidden="true" />
              Списък
            </button>
          </div>
        </div>

        <div
          ref={sphereWrapRef}
          className="opacity-0"
          style={{ transform: 'translateY(40px)' }}
        >
          {view === 'sphere' ? (
            <Suspense fallback={<SphereFallback />}>
              <ProcedureSphere />
            </Suspense>
          ) : (
            <ProcedureGrid />
          )}
        </div>
      </div>
    </section>
  )
}
