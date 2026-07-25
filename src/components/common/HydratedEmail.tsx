'use client'

import { useEffect, useMemo, useState } from 'react'

interface HydratedEmailLinkProps {
  readonly user: string
  readonly domain: string
  /** Shown before hydration when no `label` is given (keeps the address away from scrapers). */
  readonly placeholder: string
  /** Fixed link text. When omitted the address itself is rendered after hydration. */
  readonly label?: string
  readonly className?: string
}

function useHydratedEmail(user: string, domain: string) {
  const [isHydrated, setIsHydrated] = useState(false)
  const email = useMemo(() => `${user}@${domain}`, [domain, user])

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return {
    email,
    isHydrated,
  }
}

export function HydratedEmailLink({
  user,
  domain,
  placeholder,
  label,
  className = '',
}: HydratedEmailLinkProps) {
  const { email, isHydrated } = useHydratedEmail(user, domain)
  const text = label ?? (isHydrated ? email : placeholder)

  return (
    <a
      href={isHydrated ? `mailto:${email}` : '/contact/'}
      className={className}
      aria-label={isHydrated ? email : placeholder}
    >
      {text}
    </a>
  )
}
