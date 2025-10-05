# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

**IMPORTANT: This project uses Bun as the package manager.** Use `bun` commands instead of `npm` for all operations:

- `bun install` - Install dependencies (instead of npm install)
- `bun run dev` - Start Next.js development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run preview` - Build and start production server
- `bun run lint` - Run all linters (Biome, TypeScript)
- `bun run fix` - Auto-fix linting issues across all tools
- `bun run format` - Format code with Biome
- `bun run check` - Check code quality with Biome
- `bun run ci` - Run Biome in CI mode
- `bun run lih` - Run Lighthouse performance audit on localhost:3000

## Architecture Overview

This is a Next.js 15 portfolio site with App Router, fully migrated from Astro. It integrates with microCMS as a headless CMS for blog content and uses Server Components for optimal performance.

### Key Technologies
- **Next.js 15**: React framework with App Router, Server Components, static export
- **React 19**: Latest React with Server Components
- **TypeScript 5.9**: Strict mode with experimental typedRoutes
- **Bun**: Package manager and JavaScript runtime
- **microCMS**: Headless CMS for blog articles
- **Tailwind CSS 4.1**: Utility-first CSS with new `@theme` and `@plugin` directives
- **Shiki**: Server-side code highlighting (GitHub Dark theme)
- **GSAP**: Animation library for interactive elements
- **Biome**: Fast linter and formatter (replaces ESLint/Prettier)
- **Cloudflare Pages**: Deployment platform with static export

### Project Structure
- `src/app/`: Next.js App Router pages and layouts
- `src/components/`: React components (Header, Footer, Blog, etc.)
- `src/lib/`: Utility functions including microCMS client
- `src/types/`: TypeScript type definitions

### microCMS Integration
The `src/lib/microcms.ts` file contains:
- **Server-side Fetching**: Direct fetch API with `X-MICROCMS-API-KEY` header
- **Type Safety**: TypeScript interfaces for `Blog` and `BlogResponse`
- **Development Mode**: Supports placeholder credentials for local development
- **Error Handling**: Comprehensive error handling with fallback to mock data
- **API Functions**: `getBlogs()`, `getBlogDetail()`, `getAllBlogIds()`, `getPaginatedBlogs()`
- **Static Generation**: Helpers for `generateStaticParams` in App Router

### App Router Architecture
- **Server Components**: Default for data fetching and SEO
- **Client Components**: For interactivity (marked with 'use client')
- **Static Generation**: `generateStaticParams` for blog posts
- **Streaming**: Suspense boundaries for loading states
- **Error Boundaries**: Graceful error handling at route level

### Styling Architecture (Tailwind CSS v4)
**IMPORTANT**: Project uses Tailwind CSS v4 with breaking changes from v3:
- **CSS-First Configuration**: `@import "tailwindcss"` and `@plugin "@tailwindcss/typography"` in `globals.css`
- **@theme Directive**: CSS variables defined in `@theme` block (replaces JavaScript config theme)
- **@layer System**: Proper cascade with `@layer base`, `@layer components`, `@layer utilities`
- **PostCSS Plugin**: Uses `@tailwindcss/postcss` instead of `tailwindcss` plugin
- **Typography Plugin**: Loaded via `@plugin` directive in CSS, not JavaScript config
- **Component Styling**: All styling done inline with Tailwind utilities

### Environment Variables Required
- `MICROCMS_SERVICE_DOMAIN`: microCMS service domain
- `MICROCMS_API_KEY`: microCMS API key
- `SITE_URL`: Production site URL for metadata

### Build Configuration
- **Static Export**: `output: 'export'` in `next.config.ts` for Cloudflare Pages
- **Custom Image Loader**: `src/lib/imageLoader.js` for Cloudflare optimization
- **Build ID**: Auto-generated from Git commit SHA (`CF_PAGES_COMMIT_SHA`)
- **Experimental Features**: `typedRoutes: true` for type-safe navigation
- **Server Packages**: Shiki configured as `serverExternalPackages`
- **Font Optimization**: Inter font with next/font variable loading

### Deployment Commands
- `bun run deploy` - Deploy to production (main branch)
- `bun run deploy:preview` - Deploy to preview environment
- **Cloudflare Wrangler**: Uses `npx wrangler pages deploy` with `out/` directory
- **Build Output**: Static files in `out/` directory after `next build`

### Performance Features
- **Server Components**: Reduced client bundle size
- **Static Generation**: Pre-built pages for blog content
- **Image Optimization**: WebP/AVIF with responsive sizing
- **Code Splitting**: Automatic route-based splitting
- **Streaming**: Progressive page rendering

### Code Highlighting System
- **Shiki**: Server-side syntax highlighting (zero client-side JS)
- **Implementation**: `CodeHighlight.tsx` async Server Component
- **Language Detection**: Auto-detects JavaScript/Bash when language class is missing
- **Theme**: GitHub Dark theme with inline styles
- **External package**: Shiki configured as `serverExternalPackages` in `next.config.ts`
- **Blog integration**: Processes `<pre><code>` blocks from microCMS HTML content

### Linting & Code Quality
The project uses Biome for fast, comprehensive code quality:
- **Biome**: Single tool for linting, formatting, and organizing imports (replaces ESLint/Prettier)
- **Configuration**: `biome.json` with custom rules for React/Next.js
- **Key Rules**: No console (warn), no debugger (error), organize imports on save
- **Parallel execution**: `bun run lint` runs Biome + TypeScript in parallel with `npm-run-all`
- **Git Hooks**: Husky + lint-staged for pre-commit formatting
- **TypeScript**: Strict mode with `typedRoutes` experimental feature

### Custom Cursor Implementation
- **Component**: `CustomCursor.tsx` tracks mouse position and hover states
- **Styling**: Uses `mix-blend-mode: difference` for automatic color inversion
- **Integration**: Included in root layout for site-wide functionality
- **Interactions**: Scales up on hover over interactive elements

### Design System
- **Reference**: Based on https://www.ecrin.digital/en analysis
- **Theme**: White background with black text, minimalist aesthetic
- **Typography**: Bold uppercase headings with tight tracking
- **Components**: Modern border-style buttons with hover effects
- **Layout**: Clean grid systems with consistent spacing