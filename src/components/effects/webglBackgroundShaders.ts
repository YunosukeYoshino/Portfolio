export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

export const simulationFragmentShader = `
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

export const dropFragmentShader = `
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

export const renderFragmentShader = `
  uniform sampler2D uSimulation;
  uniform sampler2D uBackground;
  uniform vec2 uSimResolution;
  uniform vec2 uScreenSize;
  uniform vec2 uVideoSize;
  uniform float uRefractionStrength;
  varying vec2 vUv;

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

export const SIM_RESOLUTION = 256
export const MIN_DROP_DISTANCE = 0.005
export const AMBIENT_DROP_INTERVAL = 90
