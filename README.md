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

A personal portfolio and blog site for showcasing projects and sharing technical articles.

**Key Features:**
- **microCMS** integration for headless content management
- **Lenis** + **Three.js** for smooth scrolling and WebGL animations
- **Cloudflare Pages** deployment with static export for global edge delivery

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

### Prerequisites

- [Bun](https://bun.sh/) v1.0.0+
- [Node.js](https://nodejs.org/) v18.0.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/YunosukeYoshino/portfolio.git
cd portfolio

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
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
| `bun run lint` | Run Biome + TypeScript checks |
| `bun run fix` | Auto-fix linting issues |
| `bun run deploy` | Deploy to Cloudflare Pages |

### Spec-Driven Development

This project uses [cc-sdd](https://github.com/gotalab/cc-sdd) for spec-driven development workflow.

```bash
# Set up Spec-Driven Development workflow
bunx cc-sdd@latest --claude-agent
```

**Workflow:**

```
Requirements → Design → Tasks → Implementation
```

Specs are stored in `.kiro/specs/` with the following structure:

```
.kiro/
├── settings/
│   ├── rules/        # Design and analysis rules
│   └── templates/    # Spec templates
├── steering/         # Project-wide policies
└── specs/            # Feature specifications
```

> [!TIP]
> When adding new features, start with `spec-init` to define requirements before implementation.

### Project Structure

```
src/
├── domain/            # Domain layer (entities, repository ports)
│   ├── entities/      # Blog, BlogResponse etc.
│   └── repositories/  # BlogRepository interface
├── usecases/          # Application business logic
│   └── blog/          # GetBlogsUseCase, GetBlogDetailUseCase
├── infrastructure/    # External implementations
│   ├── microcms/      # microCMS adapter
│   └── di/            # Dependency injection container
├── routes/            # TanStack Router pages and layouts
├── components/        # React components
├── lib/               # Utilities and legacy facades
└── types/             # TypeScript type definitions (re-exports)
```

> [!NOTE]
> This project follows Clean Architecture principles. Domain layer has no external dependencies.

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

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MICROCMS_SERVICE_DOMAIN` | microCMS service domain |
| `MICROCMS_API_KEY` | microCMS API key |
| `RESEND_API_KEY` | Resend API key for contact form |
| `SITE_URL` | Site URL |
