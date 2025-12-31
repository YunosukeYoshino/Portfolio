import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, HeadContent, Link, Outlet, Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import ClientLoader from '@/components/ClientLoader'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import LenisProvider from '@/components/LenisProvider'
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
        content: 'Frontend Engineer specializing in React, Next.js, TypeScript',
      },
      {
        name: 'keywords',
        content: 'portfolio, web development, frontend, Yunosuke Yoshino',
      },
      { name: 'author', content: 'Yunosuke Yoshino' },
      { name: 'robots', content: 'index, follow' },
      {
        name: 'google-site-verification',
        content: 'eP52H3GTHVunNESnXhZ0XTxke4SSzgyVgyCbOQFCFcc',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'ja_JP' },
      { property: 'og:url', content: 'https://yunosukeyoshino.com' },
      { property: 'og:site_name', content: 'Yunosuke Yoshino Portfolio' },
      {
        property: 'og:description',
        content: 'Frontend Engineer specializing in React, Next.js, TypeScript',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'canonical', href: 'https://yunosukeyoshino.com' },
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
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&display=swap',
      },
    ],
    scripts: [
      {
        src: 'https://www.googletagmanager.com/gtag/js?id=G-7C1W0FTJR6',
        async: true,
      },
      {
        children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-7C1W0FTJR6');`,
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
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
      </head>
      <body className="antialiased" suppressHydrationWarning>
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
