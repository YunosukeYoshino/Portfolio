import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const workflowPath = resolve(import.meta.dir, '../../.github/workflows/deploy-gh-pages.yml')
const workflowSource = readFileSync(workflowPath, 'utf8')

describe('deploy workflow verification target', () => {
  it('デプロイ直後の asset 検証は pages.dev ドメインを使う', () => {
    expect(workflowSource).toContain(
      'bun run verify:deployment https://yunosuke-portfolio.pages.dev/'
    )
  })

  it('カスタムドメインの即時検証を workflow に埋め込まない', () => {
    expect(workflowSource).not.toContain('bun run verify:deployment https://yunosukeyoshino.com/')
  })
})
