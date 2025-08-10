# Portfolio Site with Next.js & microCMS

A modern portfolio website built with Next.js 15, featuring a blog powered by microCMS headless CMS. Originally migrated from Astro to leverage Next.js App Router and Server Components for optimal performance.

## Tech Stack

### Core
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with Server Components
- **TypeScript** - Type-safe development with strict mode
- **microCMS** - Headless CMS for blog content management

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **SCSS Modules** - Component-scoped styles following FLOCSS methodology
- **GSAP** - Professional-grade animation library

### Code Quality
- **Biome** - Fast linter and formatter (replaces ESLint/Prettier)
- **Lighthouse** - Performance auditing

### Deployment
- **Vercel** - Optimized hosting for Next.js applications

## Features

- ⚡ **Server Components** - Reduced client bundle size with server-side rendering
- 📝 **Blog System** - Dynamic blog with microCMS integration
- 🎨 **Syntax Highlighting** - Server-side code highlighting with Shiki (GitHub themes)
- 🖱️ **Custom Cursor** - Interactive cursor with blend mode effects
- 📱 **Responsive Design** - Mobile-first approach with adaptive layouts
- 🚀 **Performance Optimized** - Static generation, image optimization, and code splitting
- 🔍 **SEO Ready** - Metadata API and structured data

## Project Structure

```
src/
├── app/                 # Next.js App Router pages and layouts
│   ├── blog/           # Blog routes with static generation
│   ├── contact/        # Contact page
│   └── layout.tsx      # Root layout with providers
├── components/         # React components
│   ├── Header/         # Navigation header
│   ├── Footer/         # Site footer
│   ├── Blog/           # Blog-related components
│   └── CustomCursor/   # Interactive cursor
├── lib/                # Utilities and API clients
│   └── microcms.ts     # microCMS client with type safety
├── types/              # TypeScript type definitions
└── styles/             # Global styles and SCSS modules
    └── globals.css     # Base styles and Tailwind directives
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- microCMS account and API keys

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
SITE_URL=https://your-domain.com
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run preview      # Build and preview production
npm run lint         # Run all linters
npm run fix          # Auto-fix linting issues
npm run format       # Format code with Biome
npm run check        # Check code quality
npm run lih          # Run Lighthouse audit
```

## Architecture Details

### Server Components & Data Fetching
- Default components are Server Components for optimal performance
- Client Components marked with `'use client'` for interactivity
- microCMS data fetched server-side with ISR support

### Styling Architecture (FLOCSS)
- **Foundation**: Base styles and resets
- **Layout**: Grid and container components (l-*)
- **Component**: Reusable UI components (c-*)
- **Project**: Page-specific styles (p-*)
- **Utility**: Tailwind utility classes

### Performance Optimizations
- Static generation with `generateStaticParams` for blog posts
- Automatic image optimization with next/image
- Font optimization with next/font
- Route-based code splitting
- Streaming with Suspense boundaries

### Code Highlighting
- Server-side syntax highlighting with Shiki
- Dual theme support (GitHub Light/Dark)
- Zero client-side JavaScript for highlighting
- Automatic processing of microCMS code blocks

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy automatically on push to main

### Docker/Custom Server

The project supports standalone output for containerization:

```bash
# Build standalone output
npm run build

# The standalone server will be in .next/standalone
node .next/standalone/server.js
```

## Design Philosophy

The site follows a minimalist design approach inspired by modern portfolio sites:
- Clean white background with black text
- Bold uppercase typography with tight tracking
- Modern border-style interactive elements
- Consistent spacing and grid systems
- Smooth animations and micro-interactions

## Contributing

Contributions are welcome! Please ensure:
1. Code passes all lint checks (`npm run lint`)
2. Follow existing code style and patterns
3. Test thoroughly in development
4. Update types when modifying data structures

## License

This project is private and proprietary. All rights reserved.

## Acknowledgments

- Originally migrated from Astro to Next.js 15
- Design inspired by modern portfolio aesthetics
- Powered by microCMS for content management