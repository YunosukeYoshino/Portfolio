interface JsonLdProps {
  data: Record<string, any>
}

function sanitizeJsonLd(obj: any): string {
  return JSON.stringify(obj, null, 2).replace(/</g, '\\u003c')
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: sanitizeJsonLd(data),
      }}
    />
  )
}

// Structured data generators
export const createPersonSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: '芳野悠之助',
  alternateName: 'Yunosuke Yoshino',
  description:
    'フロントエンドエンジニア。React、Next.js、モダンなWeb技術を専門としています。',
  url: 'https://yunosukeyoshino.com',
  sameAs: [
    'https://github.com/YunosukeYoshino',
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
    'TypeScript',
    'JavaScript',
    'フロントエンド開発',
    'UI/UX デザイン',
    'レスポンシブ Web デザイン',
  ],
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: '日本の大学',
  },
})

export const createWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '芳野悠之助 ポートフォリオ',
  alternateName: 'Yunosuke Yoshino Portfolio',
  url: 'https://yunosukeyoshino.com',
  description:
    '芳野悠之助のポートフォリオサイト。フロントエンド開発、UI/UXデザイン、モダンなWeb技術に関する技術記事とプロジェクトを紹介しています。',
  inLanguage: 'ja-JP',
  author: createPersonSchema(),
  publisher: createPersonSchema(),
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate:
        'https://yunosukeyoshino.com/article?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
})

export const createBlogSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: '芳野悠之助の技術ブログ',
  description:
    'フロントエンド開発、UI/UXデザイン、モダンなWeb技術について書いた技術記事をまとめています。',
  url: 'https://yunosukeyoshino.com/article',
  inLanguage: 'ja-JP',
  author: createPersonSchema(),
  publisher: createPersonSchema(),
})

export const createBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

export const createArticleSchema = (article: {
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
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: article.title,
  description: article.content.replace(/<[^>]*>/g, '').substring(0, 160),
  url: `https://yunosukeyoshino.com/article/${article.id}`,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt,
  inLanguage: 'ja-JP',
  author: createPersonSchema(),
  publisher: createPersonSchema(),
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://yunosukeyoshino.com/article/${article.id}`,
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
