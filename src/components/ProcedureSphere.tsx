import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

interface LabelData {
  title: string
  lat: number
  lon: number
}

const labelData: LabelData[] = [
  { title: 'Лазерно подмладяване', lat: 0, lon: 270 },
  { title: 'Дермални филъри', lat: 45, lon: 200 },
  { title: 'Ботокс', lat: -30, lon: 310 },
  { title: 'IV терапии', lat: 60, lon: 150 },
  { title: 'Лазерна епилация', lat: -50, lon: 80 },
  { title: 'Озонотерапия', lat: 15, lon: 240 },
  { title: 'Стоматология', lat: -60, lon: 180 },
  { title: 'Интимна грижа', lat: 40, lon: 350 },
  { title: '4D Лифтинг', lat: -15, lon: 40 },
  { title: 'Мезотерапия', lat: 70, lon: 280 },
  { title: 'Кожно затягане', lat: -40, lon: 130 },
  { title: 'Маска за лице', lat: 25, lon: 100 },
  { title: 'Регенерация', lat: 55, lon: 320 },
  { title: 'Хидратация', lat: -70, lon: 250 },
  { title: 'Body контуринг', lat: 10, lon: 60 },
  { title: 'Фотона пилинг', lat: -25, lon: 170 },
  { title: 'Подмладяване', lat: 50, lon: 30 },
  { title: 'Детоксикация', lat: -55, lon: 300 },
  { title: 'Лицев хирург', lat: 35, lon: 220 },
  { title: 'Диагностика', lat: -10, lon: 120 },
  { title: 'Корекция белези', lat: 65, lon: 260 },
  { title: 'NightLase', lat: -45, lon: 50 },
  { title: 'Микронидлинг', lat: 20, lon: 340 },
  { title: 'Анти-ейдж', lat: -65, lon: 160 },
]

export default function ProcedureSphere() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const w = container.clientWidth
    const h = container.clientHeight
    const sphereRadius = 320

    // GL Renderer for stars
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, w / h, 0.1, 2000)
    camera.position.z = 580

    const glRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    glRenderer.setSize(w, h)
    glRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(glRenderer.domElement)
    glRenderer.domElement.style.position = 'absolute'
    glRenderer.domElement.style.top = '0'
    glRenderer.domElement.style.left = '0'
    glRenderer.domElement.style.width = '100%'
    glRenderer.domElement.style.height = '100%'

    // CSS3D Renderer for labels
    const cssRenderer = new CSS3DRenderer()
    cssRenderer.setSize(w, h)
    cssRenderer.domElement.style.position = 'absolute'
    cssRenderer.domElement.style.top = '0'
    cssRenderer.domElement.style.left = '0'
    cssRenderer.domElement.style.width = '100%'
    cssRenderer.domElement.style.height = '100%'
    cssRenderer.domElement.style.pointerEvents = 'auto'
    container.appendChild(cssRenderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, cssRenderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.25
    controls.enablePan = false
    controls.minPolarAngle = Math.PI * 0.2
    controls.maxPolarAngle = Math.PI * 0.8
    controls.enableZoom = false

    // Glow texture for stars
    function createGlowTexture(): THREE.CanvasTexture {
      const size = 64
      const c = document.createElement('canvas')
      c.width = size; c.height = size
      const ctx = c.getContext('2d')!
      const grad = ctx.createRadialGradient(size/2, size/2, 2, size/2, size/2, size/2)
      grad.addColorStop(0, 'rgba(255,255,255,1)')
      grad.addColorStop(0.2, 'rgba(255,255,255,0.5)')
      grad.addColorStop(0.7, 'rgba(255,255,255,0.06)')
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, size, size)
      return new THREE.CanvasTexture(c)
    }

    const glowTexture = createGlowTexture()

    // Random stars
    function addStars(count = 350) {
      const stars = new THREE.Group()
      for (let i = 0; i < count; i++) {
        const u = Math.random()
        const v = Math.random()
        const theta = 2 * Math.PI * u
        const phi = Math.acos(2 * v - 1)
        const r = sphereRadius + (Math.random() - 0.5) * 10

        const x = r * Math.sin(phi) * Math.cos(theta)
        const y = r * Math.cos(phi)
        const z = r * Math.sin(phi) * Math.sin(theta)

        const size = Math.random() * 6 + 5
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0xffffff,
            transparent: true,
            opacity: 1,
          })
        )
        sprite.position.set(x, y, z)
        sprite.scale.set(size, size, 1)
        stars.add(sprite)
      }
      scene.add(stars)
    }
    addStars()

    // Labels
    const labels: { obj: CSS3DObject; element: HTMLDivElement; target: THREE.Vector3 }[] = []

    function addLabel(title: string, lat: number, lon: number) {
      const el = document.createElement('div')
      el.className = 'label-tag'
      el.textContent = title

      el.addEventListener('pointerup', (e) => {
        e.stopPropagation()
        if (Math.abs((e as PointerEvent).movementX) < 5 && Math.abs((e as PointerEvent).movementY) < 5) {
          // Click
        }
      })

      el.addEventListener('mouseenter', () => { controls.autoRotate = false })
      el.addEventListener('mouseleave', () => { controls.autoRotate = true })

      const obj = new CSS3DObject(el)
      const r = sphereRadius + (Math.random() - 0.5) * 40
      const phi = (90 - lat) * Math.PI / 180
      const theta = (lon + 180) * Math.PI / 180
      const target = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      )

      const camDir = camera.position.clone().normalize()
      const startPos = camDir.multiplyScalar(sphereRadius)
      obj.position.copy(startPos)
      obj.lookAt(target)

      scene.add(obj)
      labels.push({ obj, element: el, target })
    }

    labelData.forEach(l => addLabel(l.title, l.lat, l.lon))

    // Animation
    let animId: number
    function animate() {
      animId = requestAnimationFrame(animate)
      controls.update()

      // Update label visibility based on camera angle
      labels.forEach(label => {
        label.obj.position.lerp(label.target, 0.05)
        label.obj.quaternion.copy(camera.quaternion)

        const pos = label.obj.getWorldPosition(new THREE.Vector3())
        const camDir = new THREE.Vector3()
        camera.getWorldDirection(camDir)
        const toLabel = pos.clone().sub(camera.position).normalize()
        const dot = camDir.dot(toLabel)

        if (dot <= 0) {
          label.element.style.display = 'none'
          label.element.style.pointerEvents = 'none'
          return
        }

        const dCamera = camera.position.length()
        const minDist = dCamera - sphereRadius
        const maxDist = Math.sqrt(dCamera * dCamera - sphereRadius * sphereRadius)
        const dist = camera.position.distanceTo(pos)

        if (dist > maxDist) {
          label.element.style.display = 'none'
          label.element.style.pointerEvents = 'none'
          return
        }

        let progress = (dist - minDist) / (maxDist - minDist)
        progress = Math.min(Math.max(progress, 0), 1)

        let opacity = 1
        if (progress <= 0.5) {
          opacity = 1
        } else if (progress <= 0.99) {
          opacity = 1 - (progress - 0.5) / 0.4
        } else {
          opacity = 0
        }

        if (opacity <= 0) {
          label.element.style.display = 'none'
          label.element.style.pointerEvents = 'none'
        } else {
          label.element.style.display = 'block'
          label.element.style.opacity = opacity.toFixed(2)
          label.element.style.pointerEvents = progress > 0.75 ? 'none' : 'auto'
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
      }}
    />
  )
}
