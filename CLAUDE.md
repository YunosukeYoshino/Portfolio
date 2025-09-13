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
- **Next.js 15**: React framework with App Router and Server Components
- **React 19**: Latest React with Server Components
- **TypeScript**: Strict type safety with experimental typedRoutes
- **microCMS**: Headless CMS for blog articles
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Shiki**: Server-side code highlighting with dual themes
- **GSAP**: Animation library for interactive elements
- **Biome**: Fast linter and formatter (replaces ESLint/Prettier)
- **Vercel**: Deployment platform optimized for Next.js

### Project Structure
- `src/app/`: Next.js App Router pages and layouts
- `src/components/`: React components (Header, Footer, Blog, etc.)
- `src/lib/`: Utility functions including microCMS client
- `src/types/`: TypeScript type definitions

### microCMS Integration
The `src/lib/microcms.ts` file contains:
- Server-side data fetching with comprehensive error handling
- Type-safe API functions for blogs with mock data fallbacks
- Development mode support with placeholder credentials
- Static generation helpers (`getAllBlogIds`, `getPaginatedBlogs`)
- Graceful degradation for API failures in development

### App Router Architecture
- **Server Components**: Default for data fetching and SEO
- **Client Components**: For interactivity (marked with 'use client')
- **Static Generation**: `generateStaticParams` for blog posts
- **Streaming**: Suspense boundaries for loading states
- **Error Boundaries**: Graceful error handling at route level

### Styling Architecture
Uses Tailwind CSS utility-first approach:
- **Foundation**: Base styles and reset (`globals.css`)
- **Utilities**: Tailwind utility classes for styling components
- **Custom Classes**: `container-custom` and design-specific utilities
- **Component Styling**: All styling done inline with Tailwind utilities

### Environment Variables Required
- `MICROCMS_SERVICE_DOMAIN`: microCMS service domain
- `MICROCMS_API_KEY`: microCMS API key
- `SITE_URL`: Production site URL for metadata

### Build Configuration
- Next.js 15 with App Router
- Experimental typedRoutes for type-safe navigation
- Static export for Cloudflare Pages deployment (`output: 'export'`)
- Custom image loader for Cloudflare optimization
- Font optimization with next/font (Inter)
- External packages configuration for Shiki server-side rendering

### Performance Features
- **Server Components**: Reduced client bundle size
- **Static Generation**: Pre-built pages for blog content
- **Image Optimization**: WebP/AVIF with responsive sizing
- **Code Splitting**: Automatic route-based splitting
- **Streaming**: Progressive page rendering

### Code Highlighting System
- **Shiki**: Server-side code syntax highlighting
- **Dual themes**: GitHub Light/Dark theme support
- **Server Component**: `CodeHighlight` processes HTML content server-side
- **External package**: Shiki configured as `serverExternalPackages`
- **Blog integration**: Automatically highlights code blocks in microCMS content

### Linting & Code Quality
The project uses Biome for fast, comprehensive code quality:
- **Biome**: Single tool for linting, formatting, and organizing imports
- **TypeScript**: Strict mode with experimental typedRoutes
- **Configuration**: Custom rules for React/Next.js best practices
- **Parallel execution**: All lint commands run in parallel with `npm-run-all`

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