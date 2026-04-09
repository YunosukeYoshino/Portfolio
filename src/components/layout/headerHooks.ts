import { useEffect, useRef, useState } from 'react'

export type HeaderSectionId = 'about' | 'works' | 'articles' | 'contact'

export function useCurrentTimeLabel() {
  const [currentTime, setCurrentTime] = useState<string | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      setCurrentTime(timeString)
    }

    updateTime()

    const msUntilNextMinute = (60 - new Date().getSeconds()) * 1000
    let intervalId: number | null = null
    const timeoutId = window.setTimeout(() => {
      updateTime()
      intervalId = window.setInterval(updateTime, 60_000)
    }, msUntilNextMinute)

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId) {
        window.clearInterval(intervalId)
      }
    }
  }, [])

  return currentTime
}

export function useHeaderVisibility(threshold: number = 50) {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (ticking) return

      ticking = true
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        setIsVisible(currentScrollY < lastScrollY.current || currentScrollY < threshold)
        lastScrollY.current = currentScrollY
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return isVisible
}

export function useLockedBodyScroll(isLocked: boolean, offset: number = 100) {
  const lockedScrollY = useRef(0)
  const pendingSectionRef = useRef<HeaderSectionId | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const html = document.documentElement
    const body = document.body

    if (!isLocked) {
      return
    }

    lockedScrollY.current = window.scrollY

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${lockedScrollY.current}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    return () => {
      html.style.overflow = ''
      body.style.overflow = ''
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.width = ''

      const targetId = pendingSectionRef.current
      if (!targetId) {
        window.scrollTo(0, lockedScrollY.current)
        return
      }

      pendingSectionRef.current = null

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const target = document.getElementById(targetId)
          if (!target) return

          const top = target.getBoundingClientRect().top + window.scrollY - offset
          window.scrollTo({ top, behavior: 'smooth' })
        })
      })
    }
  }, [isLocked, offset])

  const scheduleSectionScroll = (section: HeaderSectionId) => {
    pendingSectionRef.current = section
  }

  return { scheduleSectionScroll }
}
