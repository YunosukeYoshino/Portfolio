# microCMS API Integration Troubleshooting - Solution

## Problem Summary
The project was experiencing network errors when trying to fetch data from microCMS API using the microCMS SDK, even though the API credentials were correct.

## Root Cause
The issue was with the microCMS SDK (`microcms-js-sdk`) having compatibility problems with the Node.js fetch implementation in the Next.js 15 environment.

## Solution Implemented
1. **Replaced microCMS SDK with native fetch**:
   - Removed `microcms-js-sdk` dependency completely
   - Implemented direct HTTP requests using native fetch API
   - Created custom `apiRequest` helper function

2. **Fixed module system conflicts**:
   - Removed problematic ES module configurations
   - Performed clean reinstall of dependencies (`rm -rf node_modules package-lock.json && npm install`)

3. **Added Next.js image optimization support**:
   - Added `images.microcms-assets.io` to `remotePatterns` in `next.config.ts`
   - Enabled proper image optimization for microCMS assets

## Final Working Configuration

### API Client (`src/lib/microcms.ts`)
```typescript
// Direct API configuration instead of SDK
const API_CONFIG = {
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
  baseUrl: `https://${process.env.MICROCMS_SERVICE_DOMAIN}/api/v1`,
}

// Custom fetch implementation
const apiRequest = async <T>(endpoint: string, params?: Record<string, string | number>): Promise<T> => {
  const url = new URL(`${API_CONFIG.baseUrl}/${endpoint}`)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  const response = await fetch(url.toString(), {
    headers: {
      'X-MICROCMS-API-KEY': API_CONFIG.apiKey,
    },
  })

  if (!response.ok) {
    throw new Error(`microCMS API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
```

### Image Configuration (`next.config.ts`)
```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.microcms-assets.io',
      port: '',
      pathname: '/**',
    },
  ],
},
```

## Success Indicators
- Console logs show successful API configuration
- Blog data fetched successfully (10 items)
- No more "Network Error" or "Unexpected token 'export'" errors
- Images from microCMS display properly
- Development server runs without errors

## Commands Used for Resolution
```bash
# Remove problematic SDK
npm uninstall microcms-js-sdk

# Clean install dependencies
rm -rf node_modules package-lock.json && npm install

# Restart development server
npm run dev
```

## Environment Variables Required
- `MICROCMS_SERVICE_DOMAIN`: Domain only (e.g., "yuche.microcms.io")
- `MICROCMS_API_KEY`: Valid API key with read permissions

## Verification
The following log output confirms successful resolution:
```
microCMS config: {
  serviceDomain: 'yuche.microcms.io',
  apiKeyLength: 36,
  baseUrl: 'https://yuche.microcms.io/api/v1'
}
Attempting to fetch blogs with queries: { limit: 6, offset: 0, orders: '-publishedAt' }
Blog fetch successful: 10 items
GET / 200 in 2272ms
```