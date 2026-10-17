import { describe, expect, it } from 'vite-plus/test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const TEST_DIR = fileURLToPath(new URL('.', import.meta.url))

const workflowPath = resolve(TEST_DIR, '../../.github/workflows/deploy.yml')
const workflowSource = readFileSync(workflowPath, 'utf8')
const configPath = resolve(TEST_DIR, '../../cloudflare.config.ts')
const configSource = readFileSync(configPath, 'utf8')
const wranglerConfigPath = resolve(TEST_DIR, '../../wrangler.config.ts')
const wranglerConfigSource = readFileSync(wranglerConfigPath, 'utf8')
const wranglerJsoncPath = resolve(TEST_DIR, '../../wrangler.jsonc')
const wranglerJsoncSource = readFileSync(wranglerJsoncPath, 'utf8')

describe('deploy workflow verification target', () => {
  it('デプロイ直後の asset 検証は custom domain を使う', () => {
    expect(workflowSource).toContain('bun run verify:deployment https://yunosukeyoshino.com/')
  })

  it('Pages deploy コマンドではなく wrangler deploy を使う', () => {
    expect(workflowSource).toContain('wrangler deploy')
    expect(workflowSource).not.toContain('pages deploy')
    expect(workflowSource).not.toContain('wrangler-action')
  })

  it('build 用 .env.local を生成し、worker secrets を deploy 時に同期する', () => {
    expect(workflowSource).toContain('Prepare build env')
    expect(workflowSource).toContain('wrangler secret bulk .worker-secrets.env')
    expect(workflowSource).toContain('bunx wrangler deploy')
  })

  it('Astro ビルド成果物経由でデプロイする', () => {
    expect(workflowSource).toContain('bun run build')
    expect(workflowSource).toContain('Deploy to Cloudflare Workers via Wrangler')
  })
})

describe('cloudflare configuration', () => {
  it('Astro の Worker エントリを指定する', () => {
    expect(configSource).toContain("entrypoint: './dist/server/entry.mjs'")
    expect(wranglerConfigSource).toContain("assetsDirectory: 'dist/client'")
  })

  it('wrangler.jsonc が同じエントリとアセットを指す', () => {
    expect(wranglerJsoncSource).toContain('"main": "@astrojs/cloudflare/entrypoints/server"')
    expect(wranglerJsoncSource).toContain('"directory": "dist/client"')
    expect(wranglerJsoncSource).toContain('"name": "yunosuke-portfolio"')
  })
})
