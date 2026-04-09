import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('view transition CSS regressions', () => {
  it('does not self-reference the slide offset custom property', () => {
    const css = readFileSync(resolve(import.meta.dir, '../globals.css'), 'utf8')

    expect(css).not.toContain('--vt-slide-offset: calc(var(--vt-slide-offset) * -1);')
    expect(css).not.toContain('--vt-slide-offset: var(--vt-slide-offset);')
  })

  it('does not globally hide old article title snapshots', () => {
    const css = readFileSync(resolve(import.meta.dir, '../globals.css'), 'utf8')

    expect(css).not.toContain('::view-transition-old(.article-title-morph)')
  })
})
