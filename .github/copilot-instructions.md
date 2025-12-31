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
├── routes/        # TanStack Router ページ・レイアウト
├── components/    # React コンポーネント
├── lib/
│   ├── microcms.ts  # microCMS クライアント（createServerFn使用）
│   └── utils.ts     # cn(), formatDate()
└── types/         # 共有型定義
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

### microCMS統合
`src/lib/microcms.ts` の関数を使用。`createServerFn`でサーバーサイドAPI呼び出し。
開発時はモックデータを返却。

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
