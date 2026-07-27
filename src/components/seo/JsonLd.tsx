import { DEFAULT_SITE_DESCRIPTION, SITE_NAME, SITE_URL, toCanonicalUrl } from '@/lib/siteMetadata'

// Structured data generators
export const createPersonSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Yunosuke Yoshino',
  description: 'フロントエンドエンジニア。React、Next.js、モダンなWeb技術を専門としています。',
  url: SITE_URL,
  sameAs: [
    'https://github.com/YunosukeYoshino',
    'https://www.linkedin.com/in/yunosukeyoshino',
    'https://twitter.com/YunosukeYoshino',
  ],
  jobTitle: 'フロントエンドエンジニア',
  worksFor: {
    '@type': 'Organization',
    name: 'フリーランス',
  },
  knowsAbout: [
    'React',
    'Next.js',
    'Astro',
    'TypeScript',
    'JavaScript',
    'フロントエンド開発',
    'UI/UX デザイン',
    'AI エージェント',
    'MCP (Model Context Protocol)',
    'n8n / 自動化ワークフロー',
  ],
})

export const createProfilePageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: toCanonicalUrl('/about'),
  name: 'About Yunosuke Yoshino',
  description: 'フロントエンドエンジニア Yunosuke Yoshino のプロフィール、経歴、専門分野、FAQ。',
  inLanguage: 'ja-JP',
  mainEntity: createPersonSchema(),
})

export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
})

export const createWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_SITE_DESCRIPTION,
  inLanguage: 'ja-JP',
  author: createPersonSchema(),
  publisher: createPersonSchema(),
})

export const createBlogSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Yunosuke Yoshinoの技術ブログ',
  description:
    'フロントエンド開発、UI/UXデザイン、モダンなWeb技術について書いた技術記事をまとめています。',
  url: toCanonicalUrl('/article'),
  inLanguage: 'ja-JP',
  author: createPersonSchema(),
  publisher: createPersonSchema(),
})

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

export const createArticleSchema = (
  article: {
    id: string
    title: string
    content: string
    publishedAt: string
    updatedAt: string
    eyecatch?: {
      url: string
      alt?: string
    }
    category?: {
      name: string
    }
  },
  seoOverrides?: {
    readonly seoTitle?: string
    readonly seoDescription?: string
  }
) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: seoOverrides?.seoTitle ?? article.title,
  description:
    seoOverrides?.seoDescription ?? article.content.replace(/<[^>]*>/g, '').substring(0, 160),
  url: toCanonicalUrl(`/article/${article.id}`),
  datePublished: article.publishedAt,
  dateModified: article.updatedAt,
  inLanguage: 'ja-JP',
  author: createPersonSchema(),
  publisher: createPersonSchema(),
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': toCanonicalUrl(`/article/${article.id}`),
  },
  ...(article.eyecatch && {
    image: {
      '@type': 'ImageObject',
      url: article.eyecatch.url,
      alt: article.eyecatch.alt || article.title,
    },
  }),
  ...(article.category && {
    about: {
      '@type': 'Thing',
      name: article.category.name,
    },
  }),
  articleSection: 'テクノロジー',
  wordCount: article.content.replace(/<[^>]*>/g, '').length,
})
