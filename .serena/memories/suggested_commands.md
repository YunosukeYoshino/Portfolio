# Suggested Commands

## Development Commands
- `npm run dev` - Start Next.js development server (localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run preview` - Build and start production server

## Code Quality & Formatting
- `npm run lint` - Run all linters (Biome, TypeScript)
- `npm run lint:biome` - Run Biome linter only
- `npm run lint:tsc` - Run TypeScript compiler check
- `npm run fix` - Auto-fix all linting issues
- `npm run fix:biome` - Auto-fix Biome issues
- `npm run format` - Format code with Biome
- `npm run check` - Check code with Biome
- `npm run ci` - Run Biome in CI mode

## Performance & Testing
- `npm run lih` - Run Lighthouse performance audit on localhost:3000

## System Commands (macOS/Darwin)
- `ls` - List directory contents
- `cd` - Change directory
- `grep` or `rg` (ripgrep) - Search text in files
- `find` - Find files by name/pattern
- `git` - Version control operations
- `code` or `vim` - Open files in editor

## Package Management
- `npm install` - Install all dependencies
- `npm install <package>` - Install specific package
- `npm uninstall <package>` - Remove package
- `npm audit` - Check for security vulnerabilities
- `npm audit fix` - Fix security issues automatically

## Git Workflow
- `git status` - Check repository status
- `git add .` - Stage all changes
- `git commit -m "message"` - Commit changes
- `git push` - Push to remote repository
- `git pull` - Pull latest changes

## Development Notes
- Use Node.js 22.12.0 (managed by Volta)
- Development server auto-restarts on file changes
- TypeScript compilation is handled by Next.js
- Biome handles both linting and formatting (replaced ESLint + Prettier)