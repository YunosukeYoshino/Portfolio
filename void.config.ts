import { defineConfig } from 'void/config'

// Worker settings for `void deploy` (direct Cloudflare target).
// Void merges this with inferred bindings into the generated
// `.void-wrangler.jsonc` consumed by @astrojs/cloudflare.
export default defineConfig({
  cloudflare: {
    name: 'yunosuke-portfolio',
    compatibility_date: '2026-03-17',
    // nodejs_compat: existing SSR requirement; nodejs_als: required by
    // void/* runtime helpers in Astro framework mode.
    compatibility_flags: ['nodejs_compat', 'nodejs_als'],
    workers_dev: true,
    routes: [{ pattern: 'yunosukeyoshino.com', custom_domain: true }],
  },
})
