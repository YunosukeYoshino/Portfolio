/**
 * Custom image loader for Cloudflare Pages static export
 * This loader enables Next.js Image component to work with static export
 */
export default function cloudflareLoader({ src, width, quality }) {
  // For local images in public folder, return the src directly
  if (src.startsWith('/')) {
    return src
  }
  
  // For external images, you can add Cloudflare image optimization here
  // Example: using Cloudflare Image Resizing (requires setup)
  // return `https://yourdomain.com/cdn-cgi/image/width=${width},quality=${quality || 75}/${src}`
  
  // For now, return with query params for external images
  const params = [`w=${width}`]
  if (quality) {
    params.push(`q=${quality}`)
  }
  
  return `${src}?${params.join('&')}`
}