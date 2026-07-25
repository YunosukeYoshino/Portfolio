import { createRootRoute, HeadContent, Link, Outlet, Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { WebMCPProvider } from '@/components/effects/WebMCPProvider'
import SitePage from '@/components/layout/SitePage'
import GoogleAnalytics from '@/components/seo/GoogleAnalytics'
import appCss from '@/globals.css?url'
import {
  DEFAULT_OG_IMAGE_URL,
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  SITE_NAME,
} from '@/lib/siteMetadata'
import { createDirectionalViewTransition } from '@/lib/viewTransitions'

const CHUNK_RECOVERY_VERSION = 'v2'

export const Route = createRootRoute({
  notFoundComponent: NotFoundPage,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'format-detection', content: 'email=no,telephone=no,address=no' },
      { name: 'theme-color', content: '#F4F1EA' },
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
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
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
        <WebMCPProvider />
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function NotFoundPage() {
  return (
    <RootDocument>
      <SitePage>
        <section className="mb-[var(--sectiongap)]">
          <p className="label-mono mb-5">404</p>
          <h1 className="mb-4 text-[26px] leading-snug font-semibold tracking-[-0.01em]">
            ページが見つかりませんでした
          </h1>
          <p className="mb-8 text-base text-ink-body">
            URLが変更されたか、削除された可能性があります。
          </p>
          <Link
            to="/"
            viewTransition={createDirectionalViewTransition('back')}
            className="lnk text-base"
          >
            ← Index
          </Link>
        </section>
      </SitePage>
    </RootDocument>
  )
}
