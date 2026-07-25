// @ts-check
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

// Content Layer loader (src/content.config.ts) が process.env 経由で
// microCMS credentials を読めるように、.env / .env.local を先に展開しておく。
// プレフィックス問わず全変数を取り込む。
const envMode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
Object.assign(process.env, loadEnv(envMode, process.cwd(), ''))

// https://astro.build/config
export default defineConfig({
  // SSG by default; per-route `export const prerender = false` opts into
  // on-demand server rendering (contact API, LLM markdown).
  output: 'static',
  adapter: cloudflare(),
  integrations: [react()],
  // /article は最新記事一覧（1 ページ目）へ統一。
  redirects: {
    '/article': '/article/page/1',
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
