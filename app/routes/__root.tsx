import { createRootRoute } from '@tanstack/react-router'
import { Outlet, ScrollRestoration } from '@tanstack/react-router'
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start'
import type { ReactNode } from 'react'
import * as React from 'react'
import CustomCursor from '@/components/CustomCursor'
import ClientLoader from '@/components/ClientLoader'
import LenisProvider from '@/components/LenisProvider'
import { cn } from '@/lib/utils'
import '../src/app/globals.css'

// Font imports - we'll use system fonts for now since Next.js fonts won't work
const fontVariables = {
  inter: '--font-inter',
  manrope: '--font-manrope',
  jetbrainsMono: '--font-jetbrains-mono',
}

export const Route = createRootRoute({
  meta: () => [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      title: 'Yunosuke Yoshino｜Portfolio',
    },
    {
      name: 'description',
      content: 'Frontend Engineer specializing in React, Next.js, TypeScript',
    },
    {
      name: 'keywords',
      content: 'portfolio, web development, frontend, Yunosuke Yoshino',
    },
    {
      name: 'format-detection',
      content: 'email=no,telephone=no,address=no',
    },
    {
      name: 'theme-color',
      content: '#F3F3F1',
    },
  ],
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <Html lang="ja" className={cn('antialiased')} data-scroll-behavior="smooth">
      <Head>
        <Meta />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/assets/icons/icon-72x72.png" sizes="72x72" type="image/png" />
        <link rel="icon" href="/assets/icons/icon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/assets/icons/icon-128x128.png" sizes="128x128" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png" />
        <meta name="google-site-verification" content="eP52H3GTHVunNESnXhZ0XTxke4SSzgyVgyCbOQFCFcc" />
      </Head>
      <Body>
        <CustomCursor />
        <ClientLoader />
        <LenisProvider>
          <div>{children}</div>
        </LenisProvider>
        <ScrollRestoration />
        <Scripts />
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7C1W0FTJR6"
        />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Google Analytics requires inline script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7C1W0FTJR6');
            `,
          }}
        />
      </Body>
    </Html>
  )
}
