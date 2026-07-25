---
last-validated: 2026-07-26
---

Please reason in English and respond in Japanese.

# Portfolio Project

## Project Overview
Personal portfolio site that fetches blog articles from microCMS and showcases skills and projects.

## Tech Stack
- **Framework**: Astro 5 (`output: 'static'` with per-route SSR via `export const prerender = false`) + React 19 islands
- **CMS**: microCMS (synced via the Astro Content Layer API — see `src/content.config.ts`)
- **Styling**: Tailwind CSS v4 (CSS-first, loaded through `@tailwindcss/vite`)
- **Data Fetching**: Astro loaders + Content Layer; server endpoints live in `src/pages/api/`
- **Deploy**: Cloudflare Workers via `@astrojs/cloudflare` (built artifacts under `dist/`)

## Package Manager
**Required**: Use **Bun**, not `npm`.

## Key Commands
```
bun run dev             # Astro dev server (http://localhost:4321)
bun run build           # Production build (astro build -> dist/)
bun run lint            # Biome + TypeScript + Markuplint
bun run fix             # Auto-fix
bun run typecheck       # TypeScript type-checking only
bun test                # Run the test suite
bun run deploy          # Deploy to main branch
bun run deploy:preview  # Deploy to preview branch
bun run cf:typegen      # Regenerate Cloudflare binding types (wrangler types)
bun run seo:optimize    # Regenerate src/data/seo-metadata.json (:dry / :force variants)
bun run verify:deployment # Check deployment assets after a build
```

## Known Constraints
- **Zod v3**: Pinned to `^3.25.76`. Schemas in `src/lib/contactSchema.ts` rely on the v3 API; verify behavior before upgrading to v4.

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
│   └── di/            # Dependency injection container (createUseCases)
├── pages/             # Astro file-based routes
│   ├── api/           # Server endpoints (contact.ts - Resend-backed contact API)
│   ├── article/       # [slug].astro (detail), page/[page].astro (paginated list)
│   ├── index.astro    # Home
│   ├── about.astro, contact.astro, privacy-policy.astro
│   └── sitemap.xml.ts # Dynamic sitemap (uses useCases.getAllBlogIds)
├── layouts/           # Layout.astro (site shell, head, GA, JSON-LD)
├── components/        # UI components (Astro + React islands)
│   ├── layout/        # Header.astro, Footer.astro
│   ├── article/       # ArticleCta.astro, PaginationNav.astro
│   ├── seo/           # JsonLd.tsx (schema generators), JsonLdScript.astro
│   └── forms/         # ContactForm.tsx (React island, react-hook-form + Zod)
├── lib/
│   ├── server/        # Server-only code
│   │   ├── markdown/  # home.ts / article.ts / index.ts (LLM-facing markdown delivery)
│   │   ├── highlight.ts  # Shiki highlight core (content type -> html)
│   │   └── contactMail.ts # Resend email sender (Astro API route only)
│   ├── article/       # feed.ts (source adapters + pagination), render.ts (rendering), fetch.ts (fetching façade)
│   ├── contactSchema.ts # Zod schemas (ContactPayload)
│   ├── pagination.ts  # Pagination math
│   ├── seoMetadata.ts # Per-page SEO metadata builder
│   ├── siteMetadata.ts # Site-wide constants (SITE_URL, GA_TRACKING_ID, etc.)
│   ├── link.ts        # External link utility (target="_blank" handling)
│   └── utils.ts       # cn(), formatDate(), formatDateEditorial()
├── data/              # Generated static data (seo-metadata.json, see seo:optimize)
├── tests/             # Repo-wide config tests (Astro build output, deploy workflow)
├── types/             # Shared type definitions (domain re-exports)
├── content.config.ts  # microCMS Content Layer loader (glob + API fetch)
├── globals.css        # Tailwind v4 + paper theme (@theme tokens, utilities)
└── middleware.ts      # Astro middleware
```

## Key Locations
- `astro.config.mjs` - Astro config (output mode, adapter, integrations, redirects)
- `src/content.config.ts` - microCMS Content Layer loader
- `src/layouts/Layout.astro` - Site shell (head, GA, google-site-verification, JSON-LD)
- `src/infrastructure/di/` - DI container (useCases)
- `src/domain/` - Domain layer (no external dependencies)
- `src/pages/api/contact.ts` - Contact form endpoint (Resend)
- `src/lib/server/markdown/home.ts` - Homepage markdown for LLM clients; keep in sync with `src/pages/index.astro`
- `wrangler.toml` - Cloudflare Workers configuration
- `src/globals.css` - Tailwind v4 theme + paper design tokens

## Testing
- Module-level tests colocate in a sibling `__tests__/` (e.g. `src/lib/__tests__/`)
- `src/tests/` holds repo-wide config tests (Astro build output, deploy workflow)
- Run with `bun test`

## Important Patterns

### Data Fetching
- **Content Layer**: microCMS content is loaded via `src/content.config.ts` and queried through the use cases.
- **Astro loaders**: Pages fetch data via `useCases` through the `src/lib/article/fetch.ts` façade.
- **Server endpoints**: `src/pages/api/*.ts` for form submissions (Resend).
- **Server-only helpers**: `src/lib/server/` (highlight, markdown, contactMail) — never import these from client islands.
- Reference: `src/pages/article/[slug].astro` (detail page)

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
- Every page renders inside `Layout.astro`; only `/` passes `siteRoot` so the site name is the `h1`
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

The Content Layer loader (`src/content.config.ts`) returns mock data in development when credentials are not set.

**For testing**: Inject a fake repository
```typescript
import { createUseCases } from '@/infrastructure/di'
const testUseCases = createUseCases(fakeBlogRepository)
```

### Article Feed
microCMS is currently the only article source. `src/lib/article/feed.ts` keeps an
`ArticleSourceAdapter` seam so another source can be added without touching the pages.
- `ArticleFeedItem` in `src/types/index.ts` tags each item via `source: 'microcms'`
- External link detection uses `externalUrl` presence, not source name

### Prerendering
`output: 'static'` in `astro.config.mjs`. Per-route `export const prerender = false` opts into on-demand SSR (contact API, LLM markdown).

### Form Validation
Zod + react-hook-form pattern. See `src/components/forms/ContactForm.tsx` and `src/lib/contactSchema.ts`.

### Cloudflare Workers Deploy
The `@astrojs/cloudflare` adapter emits `dist/_worker.js/index.js` (referenced by `main` in
`wrangler.toml`); `[assets]` serves `dist/` as static assets. The `build` script writes
`dist/.assetsignore` containing `_worker.js` and `_routes.json` so neither the worker entry nor
the (Workers-ignored) routing manifest is uploaded as a static asset. After deploy, `bun run verify:deployment <url>` fetches the live HTML and
confirms `/_astro/*` (and legacy `/assets/*`) scripts and styles return the expected
content-type rather than an HTML fallback.

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
