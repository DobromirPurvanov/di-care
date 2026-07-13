import { useEffect } from 'react'
import { useLocation } from 'react-router'
import Hero from '../sections/Hero'
import ProcedureSection from '../sections/ProcedureSection'
import Services from '../sections/Services'
import WhyUs from '../sections/WhyUs'
import Equipment from '../sections/Equipment'
import Contact from '../sections/Contact'
import { scrollToTarget } from '../lib/scroll'

export default function Home() {
  const location = useLocation()

  // Когато идваме от подстраница с искане за скрол към котва (напр. #contact),
  // изчакваме секциите да се монтират и скролваме плавно.
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo
    if (!target) return
    const id = requestAnimationFrame(() => scrollToTarget(target))
    return () => cancelAnimationFrame(id)
  }, [location.state])

  return (
    <main className="relative z-10">
      <Hero />
      <ProcedureSection />
      <Services />
      <WhyUs />
      <Equipment />
      <Contact />
    </main>
  )
}
