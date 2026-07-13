import Lenis from 'lenis'

let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

export function getLenis() {
  return lenis
}

/** Плавен скрол до елемент/селектор — през Lenis, с fallback. */
export function scrollToTarget(target: string | HTMLElement, offset = -72) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.2 })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: 'smooth' })
}

/** Плавен скрол до конкретна позиция в пиксели. */
export function scrollToPosition(y: number) {
  if (lenis) {
    lenis.scrollTo(y, { duration: 1.1 })
    return
  }
  window.scrollTo({ top: y, behavior: 'smooth' })
}
