Please reason in English and respond in Japanese.

# Portfolio Project

## Project Overview
Personal portfolio site that fetches blog articles from microCMS and showcases skills and projects.

## Tech Stack
- **Framework**: TanStack Start + React 19
- **CMS**: microCMS
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **Data Fetching**: TanStack Query (React Query)
- **Deploy**: Cloudflare Pages (static export)

## Package Manager
**Required**: Use **Bun**, not `npm`.

## Key Commands
```
bun run dev             # Dev server -> http://portfolio.localhost (portless)
bun run build           # Production build
bun run lint            # Biome + TypeScript + Markuplint
bun run fix             # Auto-fix
bun run deploy          # Deploy to main branch
bun run deploy:preview  # Deploy to preview branch
```

## Known Constraints
- **Zod v3**: Must use v3 (^3.24.2) for compatibility with @tanstack/router-generator. v4 is not allowed.

## Directory Structure
```
src/
├── domain/            # Domain layer (no external dependencies)
│   ├── entities/      # Blog, BlogResponse entities
│   └── repositories/  # BlogRepository port (interface)
├── usecases/          # Use case layer (business logic)
│   └── blog/          # GetBlogsUseCase, GetBlogDetailUseCase, GetAllBlogIdsUseCase
├── infrastructure/    # Infrastructure layer (concrete implementations)
│   ├── microcms/      # microCMS adapter
│   └── di/            # Dependency injection container
├── hooks/             # Custom hooks (useArticleFilter, useDebounce, articleFilterLogic)
├── routes/            # TanStack Router pages and layouts
├── components/        # React components
│   ├── layout/        # Header, Footer, Breadcrumb
│   ├── sections/      # HeroSection, AboutSection, WorksSection, ArticlesSection, SkillsMarquee
│   ├── article/       # ArticleItem, ArticlesHoverEffect, Blog, CodeHighlight, ArticleCta, ArticleLink, ArticleSearchBar
│   ├── effects/       # CustomCursor, NoiseOverlay, WebGLBackground, SplitText, TextScramble, MagneticButton
│   ├── providers/     # LenisProvider, ClientLoader
│   ├── seo/           # GoogleAnalytics, JsonLd
│   └── forms/         # ContactForm
├── lib/
│   ├── microcms.ts    # Backward-compatible facade (@deprecated)
│   ├── utils.ts       # cn(), formatDate()
│   ├── highlight.ts   # Code highlighting via Shiki (createServerFn)
│   ├── link.ts        # External link utility (target="_blank" handling)
│   ├── markdown.ts    # Markdown processing utilities
│   ├── zennRss.ts     # Zenn RSS feed fetcher (createServerFn)
│   └── qiitaRss.ts    # Qiita Atom feed fetcher with OGP image fetch (createServerFn)
└── types/             # Shared type definitions (domain re-exports)
```

## Key Locations
- `src/infrastructure/di/` - DI container (useCases)
- `src/domain/` - Domain layer (no external dependencies)
- `src/hooks/` - Custom hooks (article filtering, debounce)
- `src/lib/microcms.ts` - Backward-compatible facade (@deprecated)
- `src/lib/zennRss.ts` - Zenn RSS feed fetcher
- `src/lib/qiitaRss.ts` - Qiita Atom feed fetcher (fetches OGP image per article)
- `vite.config.ts` - Prerender/SSG configuration

## Important Patterns

### Data Fetching
- **loader**: Server-side fetch via TanStack Router loader
- **createServerFn**: Server functions for secure API key handling (e.g., `src/lib/highlight.ts`, `src/lib/zennRss.ts`)
- Reference: `src/routes/article/$slug.tsx` (loader + createServerFn example)

### Tailwind CSS v4
Breaking changes from v3. See `src/globals.css`.
- Define CSS variables with `@theme` directive
- Load plugins with `@plugin`

### microCMS Integration (Clean Architecture)
**Recommended**: Use `useCases` directly
```typescript
import { useCases } from '@/infrastructure/di'

const blogs = await useCases.getBlogs.execute()
const blog = await useCases.getBlogDetail.execute('slug')
const paged = await useCases.getBlogs.paginated(1, 6)
const ids = await useCases.getAllBlogIds.execute()
```

**Backward compatible**: Facade functions in `src/lib/microcms.ts` still work (@deprecated).
Returns mock data in development when credentials are not set.

**For testing**: Inject a fake repository
```typescript
import { createUseCases } from '@/infrastructure/di'
const testUseCases = createUseCases(fakeBlogRepository)
```

### Zenn / Qiita RSS Integration
Fetches articles from RSS/Atom feeds and displays them alongside microCMS articles.
- `src/lib/zennRss.ts` - Zenn RSS (RSS format: `<item>`, thumbnail from enclosure tag)
- `src/lib/qiitaRss.ts` - Qiita Atom (Atom format: `<entry>`; fetches og:image from each article HTML)
- `ArticleFeedItem` in `src/types/index.ts` distinguishes sources via `source: 'microcms' | 'zenn' | 'qiita'`
- External link detection uses `externalUrl` presence, not source name (`Blog.tsx`)
- imgix transform params (`?w=800&fm=webp`) are only applied to microCMS-hosted images

### Prerendering
See prerender configuration in `vite.config.ts`.

### Form Validation
Zod + react-hook-form pattern. See `src/components/ContactForm.tsx`.

## Code Quality
Biome + TypeScript strict mode. See `biome.json` for configuration.
Auto-fix: `bun run fix`
- After any frontend/UI change, verify the affected screen in a real browser before handoff. Prefer agent-browser or Playwright, and check at least one desktop viewport plus one mobile viewport.

## Git Workflow
- Main branch: `main`
- Deploy: `bun run deploy` (main), `bun run deploy:preview` (preview)
- Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`

## Environment Variables
See `.env.example`.
