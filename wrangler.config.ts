import { defineWranglerConfig } from 'wrangler/experimental-config'

export default defineWranglerConfig((ctx) => {
  switch (ctx.mode) {
    case 'preview': {
      return {
        types: {
          generate: false,
        },
        assetsDirectory: 'dist/client',
      }
    }
    default: {
      return {
        types: {
          generate: false,
        },
        assetsDirectory: 'dist/client',
      }
    }
  }
})
