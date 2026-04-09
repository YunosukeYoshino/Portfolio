'use client'

import { useEffect, useMemo, useState } from 'react'
import TextScramble from '@/components/effects/TextScramble'

interface HydratedEmailTextProps {
  readonly user: string
  readonly domain: string
  readonly placeholder: string
  readonly scramble?: boolean
  readonly className?: string
}

interface HydratedEmailLinkProps {
  readonly user: string
  readonly domain: string
  readonly placeholder: string
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

export function HydratedEmailText({
  user,
  domain,
  placeholder,
  scramble = false,
  className = '',
}: HydratedEmailTextProps) {
  const { email, isHydrated } = useHydratedEmail(user, domain)

  if (!isHydrated) {
    return <span className={className}>{placeholder}</span>
  }

  if (scramble) {
    return <TextScramble text={email} className={className} />
  }

  return <span className={className}>{email}</span>
}

export function HydratedEmailLink({
  user,
  domain,
  placeholder,
  className = '',
}: HydratedEmailLinkProps) {
  const { email, isHydrated } = useHydratedEmail(user, domain)

  return (
    <a
      href={isHydrated ? `mailto:${email}` : '/contact/'}
      className={className}
      aria-label={isHydrated ? email : placeholder}
    >
      {isHydrated ? email : placeholder}
    </a>
  )
}
