# Cloudflare Pages Deployment Guide

## Prerequisites
- Cloudflare account
- Domain `yunosukeyoshino.com` added to Cloudflare
- microCMS API credentials

## Deployment Steps

### 1. GitHub Repository Setup
Push your code to GitHub if not already done:
```bash
git add .
git commit -m "Configure for Cloudflare Pages deployment"
git push origin main
```

### 2. Cloudflare Pages Setup

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Workers & Pages" → "Create application" → "Pages"
3. Connect your GitHub account and select your repository

### 3. Build Configuration

Set the following build settings:
- **Framework preset**: Next.js (Static Export)
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Node version**: 22.12.0

### 4. Environment Variables

Add these environment variables in Cloudflare Pages settings:
```
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
SITE_URL=https://yunosukeyoshino.com
```

### 5. Custom Domain Setup

1. In your Pages project settings, go to "Custom domains"
2. Add `yunosukeyoshino.com`
3. Cloudflare will automatically configure DNS if the domain is on Cloudflare
4. Add `www.yunosukeyoshino.com` as well if needed

### 6. Deploy

1. Click "Save and Deploy"
2. Wait for the build to complete
3. Your site will be available at:
   - `your-project.pages.dev` (Cloudflare subdomain)
   - `yunosukeyoshino.com` (your custom domain)

## Manual Deployment (Alternative)

If you prefer to deploy manually using Wrangler CLI:

1. Install Wrangler:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Build the project:
```bash
npm run build
```

4. Deploy to Cloudflare Pages:
```bash
wrangler pages deploy out --project-name=portfolio-site
```

## Important Notes

- The site uses static export (`output: 'export'`) which is compatible with Cloudflare Pages
- ISR (Incremental Static Regeneration) is not supported on Cloudflare Pages
- All pages will be statically generated at build time
- API routes are not supported with static export
- Ensure all dynamic routes use `generateStaticParams`

## Troubleshooting

### Build Errors
- Check Node version matches 22.12.0
- Verify all environment variables are set
- Check build logs in Cloudflare Pages dashboard

### Domain Issues
- Ensure DNS is managed by Cloudflare
- Check SSL/TLS settings are set to "Full" or "Full (strict)"
- Wait for DNS propagation (can take up to 24 hours)

### Content Updates
- microCMS content changes require a rebuild
- Set up webhooks in microCMS to trigger Cloudflare Pages rebuilds
- Or manually trigger rebuilds from Cloudflare dashboard