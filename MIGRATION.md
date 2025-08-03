# Astro to Next.js Migration Guide

## Overview

This project has been migrated from Astro to Next.js 15 with full TypeScript support. This document outlines the migration process and new project structure.

## Migration Steps Completed

### ✅ Phase 1: Project Setup & Architecture
- [x] Next.js 15 project with TypeScript and App Router
- [x] Project structure setup with proper TypeScript configuration
- [x] Tailwind CSS integration with PostCSS

### ✅ Phase 2: Component Migration
- [x] Converted all Astro components to React components
- [x] Implemented App Router pages structure
- [x] Added comprehensive TypeScript integration
- [x] Created loading, error, and not-found pages

### ✅ Phase 3: Core Features
- [x] microCMS integration with Next.js
- [x] Server Components with modern data fetching
- [x] SEO optimization with Metadata API
- [x] Static generation for blog posts

### ✅ Phase 4: Assets & Styling
- [x] SCSS integration with CSS Modules
- [x] Asset migration and optimization
- [x] Font loading with Next.js optimizations

## New Project Structure

```
src/
├── app/                     # App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Home page
│   ├── article/           # Blog routes
│   │   ├── [slug]/        # Dynamic blog post
│   │   └── page/[page]/   # Paginated blog list
│   ├── loading.tsx        # Global loading UI
│   ├── error.tsx         # Global error UI
│   ├── not-found.tsx     # 404 page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── MainVisual.tsx
│   ├── About.tsx
│   └── Blog.tsx
├── lib/                  # Utility functions
│   ├── microcms.ts      # microCMS client
│   ├── utils.ts         # Helper functions
│   └── gradient.js      # WebGL gradient
├── types/               # TypeScript definitions
│   └── index.ts
└── styles/             # SCSS modules
    └── components/
```

## Getting Started

### 1. Environment Setup

Copy the environment variables:
```bash
cp .env.example .env.local
```

Fill in your microCMS credentials:
```env
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
SITE_URL=https://www.yunosukeyoshino.com
```

### 2. Install Dependencies

```bash
# If using the new package.json
mv package.json.nextjs package.json
mv tsconfig.json.nextjs tsconfig.json

# Install dependencies
npm install
```

### 3. Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### 4. Linting and Formatting

```bash
# Run all linters
npm run lint

# Fix linting issues
npm run fix

# Check TypeScript
npm run lint:tsc
```

## Key Changes from Astro

### 1. Component System
- **Astro**: `.astro` files with HTML-like syntax
- **Next.js**: `.tsx` React components with JSX

### 2. Data Fetching
- **Astro**: Top-level await in frontmatter
- **Next.js**: Server Components with async/await

### 3. Routing
- **Astro**: File-based routing in `src/pages/`
- **Next.js**: App Router in `src/app/`

### 4. Static Generation
- **Astro**: Automatic for all pages
- **Next.js**: `generateStaticParams` for dynamic routes

### 5. SEO
- **Astro**: `astro-seo` component
- **Next.js**: Built-in Metadata API

## Performance Features

### Server Components
- Blog listing and details run on the server
- Reduced client-side JavaScript bundle
- Better SEO and initial page load

### Image Optimization
- Next.js `Image` component for optimized loading
- WebP/AVIF format support
- Responsive image sizing

### Caching Strategy
- Static generation for blog posts
- ISR (Incremental Static Regeneration) support
- Optimized data fetching with `fetch()` cache

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## Development Tools

### Available Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Run all linters
- `npm run fix` - Auto-fix issues
- `npm run lih` - Lighthouse audit

### Code Quality
- ESLint with Next.js and TypeScript rules
- Prettier for code formatting
- TypeScript strict mode
- Pre-commit hooks with lint-staged

## Migration Benefits

1. **Better Performance**: Server Components, automatic code splitting
2. **Enhanced SEO**: Built-in metadata API, streaming
3. **Developer Experience**: Full TypeScript integration, better tooling
4. **Modern Architecture**: React 18 features, Suspense, Error Boundaries
5. **Scalability**: Better suited for larger applications

## Next Steps

- [ ] Configure deployment pipeline
- [ ] Set up monitoring and analytics
- [ ] Optimize Core Web Vitals
- [ ] Add e2e testing
- [ ] Implement additional features as needed