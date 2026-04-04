import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const privacyPolicyRoutePath = resolve(import.meta.dir, '../routes/privacy-policy.tsx')
const privacyPolicySource = readFileSync(privacyPolicyRoutePath, 'utf8')

describe('privacy-policy route layout', () => {
  it('固定ヘッダーと本文の間に十分なトップスペースを確保する', () => {
    expect(privacyPolicySource).toContain('pt-40')
    expect(privacyPolicySource).toContain('md:pt-48')
  })

  it('main要素とcontainerを分離して余白と背景を安定させる', () => {
    expect(privacyPolicySource).toContain('<main className="min-h-screen')
    expect(privacyPolicySource).toContain('<div className="container-custom">')
  })
})
