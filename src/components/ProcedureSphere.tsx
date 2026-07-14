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
    controls.autoRotate = !prefersReduced
    controls.autoRotateSpeed = isMobile ? 0.15 : 0.25
    controls.enablePan = false
    controls.minPolarAngle = Math.PI * 0.2
    controls.maxPolarAngle = Math.PI * 0.8
    controls.enableZoom = false

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

    // Клик върху етикет → директно към страницата на съответната услуга.
    function goToService(data: Procedure) {
      navigateRef.current(`/uslugi/${categoryById[data.category].slug}`)
    }

    function addLabel(data: Procedure) {
      const el = document.createElement('div')
      el.className = 'label-tag'
      el.textContent = data.title
      el.tabIndex = 0
      el.setAttribute('role', 'button')
      el.setAttribute('aria-label', `Виж услугата за: ${data.title}`)

      // Tap/click със защита срещу drag
      let downX = 0, downY = 0
      el.addEventListener('pointerdown', (e) => { downX = e.clientX; downY = e.clientY })
      el.addEventListener('pointerup', (e) => {
        e.stopPropagation()
        if (Math.abs(e.clientX - downX) < 6 && Math.abs(e.clientY - downY) < 6) {
          goToService(data)
        }
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
      style={{
        width: '100%',
        height: 'min(80vh, 800px)',
        position: 'relative',
        cursor: 'grab',
        touchAction: 'pan-y',
      }}
    />
  )
}
