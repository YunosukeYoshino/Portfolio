import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouterState,
} from '@tanstack/react-router'
import { type ReactNode, useEffect, useRef } from 'react'
import ClientLoader from '@/components/providers/ClientLoader'
import GoogleAnalytics from '@/components/seo/GoogleAnalytics'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

import CustomCursor from '@/components/effects/CustomCursor'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import LenisProvider from '@/components/providers/LenisProvider'
import appCss from '@/globals.css?url'

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
        content:
          'フロントエンドエンジニア Yunosuke Yoshinoのポートフォリオサイト。React, Next.js, TypeScriptを専門とし、ECサイトを中心としたモダンなWeb開発と技術記事を発信しています。',
      },
      { name: 'author', content: 'Yunosuke Yoshino' },
      { name: 'robots', content: 'index, follow' },
      {
        name: 'google-site-verification',
        content: 'eP52H3GTHVunNESnXhZ0XTxke4SSzgyVgyCbOQFCFcc',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'ja_JP' },
      { property: 'og:site_name', content: 'Yunosuke Yoshino Portfolio' },
      {
        property: 'og:description',
        content:
          'フロントエンドエンジニア Yunosuke Yoshinoのポートフォリオサイト。React, Next.js, TypeScriptを専門とし、ECサイトを中心としたモダンなWeb開発と技術記事を発信しています。',
      },
      {
        property: 'og:image',
        content: 'https://yunosukeyoshino.com/assets/og-image.png',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@YunosukeYoshino' },
      { name: 'twitter:title', content: 'Yunosuke Yoshino｜Portfolio' },
      {
        name: 'twitter:description',
        content:
          'フロントエンドエンジニア Yunosuke Yoshinoのポートフォリオサイト。React, Next.js, TypeScriptを専門とし、ECサイトを中心としたモダンなWeb開発と技術記事を発信しています。',
      },
      {
        name: 'twitter:image',
        content: 'https://yunosukeyoshino.com/assets/og-image.png',
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
  const _pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    if (!layerRef.current || typeof window === 'undefined') return

    let gsapContext: { revert: () => void } | undefined

    import('gsap').then(({ default: gsap }) => {
      gsapContext = gsap.context(() => {
        // Run staggered wipe whenever route changes
        gsap.fromTo(
          columnsRef.current,
          { y: '0%' },
          {
            y: '-100%',
            duration: 0.8,
            ease: 'expo.inOut',
            stagger: 0.1,
          }
        )
      })
    })

    return () => {
      if (gsapContext) gsapContext.revert()
    }
  }, [])

  return (
    <div ref={layerRef} className="fixed inset-0 z-[9999] pointer-events-none flex">
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
  const chunkRecoveryKey = `chunk-reload:${appCss}`

  return (
    // suppressHydrationWarning on html/head/body to prevent hydration errors
    // caused by browser extensions (e.g., immersive-translate) injecting elements
    <html lang="ja" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <HeadContent />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const key = ${JSON.stringify(chunkRecoveryKey)};

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
                  const message =
                    typeof reason === 'string' ? reason : reason?.message || '';

                  if (isChunkLoadError(message)) {
                    reloadOnce();
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <GoogleAnalytics />
        <QueryClientProvider client={queryClient}>
          <LenisProvider>
            <ClientLoader />
            <CustomCursor />
            {children}
          </LenisProvider>
        </QueryClientProvider>
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
