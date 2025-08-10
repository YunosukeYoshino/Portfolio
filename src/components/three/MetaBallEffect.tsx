'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

interface MetaBallEffectProps {
  mousePosition?: { x: number; y: number }
  performanceMode?: 'high' | 'low'
}

export default function MetaBallEffect({
  mousePosition = { x: 0, y: 0 },
  performanceMode = 'high',
}: MetaBallEffectProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()

  // Automatic animated trail system
  const trailLength = 15
  const [pointerTrail] = useState(() =>
    Array.from({ length: trailLength }, () => new THREE.Vector2(0, 0))
  )

  // High-quality ray marching metaball shader based on original code
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
        uPointerTrail: { value: pointerTrail },
      },
      vertexShader: `
        varying vec2 vTexCoord;
        
        void main() {
          vTexCoord = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        
        const int TRAIL_LENGTH = 15;
        const float EPS = 1e-4;
        const int ITR = 16;
        const float PI = 3.14159265359;
        
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uPointerTrail[TRAIL_LENGTH];
        
        varying vec2 vTexCoord;
        
        float rnd3D(vec3 p) {
            return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);
        }
        
        float noise3D(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
        
            float a000 = rnd3D(i); // (0,0,0)
            float a100 = rnd3D(i + vec3(1.0, 0.0, 0.0)); // (1,0,0)
            float a010 = rnd3D(i + vec3(0.0, 1.0, 0.0)); // (0,1,0)
            float a110 = rnd3D(i + vec3(1.0, 1.0, 0.0)); // (1,1,0)
            float a001 = rnd3D(i + vec3(0.0, 0.0, 1.0)); // (0,0,1)
            float a101 = rnd3D(i + vec3(1.0, 0.0, 1.0)); // (1,0,1)
            float a011 = rnd3D(i + vec3(0.0, 1.0, 1.0)); // (0,1,1)
            float a111 = rnd3D(i + vec3(1.0, 1.0, 1.0)); // (1,1,1)
        
            vec3 u = f * f * (3.0 - 2.0 * f);
        
            float k0 = a000;
            float k1 = a100 - a000;
            float k2 = a010 - a000;
            float k3 = a001 - a000;
            float k4 = a000 - a100 - a010 + a110;
            float k5 = a000 - a010 - a001 + a011;
            float k6 = a000 - a100 - a001 + a101;
            float k7 = -a000 + a100 + a010 - a110 + a001 - a101 - a011 + a111;
        
            return k0 + k1 * u.x + k2 * u.y + k3 *u.z + k4 * u.x * u.y + k5 * u.y * u.z + k6 * u.z * u.x + k7 * u.x * u.y * u.z;
        }
        
        // Camera setup - move to main() function to avoid global initialization
        
        float smoothMin(float d1, float d2, float k) {
            float h = exp(-k * d1) + exp(-k * d2);
            return -log(h) / k;
        }
        
        vec3 translate(vec3 p, vec3 t) {
            return p - t;
        }
        
        float sdSphere(vec3 p, float s) {
            return length(p) - s;
        }
        
        float map(vec3 p) {
            float baseRadius = 0.12;
            float radius = baseRadius * float(TRAIL_LENGTH) * 0.08;
            float k = 3.5; // Smoother blending for organic feel
            float d = 1e5;
        
            for (int i = 0; i < TRAIL_LENGTH; i++) {
                float fi = float(i);
                vec2 pointerTrail = uPointerTrail[i];
                
                // Scale trail positions for screen-constrained distribution
                pointerTrail *= 1.5; // Moderate scaling to stay in bounds
                
                // Constrained Z movement for stability
                float zPos = sin(uTime + fi * 0.5) * 0.1; // Reduced Z range
                float sphere = sdSphere(
                        translate(p, vec3(pointerTrail, zPos)),
                        radius - baseRadius * fi
                    );
        
                d = smoothMin(d, sphere, k);
            }
        
            // CINEMATIC AMBIENT METABALLS with screen-constrained organic motion
            
            // Primary large mass (constrained to right side)
            float x1 = 1.2 + sin(uTime * 0.23) * 0.25 + cos(uTime * 0.31) * 0.12;
            float y1 = 0.6 + cos(uTime * 0.29) * 0.3 + sin(uTime * 0.37) * 0.15;
            // Ensure bounds: x1 = [0.8, 1.6], y1 = [0.1, 1.1]
            x1 = clamp(x1, 0.8, 1.6);
            y1 = clamp(y1, 0.1, 1.1);
            vec3 pos1 = vec3(x1, y1, sin(uTime * 0.19) * 0.08);
            float sphere1 = sdSphere(translate(p, pos1), 0.65 + sin(uTime * 0.41) * 0.12);
            d = smoothMin(d, sphere1, k);
            
            // Secondary flowing mass (constrained to left side)
            float x2 = -1.1 + cos(uTime * 0.27) * 0.35 + sin(uTime * 0.33) * 0.15;
            float y2 = -0.8 + sin(uTime * 0.25) * 0.25 + cos(uTime * 0.39) * 0.12;
            // Ensure bounds: x2 = [-1.6, -0.6], y2 = [-1.2, -0.4]
            x2 = clamp(x2, -1.6, -0.6);
            y2 = clamp(y2, -1.2, -0.4);
            vec3 pos2 = vec3(x2, y2, cos(uTime * 0.17) * 0.1);
            float sphere2 = sdSphere(translate(p, pos2), 0.7 + cos(uTime * 0.47) * 0.1);
            d = smoothMin(d, sphere2, k);
            
            // Tertiary organic mass (constrained to bottom center)
            float x3 = 0.1 + sin(uTime * 0.35) * 0.3 + cos(uTime * 0.21) * 0.2;
            float y3 = -1.3 + cos(uTime * 0.15) * 0.2 + sin(uTime * 0.43) * 0.15;
            // Ensure bounds: x3 = [-0.5, 0.8], y3 = [-1.7, -0.9]
            x3 = clamp(x3, -0.5, 0.8);
            y3 = clamp(y3, -1.7, -0.9);
            vec3 pos3 = vec3(x3, y3, sin(uTime * 0.13) * 0.06);
            float sphere3 = sdSphere(translate(p, pos3), 0.5 + sin(uTime * 0.53) * 0.08);
            d = smoothMin(d, sphere3, k);
        
            return d;
        }
        
        vec3 generateNormal(vec3 p) {
            return normalize(vec3(
                    map(p + vec3(EPS, 0.0, 0.0)) - map(p + vec3(-EPS, 0.0, 0.0)),
                    map(p + vec3(0.0, EPS, 0.0)) - map(p + vec3(0.0, -EPS, 0.0)),
                    map(p + vec3(0.0, 0.0, EPS)) - map(p + vec3(0.0, 0.0, -EPS))
                ));
        }
        
        // CINEMATIC LIQUID SHADER SYSTEM
        vec3 cinematicLiquidShader(vec3 normal, vec3 rayDir, vec3 worldPos) {
            vec3 viewDir = -rayDir;
            vec3 reflectDir = reflect(rayDir, normal);
            
            // Multi-octave noise for realistic surface variation
            float noise1 = noise3D(worldPos * 1.5 + uTime * 0.3);
            float noise2 = noise3D(worldPos * 3.0 + uTime * 0.5) * 0.5;
            float noise3 = noise3D(worldPos * 6.0 - uTime * 0.2) * 0.25;
            float combinedNoise = noise1 + noise2 + noise3;
            
            // PROFESSIONAL LIGHTING MODEL
            
            // Key Light (main illumination)
            vec3 keyLight = normalize(vec3(2.0, 3.0, 4.0));
            float keyDot = max(dot(normal, keyLight), 0.0);
            vec3 keyReflect = reflect(-keyLight, normal);
            float keySpec = pow(max(dot(keyReflect, viewDir), 0.0), 120.0);
            
            // Fill Light (softer illumination)
            vec3 fillLight = normalize(vec3(-1.0, 0.5, 2.0));
            float fillDot = max(dot(normal, fillLight), 0.0) * 0.6;
            
            // Rim Light (edge definition)
            vec3 rimLight = normalize(vec3(0.0, -1.0, -1.0));
            float rimDot = max(dot(normal, rimLight), 0.0);
            float rimFactor = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
            
            // ADVANCED COLOR GRADING
            vec3 baseColor = vec3(1.0, 0.4, 0.1); // Core orange
            vec3 highlightColor = vec3(1.0, 0.7, 0.2); // Warm highlights  
            vec3 shadowColor = vec3(0.6, 0.15, 0.05); // Deep shadows
            vec3 rimColor = vec3(1.0, 0.9, 0.6); // Golden rim
            
            // SUBSURFACE SCATTERING simulation
            float subsurface = pow(max(dot(-keyLight, viewDir), 0.0), 2.0) * 0.4;
            vec3 subsurfaceColor = vec3(1.0, 0.6, 0.3) * subsurface;
            
            // FRESNEL with realistic IOR
            float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 1.5);
            
            // COLOR COMPOSITION
            vec3 diffuse = mix(shadowColor, baseColor, keyDot + fillDot);
            vec3 specular = highlightColor * (keySpec * 2.0);
            vec3 rim = rimColor * rimFactor * rimDot * 0.8;
            vec3 reflection = highlightColor * fresnel * 0.3;
            
            // FINAL COLOR with noise variation
            vec3 finalColor = diffuse + specular + rim + reflection + subsurfaceColor;
            finalColor = mix(finalColor, finalColor * 1.3, combinedNoise * 0.2);
            
            // CINEMATIC TONE MAPPING
            finalColor *= 2.0; // Increase exposure
            finalColor = finalColor / (finalColor + vec3(1.0)); // Reinhard tone mapping
            
            return finalColor;
        }
        
        void main() {
            // Perfect viewport fitting - no clipping
            vec2 p = (gl_FragCoord.xy - uResolution * 0.5) / (uResolution.y * 0.5);
        
            // Camera setup - optimized for full screen coverage
            vec3 origin = vec3(0.0, 0.0, 2.5);
            vec3 lookAt = vec3(0.0, 0.0, 0.0);
            vec3 cDir = normalize(lookAt - origin);
            vec3 cUp = vec3(0.0, 1.0, 0.0);
            vec3 cSide = cross(cDir, cUp);
        
            // Orthographic Camera
            vec3 ray = origin + cSide * p.x + cUp * p.y;
            vec3 rayDirection = cDir;
        
            float dist = 0.0;
        
            for (int i = 0; i < ITR; ++i) {
                dist = map(ray);
                ray += rayDirection * dist;
                if (dist < EPS) break;
            }
        
            vec3 color = vec3(0.0);
        
            if (dist < EPS) {
                vec3 normal = generateNormal(ray);
                color = cinematicLiquidShader(normal, rayDirection, ray);
            }
        
            // Enhanced gamma correction for cinematic look
            vec3 finalColor = pow(color, vec3(1.0 / 1.8)); // More natural gamma
        
            gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      depthTest: true,
    })
  }, [pointerTrail, viewport.height, viewport.width])

  // Update uniforms and animate trail automatically
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime

      // Update resolution for perfect viewport fitting (handles resize)
      materialRef.current.uniforms.uResolution.value.set(state.size.width, state.size.height)

      // CINEMATIC ORGANIC FLOW SYSTEM
      const time = state.clock.elapsedTime

      for (let i = 0; i < trailLength; i++) {
        const t = i / (trailLength - 1) // 0 to 1
        const lag = i * 0.08 // Organic delay
        const currentTime = time - lag

        // Golden ratio spiral with breathing
        const golden = 1.618034
        const spiral = currentTime * 0.3
        const breathe = Math.sin(currentTime * 0.7) * 0.4 + 1

        // Multiple layered movements for organic feel with boundary constraints
        const safeZone = 1.3 // Keep within safe viewing area

        const primaryFlow = {
          x: Math.cos(spiral + t * golden * 2) * (safeZone * breathe * 0.8),
          y: Math.sin(spiral + t * golden * 2) * (safeZone * breathe * 0.7),
        }

        // Secondary turbulence (reduced range)
        const turbulence = {
          x: Math.sin(currentTime * 1.3 + t * 8) * 0.2,
          y: Math.cos(currentTime * 1.7 + t * 6) * 0.25,
        }

        // Tertiary micro-movements
        const micro = {
          x: Math.sin(currentTime * 3.1 + t * 12) * 0.08,
          y: Math.cos(currentTime * 2.9 + t * 10) * 0.1,
        }

        // Combine all layers with weight decay
        const weight = 0.8 ** i // Trailing effect
        let finalX = (primaryFlow.x + turbulence.x + micro.x) * weight
        let finalY = (primaryFlow.y + turbulence.y + micro.y) * weight

        // Smart boundary constraints with soft bounce
        const boundary = 1.6
        if (Math.abs(finalX) > boundary) {
          finalX = finalX > 0 ? boundary - 0.1 : -boundary + 0.1
          finalX += Math.sin(currentTime * 2.0 + i) * 0.05 // Add slight bounce
        }
        if (Math.abs(finalY) > boundary * 0.8) {
          finalY = finalY > 0 ? boundary * 0.8 - 0.1 : -boundary * 0.8 + 0.1
          finalY += Math.cos(currentTime * 2.3 + i) * 0.05 // Add slight bounce
        }

        pointerTrail[i].set(finalX, finalY)
      }

      materialRef.current.uniforms.uPointerTrail.value = pointerTrail
    }
  })

  // Create a plane geometry to render the ray-marched effect - perfectly sized to viewport
  const geometry = useMemo(() => {
    // Calculate plane size based on camera distance and FOV to ensure perfect fit
    const distance = 8 // Camera distance from ThreeScene.tsx
    const fov = 90 // FOV from ThreeScene.tsx
    const height = 2 * Math.tan((fov * Math.PI) / 180 / 2) * distance
    const width = height * (viewport.width / viewport.height)
    return new THREE.PlaneGeometry(width * 1.1, height * 1.1, 1, 1) // Slightly oversized to prevent gaps
  }, [viewport.width, viewport.height])

  return (
    <mesh ref={meshRef} geometry={geometry} material={shaderMaterial} position={[0, 0, 0]}>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  )
}
