// 滑らかなイージング関数のユーティリティ

export type EasingFunction = (t: number) => number

// Cubic Bezier easing functions
export const easing = {
  // 標準的なイージング
  linear: (t: number) => t,

  // In/Out系（加速→減速）
  easeInOut: (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),

  // Elastic easing (バウンス効果)
  easeInOutElastic: (t: number) => {
    const c5 = (2 * Math.PI) / 4.5
    return t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? -(2 ** (20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
          : (2 ** (-20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1
  },

  // Back easing (オーバーシュート)
  easeInOutBack: (t: number) => {
    const c1 = 1.70158
    const c2 = c1 * 1.525
    return t < 0.5
      ? ((2 * t) ** 2 * ((c2 + 1) * 2 * t - c2)) / 2
      : ((2 * t - 2) ** 2 * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2
  },

  // Exponential easing (指数関数的変化)
  easeInOutExpo: (t: number) =>
    t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2,
}

// 複数の値を滑らかに補間
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

// 値を指定範囲にマップ
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  easingFn: EasingFunction = easing.linear
): number {
  const normalized = Math.max(0, Math.min(1, (value - inMin) / (inMax - inMin)))
  const eased = easingFn(normalized)
  return outMin + eased * (outMax - outMin)
}
