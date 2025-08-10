'use client'

import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import java from 'highlight.js/lib/languages/java'
// Import only the languages you need
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import php from 'highlight.js/lib/languages/php'
import python from 'highlight.js/lib/languages/python'
import typescript from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { useEffect, useRef } from 'react'

import 'highlight.js/styles/github-dark.css'

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('html', html)
hljs.registerLanguage('xml', html)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('php', php)

interface CodeHighlightProps {
  content: string
}

export default function CodeHighlight({ content }: CodeHighlightProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      // Highlight all code blocks
      const codeBlocks = contentRef.current.querySelectorAll('pre code')
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement)
      })
    }
  }, [])

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none prose-gray prose-headings:font-bold prose-headings:text-black prose-a:text-black hover:prose-a:text-gray-700 prose-strong:text-black"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML content from microCMS
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
