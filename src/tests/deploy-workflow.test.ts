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

describe('deploy workflow verification target', () => {
  it('デプロイ直後の asset 検証は custom domain を使う', () => {
    expect(workflowSource).toContain('bun run verify:deployment https://yunosukeyoshino.com/')
  })

  it('Pages deploy コマンドではなく cf deploy を使う', () => {
    expect(workflowSource).toContain('cf deploy')
    expect(workflowSource).not.toContain('pages deploy')
    expect(workflowSource).not.toContain('wrangler-action')
  })

  it('build 用 .env.local を生成し、worker secrets を deploy 時に渡す', () => {
    expect(workflowSource).toContain('Prepare build env')
    expect(workflowSource).toContain('cf-wrangler build')
    expect(workflowSource).toContain('cf deploy --prebuilt --secrets-file .worker-secrets.env')
  })

  it('Astro ビルド成果物経由でデプロイする', () => {
    expect(workflowSource).toContain('bun run build')
    expect(workflowSource).toContain('Deploy to Cloudflare Workers via cf')
  })
})

describe('cloudflare configuration', () => {
  it('Astro の Worker エントリを指定する', () => {
    expect(configSource).toContain("entrypoint: './dist/server/entry.mjs'")
    expect(wranglerConfigSource).toContain("assetsDirectory: 'dist/client'")
  })
})
