'use client'

import { useEffect, useRef, useState } from 'react'

// Shared vertex shader for all passes
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

// Simulation fragment shader -- 2D wave equation
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

// Drop fragment shader -- injects ripple at mouse position
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

// Render fragment shader -- distorts background texture using heightmap
const renderFragmentShader = `
  uniform sampler2D uSimulation;
  uniform sampler2D uBackground;
  uniform vec2 uResolution;
  uniform vec2 uSimResolution;
  uniform float uRefractionStrength;
  uniform float uTime;
  uniform float uBgLoaded;
  varying vec2 vUv;

  void main() {
    vec2 texelSize = 1.0 / uSimResolution;

    float dx = texture2D(uSimulation, vUv + vec2(texelSize.x, 0.0)).r
             - texture2D(uSimulation, vUv - vec2(texelSize.x, 0.0)).r;
    float dy = texture2D(uSimulation, vUv + vec2(0.0, texelSize.y)).r
             - texture2D(uSimulation, vUv - vec2(0.0, texelSize.y)).r;

    // Chromatic aberration offset from ripple intensity
    float rippleIntensity = length(vec2(dx, dy));
    float aberration = rippleIntensity * 0.008;

    // Distorted UV with chromatic aberration per channel
    vec2 baseOffset = vec2(dx, dy) * uRefractionStrength;
    float r = texture2D(uBackground, vUv + baseOffset * (1.0 + aberration)).r;
    float g = texture2D(uBackground, vUv + baseOffset).g;
    float b = texture2D(uBackground, vUv + baseOffset * (1.0 - aberration)).b;
    vec3 bgColor = vec3(r, g, b);

    // Fallback gradient when texture not yet loaded
    if (uBgLoaded < 0.5) {
      vec2 distortedUv = vUv + baseOffset;
      float vignette = length(distortedUv - 0.5) * 0.8;
      bgColor = mix(vec3(0.953, 0.953, 0.945), vec3(0.90, 0.90, 0.92), vignette);
    }

    // Water surface specular highlight
    vec3 normal = normalize(vec3(dx * 4.0, dy * 4.0, 1.0));
    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    float specular = pow(max(0.0, dot(normal, lightDir)), 32.0);
    bgColor += vec3(1.0) * specular * 0.08;

    // Subtle caustic tint at ripple edges
    bgColor += vec3(dx * 0.15, (dx + dy) * 0.08, dy * 0.15) * 0.2;

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

      const renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance',
      })

      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(1)
      renderer.autoClear = false
      containerRef.current.appendChild(renderer.domElement)

      // Capability check for float textures (required for wave simulation)
      const isWebGL2 = renderer.capabilities.isWebGL2
      const hasHalfFloat = isWebGL2 || renderer.extensions.get('OES_texture_half_float')

      if (!hasHalfFloat) {
        // HalfFloat textures not supported -- simulation requires negative values
        // that UnsignedByteType cannot store. Fall back to static background.
        renderer.dispose()
        if (containerRef.current?.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement)
        }
        return
      }

      const targetType = THREE.HalfFloatType

      // Create ping-pong render targets
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

      // Simulation material
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

      // Drop material
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

      // Load background texture
      const textureLoader = new THREE.TextureLoader()
      let bgTexture: InstanceType<typeof THREE.Texture> | null = null

      // Render material
      const renderMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: renderFragmentShader,
        uniforms: {
          uSimulation: { value: null },
          uBackground: { value: null },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uSimResolution: { value: new THREE.Vector2(SIM_RESOLUTION, SIM_RESOLUTION) },
          uRefractionStrength: { value: 0.04 },
          uTime: { value: 0 },
          uBgLoaded: { value: 0.0 },
        },
        depthWrite: false,
        depthTest: false,
      })

      textureLoader.load('/images/hero-bg.png', (texture) => {
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        bgTexture = texture
        renderMaterial.uniforms.uBackground.value = texture
        renderMaterial.uniforms.uBgLoaded.value = 1.0
      })

      // Create scenes with meshes
      const simulationScene = new THREE.Scene()
      const simulationMesh = new THREE.Mesh(geometry, simulationMaterial)
      simulationScene.add(simulationMesh)

      const dropScene = new THREE.Scene()
      const dropMesh = new THREE.Mesh(geometry, dropMaterial)
      dropScene.add(dropMesh)

      const renderScene = new THREE.Scene()
      const renderMesh = new THREE.Mesh(geometry, renderMaterial)
      renderScene.add(renderMesh)

      // Initialize both render targets to zero (prevent noise on first frame)
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

      const handleClick = (e: MouseEvent) => {
        mousePos.x = e.clientX / window.innerWidth
        mousePos.y = 1.0 - e.clientY / window.innerHeight
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
      // Container has pointer-events-none so hero text stays interactive.
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
      window.addEventListener('click', handleClick, { passive: true })
      window.addEventListener('touchmove', handleTouchMove, { passive: true })
      window.addEventListener('touchstart', handleTouchStart, { passive: true })

      const handleResize = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        renderer.setSize(width, height)
        renderMaterial.uniforms.uResolution.value.set(width, height)
      }

      window.addEventListener('resize', handleResize)

      // Helper to add a drop and swap targets
      const addDrop = (x: number, y: number, radius: number, strength: number) => {
        dropMaterial.uniforms.uTexture.value = renderTargetA.texture
        dropMaterial.uniforms.uCenter.value.set(x, y)
        dropMaterial.uniforms.uRadius.value = radius
        dropMaterial.uniforms.uStrength.value = strength

        renderer.setRenderTarget(renderTargetB)
        renderer.render(dropScene, camera)

        // Swap
        const temp = renderTargetA
        renderTargetA = renderTargetB
        renderTargetB = temp
      }

      // Animation loop
      const clock = new THREE.Clock()
      let animationId: number
      let isInViewport = true
      let frameCount = 0

      const animate = () => {
        if (!isInViewport) return

        const elapsedTime = clock.getElapsedTime()
        frameCount++

        // Step 1: Add drops from mouse interaction
        if (pendingClick) {
          addDrop(mousePos.x, mousePos.y, 0.03, 0.2)
          prevDropPos.x = mousePos.x
          prevDropPos.y = mousePos.y
          pendingClick = false
          mouseDirty = false
        } else if (mouseDirty) {
          const dx = mousePos.x - prevDropPos.x
          const dy = mousePos.y - prevDropPos.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > MIN_DROP_DISTANCE) {
            addDrop(mousePos.x, mousePos.y, 0.015, 0.05)
            prevDropPos.x = mousePos.x
            prevDropPos.y = mousePos.y
          }

          mouseDirty = false
        }

        // Ambient ripples
        if (frameCount % AMBIENT_DROP_INTERVAL === 0) {
          const rx = 0.2 + Math.random() * 0.6
          const ry = 0.2 + Math.random() * 0.6
          addDrop(rx, ry, 0.02, 0.03)
        }

        // Step 2: Simulate wave propagation
        simulationMaterial.uniforms.uTexture.value = renderTargetA.texture
        renderer.setRenderTarget(renderTargetB)
        renderer.render(simulationScene, camera)

        // Swap
        const temp = renderTargetA
        renderTargetA = renderTargetB
        renderTargetB = temp

        // Step 3: Render to screen
        renderMaterial.uniforms.uSimulation.value = renderTargetA.texture
        renderMaterial.uniforms.uTime.value = elapsedTime
        renderer.setRenderTarget(null)
        renderer.render(renderScene, camera)

        animationId = requestAnimationFrame(animate)
      }

      // Intersection Observer for viewport pause
      const observer = new IntersectionObserver(
        (entries) => {
          const wasInViewport = isInViewport
          isInViewport = entries[0].isIntersecting
          if (isInViewport && !wasInViewport) {
            clock.start()
            animationId = requestAnimationFrame(animate)
          } else if (!isInViewport && wasInViewport) {
            clock.stop()
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
        renderTargetA.dispose()
        renderTargetB.dispose()
        geometry.dispose()
        simulationMaterial.dispose()
        dropMaterial.dispose()
        renderMaterial.dispose()
        bgTexture?.dispose()
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
    <div
      ref={containerRef}
      className="z-0 pointer-events-none absolute left-0 top-0 h-screen w-full"
    />
  )
}
