'use client'

import { extend, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

// Extend drei with post-processing effects
extend({ EffectComposer, RenderPass, UnrealBloomPass, FilmPass, SMAAPass })

export default function PostProcessing() {
  const { gl, scene, camera, size } = useThree()
  const _composerRef = useRef<EffectComposer>()

  const composer = useMemo(() => {
    const composer = new EffectComposer(gl)

    // Main render pass
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // Bloom effect for cinematic glow
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      1.2, // strength
      0.5, // radius
      0.85 // threshold
    )
    composer.addPass(bloomPass)

    // Film grain for vintage cinematic look
    const filmPass = new FilmPass(
      0.1, // noise intensity
      0.025, // scanline intensity
      648, // scanline count
      false // grayscale
    )
    composer.addPass(filmPass)

    // Anti-aliasing for smooth edges
    const smaaPass = new SMAAPass(size.width, size.height)
    composer.addPass(smaaPass)

    return composer
  }, [gl, scene, camera, size])

  useFrame(() => {
    if (composer) {
      composer.render()
    }
  }, 1)

  return null
}
