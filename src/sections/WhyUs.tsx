import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const slides = [
  {
    title: 'МЕДИЦИНА',
    text: 'Младостта започва с медицина. Нашият подход се основава на диагностика, клиничен опит и дълбоко разбиране на биологичните процеси на стареене. Ние не просто лекуваме видимите признаци — работим с техните причини.',
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
    text: 'Най-добрите резултати изглеждат естествено. Хората забелязват вашата свежест, увереност и привлекателност — не процедурите зад тях.',
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: `+=${slides.length * 100}%`,
          pin: true,
          scrub: 0.6,
        },
      })

      slidesRef.current.forEach((slide, i) => {
        if (!slide) return

        // Position all slides stacked
        gsap.set(slide, {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        })

        if (i === 0) {
          // First slide starts visible
          gsap.set(slide, { opacity: 1 })
        } else {
          gsap.set(slide, { opacity: 0 })
        }

        // Each slide gets a segment of the timeline
        const segmentStart = i / slides.length
        const segmentEnd = (i + 1) / slides.length
        const fadeOutStart = segmentStart + (segmentEnd - segmentStart) * 0.75

        if (i > 0) {
          // Fade in
          tl.fromTo(
            slide,
            { opacity: 0 },
            { opacity: 1, ease: 'none' },
            segmentStart
          )
        }

        if (i < slides.length - 1) {
          // Fade out
          tl.fromTo(
            slide,
            { opacity: 1 },
            { opacity: 0, ease: 'none' },
            fadeOutStart
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="relative z-10">
      {/* Section heading */}
      <div style={{ padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 4vw, 3rem) 2rem' }}>
        <h2
          className="text-center font-extralight uppercase tracking-[0.12em]"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}
        >
          Защо ние?
        </h2>
      </div>

      {/* Pinned slide area */}
      <div
        ref={wrapperRef}
        className="relative w-full flex items-center justify-center"
        style={{ height: '80vh', minHeight: '400px' }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            ref={(el) => { if (el) slidesRef.current[i] = el }}
            className="flex flex-col items-center justify-center text-center px-6"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <h3
              className="font-extralight uppercase tracking-[0.15em] mb-6 md:mb-8"
              style={{
                fontSize: 'clamp(1.6rem, 4.5vw, 3.2rem)',
                lineHeight: 1.1,
              }}
            >
              {slide.title}
            </h3>
            <p
              className="max-w-xl font-light leading-relaxed px-4"
              style={{
                color: 'rgba(242,237,226,0.5)',
                fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
              }}
            >
              {slide.text}
            </p>
          </div>
        ))}
      </div>
      {/* Clinic photo */}
      <div className="max-w-4xl mx-auto mt-20 px-6">
        <div className="relative overflow-hidden">
          <img
            src="./images/drdiclinic/clinic-banner.jpg"
            alt="Dr. Di Clinic"
            className="w-full h-auto object-cover opacity-50 hover:opacity-80 transition-opacity duration-700"
            style={{ maxHeight: '450px' }}
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0c1614 0%, transparent 60%)' }} />
          <div className="absolute bottom-0 left-0 p-8">
            <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(242,237,226,0.4)' }}>Dr. Di Clinic</p>
            <p className="text-xs tracking-wider mt-1" style={{ color: 'rgba(242,237,226,0.2)' }}>Варна, България</p>
          </div>
        </div>
      </div>
    </section>
  )
}
