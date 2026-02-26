'use client'

import { useEffect, useRef, useState } from 'react'

interface TextScrambleProps {
  text: string
  className?: string
}

const CHARS = '!<>-_\\/[]{}—=+*^?#________'

export default function TextScramble({ text, className = '' }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text)
  const frameRef = useRef<number | undefined>(undefined)

  const scramble = () => {
    let iteration = 0
    const maxIterations = text.length

    if (frameRef.current) clearInterval(frameRef.current)
    frameRef.current = window.setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((letter, index) => {
            if (index < iteration) return letter
            if (letter === ' ') return ' '
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )

      if (iteration >= maxIterations) {
        clearInterval(frameRef.current)
        setDisplayText(text)
      }
      iteration += 1 / 4
    }, 20)
  }

  useEffect(() => {
    return () => clearInterval(frameRef.current)
  }, [])

  return (
    <span className={`inline-block whitespace-nowrap ${className}`} onMouseEnter={scramble}>
      {displayText}
    </span>
  )
}
