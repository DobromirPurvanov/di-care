import { useRef, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

type Values = {
  name: string
  phone: string
  email: string
  procedure: string
  message: string
  gdpr: boolean
}

type Errors = Partial<Record<keyof Values, string>>

const PROCEDURES = [
  'Лазерно подмладяване',
  'Процедури за тяло',
  'Стоматология',
  'Озонотерапия',
  'Интимна грижа',
  'Диагностика',
  'Друго',
]

const initial: Values = { name: '', phone: '', email: '', procedure: '', message: '', gdpr: false }

function validateField(field: keyof Values, values: Values): string | undefined {
  const v = values[field]
  switch (field) {
    case 'name':
      if (!String(v).trim()) return 'Моля, въведете вашето име.'
      if (String(v).trim().length < 2) return 'Името изглежда твърде кратко.'
      return
    case 'phone': {
      const digits = String(v).replace(/\D/g, '')
      if (!String(v).trim()) return 'Моля, въведете телефон за връзка.'
      if (digits.length < 6) return 'Телефонният номер изглежда непълен — проверете цифрите.'
      return
    }
    case 'email':
      if (String(v).trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()))
        return 'Имейлът изглежда невалиден — проверете формàта (име@домейн.бг).'
      return
    case 'gdpr':
      if (!v) return 'Необходимо е съгласие с политиката за лични данни.'
      return
    default:
      return
  }
}

