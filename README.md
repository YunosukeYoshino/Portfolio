# Portfolio Site with Next.js & microCMS

A modern portfolio website built with Next.js 15, featuring a blog powered by microCMS headless CMS. Originally migrated from Astro to leverage Next.js App Router and Server Components for optimal performance.

## Tech Stack

### Core
- **Next.js 15** - React framework with App Router and static export
- **React 19** - Latest React with Server Components
- **TypeScript** - Type-safe development with strict mode and typedRoutes
- **microCMS** - Headless CMS for blog content management
- **Bun** - Fast package manager and JavaScript runtime

### Styling & Animation
- **Tailwind CSS** - Utility-first CSS framework with custom utilities
- **GSAP** - Professional-grade animation library for interactions
- **Custom Cursor** - Interactive cursor with blend mode effects

### Code Quality & Performance
- **Biome** - Fast linter and formatter (replaces ESLint/Prettier)
- **Shiki** - Server-side syntax highlighting with dual themes
- **Lighthouse** - Performance auditing and optimization
- **Husky** - Git hooks for code quality enforcement

### Deployment
- **Cloudflare Pages** - Static site hosting with global CDN

## Features

- ⚡ **Server Components** - Reduced client bundle size with server-side rendering
- 📝 **Blog System** - Dynamic blog with microCMS integration
- 🎨 **Syntax Highlighting** - Server-side code highlighting with Shiki (GitHub themes)
- 🖱️ **Custom Cursor** - Interactive cursor with blend mode effects
- 📱 **Responsive Design** - Mobile-first approach with adaptive layouts
- 🚀 **Performance Optimized** - Static export, image optimization, and code splitting
- 🔍 **SEO Ready** - Metadata API, structured data, and Google Analytics integration
- 🌐 **Three.js Integration** - 3D graphics with React Three Fiber

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
└── styles/             # Global styles
    └── globals.css     # Base styles and Tailwind directives
```

## Getting Started

### Prerequisites

- Node.js 22.12 or later (configured with Volta)
- Bun package manager
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
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

### Development Commands

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run preview      # Build and preview production
bun run lint         # Run all linters (Biome, TypeScript)
bun run fix          # Auto-fix linting issues
bun run format       # Format code with Biome
bun run check        # Check code quality with Biome
bun run ci           # Run Biome in CI mode
bun run lih          # Run Lighthouse audit on localhost:3000
```

## Architecture Details

### Server Components & Data Fetching
- Default components are Server Components for optimal performance
- Client Components marked with `'use client'` for interactivity
- microCMS data fetched server-side with ISR support

### Styling Architecture
- **Tailwind CSS**: Utility-first approach for all component styling
- **Global Styles**: Base styles and CSS variables in globals.css
- **Custom Utilities**: Project-specific utility classes (container-custom, text-display)
- **Component-scoped**: All styling handled inline with Tailwind utilities

### Performance Optimizations
- Static export for CDN-friendly deployment
- Custom image loader optimized for Cloudflare Pages
- Font optimization with next/font (Inter with variable font loading)
- Route-based code splitting with App Router
- Server Components for reduced client-side JavaScript
- Shiki server-side code highlighting (zero client-side JS)

### Code Highlighting
- Server-side syntax highlighting with Shiki
- Dual theme support (GitHub Light/Dark)
- Zero client-side JavaScript for highlighting
- Automatic processing of microCMS code blocks

## Deployment

### Cloudflare Pages (Current)

This project is configured for static export and deployed on Cloudflare Pages:

1. Push your code to GitHub
2. Connect repository to Cloudflare Pages
3. Configure build settings:
   - Build command: `bun run build`
   - Build output directory: `out`
4. Set environment variables in Cloudflare dashboard
5. Deploy automatically on push to main

### Build Configuration

The project uses static export (`output: 'export'`) in `next.config.ts` for Cloudflare Pages compatibility:
- Custom image loader for optimization
- Static HTML generation for all pages
- Automatic build ID generation from Git commit SHA

## Design Philosophy

The site follows a minimalist design approach inspired by modern portfolio sites:
- Clean white background with black text
- Bold uppercase typography with tight tracking
- Modern border-style interactive elements
- Consistent spacing and grid systems
- Smooth animations and micro-interactions

## Contributing

Contributions are welcome! Please ensure:
1. Use Bun as the package manager (`bun install`, `bun run lint`)
2. Code passes all lint checks (`bun run lint` - Biome + TypeScript)
3. Follow existing code style and patterns
4. Test thoroughly in development with mock data support
5. Update types when modifying data structures

## License

This project is private and proprietary. All rights reserved.

## Acknowledgments

- Originally migrated from Astro to Next.js 15
- Design inspired by modern portfolio aesthetics
- Powered by microCMS for content management