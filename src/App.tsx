import { lazy, Suspense, useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from './components/Header'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import NoiseOverlay from './components/NoiseOverlay'
import Hero from './sections/Hero'
import ProcedureSection from './sections/ProcedureSection'
import Services from './sections/Services'
import WhyUs from './sections/WhyUs'
import Equipment from './sections/Equipment'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import { setLenis } from './lib/scroll'

gsap.registerPlugin(ScrollTrigger)

// Code-splitting за тежкия WebGL фон
const ShaderBackground = lazy(() => import('./components/ShaderBackground'))

export default function App() {
  // Lenis smooth scroll, синхронизиран с GSAP ScrollTrigger
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    setLenis(lenis)

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg)' }}>
      <LoadingScreen />
      <Suspense fallback={null}>
        <ShaderBackground />
      </Suspense>
      <Header />
      <main className="relative z-10">
        <Hero />
        <ProcedureSection />
        <Services />
        <WhyUs />
        <Equipment />
        <Contact />
      </main>
      <Footer />
      <NoiseOverlay />
      <CustomCursor />
    </div>
  )
}
