# Portfolio Project - Copilot Instructions

## Package Manager
**必須**: このプロジェクトは **Bun** を使用します。`npm` ではなく `bun` コマンドを使用してください。
```bash
bun install    # 依存関係インストール
bun run dev    # 開発サーバー起動
bun run build  # 本番ビルド
bun run lint   # Biome + TypeScript チェック
bun run fix    # 自動修正
```

## アーキテクチャ概要
Next.js 15 App Router + React 19 のポートフォリオサイト。microCMS からブログコンテンツを取得し、Cloudflare Pages にスタティック出力(`output: 'export'`)でデプロイ。

### データフロー
```
microCMS API → src/lib/microcms.ts → Server Components → Static HTML (out/)
```

### ディレクトリ構造
- `src/app/` - App Router ページ・レイアウト
- `src/components/` - React コンポーネント（Server/Client混在）
- `src/lib/microcms.ts` - microCMS クライアント（型安全なAPI関数）
- `src/types/index.ts` - 共有型定義（`Blog`, `BlogResponse` など）

## 重要なパターン

### Server vs Client Components
- **デフォルトはServer Component** - データフェッチ・SEOに使用
- **`'use client'`必須** - useState/useEffect/イベントハンドラ使用時
- 例: `ContactForm.tsx`(Client), `CodeHighlight.tsx`(Server, async)

### Tailwind CSS v4
**v3との破壊的変更に注意**:
```css
/* globals.css */
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --background: #f3f3f1;
  /* CSS変数でテーマ定義 */
}
```
- `@theme` ディレクティブでCSS変数を定義
- JSコンフィグではなくCSS-first設定
- Typography は `@plugin` で読み込み

### microCMS統合
`src/lib/microcms.ts` の関数を使用:
```typescript
import { getBlogs, getBlogDetail, getAllBlogIds } from '@/lib/microcms'
```
- 開発時はプレースホルダー認証情報でモックデータを返却
- `generateStaticParams` で静的生成のIDリスト取得

### 静的生成パターン
```typescript
// src/app/article/[slug]/page.tsx
export async function generateStaticParams() {
  const blogIds = await getAllBlogIds()
  return blogIds.map((id) => ({ slug: id }))
}
```

### フォームバリデーション
Zod + react-hook-form パターン（`ContactForm.tsx`参照）:
```typescript
const schema = z.object({ ... })
const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) })
```

## コード品質

### Biome設定
- インデント: スペース2つ、行幅100
- `noConsole: "warn"` - 開発ログは `biome-ignore` コメントで許可
- 自動修正: `bun run fix`

### TypeScript
- Strict mode有効
- `typedRoutes: true` で型安全なナビゲーション
- パスエイリアス: `@/*` → `./src/*`

## 環境変数
```bash
MICROCMS_SERVICE_DOMAIN=xxx  # microCMS サービスドメイン
MICROCMS_API_KEY=xxx         # microCMS APIキー
RESEND_API_KEY=xxx           # Resend メール送信
SITE_URL=https://...         # 本番URL（メタデータ生成用）
```

## デプロイ
Cloudflare Pages へのスタティックエクスポート:
```bash
bun run deploy          # main ブランチにデプロイ
bun run deploy:preview  # preview ブランチにデプロイ
```
ビルド出力は `out/` ディレクトリ。GitHub Actions で自動デプロイ。

## ユーティリティ
`src/lib/utils.ts`:
- `cn()` - clsx + tailwind-merge でクラス結合
- `formatDate()` - 日本語日付フォーマット
- `generateMetadata()` - SEOメタデータ生成ヘルパー
