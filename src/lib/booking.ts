// Централна конфигурация за системата за запазване на часове (Cal.com).
//
// Реалният линк се задава чрез env променлива VITE_CAL_LINK във Vercel
// (и локално в .env.local). До създаване на акаунт се ползва placeholder,
// така че бутоните са видимо активни.
//
// Ползваме официалния vanilla embed snippet (зареден динамично), вместо
// npm пакета — така Cal не влиза в bundle-а и не утежнява build-а.

export const CAL_LINK: string = import.meta.env.VITE_CAL_LINK ?? 'dobromir-purvanov-ksto97/30min'

/** Namespace за Cal embed инстанцията. */
export const CAL_NAMESPACE = 'zapazi-chas'

/** Брандова тема на календара — съгласувана с дизайна на сайта. */
export const CAL_UI_CONFIG = {
  theme: 'dark' as const,
  hideEventTypeDetails: false,
  layout: 'month_view' as const,
  cssVarsPerTheme: {
    dark: { 'cal-brand': '#c8a05e' },
    light: { 'cal-brand': '#c8a05e' },
  },
}

/**
 * Config за конкретен клик (data-cal-config). Пренася избраната услуга в
 * бележките към резервацията, за да я вижда клиниката.
 */
export function calConfig(service?: string): string {
  const config: Record<string, string> = { theme: 'dark' }
  if (service) config.notes = `Услуга: ${service}`
  return JSON.stringify(config)
}

interface CalApi {
  (...args: unknown[]): void
  q?: unknown[][]
  ns?: Record<string, CalApi>
  loaded?: boolean
}

declare global {
  interface Window {
    Cal?: CalApi
  }
}

let started = false

/**
 * Зарежда Cal.com embed скрипта, инициализира темата и закача callbacks за
 * отваряне/затваряне на popup модала (за спиране на фоновия скрол).
 */
export function initCal(handlers: { onOpen: () => void; onClose: () => void }): void {
  if (started || typeof window === 'undefined') return
  started = true

  const w = window
  const scriptSrc = 'https://app.cal.com/embed/embed.js'
  const push = (api: CalApi, args: unknown[]) => { (api.q ??= []).push(args) }

  // Официалният bootstrap: дефинира опашка, докато embed.js се зареди.
  w.Cal =
    w.Cal ||
    (function bootstrap(...args: unknown[]) {
      const cal = w.Cal as CalApi
      if (!cal.loaded) {
        cal.ns = {}
        cal.q = cal.q || []
        w.document.head.appendChild(w.document.createElement('script')).src = scriptSrc
        cal.loaded = true
      }
      if (args[0] === 'init') {
        const api: CalApi = ((...a: unknown[]) => push(api, a)) as CalApi
        api.q = api.q || []
        const namespace = args[1]
        if (typeof namespace === 'string') {
          cal.ns![namespace] = cal.ns![namespace] || api
          push(cal.ns![namespace], args)
          push(cal, ['initNamespace', namespace])
        } else {
          push(cal, args)
        }
        return
      }
      push(cal, args)
    } as CalApi)

  w.Cal('init', CAL_NAMESPACE, { origin: 'https://cal.com' })
  const ns = w.Cal.ns![CAL_NAMESPACE]
  ns('ui', CAL_UI_CONFIG)
  ns('on', { action: 'linkReady', callback: handlers.onOpen })
  ns('on', { action: '__closeIframe', callback: handlers.onClose })
}
