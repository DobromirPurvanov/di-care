import ShaderBackground from './components/ShaderBackground'
import Header from './components/Header'
import Hero from './sections/Hero'
import ProcedureSection from './sections/ProcedureSection'
import Services from './sections/Services'
import WhyUs from './sections/WhyUs'
import Equipment from './sections/Equipment'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg)' }}>
      <ShaderBackground />
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
    </div>
  )
}
