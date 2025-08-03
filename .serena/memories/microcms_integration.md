# microCMS Integration Guide

## Overview
The project uses microCMS as a headless CMS for blog content. The integration is handled through the `src/lib/microcms.ts` file.

## Configuration
### Environment Variables
- `MICROCMS_SERVICE_DOMAIN`: Domain only (e.g., "yuche.microcms.io")
- `MICROCMS_API_KEY`: API key with read permissions for blogs endpoint

### API Endpoint
- **Endpoint name**: "blogs" (Japanese name: "ブログ")
- **Content type**: List format
- **URL pattern**: `https://{domain}/api/v1/blogs`

## Data Structure
### Blog Content Fields
- `id`: Unique identifier
- `title`: Blog post title
- `content`: Rich text content (HTML)
- `eyecatch`: Featured image with URL, width, height, alt
- `category`: Category object with id and name
- `publishedAt`: Publication date
- `createdAt`, `updatedAt`, `revisedAt`: Timestamps

## Integration Features
### Server-Side Functions
- `getBlogs()`: Fetch paginated blog list
- `getBlog(id)`: Fetch single blog post
- `generateStaticParams()`: Generate static paths for build

### Error Handling
- **Development**: Falls back to mock data if API fails
- **Production**: Proper error boundaries and user feedback
- **Network issues**: Includes fetch polyfill for Node.js compatibility

### Performance Optimizations
- **Static Generation**: Pre-builds blog pages at build time
- **ISR (Incremental Static Regeneration)**: Updates content without full rebuild
- **Type Safety**: Full TypeScript integration with proper interfaces

## Development Notes
- Uses `undici` fetch polyfill for Node.js compatibility
- Includes debug logging in development mode
- Mock data available when API is unavailable
- Supports both list and detail views with proper routing

## API Usage Examples
```typescript
// Get blog list with pagination
const blogs = await getBlogs({ limit: 10, offset: 0 })

// Get single blog post
const blog = await getBlog('blog-post-id')

// Generate static paths for build
export async function generateStaticParams() {
  const blogs = await getBlogs({ fields: ['id'] })
  return blogs.contents.map(blog => ({ slug: blog.id }))
}
```

## Troubleshooting
- **Network errors**: Check API key permissions and domain format
- **Build failures**: Ensure environment variables are set correctly
- **Type errors**: Verify data structure matches TypeScript interfaces
- **Performance issues**: Check if static generation is properly configured