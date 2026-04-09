import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { JSDOM } from 'jsdom'
import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

let dom: JSDOM | null = null
let container: HTMLDivElement | null = null
let root: Root | null = null

function installDom() {
  dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://example.com/',
  })

  globalThis.window = dom.window as unknown as Window & typeof globalThis
  globalThis.document = dom.window.document
  globalThis.navigator = dom.window.navigator
  globalThis.HTMLElement = dom.window.HTMLElement
  globalThis.Node = dom.window.Node
  globalThis.MutationObserver = dom.window.MutationObserver
  globalThis.Event = dom.window.Event
  globalThis.MouseEvent = dom.window.MouseEvent
  globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window)
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  globalThis.window.requestAnimationFrame = (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(Date.now()), 0)
  globalThis.window.cancelAnimationFrame = (id: number) => window.clearTimeout(id)
  globalThis.window.scrollTo = () => {}

  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
}

async function cleanupDom() {
  await act(async () => {
    root?.unmount()
  })
  container?.remove()
  container = null
  root = null
  dom?.window.close()
  dom = null
}

async function renderNode(node: React.ReactNode) {
  await act(async () => {
    root?.render(node)
  })
}

beforeEach(() => {
  installDom()
})

afterEach(async () => {
  await cleanupDom()
  mock.restore()
})

describe('Header mobile menu accessibility', () => {
  const createMockLink = ({
    children,
    to,
    reloadDocument: _reloadDocument,
    ...rest
  }: {
    children?: React.ReactNode
    to?: unknown
    reloadDocument?: unknown
  } & Record<string, unknown>) => {
    return React.createElement('a', { href: typeof to === 'string' ? to : '#', ...rest }, children)
  }

  it('閉じた状態ではモバイルメニューを非表示かつ非操作状態にする', async () => {
    mock.module('@tanstack/react-router', () => ({
      Link: createMockLink,
    }))

    const { default: Header } = await import('../components/layout/Header')
    await renderNode(React.createElement(Header as React.ComponentType))

    const mobileMenu = container?.querySelector('[aria-label="Mobile Menu"]')

    expect(mobileMenu).toBeTruthy()
    expect(mobileMenu?.getAttribute('aria-hidden')).toBe('true')
    expect(mobileMenu?.hasAttribute('inert')).toBe(true)
    expect(mobileMenu?.className).toContain('translate-x-full')
    expect(container?.querySelector('button[type="button"][aria-label="Toggle menu"]')).toBeTruthy()
  })

  it('開いた状態ではモバイルメニュー要素を表示する', async () => {
    mock.module('@tanstack/react-router', () => ({
      Link: createMockLink,
    }))

    const { default: Header } = await import('../components/layout/Header')
    await renderNode(React.createElement(Header as React.ComponentType))

    const toggleButton = container?.querySelector(
      'button[type="button"][aria-label="Toggle menu"]'
    ) as HTMLButtonElement | null

    expect(toggleButton).toBeTruthy()

    await act(async () => {
      toggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    const mobileMenu = container?.querySelector('[aria-label="Mobile Menu"]')

    expect(mobileMenu).toBeTruthy()
    expect(mobileMenu?.getAttribute('aria-hidden')).toBe('false')
    expect(mobileMenu?.hasAttribute('inert')).toBe(false)
    expect(mobileMenu?.className).toContain('translate-x-0')
    expect(container?.querySelector('[aria-label="Close menu"]')).toBeTruthy()
    expect(container?.querySelector('button[aria-label="Close menu"]')?.textContent).toContain('×')
  })
})

describe('WebGLBackground fallback', () => {
  it('初期化に失敗してもクラッシュせず背景要素を維持する', async () => {
    mock.module('../components/effects/createWebGLBackgroundScene', () => ({
      createWebGLBackgroundScene: () => Promise.reject(new Error('webgl init failed')),
    }))

    const { default: WebGLBackground } = await import('../components/effects/WebGLBackground')
    await renderNode(React.createElement(WebGLBackground as React.ComponentType))

    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 0))
    })

    expect(container?.querySelector('div')).toBeTruthy()
  })
})

describe('CustomCursor visibility mode', () => {
  it('SP幅では custom cursor 用の body 属性を付与しない', async () => {
    window.innerWidth = 390
    window.matchMedia = ((query: string) => ({
      matches: query === '(pointer: coarse)',
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia

    const { default: CustomCursor } = await import('../components/effects/CustomCursor')
    await renderNode(React.createElement(CustomCursor as React.ComponentType))

    expect(document.body.dataset.customCursor).toBeUndefined()
  })

  it('desktop幅では custom cursor 用の body 属性を付与する', async () => {
    window.innerWidth = 1440
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia

    const { default: CustomCursor } = await import('../components/effects/CustomCursor')
    await renderNode(React.createElement(CustomCursor as React.ComponentType))

    expect(document.body.dataset.customCursor).toBe('enabled')
  })
})

describe('PaginationNav rendering', () => {
  it('props の誤用を runtime throw ではなく型で防ぐ', () => {
    const paginationSource = readFileSync(
      resolve(import.meta.dir, '../components/article/PaginationNav.tsx'),
      'utf8'
    )

    expect(paginationSource).not.toContain(
      "throw new Error('PaginationNav requires getHref or onPageChange')"
    )
    expect(paginationSource).toContain('type PaginationNavProps =')
  })
})

describe('Article detail navigation on static hosting', () => {
  it('ArticleItem forces a document navigation for prerendered detail pages', () => {
    const articleItemSource = readFileSync(
      resolve(import.meta.dir, '../components/article/ArticleItem.tsx'),
      'utf8'
    )

    expect(articleItemSource).toContain('reloadDocument')
  })

  it('ArticleLink forces a document navigation for prerendered detail pages', () => {
    const articleLinkSource = readFileSync(
      resolve(import.meta.dir, '../components/article/ArticleLink.tsx'),
      'utf8'
    )

    expect(articleLinkSource).toContain('reloadDocument')
  })
})
