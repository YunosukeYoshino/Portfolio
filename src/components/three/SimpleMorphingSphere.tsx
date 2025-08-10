'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export default function SimpleMorphingSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  // シンプルな球体ジオメトリ
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.5, 4)
    const positions = geo.attributes.position.array as Float32Array
    const noise = []

    // 頂点ノイズを追加
    for (let i = 0; i < positions.length; i += 3) {
      const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
      const distance = vertex.length()
      noise.push(distance, distance, distance)
    }

    geo.setAttribute('aNoise', new THREE.Float32BufferAttribute(noise, 1))
    return geo
  }, [])

  // シンプルなシェーダーマテリアル（スクロール依存を削除）
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
          
          // より滑らかな時間ベースの自動変形
          float noise1 = snoise(pos * 0.6 + uTime * 0.2) * uMorph;
          float noise2 = snoise(pos * 1.2 + uTime * 0.15) * uMorph * 0.6;
          float noise3 = snoise(pos * 2.0 + uTime * 0.1) * uMorph * 0.3;
          
          // より穏やかな変形を適用
          pos += normal * noise1 * 0.25;
          pos += normal * noise2 * 0.15;
          pos += normal * noise3 * 0.08;
          
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
          // より滑らかなカラーブレンディング
          vec3 baseColor = mix(uColor1, uColor2, (vPosition.y + 1.0) * 0.5);
          
          // 穏やかな時間変化
          float timeVariation = sin(vNoise * 2.0 + uTime * 0.5) * 0.3 + 0.5;
          vec3 color = mix(baseColor, uColor3, timeVariation);
          
          // より滑らかなフレネル効果
          float fresnel = pow(1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 1.8);
          color += fresnel * 0.25;
          
          // 色の安定化（突然の変化を防ぐ）
          color = clamp(color, 0.0, 1.0);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    })
  }, [])

  useFrame((state, delta) => {
    if (meshRef.current && materialRef.current) {
      // より滑らかで予測可能な回転パターン
      const time = state.clock.elapsedTime

      // 滑らかな正弦波ベースの回転（フリッカーを防ぐ）
      meshRef.current.rotation.x = Math.sin(time * 0.15) * 0.15 + Math.cos(time * 0.08) * 0.05
      meshRef.current.rotation.y += delta * 0.3 // 一定の回転速度
      meshRef.current.rotation.z = Math.sin(time * 0.12) * 0.08

      // 滑らかな浮遊感
      meshRef.current.position.y = Math.sin(time * 0.6) * 0.1 + Math.cos(time * 0.4) * 0.05

      // シェーダーユニフォームの滑らかな更新
      materialRef.current.uniforms.uTime.value = time

      // より滑らかなモーフィング（急激な変化を避ける）
      const morphBase = 0.5
      const morphVariation = 0.2
      materialRef.current.uniforms.uMorph.value =
        morphBase +
        Math.sin(time * 0.25) * morphVariation +
        Math.cos(time * 0.15) * morphVariation * 0.3
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} material={shaderMaterial}>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  )
}
