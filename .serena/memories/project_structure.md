# Project Structure

## Directory Layout
```
src/
├── app/               # Next.js App Router pages and layouts
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Home page
│   ├── error.tsx      # Error boundary
│   ├── loading.tsx    # Loading UI
│   ├── not-found.tsx  # 404 page
│   ├── globals.css    # Global styles
│   └── article/       # Blog article routes
│       ├── [slug]/    # Individual blog post pages
│       └── page/      # Paginated blog list
├── components/        # React components
│   ├── Header.tsx     # Site header
│   ├── Footer.tsx     # Site footer
│   ├── Blog.tsx       # Blog list component
│   ├── MainVisual.tsx # Hero section
│   └── About.tsx      # About section
├── lib/              # Utility functions
│   ├── microcms.ts   # microCMS client & API functions
│   ├── utils.ts      # General utilities
│   └── gradient.js   # Gradient animation (legacy)
├── types/            # TypeScript type definitions
│   └── index.ts      # All type definitions
└── styles/           # SCSS modules
    └── components/   # Component-specific styles
        ├── Blog.module.scss
        └── Header.module.scss
```

## Key Files
- **CLAUDE.md**: Development guidance for Claude Code
- **package.json**: Dependencies and scripts
- **biome.json**: Linting and formatting configuration
- **next.config.ts**: Next.js configuration
- **tsconfig.json**: TypeScript configuration
- **tailwind.config.ts**: Tailwind CSS configuration

## Migration Notes
- Migrated from Astro to Next.js 15
- Backup files stored in `astro-backup/` directory
- All functionality maintained while adding modern React features