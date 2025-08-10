import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import ClientLoader from '@/components/ClientLoader'
import CustomCursor from '@/components/CustomCursor'
import { cn } from '@/lib/utils'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Yunosuke Yoshino Portfolio',
    template: '%s | Yunosuke Yoshino Portfolio',
  },
  description: 'This is the portfolio of Yunosuke Yoshino',
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
    title: 'Yunosuke Yoshino Portfolio',
    description: 'This is the portfolio of Yunosuke Yoshino',
    images: [
      {
        url: '/assets/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Yunosuke Yoshino Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yunosuke Yoshino Portfolio',
    description: 'This is the portfolio of Yunosuke Yoshino',
    images: ['/assets/images/og-image.jpg'],
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
    <html lang="ja" className={cn(inter.variable, 'antialiased')} data-scroll-behavior="smooth">
      <head>
        <meta name="format-detection" content="email=no,telephone=no,address=no" />
        <meta name="theme-color" content="#000000e6" />
        <Script
          id="typesquare"
          src="//typesquare.com/3/tsst/script/ja/typesquare.js?641200e6ba2c4c9ea7f95bf7ac1e02e5"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <canvas id="gradient-canvas" data-transition-in></canvas>
        <CustomCursor />
        <ClientLoader />
        <div className="p-wrapper">{children}</div>

        <GoogleAnalytics gaId="G-7C1W0FTJR6" />
      </body>
    </html>
  )
}
