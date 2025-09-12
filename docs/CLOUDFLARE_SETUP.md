# Cloudflare Pages Setup Guide

## Environment Variables

Cloudflare Pagesでデプロイする際は、以下の環境変数を設定する必要があります。

### 必須の環境変数

1. **RESEND_API_KEY**
   - Resend APIキー
   - [Resend](https://resend.com)でアカウントを作成し、APIキーを取得してください
   - メール送信に使用されます

2. **DISCORD_WEBHOOK_URL** (オプション)
   - Discord通知用のWebhook URL
   - コンタクトフォームの送信通知をDiscordに送信する場合に設定

### Cloudflare Pagesでの設定方法

1. Cloudflareダッシュボードにログイン
2. 該当のPagesプロジェクトを選択
3. Settings → Environment variablesに移動
4. 以下の変数を追加:
   - Variable name: `RESEND_API_KEY`
   - Value: 取得したResend APIキー
   - (オプション) Variable name: `DISCORD_WEBHOOK_URL`
   - Value: Discord Webhook URL

### ローカル開発環境

ローカル開発では、`.env.local`ファイルを作成して環境変数を設定できます:

```env
RESEND_API_KEY=your_resend_api_key_here
DISCORD_WEBHOOK_URL=your_discord_webhook_url_here
```

## Cloudflare Functions

このプロジェクトはCloudflare PagesのFunctions機能を使用しています。

- `/functions/api/contact.ts` - コンタクトフォームの処理を行うエンドポイント
- エンドポイントURL: `https://your-domain.pages.dev/api/contact`

## デプロイ

```bash
# ビルド
npm run build

# Cloudflare Pagesへのデプロイ（自動）
# GitHubリポジトリと連携している場合、pushで自動デプロイされます
```

## 注意事項

- Cloudflare PagesではNext.jsのAPIルート（`/app/api/*`）は使用できません
- 代わりにCloudflare Functions（`/functions/*`）を使用しています
- フロントエンドのコンタクトフォームは、本番環境では完全なURLを使用してAPIにアクセスします