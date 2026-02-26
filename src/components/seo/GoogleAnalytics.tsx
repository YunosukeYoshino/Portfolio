'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const GA_TRACKING_ID = 'G-7C1W0FTJR6'

export default function GoogleAnalytics() {
  useEffect(() => {
    // Skip in development or if already loaded
    if (typeof window === 'undefined') return
    if (window.gtag) return

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || []
    const dataLayer = window.dataLayer
    window.gtag = (...args: unknown[]) => {
      dataLayer.push(args)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_TRACKING_ID)

    // Load GA script
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
    script.async = true
    document.head.appendChild(script)
  }, [])

  return null
}
