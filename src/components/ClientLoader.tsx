'use client'

import { useEffect, useState } from 'react'

export default function ClientLoader() {
  // Start with false to match server-side render (no loader in SSG)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Show loader only after mount (client-side only)
    setIsMounted(true)
    setIsLoading(true)

    // Hide loader after a short delay to ensure content is ready
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Don't render anything on server or before mount
  if (!isMounted || !isLoading) return null

  return (
    <div className="loader" suppressHydrationWarning>
      <div className="loader-circle" />
    </div>
  )
}
