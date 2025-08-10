'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useScrollProgress } from './hooks/useScrollProgress'
import { easing, mapRange } from './utils/easing'

interface ShapeConfig {
  geometry: THREE.BufferGeometry
  name: string
  color: THREE.Color
  morphIntensity: number
}

export default function MorphingShape() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const scrollData = useScrollProgress()

  // 異なる形状の定義（スクロール進行度に応じて変化）
  const shapes = useMemo(
    (): ShapeConfig[] => [
      {
        geometry: new THREE.IcosahedronGeometry(1.5, 4),
        name: 'Sphere',
        color: new THREE.Color('#ff6b35'),
        morphIntensity: 0.3,
      },
      {
        geometry: new THREE.OctahedronGeometry(1.8, 2),
        name: 'Octahedron',
        color: new THREE.Color('#f7931e'),
        morphIntensity: 0.5,
      },
      {
        geometry: new THREE.TetrahedronGeometry(2.2, 1),
        name: 'Tetrahedron',
        color: new THREE.Color('#00ff88'),
        morphIntensity: 0.4,
      },
      {
        geometry: new THREE.DodecahedronGeometry(1.6, 0),
        name: 'Dodecahedron',
        color: new THREE.Color('#0066ff'),
        morphIntensity: 0.6,
      },
      {
        geometry: new THREE.ConeGeometry(1.5, 3, 8, 1),
        name: 'Cone',
        color: new THREE.Color('#ff0066'),
        morphIntensity: 0.2,
      },
    ],
    []
  )

  // 現在の形状インデックスとブレンド状態
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0)
  const [nextShapeIndex, setNextShapeIndex] = useState(1)
  const [blendFactor, setBlendFactor] = useState(0)

  // スクロール進行度に基づく形状変化の計算
  useEffect(() => {
    const progress = scrollData.progress
    const totalShapes = shapes.length

    // スクロール進行度を形状インデックスに変換（0-1 → 0-4の範囲）
    const rawIndex = progress * (totalShapes - 1)
    const currentIndex = Math.floor(rawIndex)
    const nextIndex = Math.min(currentIndex + 1, totalShapes - 1)
    const blend = rawIndex - currentIndex

    // 滑らかなブレンドファクターを計算
    const smoothBlend = easing.easeInOutCubic(blend)

    setCurrentShapeIndex(currentIndex)
    setNextShapeIndex(nextIndex)
    setBlendFactor(smoothBlend)
  }, [scrollData.progress, shapes.length])

  // 現在の形状設定を取得
  const currentShape = shapes[currentShapeIndex]
  const nextShape = shapes[nextShapeIndex]

  // 形状間での色の補間
  const interpolatedColor = useMemo(() => {
    const color = new THREE.Color()
    color.lerpColors(currentShape.color, nextShape.color, blendFactor)
    return color
  }, [currentShape.color, nextShape.color, blendFactor])

  // 動的ジオメトリの作成
  const geometry = useMemo(() => {
    const baseGeo = currentShape.geometry.clone()
    const positions = baseGeo.attributes.position.array as Float32Array
    const noise = []

    // 頂点ノイズを追加（形状変化用）
    for (let i = 0; i < positions.length; i += 3) {
      const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
      const distance = vertex.length()
      noise.push(distance, distance, distance)
    }

    baseGeo.setAttribute('aNoise', new THREE.Float32BufferAttribute(noise, 1))
    return baseGeo
  }, [currentShape.geometry])

  // 進化したシェーダーマテリアル
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uScrollVelocity: { value: 0 },
        uBlendFactor: { value: 0 },
        uMorphIntensity: { value: 0.3 },
        uCurrentColor: { value: new THREE.Color('#ff6b35') },
        uNextColor: { value: new THREE.Color('#f7931e') },
        uShapeIndex: { value: 0 },
        uTransition: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uScrollProgress;
        uniform float uScrollVelocity;
        uniform float uBlendFactor;
        uniform float uMorphIntensity;
        uniform float uShapeIndex;
        uniform float uTransition;
        
        attribute float aNoise;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vNoise;
        varying float vBlend;
        varying float vTransition;
        
        // Perlin noise function
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
        
        // Smooth step function
        float smoothstep3(float edge0, float edge1, float x) {
          float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
          return t * t * (3.0 - 2.0 * t);
        }
        
        void main() {
          vPosition = position;
          vNormal = normal;
          vNoise = aNoise;
          vBlend = uBlendFactor;
          vTransition = uTransition;
          
          vec3 pos = position;
          
          // 形状変化に基づくノイズの強度
          float morphStrength = uMorphIntensity * (1.0 + uBlendFactor * 0.5);
          
          // 複数レイヤーのノイズ
          float noise1 = snoise(pos * (0.8 + uScrollProgress * 0.3) + uTime * 0.4) * morphStrength;
          float noise2 = snoise(pos * (1.5 + uScrollVelocity) + uTime * 0.2) * morphStrength * 0.5;
          float noise3 = snoise(pos * 2.5 + uTime * 0.6) * morphStrength * 0.3;
          
          // 形状変化の滑らかな補間
          float transitionNoise = smoothstep3(0.3, 0.7, uBlendFactor) * 0.4;
          
          // 位置の変形
          pos += normal * (noise1 + noise2 + noise3 + transitionNoise);
          
          // スクロールベースのスケーリング（滑らか）
          float scrollScale = 1.0 + sin(uScrollProgress * 3.14159) * 0.15;
          pos *= scrollScale;
          
          // 形状変化時の追加効果
          float shapeTransition = sin(uBlendFactor * 3.14159) * 0.1;
          pos += normalize(pos) * shapeTransition;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScrollProgress;
        uniform float uScrollVelocity;
        uniform float uBlendFactor;
        uniform vec3 uCurrentColor;
        uniform vec3 uNextColor;
        uniform float uShapeIndex;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vNoise;
        varying float vBlend;
        varying float vTransition;
        
        // Smooth color mixing function
        vec3 smoothColorMix(vec3 color1, vec3 color2, float factor) {
          float smoothFactor = factor * factor * (3.0 - 2.0 * factor);
          return mix(color1, color2, smoothFactor);
        }
        
        void main() {
          // 基本的な色の補間（滑らか）
          vec3 baseColor = smoothColorMix(uCurrentColor, uNextColor, vBlend);
          
          // ノイズベースの色変化
          vec3 noiseColor = baseColor * (1.0 + sin(vNoise * 2.0 + uTime) * 0.2);
          
          // 形状変化時のエフェクト色
          vec3 transitionColor = mix(noiseColor, vec3(1.0, 1.0, 1.0), vBlend * 0.3);
          
          // スクロール速度による光の強度
          float intensity = 1.0 + uScrollVelocity * 2.0;
          transitionColor *= intensity;
          
          // フレネル効果（形状変化で強度変更）
          float fresnel = pow(1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 2.0);
          fresnel *= (1.0 + vBlend * 0.8);
          
          // 最終色の計算
          vec3 finalColor = transitionColor + fresnel * 0.4;
          
          // 形状変化時のグロー効果
          float glow = sin(vBlend * 3.14159) * 0.3;
          finalColor += glow;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
    })
  }, [])

  // アニメーションループ
  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      // 滑らかな回転（形状に応じて調整）
      const rotationSpeed = mapRange(blendFactor, 0, 1, 0.2, 0.5, easing.easeInOutQuad)

      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.2 + scrollData.progress * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1

      // 位置の滑らかな変化
      const targetY = mapRange(scrollData.progress, 0, 1, 0, 2, easing.easeInOutCubic)

      meshRef.current.position.y = Math.sin(targetY * Math.PI) * 0.5

      // シェーダーユニフォームの更新
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uScrollProgress.value = scrollData.progress
      materialRef.current.uniforms.uScrollVelocity.value = scrollData.velocity
      materialRef.current.uniforms.uBlendFactor.value = blendFactor
      materialRef.current.uniforms.uMorphIntensity.value = mapRange(
        blendFactor,
        0,
        1,
        currentShape.morphIntensity,
        nextShape.morphIntensity,
        easing.easeInOutCubic
      )
      materialRef.current.uniforms.uCurrentColor.value = currentShape.color
      materialRef.current.uniforms.uNextColor.value = nextShape.color
      materialRef.current.uniforms.uShapeIndex.value = currentShapeIndex
    }
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={shaderMaterial}>
        <primitive object={shaderMaterial} ref={materialRef} attach="material" />
      </mesh>

      {/* 形状変化インジケーター */}
      {scrollData.isScrolling && (
        <mesh position={[2.5, 2, 0]} scale={0.08}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={interpolatedColor} />
        </mesh>
      )}

      {/* 現在の形状名表示 */}
      <mesh position={[0, -2.5, 0]}>
        <planeGeometry args={[0.1, 0.1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}
