import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const workflowPath = resolve(import.meta.dir, '../../.github/workflows/deploy-gh-pages.yml')
const workflowSource = readFileSync(workflowPath, 'utf8')
const viteConfigPath = resolve(import.meta.dir, '../../vite.config.ts')
const viteConfigSource = readFileSync(viteConfigPath, 'utf8')
const wranglerConfigPath = resolve(import.meta.dir, '../../wrangler.toml')
const wranglerConfigSource = readFileSync(wranglerConfigPath, 'utf8')

describe('deploy workflow verification target', () => {
  it('デプロイ直後の asset 検証は custom domain を使う', () => {
    expect(workflowSource).toContain('bun run verify:deployment https://yunosukeyoshino.com/')
  })

  it('Pages deploy コマンドではなく Workers deploy を使う', () => {
    expect(workflowSource).toContain('command: deploy')
    expect(workflowSource).not.toContain('pages deploy')
  })
})

describe('cloudflare workers hosting configuration', () => {
  it('Vite config uses the Cloudflare plugin before TanStack Start', () => {
    expect(viteConfigSource).toContain("import { cloudflare } from '@cloudflare/vite-plugin'")
    expect(viteConfigSource).toContain("cloudflare({ viteEnvironment: { name: 'ssr' } })")
  })

  it('Wrangler config targets TanStack Start server entry on Workers', () => {
    expect(wranglerConfigSource).toContain('main = "@tanstack/react-start/server-entry"')
    expect(wranglerConfigSource).toContain(
      'compatibility_flags = ["nodejs_compat", "nodejs_compat_populate_process_env"]'
    )
    expect(wranglerConfigSource).toContain('pattern = "yunosukeyoshino.com/*"')
  })
})
