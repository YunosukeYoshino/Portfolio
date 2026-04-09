import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouterState,
} from '@tanstack/react-router'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import ClientLoader from '@/components/providers/ClientLoader'
import GoogleAnalytics from '@/components/seo/GoogleAnalytics'

const CHUNK_RECOVERY_VERSION = 'v2'

import CustomCursor from '@/components/effects/CustomCursor'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import LenisProvider from '@/components/providers/LenisProvider'
import appCss from '@/globals.css?url'
import {
  DEFAULT_OG_IMAGE_URL,
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  SITE_NAME,
} from '@/lib/siteMetadata'

export const Route = createRootRoute({
  notFoundComponent: NotFoundPage,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'format-detection', content: 'email=no,telephone=no,address=no' },
      { name: 'theme-color', content: '#F3F3F1' },
      {
        name: 'description',
        content: DEFAULT_SITE_DESCRIPTION,
      },
      { name: 'author', content: 'Yunosuke Yoshino' },
      { name: 'robots', content: 'index, follow' },
      {
        name: 'google-site-verification',
        content: 'eP52H3GTHVunNESnXhZ0XTxke4SSzgyVgyCbOQFCFcc',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'ja_JP' },
      { property: 'og:site_name', content: SITE_NAME },
      {
        property: 'og:description',
        content: DEFAULT_SITE_DESCRIPTION,
      },
      {
        property: 'og:image',
        content: DEFAULT_OG_IMAGE_URL,
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@YunosukeYoshino' },
      { name: 'twitter:title', content: DEFAULT_SITE_TITLE },
      {
        name: 'twitter:description',
        content: DEFAULT_SITE_DESCRIPTION,
      },
      {
        name: 'twitter:image',
        content: DEFAULT_OG_IMAGE_URL,
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'icon', href: '/favicon.ico' },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '72x72',
        href: '/assets/icons/icon-72x72.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/assets/icons/icon-96x96.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '128x128',
        href: '/assets/icons/icon-128x128.png',
      },
      {
        rel: 'apple-touch-icon',
        href: '/assets/icons/apple-touch-icon.png',
      },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@400;700&family=JetBrains+Mono:wght@400&family=Manrope:wght@400;600&display=swap',
      },
    ],
  }),
  component: RootComponent,
})

function TransitionLayer() {
  const layerRef = useRef<HTMLDivElement>(null)
  const columnsRef = useRef<HTMLDivElement[]>([])
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!pathname || !layerRef.current || typeof window === 'undefined') return

    setIsVisible(true)

    let isDisposed = false
    let gsapContext: { revert: () => void } | undefined
    const fallbackTimer = window.setTimeout(() => {
      if (!isDisposed) {
        setIsVisible(false)
      }
    }, 1500)

    void import('gsap')
      .then(({ default: gsap }) => {
        if (isDisposed) return

        gsapContext = gsap.context(() => {
          // Hide the overlay even if a later route transition hits a stale chunk.
          gsap.fromTo(
            columnsRef.current,
            { y: '0%' },
            {
              y: '-100%',
              duration: 0.8,
              ease: 'expo.inOut',
              stagger: 0.1,
              onComplete: () => {
                if (!isDisposed) {
                  setIsVisible(false)
                }
              },
            }
          )
        }, layerRef)
      })
      .catch(() => {
        if (!isDisposed) {
          setIsVisible(false)
        }
      })

    return () => {
      isDisposed = true
      window.clearTimeout(fallbackTimer)
      if (gsapContext) gsapContext.revert()
    }
  }, [pathname])

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) columnsRef.current[i] = el
          }}
          className="h-full flex-1 bg-[#111]"
        />
      ))}
    </div>
  )
}

function RootComponent() {
  return (
    <RootDocument>
      <TransitionLayer />
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // suppressHydrationWarning on html/head/body to prevent hydration errors
    // caused by browser extensions (e.g., immersive-translate) injecting elements
    <html lang="ja" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <HeadContent />
        <script suppressHydrationWarning>{`
          (() => {
            const buildAssets = Array.from(document.querySelectorAll('link[href^="/assets/"]'))
              .map((node) => node.getAttribute('href') ?? '')
              .filter(Boolean)
              .sort()
              .join('|');
            const key = 'chunk-reload:${CHUNK_RECOVERY_VERSION}:' + buildAssets;

            const hasReloaded = () => sessionStorage.getItem(key) === '1';
            const reloadOnce = () => {
              if (hasReloaded()) return;
              sessionStorage.setItem(key, '1');
              window.location.reload();
            };

            const isChunkLoadError = (message) =>
              /Failed to fetch dynamically imported module|error loading dynamically imported module|Expected a JavaScript-or-Wasm module script/i.test(
                message ?? ''
              );

            window.addEventListener(
              'error',
              (event) => {
                const target = event.target;
                const assetUrl =
                  target instanceof HTMLScriptElement || target instanceof HTMLLinkElement
                    ? target.src || target.href || ''
                    : '';

                if (assetUrl.includes('/assets/')) {
                  reloadOnce();
                  return;
                }

                if (isChunkLoadError(event.message)) {
                  reloadOnce();
                }
              },
              true
            );

            window.addEventListener('unhandledrejection', (event) => {
              const reason = event.reason;
              const message = typeof reason === 'string' ? reason : reason?.message || '';

              if (isChunkLoadError(message)) {
                reloadOnce();
              }
            });
          })();
        `}</script>
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <GoogleAnalytics />
        <LenisProvider>
          <ClientLoader />
          <CustomCursor />
          {children}
        </LenisProvider>
        <Scripts />
      </body>
    </html>
  )
}

function NotFoundPage() {
  return (
    <RootDocument>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="mb-4 text-8xl font-bold tracking-tight text-black">404</h1>
          <p className="mb-8 text-xl text-gray-600">ページが見つかりませんでした</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 border border-black px-6 py-3 text-sm font-medium uppercase tracking-wide text-black transition-all duration-300 hover:bg-black hover:text-white"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>ホームに戻る</span>
          </Link>
        </div>
      </main>
      <Footer />
    </RootDocument>
  )
}
