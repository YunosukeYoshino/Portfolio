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
      },
    }),
    // react's vite plugin must come after start's vite plugin
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
