import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
      gsap.utils.toArray<HTMLElement>('.ct-block').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-10"
      style={{ padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 4vw, 3rem)' }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          ref={titleRef}
          className="text-center font-extralight uppercase tracking-[0.12em] opacity-0 mb-16"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', transform: 'translateY(30px)' }}
        >
          Контакти
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {[
            { icon: MapPin, label: 'Адрес', value: 'гр. Варна, ул. Любен Каравелов № 71, Партер' },
            { icon: Phone, label: 'Телефон', value: '+359 882 708 081', href: 'tel:+359882708081' },
            { icon: Mail, label: 'Имейл', value: 'drdiclinic21@gmail.com', href: 'mailto:drdiclinic21@gmail.com' },
            { icon: Clock, label: 'Работно време', value: 'Понеделник – Петък: 10:00 – 17:00' },
          ].map((item, i) => (
            <div
              key={i}
              className="ct-block bg-black p-8 lg:p-10 opacity-0"
              style={{ transform: 'translateY(25px)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <item.icon size={15} style={{ color: 'var(--accent-light)' }} />
                <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {item.label}
                </span>
              </div>
              {item.href ? (
                <a href={item.href} className="font-light hover:text-indigo-300 transition-colors duration-300"
                  style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {item.value}
                </a>
              ) : (
                <p className="font-light" style={{ color: 'rgba(255,255,255,0.8)' }}>{item.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Social + CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Последвайте ни
            </span>
            {[
              { icon: Instagram, href: 'https://www.instagram.com/drdiclinic/' },
              { icon: Facebook, href: 'http://www.facebook.com/DrDiClinic/' },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border transition-all duration-300 hover:border-indigo-500/40 hover:bg-indigo-500/10"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <s.icon size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
              </a>
            ))}
          </div>

          <a
            href="tel:+359882708081"
            className="px-8 py-3 bg-white text-black text-[11px] tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:bg-indigo-400 hover:text-white"
          >
            Запази час
          </a>
        </div>
      </div>
    </section>
  )
}
