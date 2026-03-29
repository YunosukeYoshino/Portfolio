'use client'

import { useEffect, useRef, useState } from 'react'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const simulationFragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform float uDamping;
  varying vec2 vUv;

  void main() {
    vec2 texel = 1.0 / uResolution;

    float n = texture2D(uTexture, vUv + vec2(0.0, texel.y)).r;
    float s = texture2D(uTexture, vUv - vec2(0.0, texel.y)).r;
    float e = texture2D(uTexture, vUv + vec2(texel.x, 0.0)).r;
    float w = texture2D(uTexture, vUv - vec2(texel.x, 0.0)).r;

    vec4 current = texture2D(uTexture, vUv);
    float height = current.r;
    float prevHeight = current.g;

    float newHeight = ((n + s + e + w) * 0.5 - prevHeight) * uDamping;
    newHeight = clamp(newHeight, -1.0, 1.0);

    gl_FragColor = vec4(newHeight, height, 0.0, 1.0);
  }
`

const dropFragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform float uStrength;
  varying vec2 vUv;

  void main() {
    vec4 current = texture2D(uTexture, vUv);

    float dist = distance(vUv, uCenter);
    float drop = smoothstep(uRadius, 0.0, dist) * uStrength;

    current.r += drop;

    gl_FragColor = current;
  }
`

const renderFragmentShader = `
  uniform sampler2D uSimulation;
  uniform sampler2D uBackground;
  uniform vec2 uSimResolution;
  uniform vec2 uScreenSize;
  uniform vec2 uVideoSize;
  uniform float uRefractionStrength;
  varying vec2 vUv;

  // object-fit: cover equivalent
  vec2 coverUv(vec2 uv) {
    float screenAspect = uScreenSize.x / uScreenSize.y;
    float videoAspect = uVideoSize.x / uVideoSize.y;
    vec2 result = uv;
    if (screenAspect > videoAspect) {
      float scale = screenAspect / videoAspect;
      result.y = (uv.y - 0.5) / scale + 0.5;
    } else {
      float scale = videoAspect / screenAspect;
      result.x = (uv.x - 0.5) / scale + 0.5;
    }
    return result;
  }

  void main() {
    vec2 texelSize = 1.0 / uSimResolution;

    float dx = texture2D(uSimulation, vUv + vec2(texelSize.x, 0.0)).r
             - texture2D(uSimulation, vUv - vec2(texelSize.x, 0.0)).r;
    float dy = texture2D(uSimulation, vUv + vec2(0.0, texelSize.y)).r
             - texture2D(uSimulation, vUv - vec2(0.0, texelSize.y)).r;

    float rippleIntensity = length(vec2(dx, dy));
    float aberration = rippleIntensity * 0.01;

    vec2 baseOffset = vec2(dx, dy) * uRefractionStrength;
    vec2 baseUv = coverUv(vUv);
    float r = texture2D(uBackground, baseUv + baseOffset * (1.0 + aberration)).r;
    float g = texture2D(uBackground, baseUv + baseOffset).g;
    float b = texture2D(uBackground, baseUv + baseOffset * (1.0 - aberration)).b;
    vec3 bgColor = vec3(r, g, b);

    vec3 normal = normalize(vec3(dx * 4.0, dy * 4.0, 1.0));
    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    float specular = pow(max(0.0, dot(normal, lightDir)), 32.0);
    bgColor += vec3(1.0) * specular * 0.06;

    bgColor += vec3(dx * 0.12, (dx + dy) * 0.06, dy * 0.12) * 0.15;

    gl_FragColor = vec4(bgColor, 1.0);
  }
`

const SIM_RESOLUTION = 256
const MIN_DROP_DISTANCE = 0.005
const AMBIENT_DROP_INTERVAL = 90

