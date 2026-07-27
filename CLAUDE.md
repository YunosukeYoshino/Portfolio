---
last-validated: 2026-07-27
---

Please reason in English and respond in Japanese.

# Portfolio Project

## Project Overview
- **WHAT**: Personal portfolio site showcasing skills, projects, and microCMS-backed blog articles.
- **WHY**: Serve as a high-performance, accessible, and editorial web identity for Yunosuke Yoshino.
- **HOW**: Built with Astro 7, React 19, Tailwind CSS v4, Clean Architecture / Content Layer, and deployed to Cloudflare Workers.

## Tech Stack
- **Framework**: Astro 7 (`output: 'static'` with per-route SSR via `export const prerender = false`) + React 19 islands
- **CMS**: microCMS (synced via Astro Content Layer API — see `src/content.config.ts`)
- **Styling**: Tailwind CSS v4 (CSS-first, loaded through `@tailwindcss/vite`)
- **Data Fetching**: Astro Content Layer (`getCollection`) & Clean Architecture `useCases`
- **Deploy**: Cloudflare Workers via `@astrojs/cloudflare` v14 (built artifacts under `dist/`)

## Package Manager
**Required**: Use **Bun**, not `npm`.

## Key Commands
```bash
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

## Key Locations
| Location | Purpose |
| --- | --- |
| `astro.config.mjs` | Astro config (output mode, adapter, integrations, redirects) |
| `src/content.config.ts` | microCMS Content Layer loader |
| `src/layouts/Layout.astro` | Site shell (head, GA, google-site-verification, JSON-LD) |
| `src/infrastructure/di/` | DI container (`useCases`) |
| `src/domain/` | Domain layer (no external dependencies) |
| `src/pages/api/contact.ts` | Contact form endpoint (Resend-backed) |
| `src/lib/server/markdown/home.ts` | Homepage markdown for LLM clients; keep in sync with `src/pages/index.astro` |
| `wrangler.toml` | Cloudflare Workers configuration |
| `src/globals.css` | Tailwind v4 theme + paper design tokens |

## Directory Structure
```
src/
├── domain/            # Domain layer (entities, repository interfaces)
│   ├── entities/      # Blog, BlogResponse entities
│   └── repositories/  # BlogRepository port
├── usecases/          # Business logic use cases
│   └── blog/          # GetBlogsUseCase, GetBlogDetailUseCase, GetAllBlogIdsUseCase
├── infrastructure/    # Concrete implementations & DI
│   ├── microcms/      # microCMS adapter
│   └── di/            # Dependency injection container
├── pages/             # Astro file-based routes & API endpoints
│   ├── api/           # Server endpoints (contact.ts)
│   ├── article/       # [slug].astro (detail), page/[page].astro (paginated list)
│   ├── index.astro    # Home
│   ├── about.astro, contact.astro, privacy-policy.astro
│   └── sitemap.xml.ts # Dynamic sitemap
├── layouts/           # Layout.astro (site shell)
├── components/        # UI components (Astro + React islands)
│   ├── layout/        # Header.astro, Footer.astro
│   ├── article/       # ArticleCta.astro, PaginationNav.astro
│   ├── seo/           # JsonLd.tsx, JsonLdScript.astro
│   └── forms/         # ContactForm.tsx (React island)
├── lib/               # Utilities & domain helper logic
│   ├── server/        # Server-only code (markdown, highlight, contactMail)
│   ├── article/       # feed.ts, render.ts, fetch.ts
│   ├── contactSchema.ts # Zod schemas
│   ├── pagination.ts  # Pagination math
│   ├── seoMetadata.ts # SEO metadata builder
│   └── siteMetadata.ts # Site constants
├── data/              # Static generated data (seo-metadata.json)
├── tests/             # Repo-wide config tests (Astro build, deploy workflow)
├── types/             # Shared type definitions
├── content.config.ts  # microCMS Content Layer loader
├── globals.css        # Tailwind v4 theme & paper styles
└── middleware.ts      # Astro middleware
```

## Known Constraints
- **Zod v4**: Upgraded to `^4.4.3`. Schemas live in `src/lib/contactSchema.ts`.

## Testing
- Repo-wide config tests live in `src/tests/` (Astro build output, deploy workflow)
- Run with `bun test`

## Important Patterns

### Data Fetching
- **Content Layer & Loaders**: microCMS content is loaded via `src/content.config.ts`.
- **Fetching Options**:
  - Direct Content Layer: Pages like `src/pages/article/page/[page].astro` use `getCollection('articles')` with `src/lib/article/feed.ts` adapters.
  - Clean Architecture `useCases`: Pages like `src/pages/article/[slug].astro` use `src/lib/article/fetch.ts` façade or `useCases` directly.
- **Server endpoints**: `src/pages/api/*.ts` for form submissions (Resend).
- **Server-only helpers**: `src/lib/server/` (highlight, markdown, contactMail) — never import these from client islands.

### Tailwind CSS v4 & Design System
- Single-column editorial paper layout with Manila-paper surface (`#fbf9f5`).
- Define CSS variables with `@theme` directive in `src/globals.css`.
- Motion is strictly limited to View Transitions.

### Cloudflare Workers Deploy
- The `@astrojs/cloudflare` adapter builds artifacts into `dist/`.
- Worker entry point is emitted at `dist/_worker.js/index.js` (referenced by `main` in `wrangler.toml`).
- Static assets are served from `dist/` (`[assets]`). `dist/.assetsignore` ignores `_worker.js` and `_routes.json`.
- Post-deploy verification script `bun run verify:deployment <url>` verifies static assets (including `dist/_astro/*` scripts or `public/assets/*`).

## Safety & Guardrails
- **Destructive Commands**: Never execute `git reset --hard`, `git clean -fd`, or force pushes without user explicit instruction. Keep commits local.
- **Secrets Management**: Secrets (`MICROCMS_*`, `RESEND_API_KEY`) must remain in `.env.local` or Cloudflare Worker bindings. Never commit raw keys.

## Git Workflow
- Main branch: `main`
- Deploy: `bun run deploy` (main), `bun run deploy:preview` (preview)
- Commit format: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`)
