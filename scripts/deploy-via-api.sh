#!/bin/bash

# Cloudflare Pages API デプロイスクリプト
# 使用方法: ./scripts/deploy-via-api.sh YOUR_API_TOKEN YOUR_ACCOUNT_ID PROJECT_NAME

set -e  # エラー時に終了

# 引数チェック
if [ $# -ne 3 ]; then
    echo "使用方法: $0 <API_TOKEN> <ACCOUNT_ID> <PROJECT_NAME>"
    echo "例: $0 your_api_token_here your_account_id_here yunosuke-portfolio"
    exit 1
fi

API_TOKEN="$1"
ACCOUNT_ID="$2"
PROJECT_NAME="$3"
BUILD_DIR="out"

echo "🚀 Cloudflare Pages API経由でデプロイを開始..."

# APIのベースURL
BASE_URL="https://api.cloudflare.com/client/v4"

# 1. プロジェクトが存在するかチェック
echo "📋 プロジェクト存在確認: $PROJECT_NAME"
PROJECT_CHECK=$(curl -s -X GET \
    "$BASE_URL/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json")

if echo "$PROJECT_CHECK" | grep -q '"success":false'; then
    echo "📝 プロジェクトが存在しません。新規作成します..."
    
    # プロジェクト作成
    CREATE_RESPONSE=$(curl -s -X POST \
        "$BASE_URL/accounts/$ACCOUNT_ID/pages/projects" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" \
        --data "{
            \"name\": \"$PROJECT_NAME\",
            \"production_branch\": \"main\",
            \"build_config\": {
                \"build_command\": \"npm run build\",
                \"destination_dir\": \"out\",
                \"root_dir\": \"\"
            }
        }")
    
    if echo "$CREATE_RESPONSE" | grep -q '"success":true'; then
        echo "✅ プロジェクト作成成功"
    else
        echo "❌ プロジェクト作成失敗"
        echo "$CREATE_RESPONSE"
        exit 1
    fi
else
    echo "✅ プロジェクト確認済み"
fi

# 2. ビルドディレクトリの存在確認
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ ビルドディレクトリ '$BUILD_DIR' が見つかりません"
    echo "先に 'bun run build' を実行してください"
    exit 1
fi

# 3. デプロイメント作成（ファイルなしで初期化）
echo "🔄 デプロイメント初期化..."
DEPLOY_RESPONSE=$(curl -s -X POST \
    "$BASE_URL/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/deployments" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "{
        \"branch\": \"main\",
        \"production\": true
    }")

if echo "$DEPLOY_RESPONSE" | grep -q '"success":false'; then
    echo "❌ デプロイメント初期化失敗"
    echo "$DEPLOY_RESPONSE"
    exit 1
fi

# デプロイメントIDを取得
DEPLOYMENT_ID=$(echo "$DEPLOY_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "📦 デプロイメントID: $DEPLOYMENT_ID"

echo "⚠️  注意: 直接的なファイルアップロードAPIは複雑なため、"
echo "    この後はWrangler CLIまたはダッシュボードでファイルをアップロードしてください。"
echo ""
echo "🌐 代替方法: Wrangler CLIでのデプロイ"
echo "   CLOUDFLARE_API_TOKEN=$API_TOKEN \\"
echo "   CLOUDFLARE_ACCOUNT_ID=$ACCOUNT_ID \\"
echo "   bunx wrangler pages deploy $BUILD_DIR --project-name=$PROJECT_NAME"

echo ""
echo "✅ API経由でのプロジェクト準備完了"