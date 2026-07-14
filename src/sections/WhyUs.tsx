import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink } from 'lucide-react'
import { scrollToPosition } from '../lib/scroll'

gsap.registerPlugin(ScrollTrigger)

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Dr. Di Clinic, ул. Любен Каравелов 71, Варна')

const slides = [
  {
    title: 'МЕДИЦИНА',
    text: 'Младостта започва с медицина. Нашият подход се основава на диагностика, клиничен опит и разбиране на биологичните процеси на стареене. Не лекуваме само видимите признаци, а работим с причините им.',
  },
  {
    title: 'ИНДИВИДУАЛНОСТ',
    text: 'Не създаваме еднакви лица. Всеки план за лечение е съобразен с вашата уникална анатомия, начин на живот и естетични цели. Запазваме вашата индивидуалност, вместо да я променяме.',
  },
  {
    title: 'ДЪЛГОВЕЧНОСТ',
    text: 'Бъдещето на естетичната медицина е дълговечност. Нашата цел не е временно подобрение, а дългосрочно запазване на качеството на кожата, жизнеността и цялостното благосъстояние.',
  },
  {
    title: 'ЕКСПЕРТИЗА',
    text: 'Доверието започва с познание и прозрачност. Протоколите ни се основават на международен опит, доказателствена медицина и клинично мислене.',
  },
  {
    title: 'ЕСТЕСТВЕНОСТ',
    text: 'Най-добрите резултати изглеждат естествено. Хората забелязват вашата свежест и увереност, а не процедурите зад тях.',
  },
  {
    title: 'НАПРЕДНАЛА МЕДИЦИНА',
    text: 'Комбинираме най-съвременните технологии, световните устройства, регенеративната медицина и собствените си протоколи за лечение.',
  },
]

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const slidesRef = useRef<HTMLDivElement[]>([])
  const titlesRef = useRef<HTMLHeadingElement[]>([])
  const dotsRef = useRef<HTMLSpanElement[]>([])
  const counterRef = useRef<HTMLSpanElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const activeRef = useRef(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const N = slides.length
      const T = 0.18 // дължина на прехода в слайд-единици

      const setActiveIndicators = (idx: number) => {
        if (idx === activeRef.current) return
        activeRef.current = idx
        dotsRef.current.forEach((d, i) => {
          if (!d) return
          d.style.background = i === idx ? '#c8a05e' : 'transparent'
          d.style.borderColor = i === idx ? '#c8a05e' : 'rgba(242,237,226,0.3)'
          d.style.transform = i === idx ? 'scale(1.25)' : 'scale(1)'
          d.setAttribute('aria-current', i === idx ? 'true' : 'false')
        })
        titlesRef.current.forEach((t, i) => {
          t?.classList.toggle('text-gradient', i === idx)
        })
        if (counterRef.current) {
          counterRef.current.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`
        }
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: `+=${N * 100}%`,
          pin: true,
          scrub: 0.6,
          onUpdate: self => {
            const idx = Math.min(N - 1, Math.floor(self.progress * N))
            setActiveIndicators(idx)
          },
        },
      })
      stRef.current = tl.scrollTrigger ?? null

      slidesRef.current.forEach((slide, i) => {
        if (!slide) return

        // Стифиране на слайдовете един върху друг
        gsap.set(slide, {
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          autoAlpha: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 24,
          scale: i === 0 ? 1 : 1.02,
        })

        // Слайд i е активен в интервала [i, i+1]. Изчезването на предишния
        // приключва ТОЧНО когато започва появата на следващия.
        if (i > 0) {
          tl.fromTo(slide,
            { autoAlpha: 0, y: 24, scale: 1.02 },
            { autoAlpha: 1, y: 0, scale: 1, duration: T, ease: 'none' },
            i
          )
        }
        if (i < N - 1) {
          tl.to(slide,
            { autoAlpha: 0, y: -24, scale: 0.98, duration: T, ease: 'none' },
            i + 1 - T
          )
        }
      })

      // Последният слайд остава видим до края на pin-а
      tl.set({}, {}, N)

      // Parallax на снимката на клиниката
      if (!reduced && photoRef.current) {
        gsap.fromTo(photoRef.current,
          { yPercent: -10 },
          {
            yPercent: 10, ease: 'none',
            scrollTrigger: {
              trigger: photoRef.current.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      // първоначално състояние на индикаторите
      activeRef.current = -1
      setActiveIndicators(0)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Клик върху dot — скролва до средата на съответния слайд
  const goToSlide = (i: number) => {
    const st = stRef.current
    if (!st) return
    const segment = (st.end - st.start) / slides.length
    scrollToPosition(st.start + (i + 0.5) * segment)
  }

  return (
    <section ref={sectionRef} id="about" className="relative z-10">
      <div style={{ padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 4vw, 3rem) 2rem' }}>
        <h2
          className="text-center font-extralight uppercase tracking-[0.15em]"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}
        >
          Защо ние?
        </h2>
      </div>

      {/* Pinned slide зона */}
      <div
        ref={wrapperRef}
        className="relative w-full flex items-center justify-center"
        style={{ height: 'clamp(400px, 70vh, 80vh)', minHeight: '400px' }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            ref={el => { if (el) slidesRef.current[i] = el }}
            className="flex flex-col items-center justify-center text-center px-6 will-change-transform"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <h3
              ref={el => { if (el) titlesRef.current[i] = el }}
              className="font-extralight uppercase tracking-[0.15em] mb-6 md:mb-8"
              style={{ fontSize: 'clamp(1.5rem, 4.5vw, 3.2rem)', lineHeight: 1.15 }}
            >
              {slide.title}
            </h3>
            <p
              className="max-w-xl font-light px-4"
              style={{ color: 'rgba(242,237,226,0.65)', fontSize: 'clamp(0.85rem, 1.1vw, 1rem)', lineHeight: 1.75 }}
            >
              {slide.text}
            </p>
          </div>
        ))}

        {/* Навигационни точки */}
        <div
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10"
          role="tablist"
          aria-label="Навигация между слайдовете"
        >
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              className="relative flex items-center justify-center"
              style={{ width: 10, height: 10, background: 'transparent', border: 'none', padding: 0 }}
              aria-label={`Слайд ${i + 1}: ${s.title}`}
              role="tab"
            >
              {/* Разширена tap-зона (44×44) без промяна на визуалния размер */}
              <span aria-hidden="true" className="absolute" style={{ inset: '-17px' }} />
              <span
                ref={el => { if (el) dotsRef.current[i] = el }}
                className="block w-[10px] h-[10px] rounded-full border transition-all duration-300"
                style={{
                  borderColor: i === 0 ? '#c8a05e' : 'rgba(242,237,226,0.3)',
                  background: i === 0 ? '#c8a05e' : 'transparent',
                }}
              />
            </button>
          ))}
        </div>

        {/* Брояч на слайдовете */}
        <span
          ref={counterRef}
          aria-hidden="true"
          className="font-mono-luxe absolute bottom-5 right-4 sm:right-8 text-xs tracking-[0.2em]"
          style={{ color: 'rgba(200,160,94,0.6)' }}
        >
          01 / 06
        </span>
      </div>

      {/* Снимка на клиниката */}
      <div className="max-w-4xl mx-auto mt-20 px-6">
        <div className="relative overflow-hidden" style={{ minHeight: '360px', border: '1px solid rgba(200,160,94,0.15)' }}>
          {/* Декоративен брандиран панел с лек parallax слой */}
          <div
            ref={photoRef}
            aria-hidden="true"
            className="absolute inset-0 will-change-transform"
            style={{ background: 'radial-gradient(120% 120% at 50% 20%, rgba(200,160,94,0.10), transparent 60%), #0c1614', transform: 'scale(1.15)' }}
          />
          <img
            src="/images/logo-di-care-gold.png"
            alt=""
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-auto opacity-[0.12] select-none pointer-events-none"
            style={{ height: '140px', filter: 'drop-shadow(0 0 30px rgba(200,160,94,0.3))' }}
            draggable={false}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, #0c1614 0%, transparent 60%)' }} />

          {/* Glassmorphism caption */}
          <div
            className="absolute bottom-5 left-5 p-5 sm:p-6 max-w-[280px]"
            style={{
              background: 'rgba(12,22,20,0.55)',
              border: '1px solid rgba(200,160,94,0.25)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
            }}
          >
            <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(242,237,226,0.85)' }}>Dr. Di Clinic</p>
            <p className="text-xs tracking-wider mt-1" style={{ color: 'rgba(242,237,226,0.45)' }}>Варна, България</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase transition-colors hover:text-[#ddbd82]"
              style={{ color: '#c8a05e' }}
            >
              Вижте локацията
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
