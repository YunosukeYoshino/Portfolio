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
const voidConfigPath = resolve(TEST_DIR, '../../void.config.ts')
const voidConfigSource = readFileSync(voidConfigPath, 'utf8')
const packageJsonSource = readFileSync(resolve(TEST_DIR, '../../package.json'), 'utf8')

describe('deploy workflow verification target', () => {
  it('デプロイ直後の asset 検証は custom domain を使う', () => {
    expect(workflowSource).toContain('bun run verify:deployment https://yunosukeyoshino.com/')
  })

  it('Pages deploy コマンドではなく void deploy を使う', () => {
    expect(workflowSource).toContain('void deploy --platform cloudflare')
    expect(workflowSource).not.toContain('pages deploy')
    expect(workflowSource).not.toContain('wrangler-action')
  })

  it('build 用 .env.local を生成し、Void がビルドとデプロイを担う', () => {
    expect(workflowSource).toContain('Prepare build env')
    expect(workflowSource).toContain('Deploy to Cloudflare Workers via Void')
    expect(workflowSource).toContain('CLOUDFLARE_API_TOKEN')
  })

  it('Worker secrets はデプロイ時アップロードではなく事前登録を参照する', () => {
    expect(workflowSource).not.toContain('.worker-secrets.env')
    expect(packageJsonSource).toContain('void secret sync')
  })
})

describe('cloudflare configuration', () => {
  it('Astro の Worker エントリを指定する', () => {
    expect(configSource).toContain("entrypoint: './dist/server/entry.mjs'")
    expect(wranglerConfigSource).toContain("assetsDirectory: 'dist/client'")
  })

  it('void.config.ts が Worker 名と必須 compat flags を持つ', () => {
    expect(voidConfigSource).toContain("name: 'yunosuke-portfolio'")
    expect(voidConfigSource).toContain('nodejs_compat')
    expect(voidConfigSource).toContain('nodejs_als')
  })
})
