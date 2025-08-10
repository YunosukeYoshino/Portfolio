'use client'

import { ContactShadows, Environment } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import InteractiveScene, { useMousePosition } from './InteractiveScene'
import MetaBallEffect from './MetaBallEffect'

// Abstract geometric shape with morphing capabilities
function _MorphingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  // Create complex geometry using mathematical functions
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.5, 4)
    const positions = geo.attributes.position.array as Float32Array
    const noise = []

    // Add vertex noise for organic deformation
    for (let i = 0; i < positions.length; i += 3) {
      const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
      const distance = vertex.length()
      noise.push(distance, distance, distance)
    }

    geo.setAttribute('aNoise', new THREE.Float32BufferAttribute(noise, 1))
    return geo
  }, [])

  // Custom shader material for cinematic rendering
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0.5 },
        uColor1: { value: new THREE.Color('#ff6b35') },
        uColor2: { value: new THREE.Color('#f7931e') },
        uColor3: { value: new THREE.Color('#004d40') },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uMorph;
        attribute float aNoise;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vNoise;
        
        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        
        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        
        vec4 permute(vec4 x) {
          return mod289(((x*34.0)+1.0)*x);
        }
        
        vec4 taylorInvSqrt(vec4 r) {
          return 1.79284291400159 - 0.85373472095314 * r;
        }
        
        float snoise(vec3 v) { 
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
          vPosition = position;
          vNormal = normal;
          vNoise = aNoise;
          
          vec3 pos = position;
          float noise1 = snoise(pos * 0.8 + uTime * 0.5) * uMorph;
          float noise2 = snoise(pos * 1.5 + uTime * 0.3) * uMorph * 0.5;
          
          pos += normal * noise1 * 0.3;
          pos += normal * noise2 * 0.2;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vNoise;
        
        void main() {
          vec3 color = mix(uColor1, uColor2, (vPosition.y + 1.0) * 0.5);
          color = mix(color, uColor3, sin(vNoise * 3.0 + uTime) * 0.5 + 0.5);
          
          float fresnel = pow(1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 2.0);
          color += fresnel * 0.3;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    })
  }, [])

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1

      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uMorph.value =
        Math.sin(state.clock.elapsedTime * 0.4) * 0.3 + 0.5
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} material={shaderMaterial}>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  )
}

// Particle system removed to focus on metaballs

// Floating geometric shapes
function _FloatingShapes() {
  const shapes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      scale: Math.random() * 0.3 + 0.1,
      rotationSpeed: Math.random() * 0.02 + 0.01,
      type: Math.floor(Math.random() * 3), // 0: box, 1: sphere, 2: octahedron
    }))
  }, [])

  return (
    <>
      {shapes.map((shape) => (
        <FloatingShape key={shape.id} {...shape} />
      ))}
    </>
  )
}

function FloatingShape({
  position,
  scale,
  rotationSpeed,
  type,
}: {
  position: [number, number, number]
  scale: number
  rotationSpeed: number
  type: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * rotationSpeed
      meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed * 0.7
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.5
    }
  })

  const geometry = useMemo(() => {
    switch (type) {
      case 0:
        return new THREE.BoxGeometry(1, 1, 1)
      case 1:
        return new THREE.SphereGeometry(0.5, 16, 16)
      case 2:
        return new THREE.OctahedronGeometry(0.6)
      default:
        return new THREE.BoxGeometry(1, 1, 1)
    }
  }, [type])

  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
      <meshStandardMaterial
        color="#ffffff"
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.3}
      />
    </mesh>
  )
}

// Wrapper component that uses mouse position context
function MetaBallEffectWrapper({ performanceMode }: { performanceMode: 'auto' | 'high' | 'low' }) {
  const mousePosition = useMousePosition()

  return (
    <MetaBallEffect
      mousePosition={mousePosition}
      performanceMode={performanceMode === 'low' ? 'low' : 'high'}
    />
  )
}

// Main scene component
export default function Scene({
  performanceMode = 'high',
}: {
  performanceMode?: 'auto' | 'high' | 'low'
}) {
  return (
    <InteractiveScene>
      {/* Adaptive lighting setup based on performance mode */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow={performanceMode !== 'low'}
        shadow-mapSize-width={
          performanceMode === 'low' ? 512 : performanceMode === 'high' ? 2048 : 1024
        }
        shadow-mapSize-height={
          performanceMode === 'low' ? 512 : performanceMode === 'high' ? 2048 : 1024
        }
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {performanceMode !== 'low' && (
        <>
          <spotLight
            position={[-10, 15, -5]}
            intensity={0.8}
            angle={0.3}
            penumbra={0.5}
            color="#ff6b35"
            castShadow={performanceMode === 'high'}
          />
          <pointLight position={[5, -5, 5]} intensity={0.6} color="#f7931e" />
        </>
      )}

      {/* Environment and atmosphere - simplified for low performance */}
      {performanceMode !== 'low' && <Environment preset="city" background={false} />}
      <fog attach="fog" args={['#000000', 8, performanceMode === 'low' ? 20 : 30]} />

      {/* Interactive MetaBall Effect */}
      <MetaBallEffectWrapper performanceMode={performanceMode} />

      {/* Focus on metaballs only - particles removed */}

      {/* Ground shadows - subtle and clean */}
      {performanceMode !== 'low' && (
        <ContactShadows
          position={[0, -3, 0]}
          opacity={0.2}
          scale={15}
          blur={1.5}
          far={3}
          color="#000000"
        />
      )}
    </InteractiveScene>
  )
}
