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
})
