import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const privacyPolicyRoutePath = resolve(import.meta.dir, '../routes/privacy-policy.tsx')
const privacyPolicySource = readFileSync(privacyPolicyRoutePath, 'utf8')

describe('privacy-policy route layout', () => {
  it('他ページと同じ1カラムのページシェルを使う', () => {
    expect(privacyPolicySource).toContain('<SitePage>')
    expect(privacyPolicySource).toContain('mb-[var(--sectiongap)]')
  })

  it('長文本文は prose で組む', () => {
    expect(privacyPolicySource).toContain('<div className="prose max-w-none">')
  })
})
