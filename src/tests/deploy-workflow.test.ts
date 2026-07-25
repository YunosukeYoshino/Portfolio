import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const workflowPath = resolve(import.meta.dir, '../../.github/workflows/deploy-gh-pages.yml')
const workflowSource = readFileSync(workflowPath, 'utf8')
const wranglerPath = resolve(import.meta.dir, '../../wrangler.toml')
const wranglerSource = readFileSync(wranglerPath, 'utf8')

describe('deploy workflow verification target', () => {
  it('デプロイ直後の asset 検証は custom domain を使う', () => {
    expect(workflowSource).toContain('bun run verify:deployment https://yunosukeyoshino.com/')
  })

  it('Pages deploy コマンドではなく Workers deploy を使う', () => {
    expect(workflowSource).toContain('command: deploy')
    expect(workflowSource).not.toContain('pages deploy')
  })

  it('build 用 .env.local を生成し、worker secrets を同期する', () => {
    expect(workflowSource).toContain('Prepare build env')
    expect(workflowSource).toContain('Sync worker secrets')
    expect(workflowSource).toContain('wrangler secret bulk .worker-secrets.env')
  })

  it('Astro ビルド成果物経由でデプロイする', () => {
    expect(workflowSource).toContain('bun run build')
    expect(workflowSource).toContain('Deploy to Cloudflare Workers via Wrangler')
  })
})

describe('wrangler configuration', () => {
  it('Astro の Worker エントリと assets ディレクトリを指定する', () => {
    expect(wranglerSource).toContain('main = "dist/_worker.js/index.js"')
    expect(wranglerSource).toContain('directory = "dist"')
  })
})
