# Project Overview

## Purpose
This is a portfolio website built with Next.js 15 that showcases blog articles fetched from microCMS (a headless CMS). The project was migrated from Astro to Next.js to leverage modern React features and better performance.

## Key Technologies
- **Next.js 15**: React framework with App Router and Server Components
- **React 19**: Latest React with Server Components
- **TypeScript**: Strict type safety with experimental typedRoutes
- **microCMS**: Headless CMS for blog articles
- **Tailwind CSS + SCSS**: Hybrid styling with CSS Modules following FLOCSS methodology
- **GSAP**: Animation library for interactive elements
- **Biome**: Modern linter/formatter (replaced ESLint)
- **Vercel**: Deployment platform optimized for Next.js

## Architecture
- **App Router**: Uses Next.js 15 App Router for modern routing
- **Server Components**: Default for data fetching and SEO
- **Client Components**: For interactivity (marked with 'use client')
- **Static Generation**: Pre-built pages for blog content with `generateStaticParams`
- **Streaming**: Progressive page rendering with Suspense boundaries
- **Error Boundaries**: Graceful error handling at route level

## Performance Features
- Server Components for reduced client bundle size
- Static generation for blog content
- Image optimization with WebP/AVIF
- Code splitting (automatic route-based)
- Streaming for progressive page rendering

## Environment Configuration
Required environment variables:
- `MICROCMS_SERVICE_DOMAIN`: microCMS service domain (e.g., "yuche.microcms.io")
- `MICROCMS_API_KEY`: microCMS API key
- `SITE_URL`: Production site URL for metadata