export default function WebGLBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !isMounted || !containerRef.current) return

    let cleanup: (() => void) | undefined

    const initThree = async () => {
      const THREE = await import('three')

      if (!containerRef.current) return

      // Create hidden video element for texture source
      const video = document.createElement('video')
      video.src = '/images/hero-loop.mp4'
      video.crossOrigin = 'anonymous'
      video.loop = true
      video.muted = true
      video.playsInline = true
      video.style.display = 'none'
      document.body.appendChild(video)

      try {
        await video.play()
      } catch {
        // Autoplay may be blocked; video will start on user interaction
      }

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      })

      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.autoClear = false

      // Force canvas to fill container exactly -- prevents inline baseline gap
      const canvas = renderer.domElement
      canvas.style.display = 'block'
      canvas.style.position = 'absolute'
      canvas.style.inset = '0'
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      containerRef.current.appendChild(canvas)

      const isWebGL2 = renderer.capabilities.isWebGL2
      const hasHalfFloat = isWebGL2 || renderer.extensions.get('OES_texture_half_float')

      if (!hasHalfFloat) {
        renderer.dispose()
        if (containerRef.current?.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement)
        }
        video.pause()
        video.remove()
        return
      }

      const targetType = THREE.HalfFloatType

      const createRenderTarget = () =>
        new THREE.WebGLRenderTarget(SIM_RESOLUTION, SIM_RESOLUTION, {
          type: targetType,
          minFilter: THREE.NearestFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat,
          depthBuffer: false,
          stencilBuffer: false,
        })

      let renderTargetA = createRenderTarget()
      let renderTargetB = createRenderTarget()

      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const geometry = new THREE.PlaneGeometry(2, 2)

      const simulationMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: simulationFragmentShader,
        uniforms: {
          uTexture: { value: null },
          uResolution: { value: new THREE.Vector2(SIM_RESOLUTION, SIM_RESOLUTION) },
          uDamping: { value: 0.99 },
        },
        depthWrite: false,
        depthTest: false,
      })

      const dropMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: dropFragmentShader,
        uniforms: {
          uTexture: { value: null },
          uCenter: { value: new THREE.Vector2(0.5, 0.5) },
          uRadius: { value: 0.015 },
          uStrength: { value: 0.05 },
        },
        depthWrite: false,
        depthTest: false,
      })

      // Video texture -- updates every frame automatically
      const videoTexture = new THREE.VideoTexture(video)
      videoTexture.minFilter = THREE.LinearFilter
      videoTexture.magFilter = THREE.LinearFilter

      const renderMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: renderFragmentShader,
        uniforms: {
          uSimulation: { value: null },
          uBackground: { value: videoTexture },
          uSimResolution: { value: new THREE.Vector2(SIM_RESOLUTION, SIM_RESOLUTION) },
          uScreenSize: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uVideoSize: {
            value: new THREE.Vector2(video.videoWidth || 1280, video.videoHeight || 720),
          },
          uRefractionStrength: { value: 0.055 },
        },
        depthWrite: false,
        depthTest: false,
      })

      const simulationScene = new THREE.Scene()
      simulationScene.add(new THREE.Mesh(geometry, simulationMaterial))

      const dropScene = new THREE.Scene()
      dropScene.add(new THREE.Mesh(geometry, dropMaterial))

      const renderScene = new THREE.Scene()
      renderScene.add(new THREE.Mesh(geometry, renderMaterial))

      // Update video dimensions once metadata loads
      video.addEventListener('loadedmetadata', () => {
        renderMaterial.uniforms.uVideoSize.value.set(video.videoWidth, video.videoHeight)
      })

      // Initialize render targets to zero
      renderer.setClearColor(new THREE.Color(0x000000), 0)
      renderer.setRenderTarget(renderTargetA)
      renderer.clear()
      renderer.setRenderTarget(renderTargetB)
      renderer.clear()
      renderer.setRenderTarget(null)

      // Mouse tracking
      const mousePos = { x: 0.5, y: 0.5 }
      const prevDropPos = { x: 0.5, y: 0.5 }
      let mouseDirty = false
      let pendingClick = false

      const handleMouseMove = (e: MouseEvent) => {
        mousePos.x = e.clientX / window.innerWidth
        mousePos.y = 1.0 - e.clientY / window.innerHeight
        mouseDirty = true
      }

      const handleClick = () => {
        pendingClick = true
      }

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0]
        if (!touch) return
        mousePos.x = touch.clientX / window.innerWidth
        mousePos.y = 1.0 - touch.clientY / window.innerHeight
        mouseDirty = true
      }

      const handleTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0]
        if (!touch) return
        mousePos.x = touch.clientX / window.innerWidth
        mousePos.y = 1.0 - touch.clientY / window.innerHeight
        pendingClick = true
      }

      // Window-level listeners: ripples respond to any interaction across the page.
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
      window.addEventListener('click', handleClick, { passive: true })
      window.addEventListener('touchmove', handleTouchMove, { passive: true })
      window.addEventListener('touchstart', handleTouchStart, { passive: true })

      const handleResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderMaterial.uniforms.uScreenSize.value.set(window.innerWidth, window.innerHeight)
      }

      window.addEventListener('resize', handleResize)

      const addDrop = (x: number, y: number, radius: number, strength: number) => {
        dropMaterial.uniforms.uTexture.value = renderTargetA.texture
        dropMaterial.uniforms.uCenter.value.set(x, y)
        dropMaterial.uniforms.uRadius.value = radius
        dropMaterial.uniforms.uStrength.value = strength

        renderer.setRenderTarget(renderTargetB)
        renderer.render(dropScene, camera)

        const temp = renderTargetA
        renderTargetA = renderTargetB
        renderTargetB = temp
      }

      const clock = new THREE.Clock()
      let animationId: number
      let isInViewport = true
      let frameCount = 0

      const animate = () => {
        if (!isInViewport) return

        frameCount++

        // Step 1: Mouse/touch drops
        if (pendingClick) {
          addDrop(mousePos.x, mousePos.y, 0.04, 0.25)
          prevDropPos.x = mousePos.x
          prevDropPos.y = mousePos.y
          pendingClick = false
          mouseDirty = false
        } else if (mouseDirty) {
          const dx = mousePos.x - prevDropPos.x
          const dy = mousePos.y - prevDropPos.y
          if (Math.sqrt(dx * dx + dy * dy) > MIN_DROP_DISTANCE) {
            addDrop(mousePos.x, mousePos.y, 0.02, 0.07)
            prevDropPos.x = mousePos.x
            prevDropPos.y = mousePos.y
          }
          mouseDirty = false
        }

        // Ambient ripples
        if (frameCount % AMBIENT_DROP_INTERVAL === 0) {
          addDrop(0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6, 0.025, 0.04)
        }

        // Step 2: Wave simulation
        simulationMaterial.uniforms.uTexture.value = renderTargetA.texture
        renderer.setRenderTarget(renderTargetB)
        renderer.render(simulationScene, camera)

        const temp = renderTargetA
        renderTargetA = renderTargetB
        renderTargetB = temp

        // Step 3: Render video + ripple distortion to screen
        renderMaterial.uniforms.uSimulation.value = renderTargetA.texture
        renderer.setRenderTarget(null)
        renderer.render(renderScene, camera)

        animationId = requestAnimationFrame(animate)
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const wasInViewport = isInViewport
          isInViewport = entries[0].isIntersecting
          if (isInViewport && !wasInViewport) {
            clock.start()
            video.play().catch(() => {})
            animationId = requestAnimationFrame(animate)
          } else if (!isInViewport && wasInViewport) {
            clock.stop()
            video.pause()
          }
        },
        { threshold: 0 }
      )

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }

      animate()

      cleanup = () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('click', handleClick)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchstart', handleTouchStart)
        window.removeEventListener('resize', handleResize)
        observer.disconnect()
        cancelAnimationFrame(animationId)
        video.pause()
        video.remove()
        videoTexture.dispose()
        renderTargetA.dispose()
        renderTargetB.dispose()
        geometry.dispose()
        simulationMaterial.dispose()
        dropMaterial.dispose()
        renderMaterial.dispose()
        renderer.dispose()
        if (containerRef.current?.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement)
        }
      }
    }

    initThree()

    return () => {
      cleanup?.()
    }
  }, [isMounted])

  return (
    <div ref={containerRef} className="z-0 pointer-events-none absolute -inset-1 bg-[#c8d4b8]" />
  )
}
