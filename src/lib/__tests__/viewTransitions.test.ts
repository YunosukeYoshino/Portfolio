import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('view transition CSS regressions', () => {
  it('does not self-reference the slide offset custom property', () => {
    const css = readFileSync(resolve(import.meta.dir, '../../globals.css'), 'utf8')

    expect(css).not.toContain('--vt-slide-offset: calc(var(--vt-slide-offset) * -1);')
    expect(css).not.toContain('--vt-slide-offset: var(--vt-slide-offset);')
  })

  it('does not globally hide old article title snapshots', () => {
    const css = readFileSync(resolve(import.meta.dir, '../../globals.css'), 'utf8')

    expect(css).not.toContain('::view-transition-old(.article-title-morph)')
  })

  it("keeps view-transition rules unlayered so they win over Astro's per-element @layer astro overrides", () => {
    // transition:animate="none" makes Astro emit `@layer astro { ::view-transition-old(page-shell) { opacity: 0 } }`
    // per page. Cascade layers ignore specificity, so if our rules were inside `@layer base` they would
    // silently lose to that override and the transition would appear to do nothing.
    const css = readFileSync(resolve(import.meta.dir, '../../globals.css'), 'utf8')

    const layerBaseStart = css.indexOf('@layer base {')
    expect(layerBaseStart).toBeGreaterThan(-1)
    const bodyStart = css.indexOf('{', layerBaseStart) + 1
    let depth = 1
    let i = bodyStart
    while (depth > 0 && i < css.length) {
      if (css[i] === '{') depth++
      else if (css[i] === '}') depth--
      i++
    }
    const layerBaseBody = css.slice(bodyStart, i - 1)

    expect(layerBaseBody).not.toContain('--vt-duration-exit')
    expect(css).toContain('--vt-duration-exit')
  })
})
