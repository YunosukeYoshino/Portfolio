<div align="center">
  <img src="public/assets/icons/icon-192x192.png" alt="Portfolio Logo" width="120" />
  <h1>Yunosuke Yoshino Portfolio</h1>
  <p>
    <strong>A modern, high-performance portfolio website built with Next.js 15, React 19, and Tailwind CSS v4.</strong>
  </p>
  <p>
    <a href="https://yunosukeyoshino.com">View Live Site</a>
  </p>
</div>

---

## 📖 Overview

This project is a personal portfolio and blog site designed to showcase projects and share technical articles. It leverages the latest web technologies to ensure top-tier performance, accessibility, and SEO. The site is statically generated using Next.js App Router and deployed to Cloudflare Pages for global edge delivery.

Content is managed via **microCMS**, allowing for easy updates without code changes. The UI features smooth animations powered by **Lenis** and **Three.js**, providing an immersive user experience.

## ✨ Features

- **🚀 Next.js 15 App Router:** Utilizing React Server Components for optimal performance.
- **🎨 Tailwind CSS v4:** The latest utility-first CSS framework for rapid UI development.
- **📝 microCMS Integration:** Headless CMS for managing blog posts and dynamic content.
- **⚡ Static Export:** Fully static site generation (`output: 'export'`) for Cloudflare Pages.
- **✨ Rich Animations:** Smooth scrolling with Lenis and WebGL background effects with Three.js.
- **🔍 SEO Optimized:** Automatic sitemap, robots.txt, and JSON-LD generation.
- **🛡️ Type Safe:** Built with TypeScript and Zod for robust data validation.
- **💌 Contact Form:** Integrated with Resend for reliable email delivery.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **CMS:** [microCMS](https://microcms.io/)
- **Animation:** [Lenis](https://github.com/studio-freight/lenis), [Three.js](https://threejs.org/)
- **Forms:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), [Resend](https://resend.com/)
- **Linting & Formatting:** [Biome](https://biomejs.dev/)
- **Package Manager:** [Bun](https://bun.sh/)

## 🚀 Getting Started

### Prerequisites

- **Bun** (v1.0.0 or later)
- **Node.js** (v18.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YunosukeYoshino/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following keys:

   ```env
   MICROCMS_SERVICE_DOMAIN=your-service-domain
   MICROCMS_API_KEY=your-api-key
   RESEND_API_KEY=your-resend-api-key
   SITE_URL=http://localhost:3000
   ```

   > [!NOTE]
   > In development mode, the application uses mock data if credentials are not provided, allowing you to run it locally without external services.

4. Start the development server:
   ```bash
   bun run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `bun run dev` | Starts the development server. |
| `bun run build` | Builds the application for production. |
| `bun run start` | Starts the production server locally. |
| `bun run lint` | Runs Biome and TypeScript checks. |
| `bun run fix` | Automatically fixes linting and formatting issues. |
| `bun run deploy` | Deploys the `out` directory to Cloudflare Pages (main branch). |

> [!NOTE]
> This project uses **Bun** as the package manager. Please use `bun` instead of `npm` or `yarn` for all scripts.

## 📂 Project Structure

```
.
├── docs/               # Documentation files
├── public/             # Static assets (images, icons)
├── src/
│   ├── app/            # Next.js App Router pages and layouts
│   ├── components/     # React components (Server & Client)
│   ├── lib/            # Utility functions and API clients
│   ├── styles/         # Global styles
│   └── types/          # TypeScript type definitions
├── biome.json          # Biome configuration
├── next.config.ts      # Next.js configuration
└── tailwind.config.ts  # Tailwind CSS configuration
```

## ☁️ Deployment

This project is configured for **Cloudflare Pages**.

1. **Build the project:**
   ```bash
   bun run build
   ```
   This will generate a static `out/` directory.

2. **Deploy:**
   The project includes a `wrangler.toml` configuration. You can deploy directly using Wrangler:
   ```bash
   bun run deploy
   ```

> [!IMPORTANT]
> Ensure that the `NODE_VERSION` environment variable is set to `20` or higher in your Cloudflare Pages project settings.

## 🧩 Key Patterns

### Server vs Client Components
- **Server Components** are the default and used for data fetching and SEO.
- **Client Components** are marked with `'use client'` and used for interactivity (forms, animations).

### Tailwind CSS v4
This project uses the latest Tailwind CSS v4. Configuration is primarily handled via CSS variables in `src/app/globals.css` using the `@theme` directive.

```css
@theme {
  --background: #f3f3f1;
  /* ... */
}
```
