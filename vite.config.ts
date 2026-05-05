import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      srcDirectory: 'src',
      prerender: {
        // Enable static site generation
        enabled: true,
        // Generate /page/index.html format for clean URLs
        autoSubfolderIndex: true,
        // Automatically discover static routes
        autoStaticPathsDiscovery: true,
        // Crawl links to find all pages
        crawlLinks: true,
        // Retry failed prerenders
        retryCount: 2,
        retryDelay: 1000,
        // Filter out paths with hashes
        filter: ({ path }) => !path.includes('#'),
      },
      pages: [
        {
          path: '/sitemap.xml',
          prerender: { enabled: true, outputPath: 'sitemap.xml' },
        },
      ],
    }),
    // React's Vite plugin must come after TanStack Start's plugin.
    viteReact(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor'
          }
          // TanStack packages
          if (id.includes('node_modules/@tanstack/')) {
            return 'tanstack-vendor'
          }
          // Three.js (WebGL)
          if (id.includes('node_modules/three')) {
            return 'three-vendor'
          }
          // GSAP (animations)
          if (id.includes('node_modules/gsap')) {
            return 'gsap-vendor'
          }
          // Lenis (smooth scroll)
          if (id.includes('node_modules/lenis')) {
            return 'lenis-vendor'
          }
          // Shiki (syntax highlighting)
          if (id.includes('node_modules/shiki')) {
            return 'shiki-vendor'
          }
          // Forms
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/zod')) {
            return 'forms-vendor'
          }
          // Icons
          if (id.includes('node_modules/lucide-react')) {
            return 'icons-vendor'
          }
        },
      },
    },
  },
})
