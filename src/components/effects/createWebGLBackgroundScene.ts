import {
  AMBIENT_DROP_INTERVAL,
  dropFragmentShader,
  MIN_DROP_DISTANCE,
  renderFragmentShader,
  SIM_RESOLUTION,
  simulationFragmentShader,
  vertexShader,
} from './webglBackgroundShaders'

export async function createWebGLBackgroundScene(container: HTMLDivElement): Promise<() => void> {
  const THREE = await import('three')

  const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
  const getContainerSize = () => {
    const rect = container.getBoundingClientRect()

    return {
      width: Math.max(Math.round(rect.width || window.innerWidth), 1),
      height: Math.max(Math.round(rect.height || window.innerHeight), 1),
    }
  }

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
    // Autoplay may be blocked; video will start on user interaction.
  }

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance',
  })
  const initialSize = getContainerSize()
  const rendererSize = { ...initialSize }

  renderer.setSize(initialSize.width, initialSize.height, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.autoClear = false

  const canvas = renderer.domElement
  canvas.style.display = 'block'
  canvas.style.position = 'absolute'
  canvas.style.inset = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  container.appendChild(canvas)

  const isWebGL2 = renderer.capabilities.isWebGL2
  const hasHalfFloat = isWebGL2 || renderer.extensions.get('OES_texture_half_float')

  if (!hasHalfFloat) {
    renderer.dispose()
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement)
    }
    video.pause()
    video.remove()
    return () => {}
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
      uScreenSize: { value: new THREE.Vector2(initialSize.width, initialSize.height) },
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

  const handleLoadedMetadata = () => {
    renderMaterial.uniforms.uVideoSize.value.set(video.videoWidth, video.videoHeight)
  }

  video.addEventListener('loadedmetadata', handleLoadedMetadata)

  renderer.setClearColor(new THREE.Color(0x000000), 0)
  renderer.setRenderTarget(renderTargetA)
  renderer.clear()
  renderer.setRenderTarget(renderTargetB)
  renderer.clear()
  renderer.setRenderTarget(null)

  const mousePos = { x: 0.5, y: 0.5 }
  const previousDropPosition = { x: 0.5, y: 0.5 }
  let mouseDirty = false
  let pendingClick = false
  let resizeFrame = 0
  let animationId = 0
  let isInViewport = true
  let frameCount = 0

  const setPointerPosition = (clientX: number, clientY: number) => {
    const rect = container.getBoundingClientRect()

    if (rect.width <= 0 || rect.height <= 0) return

    mousePos.x = clamp01((clientX - rect.left) / rect.width)
    mousePos.y = 1 - clamp01((clientY - rect.top) / rect.height)
  }

  const handleMouseMove = (event: MouseEvent) => {
    setPointerPosition(event.clientX, event.clientY)
    mouseDirty = true
  }

  const handleClick = () => {
    pendingClick = true
  }

  const handleTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0]
    if (!touch) return
    setPointerPosition(touch.clientX, touch.clientY)
    mouseDirty = true
  }

  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0]
    if (!touch) return
    setPointerPosition(touch.clientX, touch.clientY)
    pendingClick = true
  }

  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('click', handleClick, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
  window.addEventListener('touchstart', handleTouchStart, { passive: true })

  const syncRendererSize = () => {
    const { width, height } = getContainerSize()

    if (width === rendererSize.width && height === rendererSize.height) {
      return
    }

    rendererSize.width = width
    rendererSize.height = height
    renderer.setSize(width, height, false)
    renderMaterial.uniforms.uScreenSize.value.set(width, height)
  }

  const handleResize = () => {
    window.cancelAnimationFrame(resizeFrame)
    resizeFrame = window.requestAnimationFrame(syncRendererSize)
  }

  window.addEventListener('resize', handleResize)
  const resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(container)

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

  const animate = () => {
    if (!isInViewport) return

    frameCount += 1

    if (pendingClick) {
      addDrop(mousePos.x, mousePos.y, 0.04, 0.25)
      previousDropPosition.x = mousePos.x
      previousDropPosition.y = mousePos.y
      pendingClick = false
      mouseDirty = false
    } else if (mouseDirty) {
      const dx = mousePos.x - previousDropPosition.x
      const dy = mousePos.y - previousDropPosition.y
      if (Math.sqrt(dx * dx + dy * dy) > MIN_DROP_DISTANCE) {
        addDrop(mousePos.x, mousePos.y, 0.02, 0.07)
        previousDropPosition.x = mousePos.x
        previousDropPosition.y = mousePos.y
      }
      mouseDirty = false
    }

    if (frameCount % AMBIENT_DROP_INTERVAL === 0) {
      addDrop(0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6, 0.025, 0.04)
    }

    simulationMaterial.uniforms.uTexture.value = renderTargetA.texture
    renderer.setRenderTarget(renderTargetB)
    renderer.render(simulationScene, camera)

    const temp = renderTargetA
    renderTargetA = renderTargetB
    renderTargetB = temp

    renderMaterial.uniforms.uSimulation.value = renderTargetA.texture
    renderer.setRenderTarget(null)
    renderer.render(renderScene, camera)

    animationId = window.requestAnimationFrame(animate)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const wasInViewport = isInViewport
      isInViewport = entries[0]?.isIntersecting ?? false

      if (isInViewport && !wasInViewport) {
        void video.play().catch(() => {})
        animationId = window.requestAnimationFrame(animate)
      } else if (!isInViewport && wasInViewport) {
        video.pause()
      }
    },
    { threshold: 0 }
  )

  observer.observe(container)
  animate()

  return () => {
    video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('click', handleClick)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('resize', handleResize)
    resizeObserver.disconnect()
    observer.disconnect()
    window.cancelAnimationFrame(animationId)
    window.cancelAnimationFrame(resizeFrame)
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

    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement)
    }
  }
}
