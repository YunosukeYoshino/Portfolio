# Next.js Cloudflare デプロイメントオプション

## オプション 1: Cloudflare Pages (SSG) - 推奨 for SEO

### メリット
- **SEO最適化**: 完全な静的HTML生成
- **高速**: CDNエッジから直接配信
- **低コスト**: 静的ファイルのみ
- **シンプル**: ビルド時に全ページ生成

### デメリット
- ISR（増分静的再生成）非対応
- 動的ルート制限あり
- API Routes使用不可

### 設定
```typescript
// next.config.ts
output: 'export'
```

### デプロイコマンド
```bash
npm run build
npx wrangler pages deploy out --project-name=yunosuke-portfolio
```

---

## オプション 2: Cloudflare Workers (Edge Runtime)

### メリット
- **動的機能**: SSR、ISR、API Routes対応
- **エッジ実行**: 世界中で低レイテンシー
- **柔軟性**: 動的コンテンツ生成可能

### デメリット
- 複雑な設定
- 高コスト（リクエストごとの課金）
- Next.js完全互換ではない

### 必要な設定

1. **@cloudflare/next-on-pages** インストール
```bash
npm install -D @cloudflare/next-on-pages vercel
```

2. **next.config.ts 変更**
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    runtime: 'edge', // Edge Runtime使用
  },
  // output: 'export' を削除
}
```

3. **ビルドとデプロイ**
```bash
npx @cloudflare/next-on-pages
npx wrangler pages deploy .vercel/output/static --project-name=yunosuke-portfolio
```

---

## 推奨: ハイブリッドアプローチ

### Cloudflare Pages + 画像最適化

1. **Cloudflare Images** または **R2** で画像配信
2. **Transform Rules** で画像最適化
3. **静的サイト** (Pages) でSEO最適化

### 実装手順

1. 画像を Cloudflare R2 にアップロード
2. next.config.ts で画像ドメイン設定
3. Pages にデプロイ

```typescript
// next.config.ts
images: {
  loader: 'custom',
  loaderFile: './src/lib/cloudflare-loader.js',
}
```

```javascript
// src/lib/cloudflare-loader.js
export default function cloudflareLoader({ src, width, quality }) {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(',');
  return `https://yourdomain.com/cdn-cgi/image/${paramsString}/${src}`;
}
```

---

## 画像問題の即時解決

### 現在の `/assets/images/my-image.jpg` が表示されない場合

1. **確認事項**
   - ブラウザの開発者ツールでネットワークエラー確認
   - 実際のURLパス確認: https://3ae1b635.yunosuke-portfolio.pages.dev/assets/images/my-image.jpg

2. **解決策**
   - 画像が public/assets/images/ に存在することを確認
   - ビルド後 out/assets/images/ に存在することを確認
   - 再デプロイ: `npx wrangler pages deploy out --project-name=yunosuke-portfolio`

---

## 決定事項

現在のポートフォリオサイトには **Cloudflare Pages (SSG)** が最適：

- SEO重視のポートフォリオサイト
- 静的コンテンツ中心
- microCMSのコンテンツはビルド時に取得
- 高速配信とコスト効率

動的機能が必要になった場合のみ Workers への移行を検討。