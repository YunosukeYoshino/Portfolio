# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run preview` - Build and start production server
- `npm run lint` - Run all linters (ESLint, TypeScript, Prettier)
- `npm run fix` - Auto-fix linting issues across all tools
- `npm run lih` - Run Lighthouse performance audit on localhost:3000

## Architecture Overview

This is a Next.js 15 portfolio site with App Router, fully migrated from Astro. It integrates with microCMS as a headless CMS for blog content and uses Server Components for optimal performance.

### Key Technologies
- **Next.js 15**: React framework with App Router and Server Components
- **React 19**: Latest React with Server Components
- **TypeScript**: Strict type safety with experimental typedRoutes
- **microCMS**: Headless CMS for blog articles
- **Tailwind CSS + SCSS**: Hybrid styling with CSS Modules
- **GSAP**: Animation library for interactive elements
- **Vercel**: Deployment platform optimized for Next.js

### Project Structure
- `src/app/`: Next.js App Router pages and layouts
- `src/components/`: React components (Header, Footer, Blog, etc.)
- `src/lib/`: Utility functions including microCMS client
- `src/types/`: TypeScript type definitions
- `src/styles/`: SCSS modules following FLOCSS methodology

### microCMS Integration
The `src/lib/microcms.ts` file contains:
- Server-side data fetching with error handling
- Type-safe API functions for blogs
- Static generation helpers for build optimization
- ISR (Incremental Static Regeneration) support

### App Router Architecture
- **Server Components**: Default for data fetching and SEO
- **Client Components**: For interactivity (marked with 'use client')
- **Static Generation**: `generateStaticParams` for blog posts
- **Streaming**: Suspense boundaries for loading states
- **Error Boundaries**: Graceful error handling at route level

### Styling Architecture
Follows FLOCSS methodology with CSS Modules:
- **Foundation**: Base styles and reset (`globals.css`)
- **Layout**: Grid and layout components (l-*)
- **Component**: Reusable UI components (c-*)
- **Project**: Page-specific styles (p-*)
- **Utility**: Tailwind utility classes

### Environment Variables Required
- `MICROCMS_SERVICE_DOMAIN`: microCMS service domain
- `MICROCMS_API_KEY`: microCMS API key
- `SITE_URL`: Production site URL for metadata

### Build Configuration
- Next.js 15 with App Router
- Experimental typedRoutes for type-safe navigation
- Image optimization with next/image
- Font optimization with next/font
- Vercel deployment optimizations
- Standalone output for Docker/custom deployment

### Performance Features
- **Server Components**: Reduced client bundle size
- **Static Generation**: Pre-built pages for blog content
- **Image Optimization**: WebP/AVIF with responsive sizing
- **Code Splitting**: Automatic route-based splitting
- **Streaming**: Progressive page rendering

### Linting & Code Quality
The project enforces strict code quality with:
- ESLint with Next.js and TypeScript rules
- TypeScript strict mode with experimental features
- Prettier for code formatting
- Pre-commit hooks with lint-staged
- Type-safe routing with experimental typedRoutes

## Migration Notes

This project was migrated from Astro to Next.js 15. Backup files are stored in:
- `astro-backup/`: Original Astro configuration files
- `package.json.astro`: Original Astro package.json
- `tsconfig.json.astro`: Original Astro TypeScript config

The migration maintained all functionality while adding:
- Better performance with Server Components
- Enhanced SEO with streaming and built-in metadata
- Type-safe routing
- Modern React 19 features