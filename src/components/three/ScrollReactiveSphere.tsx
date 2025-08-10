'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useScrollProgress } from './hooks/useScrollProgress'

export default function ScrollReactiveSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const scrollData = useScrollProgress()

  // Create adaptive geometry based on scroll position
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

  // Enhanced shader material that reacts to scroll
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0.5 },
        uScrollProgress: { value: 0 },
        uScrollVelocity: { value: 0 },
        uColor1: { value: new THREE.Color('#ff6b35') },
        uColor2: { value: new THREE.Color('#f7931e') },
        uColor3: { value: new THREE.Color('#004d40') },
        uScrollColor: { value: new THREE.Color('#00ff88') },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uMorph;
        uniform float uScrollProgress;
        uniform float uScrollVelocity;
        attribute float aNoise;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vNoise;
        varying float vScrollEffect;
        
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
          
          // Scroll-reactive effects
          float scrollMorph = uMorph + uScrollProgress * 0.8;
          float velocityEffect = uScrollVelocity * 2.0;
          vScrollEffect = uScrollProgress;
          
          vec3 pos = position;
          
          // Base noise with scroll influence
          float noise1 = snoise(pos * (0.8 + uScrollProgress * 0.5) + uTime * 0.5) * scrollMorph;
          float noise2 = snoise(pos * (1.5 + velocityEffect) + uTime * 0.3) * scrollMorph * 0.5;
          
          // Scroll-based deformation
          float scrollDeform = sin(uScrollProgress * 3.14159) * 0.3;
          
          pos += normal * noise1 * (0.3 + scrollDeform);
          pos += normal * noise2 * (0.2 + velocityEffect * 0.1);
          
          // Scroll-based scaling
          float scrollScale = 1.0 + uScrollProgress * 0.2;
          pos *= scrollScale;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScrollProgress;
        uniform float uScrollVelocity;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uScrollColor;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vNoise;
        varying float vScrollEffect;
        
        void main() {
          // Base color mixing
          vec3 color = mix(uColor1, uColor2, (vPosition.y + 1.0) * 0.5);
          color = mix(color, uColor3, sin(vNoise * 3.0 + uTime) * 0.5 + 0.5);
          
          // Scroll-reactive color changes
          vec3 scrollColor = mix(color, uScrollColor, vScrollEffect * 0.6);
          color = mix(color, scrollColor, uScrollProgress);
          
          // Velocity-based intensity
          float intensity = 1.0 + uScrollVelocity * 1.5;
          color *= intensity;
          
          // Fresnel effect enhanced by scroll
          float fresnel = pow(1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 2.0);
          fresnel *= (1.0 + uScrollProgress * 0.5);
          color += fresnel * 0.3 * (1.0 + uScrollVelocity);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    })
  }, [])

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      // Base rotation affected by scroll
      const scrollRotationSpeed = 0.2 + scrollData.progress * 0.3
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.2 + scrollData.progress * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * scrollRotationSpeed
      meshRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + scrollData.velocity * 0.5

      // Position changes based on scroll
      meshRef.current.position.y = Math.sin(scrollData.progress * Math.PI) * 0.5

      // Update shader uniforms
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uScrollProgress.value = scrollData.progress
      materialRef.current.uniforms.uScrollVelocity.value = scrollData.velocity
      materialRef.current.uniforms.uMorph.value =
        Math.sin(state.clock.elapsedTime * 0.4) * 0.3 + 0.5 + scrollData.progress * 0.4
    }
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={shaderMaterial}>
        <primitive object={shaderMaterial} ref={materialRef} attach="material" />
      </mesh>

      {/* Scroll progress indicator */}
      {scrollData.isScrolling && (
        <mesh position={[2, 2, 0]} scale={0.1}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color={`hsl(${scrollData.progress * 120}, 70%, 50%)`} />
        </mesh>
      )}
    </group>
  )
}
