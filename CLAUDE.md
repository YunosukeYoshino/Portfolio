Please reason in English and respond in Japanese.
When working on this repository, please refer to the following files:

## プロジェクト設定
@.github/copilot-instructions.md

## Quick Reference
- Package Manager: **Bun** (npm 不可)
- Framework: TanStack Start + React 19
- CMS: microCMS (Clean Architecture) + Zenn RSS
- Deploy: Cloudflare Pages (静的エクスポート)

## Key Commands
```
bun run dev    # 開発サーバー → http://portfolio.localhost (portless)
bun run build  # 本番ビルド
bun run lint   # Biome + TypeScript + Markuplint
bun run fix    # 自動修正
```

## Known Constraints
- **Zod v3**: @tanstack/router-generator との互換性のため v3 (^3.24.2) を使用。v4 不可。

## Key Locations
- `src/infrastructure/di/` - 依存性注入コンテナ (useCases)
- `src/domain/` - Domain層 (外部依存なし)
- `src/lib/microcms.ts` - 後方互換ファサード (@deprecated)
- `src/lib/zennRss.ts` - Zenn RSSフィード取得
- `vite.config.ts` - prerender/SSG設定