export default function ContactForm() {
  const [values, setValues] = useState<Values>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const set = (field: keyof Values, value: string | boolean) => {
    setValues(prev => {
      const next = { ...prev, [field]: value }
      // при вече докоснато поле — валидирай в реално време, за да изчезва грешката
      if (touched[field]) {
        setErrors(e => ({ ...e, [field]: validateField(field, next) }))
      }
      return next
    })
  }

  const blur = (field: keyof Values) => {
    setTouched(t => ({ ...t, [field]: true }))
    setErrors(e => ({ ...e, [field]: validateField(field, values) }))
  }

  const isValid = (field: keyof Values) =>
    touched[field] && !errors[field] && String(values[field]).trim() !== ''

  const handleSubmit = () => {
    const all: Errors = {}
    ;(['name', 'phone', 'email', 'gdpr'] as (keyof Values)[]).forEach(f => {
      const err = validateField(f, values)
      if (err) all[f] = err
    })
    setTouched({ name: true, phone: true, email: true, gdpr: true })
    setErrors(all)

    if (Object.keys(all).length > 0) {
      // фокус върху първото невалидно поле
      const first = formRef.current?.querySelector<HTMLElement>('.field-error, input[aria-invalid="true"]')
      first?.focus()
      return
    }

    setStatus('sending')
    // TODO: заменете mock-а с реална API интеграция (Resend / собствен endpoint)
    setTimeout(() => {
      console.log('[ContactForm] Заявка за час:', values)
      setStatus('success')
    }, 900)
  }

  if (status === 'success') {
    return (
      <div
        className="flex flex-col items-start gap-5 py-10"
        role="status"
        aria-live="polite"
      >
        <span
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            border: '1px solid rgba(200,160,94,0.5)',
            background: 'rgba(200,160,94,0.08)',
            animation: 'successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <Check size={26} style={{ color: '#c8a05e' }} />
        </span>
        <div>
          <p className="text-lg font-light" style={{ color: '#f2ede2' }}>
            Благодарим ви!
          </p>
          <p className="text-sm font-light mt-1" style={{ color: 'rgba(242,237,226,0.55)' }}>
            Получихме вашата заявка и ще се свържем с вас скоро.
          </p>
        </div>
        <style>{`
          @keyframes successPop {
            0% { transform: scale(0.4); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={e => { e.preventDefault(); handleSubmit() }}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* Име */}
      <div className="field-wrap">
        <input
          id="cf-name"
          type="text"
          autoComplete="name"
          placeholder=" "
          className={`field-input ${touched.name && errors.name ? 'field-error' : ''}`}
          value={values.name}
          onChange={e => set('name', e.target.value)}
          onBlur={() => blur('name')}
          aria-invalid={!!(touched.name && errors.name)}
          aria-describedby={errors.name ? 'cf-name-err' : undefined}
          required
        />
        <label htmlFor="cf-name" className="field-label">Име и фамилия *</label>
        {isValid('name') && <Check size={14} className="absolute right-0 top-6" style={{ color: '#8fb996' }} aria-hidden="true" />}
        {touched.name && errors.name && <span id="cf-name-err" className="field-msg" role="alert">{errors.name}</span>}
      </div>

      {/* Телефон */}
      <div className="field-wrap">
        <span className="absolute left-0 top-[22px] text-sm select-none" aria-hidden="true" style={{ color: 'rgba(242,237,226,0.6)' }}>🇧🇬</span>
        <input
          id="cf-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder=" "
          className={`field-input pl-8 ${touched.phone && errors.phone ? 'field-error' : ''}`}
          value={values.phone}
          onChange={e => set('phone', e.target.value)}
          onBlur={() => blur('phone')}
          aria-invalid={!!(touched.phone && errors.phone)}
          aria-describedby={errors.phone ? 'cf-phone-err' : undefined}
          required
        />
        <label htmlFor="cf-phone" className="field-label pl-8">Телефон *</label>
        {isValid('phone') && <Check size={14} className="absolute right-0 top-6" style={{ color: '#8fb996' }} aria-hidden="true" />}
        {touched.phone && errors.phone && <span id="cf-phone-err" className="field-msg" role="alert">{errors.phone}</span>}
      </div>

      {/* Имейл */}
      <div className="field-wrap">
        <input
          id="cf-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder=" "
          className={`field-input ${touched.email && errors.email ? 'field-error' : ''}`}
          value={values.email}
          onChange={e => set('email', e.target.value)}
          onBlur={() => blur('email')}
          aria-invalid={!!(touched.email && errors.email)}
          aria-describedby={errors.email ? 'cf-email-err' : undefined}
        />
        <label htmlFor="cf-email" className="field-label">Имейл (по избор)</label>
        {isValid('email') && <Check size={14} className="absolute right-0 top-6" style={{ color: '#8fb996' }} aria-hidden="true" />}
        {touched.email && errors.email && <span id="cf-email-err" className="field-msg" role="alert">{errors.email}</span>}
      </div>

      {/* Процедура */}
      <div className="field-wrap">
        <select
          id="cf-procedure"
          className="field-input"
          value={values.procedure}
          onChange={e => { set('procedure', e.target.value); setTouched(t => ({ ...t, procedure: true })) }}
        >
          <option value="" disabled hidden></option>
          {PROCEDURES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <label htmlFor="cf-procedure" className={`field-label ${values.procedure ? 'label-float' : ''}`}>
          Процедура
        </label>
      </div>

      {/* Съобщение */}
      <div className="field-wrap">
        <textarea
          id="cf-message"
          rows={4}
          placeholder=" "
          className="field-input resize-none"
          value={values.message}
          onChange={e => set('message', e.target.value)}
        />
        <label htmlFor="cf-message" className="field-label">
          Разкажете ни повече за вашите нужди...
        </label>
      </div>

      {/* GDPR */}
      <div className="field-wrap">
        <label htmlFor="cf-gdpr" className="flex items-start gap-3 cursor-pointer select-none group">
          <input
            id="cf-gdpr"
            type="checkbox"
            checked={values.gdpr}
            onChange={e => { set('gdpr', e.target.checked); setTouched(t => ({ ...t, gdpr: true })); setErrors(er => ({ ...er, gdpr: validateField('gdpr', { ...values, gdpr: e.target.checked }) })) }}
            className="sr-only"
            aria-invalid={!!(touched.gdpr && errors.gdpr)}
            aria-describedby={errors.gdpr ? 'cf-gdpr-err' : undefined}
          />
          <span
            aria-hidden="true"
            className="mt-[2px] w-[18px] h-[18px] flex-none flex items-center justify-center transition-all duration-200"
            style={{
              border: `1px solid ${values.gdpr ? '#c8a05e' : 'rgba(242,237,226,0.25)'}`,
              background: values.gdpr ? 'rgba(200,160,94,0.15)' : 'transparent',
            }}
          >
            {values.gdpr && <Check size={12} style={{ color: '#c8a05e' }} />}
          </span>
          <span className="text-xs font-light leading-relaxed" style={{ color: 'rgba(242,237,226,0.55)' }}>
            Съгласен съм с{' '}
            <a href="#" className="underline underline-offset-2 transition-colors hover:text-[#ddbd82]" style={{ color: 'rgba(242,237,226,0.75)' }} onClick={e => e.stopPropagation()}>
              политиката за лични данни
            </a>{' '}*
          </span>
        </label>
        {touched.gdpr && errors.gdpr && <span id="cf-gdpr-err" className="field-msg" role="alert">{errors.gdpr}</span>}
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-2 w-full sm:w-auto sm:self-start inline-flex items-center justify-center gap-3 px-10 py-4 text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
        style={{ background: status === 'sending' ? '#c8a05e' : '#c8a05e', color: '#0c1614' }}
        onMouseEnter={e => { if (status !== 'sending') (e.currentTarget as HTMLButtonElement).style.background = '#ddbd82' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#c8a05e' }}
      >
        {status === 'sending' ? (
          <>
            <Loader2 size={15} className="animate-spin" aria-hidden="true" />
            Изпращане...
          </>
        ) : (
          'Изпрати заявка'
        )}
      </button>
    </form>
  )
}
