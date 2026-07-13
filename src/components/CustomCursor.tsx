import { useEffect, useRef } from 'react'

/**
 * Custom cursor — златна точка (8px), която при hover върху
 * интерактивни елементи се разширява до 40px кръг с border.
 * Активен само на устройства с прецизен pointer (desktop).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    document.body.classList.add('has-custom-cursor')

    const dot = dotRef.current!
    const ring = ringRef.current!
    let x = window.innerWidth / 2, y = window.innerHeight / 2
    let rx = x, ry = y
    let raf = 0
    let hovering = false
    let visible = false

    const onMove = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
    }

    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element &&
      !!t.closest('a, button, [role="button"], .label-tag, input, textarea, select, label')

    const onOver = (e: MouseEvent) => {
      hovering = isInteractive(e.target)
      ring.style.width = hovering ? '40px' : '28px'
      ring.style.height = hovering ? '40px' : '28px'
      ring.style.backdropFilter = hovering ? 'blur(2px)' : 'none'
      ring.style.borderColor = hovering ? 'rgba(200,160,94,0.9)' : 'rgba(200,160,94,0.45)'
      dot.style.opacity = hovering ? '0' : '1'
    }

    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const loop = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[250] pointer-events-none rounded-full"
        style={{
          width: 8, height: 8, background: '#c8a05e', opacity: 0,
          transition: 'opacity 0.25s ease',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[250] pointer-events-none rounded-full"
        style={{
          width: 28, height: 28, border: '1px solid rgba(200,160,94,0.45)', opacity: 0,
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, opacity 0.25s ease',
        }}
      />
    </>
  )
}
