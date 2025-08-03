# Code Style & Conventions

## TypeScript Configuration
- **Strict mode enabled**: All type safety features active
- **Path aliases**: `@/*` for `src/*`, `@/components/*`, etc.
- **Experimental features**: typedRoutes for type-safe navigation
- **Target**: ES2017
- **Module resolution**: bundler (modern)

## Biome Configuration (Linting & Formatting)
### Formatting Rules
- **Indentation**: 2 spaces
- **Line width**: 100 characters
- **Quote style**: Single quotes preferred
- **Semicolons**: As needed (ASI)
- **Trailing commas**: ES5 compatible

### Linting Rules
- **Console usage**: `console.*` warns, `debugger` errors
- **Import organization**: Automatic import sorting enabled
- **Type imports**: Must use `import type` for types
- **Const usage**: Prefer `const` over `let`
- **Non-null assertions**: Warn on `!` operator usage

## Naming Conventions
### Files & Directories
- **Components**: PascalCase (e.g., `Header.tsx`, `MainVisual.tsx`)
- **Pages**: lowercase with hyphens (e.g., `page.tsx`, `not-found.tsx`)
- **Utilities**: camelCase (e.g., `microcms.ts`, `utils.ts`)
- **Types**: camelCase files (e.g., `index.ts`)
- **Styles**: Component.module.scss pattern

### Code
- **Components**: PascalCase (e.g., `MainVisual`, `BlogList`)
- **Functions**: camelCase (e.g., `getBlogs`, `formatDate`)
- **Variables**: camelCase (e.g., `blogData`, `isLoading`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `API_ENDPOINT`)
- **Types/Interfaces**: PascalCase (e.g., `Blog`, `BlogResponse`)

## SCSS/CSS Architecture (FLOCSS)
### Methodology Structure
- **Foundation**: Base styles and reset (`globals.css`)
- **Layout**: Grid and layout components (l-* prefix)
- **Component**: Reusable UI components (c-* prefix)
- **Project**: Page-specific styles (p-* prefix)
- **Utility**: Tailwind utility classes

### Styling Approach
- **CSS Modules**: For component-specific styles
- **Tailwind CSS**: For utility classes and rapid development
- **SCSS**: For complex styling with variables and mixins

## React Patterns
### Component Structure
- **Server Components**: Default (no 'use client')
- **Client Components**: Explicitly marked with 'use client' directive
- **Props typing**: Always use TypeScript interfaces
- **Export pattern**: Default exports for pages, named for utilities

### File Organization
```typescript
// 1. Type imports first
import type { Blog, BlogResponse } from '@/types'

// 2. Library imports
import { createClient } from 'microcms-js-sdk'

// 3. Local imports
import { formatDate } from '@/lib/utils'

// 4. Component definition
export default function BlogList({ blogs }: Props) {
  // Component logic
}
```

## Error Handling
- **Type safety**: Strict TypeScript enforcement
- **Runtime errors**: Graceful degradation with fallbacks
- **API errors**: Mock data in development, proper error boundaries
- **Missing data**: Default values and loading states

## Documentation
- **Comments**: Minimal, code should be self-documenting
- **Type definitions**: Comprehensive interfaces for all data
- **README updates**: When adding major features
- **CLAUDE.md**: Keep development guidance current