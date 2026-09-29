<div align="center">
  <img src="public/assets/icons/icon-192x192.png" alt="Portfolio Logo" width="120" />
  <h1>Yunosuke Yoshino Portfolio</h1>
  <p>
    A modern portfolio site built with Astro 7, React 19, and Tailwind CSS v4
  </p>
  <p>
    <a href="https://yunosukeyoshino.com">Live Site</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#development">Development</a>
  </p>
</div>

---

## Overview

A personal portfolio and blog built with Astro 7. microCMS-managed articles are rendered
into a single-column editorial paper layout, prerendered at build time, and served from a
Cloudflare Worker via the `@astrojs/cloudflare` adapter.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Astro 7](https://astro.build/) |
| UI | [React 19](https://react.dev/) islands, [Tailwind CSS v4](https://tailwindcss.com/) |
| Data Fetching | Astro Content Layer + on-demand SSR (`export const prerender = false`) |
| CMS | [microCMS](https://microcms.io/) |
| Content | [marked](https://marked.js.org/), [Shiki](https://shiki.style/) |
| Forms | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), [Resend](https://resend.com/) |
| Hosting | [Cloudflare Workers](https://workers.cloudflare.com/) |
| Tooling | [Vite+](https://viteplus.dev/) 1.0 (`vp` CLI: Vite + Oxlint/Oxfmt + tsgolint + Vitest), [Bun](https://bun.sh/) |

## Project Structure

```
src/
├── domain/          # Entities & Repository interfaces
├── usecases/        # Business logic / application services
├── infrastructure/  # microCMS adapter & DI container
├── pages/           # Astro file-based routes & API endpoints
├── layouts/         # Base layout & HTML shell
├── components/      # UI components (Astro & React islands)
├── lib/             # Utility functions, helpers & server logic
├── data/            # Static data assets (SEO metadata)
└── tests/           # Configuration & build verification tests
```

## Getting Started

```bash
git clone https://github.com/YunosukeYoshino/portfolio.git
cd portfolio
bun install
cp .env.example .env.local
bun run dev
```

> [!NOTE]
> In development mode, the application uses mock data if microCMS credentials are not provided.

## Development

### Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server (Astro; equivalent: `vp run dev`) |
| `bun run build` | Build for production (`vp run build`) |
| `bun run lint` | `vp check` — Oxfmt check + Oxlint + type-aware typecheck |
| `bun run fix` | Auto-fix linting + formatting issues |
| `bun run typecheck` | `vp check --no-fmt --no-lint` (types only) |
| `bun run test` | `vp test` — run the Vitest suite |
| `bun run deploy` | Deploy to Cloudflare Workers via `cf` CLI |
| `bun run deploy:preview` | Deploy to the preview environment |
| `bun run lighthouse` | Build & run Lighthouse CI automated audit |

### Toolchain

This repo uses [Vite+](https://viteplus.dev/) 1.0, installed project-locally as the
`vite-plus` devDependency (`vp` is run via `bunx vp` or the package.json scripts above).
It unifies the dev toolchain:

- `vp check` — Oxfmt format check + Oxlint + type-aware typecheck (tsgolint)
- `vp test` — Vitest test runner (`vite-plus/test` import surface)
- `vp run dev` / `vp run build` — invoke the Astro scripts (the `vp dev`/`vp build`
  built-ins do not apply to Astro projects)
- `vp staged` — lint-staged equivalent for pre-commit hooks

All formatting, linting, and staged settings live in `vite.config.ts` (there are no
`.oxlintrc`/`.oxfmtrc`/ESLint/Prettier configs). Git hooks are managed by `vp hooks`
— `.vite-hooks/pre-commit` runs `vp staged`, and `bun install` re-installs the
dispatcher via the `prepare` script (`vp config`). `vp` runs on Node.js.

### Notes

- Internal implementation guidance for contributors and coding agents lives in `CLAUDE.md`.
- In development, microCMS-backed routes fall back to mock data when credentials are missing.
- Routes are prerendered at build time and served from a Cloudflare Worker via the `@astrojs/cloudflare` adapter (see `cloudflare.config.ts`).

## Deployment

Deployed to Cloudflare Workers with the [`cf` CLI](https://github.com/cloudflare/cf)
(`bun run deploy` = `astro build` → `cf-wrangler build` → `cf deploy --prebuilt`).
Pushes to `main` deploy automatically via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
Worker bindings, secrets and environments are declared in `cloudflare.config.ts`.

```bash
# Production deploy
bun run deploy

# Preview deploy
bun run deploy:preview
```

> [!IMPORTANT]
> The `cf` and `vp` CLIs run on Node.js — use Node.js 24 or higher locally
> (`vp staged` requires Node >= 22.22.1 or >= 24.11; the deploy workflow uses Node.js 22).

## Contributing

Bug reports and fixes are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md).
For security issues, follow [SECURITY.md](SECURITY.md) instead of opening an issue.

## License

Source code is released under the [MIT License](LICENSE).
Site content (blog articles, images, and other assets under `public/`) is © Yunosuke Yoshino
and is not covered by the MIT License.
