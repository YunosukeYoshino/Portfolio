import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = resolve(import.meta.dir, '../..')

const articleSidebarSource = readFileSync(
  resolve(repoRoot, 'src/components/article/ArticleSidebar.astro'),
  'utf8'
)
const indexSource = readFileSync(resolve(repoRoot, 'src/pages/index.astro'), 'utf8')
const articlePageSource = readFileSync(
  resolve(repoRoot, 'src/pages/article/page/[page].astro'),
  'utf8'
)
const slugSource = readFileSync(resolve(repoRoot, 'src/pages/article/[slug].astro'), 'utf8')
const contactFormSource = readFileSync(
  resolve(repoRoot, 'src/components/forms/ContactForm.tsx'),
  'utf8'
)
const globalsCssSource = readFileSync(resolve(repoRoot, 'src/globals.css'), 'utf8')

describe('back-to-top scroll respects prefers-reduced-motion (#111)', () => {
  it('checks prefers-reduced-motion before calling scrollTo', () => {
    expect(articleSidebarSource).toMatch(/prefers-reduced-motion/)
    const scrollToIndex = articleSidebarSource.indexOf('window.scrollTo(')
    const reducedMotionIndex = articleSidebarSource.indexOf('prefers-reduced-motion')
    expect(scrollToIndex).toBeGreaterThan(-1)
    expect(reducedMotionIndex).toBeGreaterThan(-1)
    expect(reducedMotionIndex).toBeLessThan(scrollToIndex)
  })

  it('back-to-top button only transitions opacity and filter, not all properties', () => {
    expect(articleSidebarSource).not.toContain('transition-all')
    expect(articleSidebarSource).toMatch(/transition-\[opacity,filter\]/)
  })
})

describe('list-item wrapper transition scoped to opacity/filter (#111)', () => {
  it('index.astro list rows transition only opacity and filter (the sibling-dim effect), not all properties', () => {
    expect(indexSource).not.toContain('transition-all')
    expect(indexSource.match(/transition-\[opacity,filter\]/g) ?? []).toHaveLength(2)
  })

  it('article/page/[page].astro list rows transition only opacity and filter, not all properties', () => {
    expect(articlePageSource).not.toContain('transition-all')
    expect(articlePageSource).toMatch(/transition-\[opacity,filter\]/)
  })
})

describe('prev/next nav arrow timing matches the sibling title (#111)', () => {
  it('uses duration-150 instead of duration-300 on the nav arrow icons', () => {
    expect(slugSource).not.toContain('transition-transform duration-300')
    const arrowMatches = slugSource.match(/transition-transform duration-150/g) ?? []
    expect(arrowMatches.length).toBe(2)
  })
})

describe('contact form feedback animates in (#111)', () => {
  it('globals.css defines reusable fade-in keyframes and utility classes', () => {
    expect(globalsCssSource).toMatch(/@keyframes fade-in\b/)
    expect(globalsCssSource).toMatch(/@keyframes fade-in-up\b/)
    expect(globalsCssSource).toMatch(/\.animate-fade-in\s*{/)
    expect(globalsCssSource).toMatch(/\.animate-fade-in-up\s*{/)
  })

  it('reduced-motion media query also disables the new fade-in animations', () => {
    // The fade-in override must sit in the UNLAYERED reduced-motion block
    // (alongside the view-transition rules), not inside @layer base. Tailwind
    // declares layer order as `theme, base, components, utilities`, so a
    // base-layer `animation: none` is silently beaten by the utilities-layer
    // animation regardless of specificity — only unlayered CSS wins. Mirrors
    // the "keeps view-transition rules unlayered" test in viewTransitions.test.ts.
    const layerBaseStart = globalsCssSource.indexOf('@layer base {')
    expect(layerBaseStart).toBeGreaterThan(-1)
    const bodyStart = globalsCssSource.indexOf('{', layerBaseStart) + 1
    let depth = 1
    let i = bodyStart
    while (depth > 0 && i < globalsCssSource.length) {
      if (globalsCssSource[i] === '{') depth++
      else if (globalsCssSource[i] === '}') depth--
      i++
    }
    const layerBaseBody = globalsCssSource.slice(bodyStart, i - 1)
    // A base-layer override would lose to the utilities-layer animation.
    expect(layerBaseBody).not.toMatch(/animate-fade-in/)

    // The override must instead live in the unlayered reduced-motion block.
    const unlayeredReducedMotion = globalsCssSource.match(
      /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?::view-transition-old\(\*\)[\s\S]*?\n\}/
    )
    expect(unlayeredReducedMotion).not.toBeNull()
    expect(unlayeredReducedMotion?.[0]).toMatch(/\.animate-fade-in/)
  })

  it('submit status banner has an opacity/translate enter animation', () => {
    expect(contactFormSource).toMatch(/submitStatus\.type/)
    expect(contactFormSource).toMatch(/animate-fade-in-up/)
  })

  it('field-level error messages fade in', () => {
    expect(contactFormSource).toMatch(/errorClass\s*=\s*['"`][^'"`]*animate-fade-in\b/)
  })
})
