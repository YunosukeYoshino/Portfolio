# Spec-Driven Development Guide

Kiro-style Spec Driven Development（AI-DLC）の実装ガイド。

## 概要
仕様駆動開発により、Requirements → Design → Tasks → Implementation の3フェーズ承認ワークフローで品質を担保。

## ディレクトリ構造
```
.kiro/
├── settings/
│   ├── rules/        # 設計・分析ルール
│   └── templates/    # 仕様・ステアリングテンプレート
├── steering/         # プロジェクト全体ポリシー（作成時）
└── specs/            # 機能別仕様（作成時）
```

## プロジェクトメモリ

### Steering（`.kiro/steering/`）
プロジェクト全体のルール・コンテキスト：
- `product.md` - プロダクト概要
- `tech.md` - 技術スタック決定
- `structure.md` - アーキテクチャ原則

### Specs（`.kiro/specs/{feature}/`）
機能別の仕様ドキュメント：
- `spec.json` - 仕様メタデータ
- `requirements.md` - 要件定義（EARS形式）
- `design.md` - 設計ドキュメント
- `tasks.md` - 実装タスク一覧

## 開発ワークフロー

### Phase 0: Steering設定（任意）
プロジェクトポリシーを `.kiro/steering/` に定義。

### Phase 1: 仕様策定
1. **要件定義**: `requirements.md` 作成
2. **ギャップ分析**: 既存コードとの差分確認（任意）
3. **設計**: `design.md` 作成
4. **タスク分解**: `tasks.md` 作成

### Phase 2: 実装
タスクに従って実装。各フェーズで人間レビュー必須。

## ルール
- 各フェーズで承認を得てから次へ進む
- Markdownは設定言語（日本語）で記述
- 指示の範囲内で自律的に行動し、不明点のみ質問

## 参照
- ルール: `.kiro/settings/rules/`
- テンプレート: `.kiro/settings/templates/`
- 現在の仕様: `.kiro/specs/`
