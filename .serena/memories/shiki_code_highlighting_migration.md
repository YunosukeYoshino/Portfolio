# Shiki Code Highlighting Migration - Completed

## Migration Summary
Successfully migrated from Prism.js to Shiki for server-side code highlighting in Next.js 15.

## Changes Made

### 1. Package Management
- **Uninstalled**: Prism.js related packages
- **Installed**: `shiki@^3.9.1` and `@shikijs/transformers@^3.9.1`

### 2. Next.js Configuration (`next.config.ts`)
```typescript
const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  // External packages for server components
  serverExternalPackages: ['shiki'],
  // ... other config
}
```

### 3. CodeHighlight Component (`src/components/CodeHighlight.tsx`)
Created new Server Component with:
- HTML entity decoding for proper code display
- Regex pattern matching for `<pre><code class="language-xxx">` blocks
- Dual theme support (github-light/github-dark)
- Error handling for unsupported languages
- Server-side rendering for better performance

```typescript
import { codeToHtml } from 'shiki'

interface CodeHighlightProps {
  content: string
}

async function processCodeBlocks(html: string): Promise<string> {
  const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g
  // ... processing logic
}

export default async function CodeHighlight({ content }: CodeHighlightProps) {
  const highlightedContent = await processCodeBlocks(content)
  return (
    <div
      className="prose prose-lg max-w-none prose-gray prose-headings:font-bold prose-headings:text-black prose-a:text-black hover:prose-a:text-gray-700 prose-strong:text-black"
      dangerouslySetInnerHTML={{ __html: highlightedContent }}
    />
  )
}
```

### 4. Article Detail Page Update (`src/app/article/[slug]/page.tsx`)
- Replaced direct HTML rendering with CodeHighlight component
- Changed from: `dangerouslySetInnerHTML={{ __html: blog.content }}`
- To: `<CodeHighlight content={blog.content} />`

## Key Benefits
- **Server-side rendering**: Better SEO and performance
- **Dual theme support**: Automatic light/dark theme handling
- **Better Next.js 15 compatibility**: No client-side JavaScript needed
- **Consistent styling**: Integrated with Tailwind prose classes

## Technical Notes
- Uses `serverExternalPackages: ['shiki']` instead of deprecated experimental option
- Processes HTML content server-side before rendering
- Compatible with microCMS HTML content format
- Maintains existing prose styling and design consistency