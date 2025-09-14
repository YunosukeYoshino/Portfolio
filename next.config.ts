import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable typed routes for type-safe links
  typedRoutes: true,

  // External packages for server components
  serverExternalPackages: ['shiki'],

  // Site configuration
  env: {
    SITE_URL: 'https://yunosukeyoshino.com',
  },

  // Image optimization with custom loader for Cloudflare Pages
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js',
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Styling
  sassOptions: {
    includePaths: ['./src/styles'],
  },

  // Build optimization - static export for Cloudflare Pages
  output: 'export',

  // Deployment optimization
  ...(process.env.NODE_ENV === 'production' && {
    generateBuildId: async () => {
      return process.env.CF_PAGES_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || 'development'
    },
  }),
}

export default nextConfig
