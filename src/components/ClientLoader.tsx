'use client'

import { useEffect, useState } from 'react'

export default function ClientLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Hide loader after a short delay to ensure content is ready
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className={`p-loader ${!isLoading ? 'is-hidden' : ''}`}>
      <div className="p-loader__circle"></div>
    </div>
  )
}
