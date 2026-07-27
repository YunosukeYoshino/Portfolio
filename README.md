<div align="center">
  <img src="public/assets/icons/icon-192x192.png" alt="Portfolio Logo" width="120" />
  <h1>Yunosuke Yoshino Portfolio</h1>
  <p>
    A modern portfolio site built with Astro 5, React 19, and Tailwind CSS v4
  </p>
  <p>
    <a href="https://yunosukeyoshino.com">Live Site</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#development">Development</a>
  </p>
</div>

---

## Overview

A personal portfolio and blog built with Astro 5. microCMS-managed articles are rendered
into a single-column editorial paper layout, prerendered at build time, and served from a
Cloudflare Worker via the `@astrojs/cloudflare` adapter.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Astro 5](https://astro.build/) |
| UI | [React 19](https://react.dev/) islands, [Tailwind CSS v4](https://tailwindcss.com/) |
| Data Fetching | Astro Content Layer + on-demand SSR (`export const prerender = false`) |
| CMS | [microCMS](https://microcms.io/) |
| Content | [marked](https://marked.js.org/), [Shiki](https://shiki.style/) |
| Forms | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), [Resend](https://resend.com/) |
| Hosting | [Cloudflare Workers](https://workers.cloudflare.com/) |
| Tooling | [Biome](https://biomejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Bun](https://bun.sh/) |

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
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run lint` | Run Biome + TypeScript + Markuplint checks |
| `bun run fix` | Auto-fix linting issues |
| `bun run typecheck` | TypeScript type-checking only |
| `bun test` | Run the test suite |
| `bun run deploy` | Deploy to Cloudflare Workers |
| `bun run deploy:preview` | Deploy to the preview environment |

### Notes

- Internal implementation guidance for contributors and coding agents lives in `CLAUDE.md`.
- In development, microCMS-backed routes fall back to mock data when credentials are missing.
- Routes are prerendered at build time and served from a Cloudflare Worker via the `@astrojs/cloudflare` adapter (see `wrangler.toml`).

## Deployment

Deployed to Cloudflare Workers with Wrangler. Pushes to `main` deploy automatically via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

```bash
# Production deploy
bun run deploy

# Preview deploy
bun run deploy:preview
```

> [!IMPORTANT]
> The deploy workflow runs on Node.js 22. Use Node.js 22 or higher for local deploys as well.

## Contributing

Bug reports and fixes are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md).
For security issues, follow [SECURITY.md](SECURITY.md) instead of opening an issue.

## License

Source code is released under the [MIT License](LICENSE).
Site content (blog articles, images, and other assets under `public/`) is © Yunosuke Yoshino
and is not covered by the MIT License.
