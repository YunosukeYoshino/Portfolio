import { bindings, type CloudflareConfig, defineConfig } from 'cf/config'

/**
 * Wrangler environments are selected through ctx.mode and the cf --mode flag.
 * @see https://developers.cloudflare.com/workers/wrangler/environments/
 */
export default defineConfig((ctx): CloudflareConfig => {
  switch (ctx.mode) {
    case 'preview': {
      return {
        worker: {
          name: 'yunosuke-portfolio-preview',
          compatibilityDate: '2026-03-17',
          compatibilityFlags: ['nodejs_compat'],
          entrypoint: './dist/server/entry.mjs',
          workersDev: true,
          observability: {
            enabled: true,
          },
          env: {
            ASSETS: bindings.assets(),
          },
        },
      }
    }
    default: {
      return {
        worker: {
          name: 'yunosuke-portfolio',
          compatibilityDate: '2026-03-17',
          compatibilityFlags: ['nodejs_compat'],
          entrypoint: './dist/server/entry.mjs',
          workersDev: true,
          observability: {
            enabled: true,
          },
          env: {
            ASSETS: bindings.assets(),
            MICROCMS_SERVICE_DOMAIN: bindings.secret(),
            MICROCMS_API_KEY: bindings.secret(),
            RESEND_API_KEY: bindings.secret(),
          },
        },
      }
    }
  }
})
