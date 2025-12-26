# GitHub & Cloudflare Pages デプロイガイド

## 📋 デプロイ手順

### 1. GitHubにプッシュ

```bash
# 現在の変更を確認
git status

# すべての変更をステージング
git add -A

# コミット
git commit -m "feat: Update gallery website with fluid background"

# GitHubにプッシュ
git push origin main
```

### 2. Cloudflare Pagesで設定

1. **Cloudflare Dashboardにログイン**
   - https://dash.cloudflare.com にアクセス
   - アカウントにログイン

2. **Workers & Pagesに移動**
   - 左サイドバーから「Workers & Pages」を選択
   - 「Create application」→「Pages」→「Connect to Git」

3. **GitHubリポジトリを接続**
   - GitHubアカウントを認証
   - リポジトリ `MoMoCaTMeow/momo-technology` を選択
   - 「Begin setup」をクリック

4. **ビルド設定を入力**

   **Project name**: `momo-technology`（任意）

   **Production branch**: `main`

   **Build command**:
   ```
   npm install --legacy-peer-deps && npm run build
   ```

   **Build output directory**:
   ```
   out
   ```

   **Root directory**: （空白のまま）

   **Environment variables**: （不要）

5. **保存してデプロイ**
   - 「Save and Deploy」をクリック
   - ビルドが開始されます（数分かかります）

### 3. カスタムドメインの設定（オプション）

1. **Cloudflare Pagesのプロジェクトページで**
   - 「Custom domains」タブを開く
   - 「Set up a custom domain」をクリック
   - ドメイン名を入力（例: `momo1105.com`）

2. **DNS設定**
   - CloudflareでDNSレコードを追加:
     - Type: `CNAME`
     - Name: `@` または `www`
     - Target: `プロジェクト名.pages.dev`
     - Proxy: ON（推奨）

3. **SSL/TLS設定**
   - Cloudflareが自動的にSSL証明書を発行します
   - 「SSL/TLS」タブで「Full」モードを確認

## 🔧 トラブルシューティング

### ビルドが失敗する場合

1. **ビルドログを確認**
   - Cloudflare Pagesの「Deployments」タブ
   - 失敗したデプロイをクリック
   - 「View build log」でエラーを確認

2. **よくあるエラーと解決方法**

   **エラー**: `Build output directory not found`
   - **解決**: Build output directoryを `out` に設定

   **エラー**: `npm install failed`
   - **解決**: Build commandに `--legacy-peer-deps` を追加

   **エラー**: `Node version mismatch`
   - **解決**: `.nvmrc` ファイルでNode.js 18を指定済み

### 画像が表示されない場合

1. **画像パスの確認**
   - `public/images/` フォルダに画像があるか確認
   - 画像パスが `/images/ファイル名` になっているか確認

2. **ビルド後の確認**
   - `out/images/` フォルダに画像がコピーされているか確認

## 📝 現在の設定

- **Framework**: Next.js 15
- **Build output**: Static Export (`out/`)
- **Node version**: 18 (`.nvmrc`で指定)
- **画像数**: 747枚（自動検出）

## 🚀 デプロイ後の確認

1. **プレビューURLで確認**
   - Cloudflare Pagesの「Deployments」タブ
   - 最新のデプロイのプレビューURLをクリック

2. **カスタムドメインで確認**
   - 設定したカスタムドメインにアクセス
   - 画像が正しく表示されるか確認

## 🔄 更新のデプロイ

コードを更新したら、以下のコマンドで再デプロイ:

```bash
git add -A
git commit -m "feat: Update content"
git push origin main
```

Cloudflare Pagesが自動的に新しいビルドを開始します。

