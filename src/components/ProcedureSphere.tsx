import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { procedures as labelData, categoryById, type Procedure } from '../data/procedures'

export default function ProcedureSphere() {
  const containerRef = useRef<HTMLDivElement>(null)
  // activeIdxRef остава винаги null — цикълът на анимацията го чете за culling.
  const activeIdxRef = useRef<number | null>(null)
  // Навигацията се ползва в императивните listener-и на етикетите.
  const navigate = useNavigate()
  const navigateRef = useRef(navigate)
  useEffect(() => { navigateRef.current = navigate }, [navigate])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const w = container.clientWidth
    const h = container.clientHeight
    // Адаптивният world radius пази сходен визуален размер на CSS3D текста
    // както на 320px телефон, така и на по-широк таблет.
    const sphereRadius = isMobile
      ? Math.min(360, Math.max(200, w * 0.55))
      : 320

    // GL Renderer за звездите
    const scene = new THREE.Scene()
    const FOV = 70
    const camera = new THREE.PerspectiveCamera(FOV, w / h, 0.1, 2000)

    // Разстоянието на камерата се смята така, че цялата сфера (плюс етикетите)
    // да се побира в кадъра — И по височина, И по ширина. На тесни мобилни
    // екрани ограничението е ШИРИНАТА: с фиксирано разстояние страничните
    // етикети излизаха извън кадъра и се отрязваха — точно оттам „се чупеше".
    function fitDistance(width: number, height: number) {
      const halfV = (FOV * Math.PI) / 180 / 2
      const halfH = Math.atan(Math.tan(halfV) * (width / height))
      const distV = sphereRadius / Math.tan(halfV)
      const distH = sphereRadius / Math.tan(halfH)
      // 1.5 оставяше почти една трета празно място отстрани и смаляваше
      // етикетите. 1.32 дава осезаемо по-голяма сфера, но пази място за тях.
      const margin = isMobile ? 1.32 : 1.25
      return Math.max(distV, distH) * margin
    }
    camera.position.z = fitDistance(w, h)

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
    controls.autoRotate = !prefersReduced
    controls.autoRotateSpeed = isMobile ? 0.15 : 0.25
    controls.enablePan = false
    controls.minPolarAngle = Math.PI * 0.2
    controls.maxPolarAngle = Math.PI * 0.8
    controls.enableZoom = false

    // OrbitControls слага touch-action:none на своя елемент, което „заключва"
    // вертикалния скрол на страницата, докато пръстът е върху сферата (а тя
    // заема ~80% от височината на екрана). Връщаме pan-y: вертикалният жест
    // скролва страницата, хоризонталният върти сферата — така мобилният скрол
    // вече не се „чупи".
    cssRenderer.domElement.style.touchAction = 'pan-y'

    // Спираме въртенето докато мишката е над сферата — така всеки етикет
    // стои неподвижно и е лесен за клик.
    const pauseRotate = () => { if (!prefersReduced) controls.autoRotate = false }
    const resumeRotate = () => { if (!prefersReduced) controls.autoRotate = true }
    container.addEventListener('mouseenter', pauseRotate)
    container.addEventListener('mouseleave', resumeRotate)

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

    // Клик върху етикет → страницата на услугата, позиционирана на
    // конкретната процедура (ServicePage скролва и я маркира).
    function goToService(data: Procedure) {
      navigateRef.current(`/uslugi/${categoryById[data.category].slug}`, {
        state: { procedure: data.title },
      })
    }

    function addLabel(data: Procedure) {
      const el = document.createElement('div')
      el.className = 'label-tag'
      el.textContent = data.title
      el.tabIndex = 0
      el.setAttribute('role', 'button')
      el.setAttribute('aria-label', `Виж услугата за: ${data.title}`)

      // ВАЖНО: спираме натиска да стигне до OrbitControls (да не завърти сферата)
      // И замразяваме въртенето веднага — така етикетът стои неподвижно по
      // време на клика/тапа и навигацията е надеждна (и на десктоп, и на touch).
      el.addEventListener('pointerdown', (e) => { e.stopPropagation(); controls.autoRotate = false })
      el.addEventListener('pointerup', (e) => { e.stopPropagation() })
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        goToService(data)
      })
      // Клавиатурна навигация
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          goToService(data)
        }
      })
      el.addEventListener('mouseenter', () => { controls.autoRotate = false })
      el.addEventListener('mouseleave', () => { if (!prefersReduced) controls.autoRotate = true })

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

    labelData.forEach((l) => addLabel(l))

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

        // На телефон показваме само най-предните 5–8 процедури. Така те могат
        // да са реално четими и удобни за натискане, без 30 големи етикета да
        // се застъпват. Останалите се появяват естествено при завъртане.
        if (isMobile && progress > 0.84 && !isActive) {
          label.element.style.display = 'none'
          label.element.style.pointerEvents = 'none'
          return
        }

        // Предната полусфера остава ясно четима. Към ръба етикетите избледняват.
        // На мобилно фейдът започва по-рано и е по-силен — тесният екран събира
        // 30-те етикета много нагъсто, затова оставяме ясни само предните, а
        // претрупаният външен пръстен се стапя, вместо да се застъпва/отрязва.
        let opacity = 1
        const fadeStart = isMobile ? 0.52 : 0.85
        const fadeAmount = isMobile ? 0.95 : 0.35
        if (progress > fadeStart) {
          opacity = 1 - ((progress - fadeStart) / (1 - fadeStart)) * fadeAmount
        }
        if (isActive) opacity = Math.max(opacity, 1)

        if (opacity <= 0.02) {
          label.element.style.display = 'none'
          label.element.style.pointerEvents = 'none'
        } else {
          label.element.style.display = 'inline-flex'
          label.element.style.opacity = opacity.toFixed(2)
          label.element.style.pointerEvents = progress > 0.9 && !isActive ? 'none' : 'auto'
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
      // Пресмятаме наново разстоянието — при завъртане на телефона или скриване
      // на адрес-лентата съотношението се променя и сферата пак трябва да пасне.
      camera.position.z = fitDistance(nw, nh)
      camera.updateProjectionMatrix()
      glRenderer.setSize(nw, nh)
      cssRenderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      container.removeEventListener('mouseenter', pauseRotate)
      container.removeEventListener('mouseleave', resumeRotate)
      cancelAnimationFrame(animId)
      controls.dispose()
      glRenderer.dispose()
      glowTexture.dispose()
      if (container.contains(glRenderer.domElement)) container.removeChild(glRenderer.domElement)
      if (container.contains(cssRenderer.domElement)) container.removeChild(cssRenderer.domElement)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="procedure-sphere"
      style={{
        position: 'relative',
        cursor: 'grab',
        touchAction: 'pan-y',
      }}
    />
  )
}
