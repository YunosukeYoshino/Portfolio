<div align="center">
  <img src="public/assets/icons/icon-192x192.png" alt="Portfolio Logo" width="120" />
  <h1>Yunosuke Yoshino Portfolio</h1>
  <p>
    A modern portfolio site built with TanStack Start, React 19, and Tailwind CSS v4
  </p>
  <p>
    <a href="https://yunosukeyoshino.com">Live Site</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#development">Development</a>
  </p>
</div>

---

## Overview

A personal portfolio and blog built with TanStack Start. It combines microCMS-managed articles, external feed aggregation, and motion-heavy presentation for projects and writing.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) |
| UI | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) |
| Data Fetching | [TanStack Query](https://tanstack.com/query) |
| CMS | [microCMS](https://microcms.io/) |
| Animation | [Lenis](https://github.com/studio-freight/lenis), [Three.js](https://threejs.org/), [GSAP](https://greensock.com/gsap/) |
| Forms | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), [Resend](https://resend.com/) |
| Tooling | [Biome](https://biomejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Bun](https://bun.sh/) |

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
| `bun run deploy` | Deploy to Cloudflare Pages |
| `bun run deploy:preview` | Deploy to preview branch |

### Notes

- Internal implementation guidance for contributors and coding agents lives in `CLAUDE.md`.
- In development, microCMS-backed routes fall back to mock data when credentials are missing.
- The site is statically exported and deployed to Cloudflare Pages.

### Architecture

![Portfolio Architecture](docs/diagrams/architecture.svg)

## Deployment

Deployed as a static site to Cloudflare Pages.

```bash
# Production deploy
bun run deploy

# Preview deploy
bun run deploy:preview
```

> [!IMPORTANT]
> Set `NODE_VERSION=20` or higher in your Cloudflare Pages project settings.
