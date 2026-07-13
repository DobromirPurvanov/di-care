import { useParams, useNavigate, Link, Navigate } from 'react-router'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { categories, procedures } from '../data/procedures'
import { serviceContent, clinicPhilosophy } from '../data/services'

export default function ServicePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const category = categories.find((c) => c.slug === slug)

  // Непозната услуга → обратно към началото.
  if (!category) return <Navigate to="/" replace />

  const content = serviceContent[category.id]
  const items = procedures.filter((p) => p.category === category.id)
  const extras = new Map((content.extras ?? []).map((e) => [e.match, e]))

  const bookNow = () => navigate('/', { state: { scrollTo: '#contact' } })

  return (
    <main
      className="relative z-10"
      style={{ padding: 'clamp(7rem, 16vh, 11rem) clamp(1.5rem, 4vw, 3rem) clamp(5rem, 10vh, 8rem)' }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Обратна навигация */}
        <Link
          to="/"
          state={{ scrollTo: '#services' }}
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase transition-colors hover:text-[#ddbd82]"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={13} aria-hidden="true" />
          Всички услуги
        </Link>

        {/* Заглавие */}
        <header className="mt-8">
          <p className="text-[11px] tracking-[0.24em] uppercase mb-4" style={{ color: 'var(--accent)' }}>
            {content.tagline}
          </p>
          <h1
            className="text-gradient font-serif-luxe leading-[1.1]"
            style={{ fontSize: 'clamp(2rem, 6vw, 3.4rem)' }}
          >
            {category.label}
          </h1>
          <div
            aria-hidden="true"
            className="mt-6 mb-8"
            style={{ width: '64px', height: '1px', background: 'linear-gradient(90deg, #c8a05e, transparent)' }}
          />
          <p className="text-base font-light leading-relaxed" style={{ color: 'rgba(242,237,226,0.75)' }}>
            {content.intro}
          </p>
        </header>

        {/* Обобщени предимства на услугата */}
        {content.highlights && content.highlights.length > 0 && (
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {content.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-[14px] font-light" style={{ color: 'rgba(242,237,226,0.8)' }}>
                <Check size={15} aria-hidden="true" style={{ color: 'var(--accent)', marginTop: '3px', flex: 'none' }} />
                {h}
              </li>
            ))}
          </ul>
        )}

        {/* Списък с процедури */}
        <section className="mt-14" aria-label="Процедури">
          <h2 className="text-[11px] tracking-[0.22em] uppercase mb-6" style={{ color: 'var(--text-secondary)' }}>
            Процедури
          </h2>
          <ul className="flex flex-col">
            {items.map((p, i) => {
              const extra = extras.get(p.title)
              return (
                <li
                  key={p.title}
                  className="py-6"
                  style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}
                >
                  <h3 className="text-[15px] tracking-[0.06em]" style={{ color: '#ddbd82' }}>
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[14px] font-light leading-relaxed" style={{ color: 'rgba(242,237,226,0.62)' }}>
                    {p.description}
                  </p>

                  {extra?.benefits && (
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {extra.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-[13px] font-light" style={{ color: 'rgba(242,237,226,0.72)' }}>
                          <Check size={13} aria-hidden="true" style={{ color: 'var(--accent)', marginTop: '3px', flex: 'none' }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {extra?.note && (
                    <p
                      className="mt-4 text-[13px] font-light leading-relaxed pl-4"
                      style={{ color: 'rgba(242,237,226,0.55)', borderLeft: '2px solid rgba(200,160,94,0.4)' }}
                    >
                      {extra.note}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {/* Маркетинг послание */}
        {content.quote && (
          <blockquote
            className="mt-12 pl-5 text-lg font-serif-luxe italic leading-relaxed"
            style={{ color: 'rgba(242,237,226,0.85)', borderLeft: '2px solid var(--accent)' }}
          >
            {content.quote}
          </blockquote>
        )}

        {/* CTA */}
        <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <button
            onClick={bookNow}
            className="inline-flex items-center gap-2 px-7 py-3 text-[11px] tracking-[0.18em] uppercase font-medium transition-all duration-300 hover:bg-[#ddbd82]"
            style={{ background: '#c8a05e', color: '#0c1614' }}
          >
            Запази час
            <ArrowRight size={14} aria-hidden="true" />
          </button>
          <a
            href="tel:+359882708081"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase transition-colors hover:text-[#ddbd82]"
            style={{ color: 'rgba(242,237,226,0.7)' }}
          >
            Обади се: +359 88 270 8081
          </a>
        </div>

        {/* Философска линия */}
        <p
          className="mt-16 pt-8 text-[13px] font-light italic leading-relaxed text-center"
          style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}
        >
          {clinicPhilosophy}
        </p>
      </div>
    </main>
  )
}
