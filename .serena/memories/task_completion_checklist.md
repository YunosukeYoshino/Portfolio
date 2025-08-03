# Task Completion Checklist

## Before Committing Code
1. **Run linting and formatting**:
   ```bash
   npm run lint        # Check all linting rules
   npm run fix         # Auto-fix issues
   npm run format      # Format code
   ```

2. **Type checking**:
   ```bash
   npm run lint:tsc    # TypeScript compilation check
   ```

3. **Build verification**:
   ```bash
   npm run build       # Ensure production build works
   ```

4. **Test locally**:
   ```bash
   npm run dev         # Start development server
   # Visit localhost:3000 to verify functionality
   ```

## Code Quality Standards
- ✅ All TypeScript errors resolved
- ✅ Biome linting passes without errors
- ✅ Code follows established naming conventions
- ✅ Imports are properly organized (types first, then libraries, then local)
- ✅ No console.log statements in production code (warnings acceptable)
- ✅ Components have proper TypeScript interfaces for props

## Performance Considerations
- ✅ Use Server Components by default
- ✅ Only add 'use client' when interactivity is needed
- ✅ Optimize images with next/image component
- ✅ Implement proper loading states and error boundaries
- ✅ Use static generation for blog content when possible

## Optional Performance Audit
- `npm run lih` - Run Lighthouse audit if performance-critical changes were made

## Git Workflow
1. **Stage changes**: `git add .`
2. **Commit with descriptive message**: `git commit -m "feat: add new blog component"`
3. **Push to remote**: `git push`

## When Adding Dependencies
1. Check if dependency aligns with project tech stack
2. Update package.json
3. Run `npm install`
4. Update documentation if it affects development workflow
5. Consider bundle size impact

## Environment Variables
- Verify `.env.local` has required variables for local development
- Update `.env.example` if new environment variables are added
- Never commit actual API keys or secrets

## Documentation Updates
- Update CLAUDE.md if development workflow changes
- Update README.md for significant feature additions
- Keep type definitions current in `src/types/index.ts`

## Deployment Checklist (if applicable)
- ✅ Production build succeeds
- ✅ Environment variables configured
- ✅ No hardcoded development URLs
- ✅ Image optimization settings appropriate
- ✅ Error boundaries handle edge cases