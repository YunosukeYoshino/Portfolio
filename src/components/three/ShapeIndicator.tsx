'use client'

import { Html } from '@react-three/drei'
import { useMemo } from 'react'
import { useScrollProgress } from './hooks/useScrollProgress'
import { easing } from './utils/easing'

const shapeNames = ['ICOSAHEDRON', 'OCTAHEDRON', 'TETRAHEDRON', 'DODECAHEDRON', 'CONE']

export default function ShapeIndicator() {
  const scrollData = useScrollProgress()

  // 現在の形状インデックスと名前を計算
  const { currentIndex, nextIndex, blendFactor, currentName, nextName } = useMemo(() => {
    const progress = scrollData.progress
    const totalShapes = shapeNames.length

    const rawIndex = progress * (totalShapes - 1)
    const currentIndex = Math.floor(rawIndex)
    const nextIndex = Math.min(currentIndex + 1, totalShapes - 1)
    const blend = rawIndex - currentIndex
    const smoothBlend = easing.easeInOutCubic(blend)

    return {
      currentIndex,
      nextIndex,
      blendFactor: smoothBlend,
      currentName: shapeNames[currentIndex],
      nextName: shapeNames[nextIndex],
    }
  }, [scrollData.progress])

  return (
    <Html
      position={[0, -3, 0]}
      center
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div className="text-center">
        {/* 現在の形状名 */}
        <div
          className="text-white/80 text-lg font-mono font-bold tracking-wider transition-opacity duration-500"
          style={{
            opacity: 1 - blendFactor,
            transform: `translateY(${blendFactor * -20}px)`,
          }}
        >
          {currentName}
        </div>

        {/* 次の形状名（フェードイン） */}
        {currentIndex !== nextIndex && (
          <div
            className="text-white/80 text-lg font-mono font-bold tracking-wider absolute top-0 left-1/2 transform -translate-x-1/2 transition-opacity duration-500"
            style={{
              opacity: blendFactor,
              transform: `translateX(-50%) translateY(${(1 - blendFactor) * 20}px)`,
            }}
          >
            {nextName}
          </div>
        )}

        {/* プログレスバー */}
        <div className="mt-4 w-32 h-0.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-green-400 transition-all duration-300 ease-out"
            style={{
              width: `${scrollData.progress * 100}%`,
              boxShadow: scrollData.isScrolling ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
            }}
          />
        </div>

        {/* 形状インジケーターのドット */}
        <div className="flex justify-center mt-3 space-x-2">
          {shapeNames.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : index === nextIndex && blendFactor > 0.3
                    ? 'bg-white/60 scale-110'
                    : 'bg-white/30'
              }`}
              style={{
                boxShadow: index === currentIndex ? '0 0 8px rgba(255,255,255,0.6)' : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </Html>
  )
}
