---
last-validated: 2026-04-10
---

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
│   ├── layout/        # SitePage (page shell), Header, Footer, Breadcrumb
│   ├── common/        # RuleList/RuleRowBody (hairline rows), HydratedEmail
│   ├── article/       # Blog, CodeHighlight, ArticleCta, ArticleLink, ArticleSearchBar, PaginationNav
│   ├── providers/     # WebMCPProvider
│   ├── seo/           # GoogleAnalytics, JsonLd
│   └── forms/         # ContactForm
├── lib/
│   ├── server/        # createServerFn modules (highlight.ts, markdown.ts)
│   ├── microcms.ts    # Backward-compatible facade (@deprecated, createServerFn)
│   ├── utils.ts       # cn(), formatDate(), formatDateEditorial()
│   ├── link.ts        # External link utility (target="_blank" handling)
│   └── articleFeed.ts # Source adapters + pagination for the article feed
├── server/            # Worker-only code (markdown/ serves llms-style responses)
├── tests/             # Repo-wide config tests only (see Testing below)
└── types/             # Shared type definitions (domain re-exports)
```

## Key Locations
- `src/infrastructure/di/` - DI container (useCases)
- `src/domain/` - Domain layer (no external dependencies)
- `src/hooks/` - Custom hooks (article filtering, debounce)
- `src/lib/microcms.ts` - Backward-compatible facade (@deprecated)
- `src/server/markdown/home.ts` - Homepage markdown for LLM clients; keep in sync with `src/routes/index.tsx`
- `vite.config.ts` - Prerender/SSG configuration

## Testing
- Module-level tests colocate in a sibling `__tests__/` (`src/lib/__tests__/`, `src/components/__tests__/`, `src/routes/__tests__/`, `src/hooks/__tests__/`)
- `src/tests/` holds only repo-wide config tests that span wrangler/CI/vite
- Run with `bun test`

## Important Patterns

### Data Fetching
- **loader**: Server-side fetch via TanStack Router loader
- **createServerFn**: Server functions for secure API key handling (e.g., `src/lib/highlight.ts`, `src/lib/markdown.ts`)
- Reference: `src/routes/article/$slug.tsx` (loader + createServerFn example)

### Tailwind CSS v4
Breaking changes from v3. See `src/globals.css`.
- Define CSS variables with `@theme` directive
- Load plugins with `@plugin`

### Design System (editorial paper theme)
Single-column editorial layout on a Manila-paper surface. No WebGL, custom cursor,
marquee, or scroll-driven animation — motion is limited to View Transitions.
- **Colors**: `paper` / `ink` / `ink-body` / `ink-soft` / `ink-label` / `ink-faint` /
  `rule` / `rule-strong` / `carbon` (code blocks) / `alert` / `affirm`
- **Fonts**: Inter (body) + JetBrains Mono (labels and meta) only
- **Rhythm**: `--measure` (760px), `--gutter`, `--pagetop`, `--sectiongap`,
  `--rowpad` / `--rowpad-sm` — all narrowed at `max-width: 767px`
- **Utilities**: `.measure` (page column), `.label-mono` (section heading),
  `.meta-mono` (trailing meta), `.rule-row` (hairline grid row), `.lnk` (underlined link)
- Every page renders inside `SitePage`; only `/` passes `siteRoot` so the site name is the `h1`
- Paper grain and vignette are `body::before` / `body::after` (`z-index: 1`);
  page content sits at `z-index: 2`

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

### Article Feed
microCMS is currently the only article source. `src/lib/articleFeed.ts` keeps a
`ArticleSourceAdapter` seam so another source can be added without touching the routes.
- `ArticleFeedItem` in `src/types/index.ts` tags each item via `source: 'microcms'`
- External link detection uses `externalUrl` presence, not source name (`Blog.tsx`)

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
