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

describe('Header heading level', () => {
  const createMockLink = ({
    children,
    to,
    viewTransition: _viewTransition,
    reloadDocument: _reloadDocument,
    ...rest
  }: {
    children?: React.ReactNode
    to?: unknown
    viewTransition?: unknown
    reloadDocument?: unknown
  } & Record<string, unknown>) => {
    return React.createElement('a', { href: typeof to === 'string' ? to : '#', ...rest }, children)
  }

  it('siteRoot のときだけサイト名を h1 として描画する', async () => {
    mock.module('@tanstack/react-router', () => ({
      Link: createMockLink,
    }))

    const { default: Header } = await import('../components/layout/Header')

    await renderNode(
      React.createElement(Header as React.ComponentType<{ siteRoot?: boolean }>, {
        siteRoot: true,
      })
    )
    expect(container?.querySelector('h1')?.textContent).toBe('Yunosuke Yoshino')

    await renderNode(React.createElement(Header as React.ComponentType))
    expect(container?.querySelector('h1')).toBeNull()
    expect(container?.textContent).toContain('Yunosuke Yoshino')
  })

  it('サイト名からトップページへ戻れる', async () => {
    mock.module('@tanstack/react-router', () => ({
      Link: createMockLink,
    }))

    const { default: Header } = await import('../components/layout/Header')
    await renderNode(React.createElement(Header as React.ComponentType))

    expect(container?.querySelector('a')?.getAttribute('href')).toBe('/')
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

describe('Article detail navigation on workers hosting', () => {
  it('ArticleLink keeps SPA navigation enabled for view transitions', () => {
    const articleLinkSource = readFileSync(
      resolve(import.meta.dir, '../components/article/ArticleLink.tsx'),
      'utf8'
    )

    expect(articleLinkSource).not.toContain('reloadDocument')
  })
})
