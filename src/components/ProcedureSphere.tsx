import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { ArrowRight, X } from 'lucide-react'
import { scrollToTarget } from '../lib/scroll'

interface LabelData {
  title: string
  lat: number
  lon: number
  description: string
}

const labelData: LabelData[] = [
  { title: 'Лазерно подмладяване', lat: 0, lon: 270, description: 'Fotona 4D лифтинг, лазерен пилинг и ресърфейсинг за видимо по-млада кожа без възстановителен период.' },
  { title: 'Дермални филъри', lat: 45, lon: 200, description: 'Прецизно възстановяване на обем и контур с хиалуронови филъри от световни марки.' },
  { title: 'Ботокс', lat: -30, lon: 310, description: 'Изглаждане на мимически бръчки с естествен, недокоснат резултат.' },
  { title: 'IV терапии', lat: 60, lon: 150, description: 'Венозни витаминни инфузии за енергия, имунитет и клетъчно възстановяване.' },
  { title: 'Лазерна епилация', lat: -50, lon: 80, description: 'Трайно премахване на окосмяване с медицински лазер за всеки тип кожа.' },
  { title: 'Озонотерапия', lat: 15, lon: 240, description: 'Системна детоксикация и подмладяване чрез медицински озон (Medozon).' },
  { title: 'Стоматология', lat: -60, lon: 180, description: 'Естетична стоматология и холивудска усмивка от специалисти.' },
  { title: 'Интимна грижа', lat: 40, lon: 350, description: 'Деликатно лазерно лечение и подмладяване на интимната зона.' },
  { title: '4D Лифтинг', lat: -15, lon: 40, description: 'Четириизмерен неинвазивен лифтинг с Fotona — стягане отвътре и отвън.' },
  { title: 'Мезотерапия', lat: 70, lon: 280, description: 'Микроинжектиране на активни коктейли за хидратация и сияйна кожа.' },
  { title: 'Кожно затягане', lat: -40, lon: 130, description: 'Skin Tightening — лазерно стягане на отпусната кожа на лице и тяло.' },
  { title: 'Маска за лице', lat: 25, lon: 100, description: 'Професионални терапии за лице, съобразени с вашия тип кожа.' },
  { title: 'Регенерация', lat: 55, lon: 320, description: 'Регенеративни протоколи, стимулиращи естественото възстановяване.' },
  { title: 'Хидратация', lat: -70, lon: 250, description: 'Дълбока хидратация с хиалурон и биоревитализация.' },
  { title: 'Body контуринг', lat: 10, lon: 60, description: 'Лазерна липолиза и оформяне на силует без операция.' },
  { title: 'Фотона пилинг', lat: -25, lon: 170, description: 'Контролиран лазерен пилинг за обновена, равномерна кожа.' },
  { title: 'Подмладяване', lat: 50, lon: 30, description: 'Комплексни анти-ейдж програми, персонализирани за вас.' },
  { title: 'Детоксикация', lat: -55, lon: 300, description: 'Пълна детоксикация на организма с озон и IV терапии.' },
  { title: 'Лицев хирург', lat: 35, lon: 220, description: 'Консултации и естетични корекции от лицево-челюстен хирург.' },
  { title: 'Диагностика', lat: -10, lon: 120, description: 'FRAS 5 тест за оксидативен стрес и персонализирани терапии.' },
  { title: 'Корекция белези', lat: 65, lon: 260, description: 'Лазерно заличаване на белези, стрии и пигментации.' },
  { title: 'NightLase', lat: -45, lon: 50, description: 'Неинвазивно лазерно лечение на хъркане за спокоен сън.' },
  { title: 'Микронидлинг', lat: 20, lon: 340, description: 'Колаген-стимулираща терапия за текстура и еластичност.' },
  { title: 'Анти-ейдж', lat: -65, lon: 160, description: 'Дългосрочна стратегия за запазване на младостта на кожата.' },
]

