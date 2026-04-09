import type { CSSProperties } from 'react'

type NavigationDirection = 'forward' | 'back'

const NAV_FORWARD_TYPE = 'nav-forward'
const NAV_BACK_TYPE = 'nav-back'
const ROUTE_FADE_TYPE = 'route-fade'

export const PAGE_SHELL_TRANSITION_NAME = 'page-shell'
export const SITE_HEADER_TRANSITION_NAME = 'site-header'
export const SITE_FOOTER_TRANSITION_NAME = 'site-footer'

export function createDirectionalViewTransition(
  direction: NavigationDirection,
  extraTypes: string[] = []
) {
  return {
    types: [direction === 'forward' ? NAV_FORWARD_TYPE : NAV_BACK_TYPE, ...extraTypes],
  }
}

export const fadeViewTransition = {
  types: [ROUTE_FADE_TYPE],
}

export function createSharedElementStyle(name: string, transitionClass?: string): CSSProperties {
  return (
    transitionClass
      ? {
          viewTransitionName: name,
          viewTransitionClass: transitionClass,
        }
      : {
          viewTransitionName: name,
        }
  ) as CSSProperties
}

export function createPersistentTransitionStyle(name: string): CSSProperties {
  return { viewTransitionName: name } as CSSProperties
}

export function getArticleImageTransitionStyle(slug: string): CSSProperties {
  return createSharedElementStyle(`article-image-${slug}`, 'article-image-morph')
}

export function getArticleTitleTransitionStyle(slug: string): CSSProperties {
  return createSharedElementStyle(`article-title-${slug}`)
}
