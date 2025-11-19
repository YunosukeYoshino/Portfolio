import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Manrope } from 'next/font/google'
import ClientLoader from '@/components/ClientLoader'
import CustomCursor from '@/components/CustomCursor'
import LenisProvider from '@/components/LenisProvider'
import { cn } from '@/lib/utils'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'Yunosuke Yoshino｜Portfolio',
    template: '%s | Yunosuke Yoshino',
  },
  description: 'Frontend Engineer specializing in React, Next.js, TypeScript',
  keywords: ['portfolio', 'web development', 'frontend', 'Yunosuke Yoshino'],
  authors: [{ name: 'Yunosuke Yoshino', url: 'https://yunosukeyoshino.com' }],
  creator: 'Yunosuke Yoshino',
  publisher: 'Yunosuke Yoshino',
  metadataBase: new URL('https://yunosukeyoshino.com'),
  alternates: {
    canonical: 'https://yunosukeyoshino.com',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://yunosukeyoshino.com',
    siteName: 'Yunosuke Yoshino Portfolio',
    title: 'Yunosuke Yoshino｜Portfolio',
    description: 'Frontend Engineer specializing in React, Next.js, TypeScript',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yunosuke Yoshino｜Portfolio',
    description: 'Frontend Engineer specializing in React, Next.js, TypeScript',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'eP52H3GTHVunNESnXhZ0XTxke4SSzgyVgyCbOQFCFcc',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/assets/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        url: '/assets/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        url: '/assets/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
      },
    ],
    apple: [{ url: '/assets/icons/apple-touch-icon.png' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={cn(inter.variable, manrope.variable, jetbrainsMono.variable, 'antialiased')}
      data-scroll-behavior="smooth"
    >
      <head>
        <meta name="format-detection" content="email=no,telephone=no,address=no" />
        <meta name="theme-color" content="#F3F3F1" />
      </head>
      <body>
        <CustomCursor />
        <ClientLoader />
        <LenisProvider>
          <div>{children}</div>
        </LenisProvider>

        <GoogleAnalytics gaId="G-7C1W0FTJR6" />
      </body>
    </html>
  )
}