export default function ProcedureSphere() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const activeIdxRef = useRef<number | null>(null)
  activeIdxRef.current = activeIdx

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const w = container.clientWidth
    const h = container.clientHeight
    const sphereRadius = isMobile ? 220 : 320

    // GL Renderer за звездите
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, w / h, 0.1, 2000)
    camera.position.z = isMobile ? 420 : 580

    const glRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    glRenderer.setSize(w, h)
    glRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(glRenderer.domElement)
    Object.assign(glRenderer.domElement.style, { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' })

    // CSS3D Renderer за етикетите
    const cssRenderer = new CSS3DRenderer()
    cssRenderer.setSize(w, h)
    Object.assign(cssRenderer.domElement.style, { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', pointerEvents: 'auto' })
    container.appendChild(cssRenderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, cssRenderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = true
    controls.autoRotateSpeed = isMobile ? 0.15 : 0.25
    controls.enablePan = false
    controls.minPolarAngle = Math.PI * 0.2
    controls.maxPolarAngle = Math.PI * 0.8
    controls.enableZoom = false

    // Glow текстура
    function createGlowTexture(): THREE.CanvasTexture {
      const size = 64
      const c = document.createElement('canvas')
      c.width = size; c.height = size
      const ctx = c.getContext('2d')!
      const grad = ctx.createRadialGradient(size/2, size/2, 2, size/2, size/2, size/2)
      grad.addColorStop(0, 'rgba(255,246,226,1)')
      grad.addColorStop(0.2, 'rgba(240,222,180,0.5)')
      grad.addColorStop(0.7, 'rgba(240,222,180,0.06)')
      grad.addColorStop(1, 'rgba(240,222,180,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, size, size)
      return new THREE.CanvasTexture(c)
    }
    const glowTexture = createGlowTexture()

    // Звезди с twinkle ефект
    const twinkles: { mat: THREE.SpriteMaterial; phase: number; speed: number; base: number }[] = []
    function addStars(count = 220) {
      const stars = new THREE.Group()
      for (let i = 0; i < count; i++) {
        const u = Math.random(), v = Math.random()
        const theta = 2 * Math.PI * u
        const phi = Math.acos(2 * v - 1)
        const r = sphereRadius + (Math.random() - 0.5) * 10
        const size = Math.random() * 4 + 3
        const mat = new THREE.SpriteMaterial({ map: glowTexture, color: 0xe9d8b4, transparent: true, opacity: 0.9 })
        const sprite = new THREE.Sprite(mat)
        sprite.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        )
        sprite.scale.set(size, size, 1)
        stars.add(sprite)
        twinkles.push({ mat, phase: Math.random() * Math.PI * 2, speed: 0.7 + Math.random() * 1.6, base: 0.45 + Math.random() * 0.45 })
      }
      scene.add(stars)
    }
    addStars()

    // Централно златно сияние
    const centerGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glowTexture, color: 0xc8a05e, transparent: true, opacity: 0.16, depthWrite: false })
    )
    centerGlow.scale.set(sphereRadius * 0.85, sphereRadius * 0.85, 1)
    scene.add(centerGlow)

    // Етикети
    const labels: { obj: CSS3DObject; element: HTMLDivElement; target: THREE.Vector3 }[] = []

    function selectLabel(index: number | null) {
      labels.forEach((l, i) => l.element.classList.toggle('label-active', i === index))
      setActiveIdx(index)
      controls.autoRotate = index === null
    }

    function addLabel(data: LabelData, index: number) {
      const el = document.createElement('div')
      el.className = 'label-tag'
      el.textContent = data.title
      el.tabIndex = 0
      el.setAttribute('role', 'button')
      el.setAttribute('aria-label', `Процедура: ${data.title}`)

      // Tap/click със защита срещу drag
      let downX = 0, downY = 0
      el.addEventListener('pointerdown', (e) => { downX = e.clientX; downY = e.clientY })
      el.addEventListener('pointerup', (e) => {
        e.stopPropagation()
        if (Math.abs(e.clientX - downX) < 6 && Math.abs(e.clientY - downY) < 6) {
          selectLabel(activeIdxRef.current === index ? null : index)
        }
      })
      // Клавиатурна навигация
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          selectLabel(activeIdxRef.current === index ? null : index)
        }
      })
      el.addEventListener('mouseenter', () => { controls.autoRotate = false })
      el.addEventListener('mouseleave', () => { if (activeIdxRef.current === null) controls.autoRotate = true })

      const obj = new CSS3DObject(el)
      const r = sphereRadius + (Math.random() - 0.5) * 40
      const phi = (90 - data.lat) * Math.PI / 180
      const theta = (data.lon + 180) * Math.PI / 180
      const target = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      )

      const camDir = camera.position.clone().normalize()
      obj.position.copy(camDir.multiplyScalar(sphereRadius))
      obj.lookAt(target)

      scene.add(obj)
      labels.push({ obj, element: el, target })
    }

    labelData.forEach((l, i) => addLabel(l, i))

    // Анимация
    const clock = new THREE.Clock()
    let elapsed = 0
    let animId: number
    function animate() {
      animId = requestAnimationFrame(animate)
      controls.update()

      // Времево-базирана конвергенция — еднаква скорост при всякакъв fps
      const dt = Math.min(clock.getDelta(), 0.25)
      elapsed += dt
      const k = 1 - Math.pow(0.046, dt)

      // Twinkle на звездите
      for (const t of twinkles) {
        t.mat.opacity = t.base + 0.35 * Math.sin(elapsed * t.speed + t.phase)
      }
      centerGlow.material.opacity = 0.13 + 0.05 * Math.sin(elapsed * 0.8)

      labels.forEach((label, idx) => {
        label.obj.position.lerp(label.target, k)
        label.obj.quaternion.copy(camera.quaternion)

        const pos = label.obj.getWorldPosition(new THREE.Vector3())
        const camDir = new THREE.Vector3()
        camera.getWorldDirection(camDir)
        const toLabel = pos.clone().sub(camera.position).normalize()
        const dot = camDir.dot(toLabel)

        const isActive = activeIdxRef.current === idx

        if (dot <= 0 && !isActive) {
          label.element.style.display = 'none'
          label.element.style.pointerEvents = 'none'
          return
        }

        const dCamera = camera.position.length()
        const minDist = dCamera - sphereRadius
        const maxDist = Math.sqrt(dCamera * dCamera - sphereRadius * sphereRadius)
        const dist = camera.position.distanceTo(pos)

        if (dist > maxDist && !isActive) {
          label.element.style.display = 'none'
          label.element.style.pointerEvents = 'none'
          return
        }

        let progress = (dist - minDist) / (maxDist - minDist)
        progress = Math.min(Math.max(progress, 0), 1)

        // Цялата предна полусфера е четима; към хоризонта етикетите
        // избледняват и се скриват — без полупрозрачни призраци отзад
        let opacity = 1
        if (progress > 0.7) opacity = 1 - (progress - 0.7) / 0.3
        if (isActive) opacity = Math.max(opacity, 1)

        if (opacity <= 0.02) {
          label.element.style.display = 'none'
          label.element.style.pointerEvents = 'none'
        } else {
          label.element.style.display = 'inline-flex'
          label.element.style.opacity = opacity.toFixed(2)
          label.element.style.pointerEvents = progress > 0.75 && !isActive ? 'none' : 'auto'
        }
      })

      glRenderer.render(scene, camera)
      cssRenderer.render(scene, camera)
    }
    animate()

    // Resize
    function onResize() {
      const nw = container!.clientWidth
      const nh = container!.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      glRenderer.setSize(nw, nh)
      cssRenderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animId)
      controls.dispose()
      glRenderer.dispose()
      glowTexture.dispose()
      if (container.contains(glRenderer.domElement)) container.removeChild(glRenderer.domElement)
      if (container.contains(cssRenderer.domElement)) container.removeChild(cssRenderer.domElement)
    }
  }, [])

  const active = activeIdx !== null ? labelData[activeIdx] : null

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: 'min(80vh, 800px)',
        position: 'relative',
        cursor: 'grab',
        touchAction: 'pan-y',
      }}
    >
      {/* Информационна карта за активната процедура */}
      <div
        className="absolute z-20 left-3 right-3 bottom-3 sm:left-6 sm:bottom-6 sm:right-auto sm:max-w-xs transition-all duration-[400ms]"
        style={{
          opacity: active ? 1 : 0,
          transform: active ? 'translateY(0)' : 'translateY(14px)',
          pointerEvents: active ? 'auto' : 'none',
          background: 'rgba(12,22,20,0.88)',
          border: '1px solid rgba(200,160,94,0.35)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
        }}
        role="dialog"
        aria-live="polite"
        aria-label={active ? `Детайли за ${active.title}` : undefined}
      >
        {active && (
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-sm tracking-[0.12em] uppercase font-medium" style={{ color: '#ddbd82' }}>
                {active.title}
              </h3>
              <button
                onClick={() => {
                  setActiveIdx(null)
                  document.querySelectorAll('.label-tag.label-active').forEach(el => el.classList.remove('label-active'))
                }}
                className="p-2 -m-2 transition-colors hover:text-[#f2ede2]"
                style={{ color: 'rgba(242,237,226,0.45)' }}
                aria-label="Затвори детайлите"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 text-[13px] font-light leading-relaxed" style={{ color: 'rgba(242,237,226,0.65)' }}>
              {active.description}
            </p>
            <button
              onClick={() => scrollToTarget('#contact')}
              className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase transition-colors hover:text-[#ddbd82]"
              style={{ color: '#c8a05e' }}
            >
              Запази час
              <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
