# Portfolio Project - Copilot Instructions

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
```bash
bun install    # 依存関係インストール
bun run dev    # 開発サーバー起動
bun run build  # 本番ビルド
bun run lint   # Biome + TypeScript チェック
bun run fix    # 自動修正
```

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
├── lib/
│   ├── microcms.ts    # 後方互換ファサード（@deprecated）
│   └── utils.ts       # cn(), formatDate()
└── types/             # 共有型定義（domain再エクスポート）
```

## 重要なパターン

### データフェッチパターン
- **loader**: TanStack Routerのloaderでサーバーサイドfetch
- **createServerFn**: APIキーを安全に扱うサーバー関数（`src/lib/microcms.ts`）
- **useSuspenseQuery**: クライアントサイドでのSuspense対応fetch
- 参照: `src/routes/article/$slug.tsx`（Suspense例）

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

### プリレンダリング
`vite.config.ts` の prerender 設定を参照。

### フォームバリデーション
Zod + react-hook-form パターン。`src/components/ContactForm.tsx` 参照。

## コード品質
Biome + TypeScript strict mode使用。設定は `biome.json` 参照。
自動修正: `bun run fix`

## 環境変数
`.env.example` 参照。

## デプロイ
```bash
bun run deploy          # main ブランチにデプロイ
bun run deploy:preview  # preview ブランチにデプロイ
```
ビルド出力は `dist/client/` ディレクトリ。GitHub Actions で自動デプロイ。
