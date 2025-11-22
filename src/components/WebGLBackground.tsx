'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform vec2 iResolution;
  uniform float iTime;
  uniform float uScroll;
  varying vec2 vUv;

  #define MAX_STEPS 50
  #define MAX_DIST 100.0
  #define SURF_DIST 0.01

  vec3 hash( vec3 p ) {
    p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
            dot(p,vec3(269.5,183.3,246.1)),
            dot(p,vec3(113.5,271.9,124.6)));
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
  }

  float noise( in vec3 p ) {
    vec3 i = floor( p );
    vec3 f = fract( p );
    vec3 u = f*f*(3.0-2.0*f);
    return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ),
                        dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                    mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ),
                        dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ),
                        dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                    mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ),
                        dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 3; ++i) {
      v += a * noise(p);
      p.xy *= rot;
      p = p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  float sdSphere(vec3 p, float s) {
    return length(p) - s;
  }

  float GetDist(vec3 p) {
    vec3 q = p;
    float t = iTime * 0.4;

    float velocity = uScroll * 0.15;

    q.y /= (1.0 + abs(velocity) * 1.5);
    float squash = (1.0 + abs(velocity) * 0.4);
    q.x *= squash;
    q.z *= squash;

    float c = cos(t * 0.1);
    float s = sin(t * 0.1);
    mat2 m = mat2(c, -s, s, c);
    q.xz *= m;

    q += vec3(sin(t*0.5), cos(t*0.3), sin(t*0.7)) * 0.3;

    float sphere = sdSphere(q, 1.8);

    float scrollNoise = abs(velocity) * 4.0;
    float displacement = fbm(q * (1.2 + scrollNoise*0.2) + vec3(0.0, t * (0.8 + scrollNoise), 0.0));

    displacement = (displacement * 2.0 - 1.0) * (0.7 + scrollNoise * 0.4);

    return sphere + displacement * 0.6;
  }

  float RayMarch(vec3 ro, vec3 rd) {
    float dO = 0.0;
    for(int i=0; i<MAX_STEPS; i++) {
      vec3 p = ro + rd * dO;
      float dS = GetDist(p);
      dO += dS;
      if(dO > MAX_DIST || abs(dS) < SURF_DIST) break;
    }
    return dO;
  }

  vec3 GetNormal(vec3 p) {
    float d = GetDist(p);
    vec2 e = vec2(0.01, 0.0);
    vec3 n = d - vec3(
      GetDist(p-e.xyy),
      GetDist(p-e.yxy),
      GetDist(p-e.yyx)
    );
    return normalize(n);
  }

  vec3 GetEnvColor(vec3 rd) {
    float y = rd.y * 0.5 + 0.5;
    vec3 col = vec3(0.95, 0.95, 0.94);
    float horizon = smoothstep(0.4, 0.6, y);
    col = mix(vec3(0.88, 0.88, 0.9), col, horizon);
    col += vec3(0.05) * y;
    return col;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    // Adjust camera distance based on aspect ratio for mobile devices
    float aspect = iResolution.x / iResolution.y;
    float cameraDistance = 5.0;

    // If aspect ratio is less than 1.0 (portrait/mobile), move camera back
    if (aspect < 1.0) {
      // Smoothly scale camera distance to prevent sphere from being cut off
      cameraDistance = 5.0 + (1.0 - aspect) * 3.0;
    }

    vec3 ro = vec3(0.0, 0.0, cameraDistance);
    vec3 rd = normalize(vec3(uv, -1.0));

    float d = RayMarch(ro, rd);

    vec3 col = GetEnvColor(rd);

    if(d < MAX_DIST) {
      vec3 p = ro + rd * d;
      vec3 n = GetNormal(p);
      vec3 r = reflect(rd, n);

      float aberration = 0.03 + abs(uScroll) * 0.02;

      float ior = 1.25;
      vec3 refractedRd = refract(rd, n, 1.0/ior);
      if(length(refractedRd) == 0.0) refractedRd = r;

      vec3 refractCol = GetEnvColor(refractedRd);
      float beer = exp(-d * 0.15);
      vec3 absorptionColor = vec3(0.96, 0.97, 0.99);
      refractCol *= beer * absorptionColor;

      float fresnel = pow(1.0 + dot(rd, n), 3.0);
      fresnel = clamp(fresnel, 0.0, 1.0);

      float spec = pow(max(0.0, dot(r, normalize(vec3(1.0, 1.0, 1.0)))), 8.0) * 0.6;
      float rim = pow(max(0.0, dot(r, normalize(vec3(-1.0, 0.0, 0.5)))), 4.0) * 0.3;

      vec3 reflectCol = GetEnvColor(r);

      col = mix(refractCol, reflectCol, fresnel * 0.7 + 0.15);
      col += vec3(1.0) * (spec + rim);

      vec3 colR = GetEnvColor(refract(rd, n, 1.0/((ior - aberration))));
      vec3 colB = GetEnvColor(refract(rd, n, 1.0/((ior + aberration))));

      float splitIntensity = fresnel * 0.5 + abs(uScroll) * 0.03;
      col = mix(col, vec3(colR.r, col.g, colB.b), splitIntensity);

      float edge = 1.0 - dot(-rd, n);
      col *= 1.0 - pow(edge, 4.0) * 0.1;
    }

    col = pow(col, vec3(0.4545));
    gl_FragColor = vec4(col, 1.0);
  }
`

export default function WebGLBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const targetScrollRef = useRef(0)
  const currentScrollRef = useRef(0)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(1) // Fixed at 1 for better performance
    containerRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uScroll: { value: 0 },
      },
      depthWrite: false,
      depthTest: false,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height)
      material.uniforms.iResolution.value.set(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Scroll velocity tracking
    let lastScrollY = window.scrollY
    let lastScrollTime = Date.now()

    const updateScrollVelocity = () => {
      const currentScrollY = window.scrollY
      const currentTime = Date.now()
      const timeDiff = (currentTime - lastScrollTime) / 1000
      const scrollDiff = currentScrollY - lastScrollY

      if (timeDiff > 0) {
        targetScrollRef.current = scrollDiff / timeDiff / 1000
      }

      lastScrollY = currentScrollY
      lastScrollTime = currentTime
    }

    const scrollInterval = setInterval(updateScrollVelocity, 50)

    // Animation loop with visibility check
    const clock = new THREE.Clock()
    let animationId: number

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Smooth interpolation for shader
      currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.1

      material.uniforms.iTime.value = elapsedTime
      material.uniforms.uScroll.value = currentScrollRef.current

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      clearInterval(scrollInterval)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-screen z-[1] pointer-events-none"
    />
  )
}
