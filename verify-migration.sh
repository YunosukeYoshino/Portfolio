#!/bin/bash

echo "🔍 Verifying Next.js Migration..."
echo "=================================="

# Check if Next.js files exist
echo "✅ Checking Next.js configuration files:"
[ -f "next.config.ts" ] && echo "  ✓ next.config.ts" || echo "  ✗ next.config.ts missing"
[ -f "next-env.d.ts" ] && echo "  ✓ next-env.d.ts" || echo "  ✗ next-env.d.ts missing"
[ -f "tailwind.config.ts" ] && echo "  ✓ tailwind.config.ts" || echo "  ✗ tailwind.config.ts missing"
[ -f "postcss.config.mjs" ] && echo "  ✓ postcss.config.mjs" || echo "  ✗ postcss.config.mjs missing"

echo ""
echo "✅ Checking package.json dependencies:"
if grep -q '"next"' package.json; then
    echo "  ✓ Next.js dependency found"
else
    echo "  ✗ Next.js dependency missing"
fi

if grep -q '"react"' package.json; then
    echo "  ✓ React dependency found"
else
    echo "  ✗ React dependency missing"
fi

echo ""
echo "✅ Checking App Router structure:"
[ -d "src/app" ] && echo "  ✓ src/app directory exists" || echo "  ✗ src/app directory missing"
[ -f "src/app/layout.tsx" ] && echo "  ✓ Root layout exists" || echo "  ✗ Root layout missing"
[ -f "src/app/page.tsx" ] && echo "  ✓ Home page exists" || echo "  ✗ Home page missing"
[ -f "src/app/globals.css" ] && echo "  ✓ Global styles exist" || echo "  ✗ Global styles missing"

echo ""
echo "✅ Checking React components:"
[ -d "src/components" ] && echo "  ✓ Components directory exists" || echo "  ✗ Components directory missing"
[ -f "src/components/Header.tsx" ] && echo "  ✓ Header component exists" || echo "  ✗ Header component missing"
[ -f "src/components/Blog.tsx" ] && echo "  ✓ Blog component exists" || echo "  ✗ Blog component missing"

echo ""
echo "✅ Checking TypeScript configuration:"
[ -f "tsconfig.json" ] && echo "  ✓ TypeScript config exists" || echo "  ✗ TypeScript config missing"
[ -d "src/types" ] && echo "  ✓ Types directory exists" || echo "  ✗ Types directory missing"

echo ""
echo "✅ Checking microCMS integration:"
[ -f "src/lib/microcms.ts" ] && echo "  ✓ microCMS client exists" || echo "  ✗ microCMS client missing"

echo ""
echo "✅ Checking backup files:"
[ -d "astro-backup" ] && echo "  ✓ Astro backup directory exists" || echo "  ✗ Astro backup directory missing"
[ -f "package.json.astro" ] && echo "  ✓ Astro package.json backup exists" || echo "  ✗ Astro package.json backup missing"

echo ""
echo "✅ Checking for remaining Astro files (should be none):"
ASTRO_FILES=$(find src -name "*.astro" 2>/dev/null | wc -l)
if [ "$ASTRO_FILES" -eq 0 ]; then
    echo "  ✓ No Astro files found in src/"
else
    echo "  ⚠️  Found $ASTRO_FILES Astro files in src/"
    find src -name "*.astro" 2>/dev/null | head -5
fi

echo ""
echo "=================================="
echo "🎉 Migration verification complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy .env.example to .env.local and add your microCMS credentials"
echo "2. Run 'npm install' to install dependencies"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Test the migration at http://localhost:3000"