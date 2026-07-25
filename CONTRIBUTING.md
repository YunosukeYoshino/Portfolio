# Contributing

Thanks for taking a look. This is a personal portfolio site, so the scope is
intentionally narrow: **bug reports and fixes are welcome, new features generally
are not** — design and content decisions are personal ones.

If you want to reuse the code, the source is MIT-licensed. Fork away. Note that
the site content under `public/` (articles, images) is not covered by that license.

## Before You Start

For anything larger than a typo or an obvious bug fix, please open an issue first
so we can agree on the approach. Security issues go through
[SECURITY.md](SECURITY.md), not the public issue tracker.

## Setup

Bun is required — not npm or pnpm.

```bash
bun install
cp .env.example .env.local
bun run dev
```

microCMS credentials are optional. Without them, article routes fall back to mock
data in development.

## Before Opening a Pull Request

Both of these must pass; CI runs the same commands.

```bash
bun run lint
bun test
```

`bun run fix` auto-fixes most Biome findings. A `lint-staged` pre-commit hook also
formats staged files.

## Conventions

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) —
  `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`
- **Branches**: branch off `main`; PRs target `main`
- **Architecture**: the domain / usecase / infrastructure layering and the
  editorial design system are documented in [CLAUDE.md](CLAUDE.md). Read it before
  touching `src/domain/`, `src/usecases/`, or styling.
- **Tests**: module tests live in a sibling `__tests__/` directory
- **UI changes**: verify in a real browser at one desktop and one mobile viewport,
  and say so in the PR
