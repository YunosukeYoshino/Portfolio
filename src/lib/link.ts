/**
 * Link utilities for handling internal/external navigation
 */

/**
 * Determine if a URL is external (different origin)
 */
export function isExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url, 'https://placeholder.internal')
    return parsed.origin !== 'https://placeholder.internal'
  } catch {
    return false
  }
}

/**
 * Get link attributes for external URLs (opens in new tab with security attrs)
 */
export function getExternalLinkProps(url: string) {
  if (!isExternalUrl(url)) {
    return {}
  }

  return {
    target: '_blank' as const,
    rel: 'noopener noreferrer',
  }
}
