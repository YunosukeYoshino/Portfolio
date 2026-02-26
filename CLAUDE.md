Please reason in English and respond in Japanese.

# Portfolio Project

## プロジェクト概要
個人ポートフォリオサイト。microCMSからブログ記事を取得し、スキル・プロジェクト紹介を提供。

## 技術スタック
- **フレームワーク**: TanStack Start + React 19
- **CMS**: microCMS
- **スタイル**: Tailwind CSS v4（CSS-first設定）
- **データフェッチ**: TanStack Query（React Query）
- **デプロイ**: Cloudflare Pages（静的エクスポート）

## Package Manager
**必須**: `npm` ではなく **Bun** を使用。

## Key Commands
```
bun run dev    # 開発サーバー → http://portfolio.localhost (portless)
bun run build  # 本番ビルド
bun run lint   # Biome + TypeScript + Markuplint
bun run fix    # 自動修正
bun run deploy          # main ブランチにデプロイ
bun run deploy:preview  # preview ブランチにデプロイ
```

## Known Constraints
- **Zod v3**: @tanstack/router-generator との互換性のため v3 (^3.24.2) を使用。v4 不可。

## ディレクトリ構造
```
src/
├── domain/            # Domain層（外部依存なし）
│   ├── entities/      # Blog, BlogResponse エンティティ
│   └── repositories/  # BlogRepository Port（インターフェース）
├── usecases/          # UseCase層（ビジネスロジック）
│   └── blog/          # GetBlogsUseCase, GetBlogDetailUseCase
├── infrastructure/    # Infrastructure層（具体実装）
│   ├── microcms/      # microCMS Adapter
│   └── di/            # 依存性注入コンテナ
├── routes/            # TanStack Router ページ・レイアウト
├── components/        # React コンポーネント
│   ├── layout/        # Header, Footer, Breadcrumb
│   ├── sections/      # HeroSection, AboutSection, WorksSection, ArticlesSection, SkillsMarquee
│   ├── article/       # ArticleItem, ArticlesHoverEffect, Blog, CodeHighlight
│   ├── effects/       # CustomCursor, NoiseOverlay, WebGLBackground, SplitText, TextScramble, MagneticButton
│   ├── providers/     # LenisProvider, ClientLoader
│   ├── seo/           # GoogleAnalytics, JsonLd
│   └── forms/         # ContactForm
├── lib/
│   ├── microcms.ts    # 後方互換ファサード（@deprecated）
│   ├── utils.ts       # cn(), formatDate()
│   ├── highlight.ts   # Shikiによるコードハイライト（createServerFn）
│   ├── zennRss.ts     # Zenn RSSフィード取得（createServerFn）
│   └── qiitaRss.ts    # Qiita Atom RSSフィード取得（createServerFn）
└── types/             # 共有型定義（domain再エクスポート）
```

## Key Locations
- `src/infrastructure/di/` - 依存性注入コンテナ (useCases)
- `src/domain/` - Domain層 (外部依存なし)
- `src/lib/microcms.ts` - 後方互換ファサード (@deprecated)
- `src/lib/zennRss.ts` - Zenn RSSフィード取得
- `src/lib/qiitaRss.ts` - Qiita Atom RSSフィード取得
- `vite.config.ts` - prerender/SSG設定

## 重要なパターン

### データフェッチパターン
- **loader**: TanStack Routerのloaderでサーバーサイドfetch
- **createServerFn**: APIキーを安全に扱うサーバー関数（例: `src/lib/highlight.ts`, `src/lib/zennRss.ts`）
- 参照: `src/routes/article/$slug.tsx`（loader + createServerFn 例）

### Tailwind CSS v4
v3との破壊的変更あり。`src/globals.css` 参照。
- `@theme` ディレクティブでCSS変数を定義
- `@plugin` でプラグイン読み込み

### microCMS統合（Clean Architecture）
**推奨**: `useCases` を直接使用
```typescript
import { useCases } from '@/infrastructure/di'

const blogs = await useCases.getBlogs.execute()
const blog = await useCases.getBlogDetail.execute('slug')
const paged = await useCases.getBlogs.paginated(1, 6)
```

**後方互換**: `src/lib/microcms.ts` のファサード関数も引き続き使用可能（@deprecated）
開発時はモックデータを返却。

**テスト時**: Fakeリポジトリを注入
```typescript
import { createUseCases } from '@/infrastructure/di'
const testUseCases = createUseCases(fakeBlogRepository)
```

### Zenn / Qiita RSS統合
Zenn・Qiita記事をRSSフィードから取得し、microCMS記事と統合表示。
- `src/lib/zennRss.ts` - Zenn RSS（RSS形式: `<item>`）
- `src/lib/qiitaRss.ts` - Qiita Atom（Atom形式: `<entry>`, `<link rel="alternate">`）
- `src/types/index.ts` の `ArticleFeedItem` で `source: 'microcms' | 'zenn' | 'qiita'` を区別
- 外部リンク判定は `externalUrl` の有無で判断（`Blog.tsx`）

### プリレンダリング
`vite.config.ts` の prerender 設定を参照。

### フォームバリデーション
Zod + react-hook-form パターン。`src/components/ContactForm.tsx` 参照。

## コード品質
Biome + TypeScript strict mode使用。設定は `biome.json` 参照。
自動修正: `bun run fix`

## 環境変数
`.env.example` 参照。
