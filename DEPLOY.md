# GitHub & Cloudflare Pages デプロイガイド

## 📋 デプロイ手順

### 1. GitHubにプッシュ

```bash
# 現在の変更を確認
git status

# すべての変更をステージング
git add -A

# コミット
git commit -m "feat: Fix package-lock.json and update gallery"

# GitHubにプッシュ
git push origin main
```

### 2. Cloudflare Pagesで設定

1. **Cloudflare Dashboardにログイン**
   - https://dash.cloudflare.com にアクセス
   - アカウントにログイン

2. **既存のプロジェクトを編集**
   - 左サイドバーから「Workers & Pages」を選択
   - `momo-technology` プロジェクトを選択
   - 「Settings」タブを開く
   - 「Builds & deployments」セクションを開く

3. **ビルド設定を更新**

   **Build command**:
   ```
   npm install --legacy-peer-deps && npm run build
   ```
   
   **重要**: Cloudflare Pagesはデフォルトで`npm ci`を使用しますが、依存関係の不一致を避けるため、上記のコマンドを**必ず**設定してください。

   **Build output directory**:
   ```
   out
   ```

   **Root directory**: （空白のまま）

   **Node version**: `18`（`.nvmrc`で指定済み）

4. **保存**
   - 「Save」をクリック
   - 自動的に新しいビルドが開始されます

### 3. カスタムドメインの設定（オプション）

1. **Cloudflare Pagesのプロジェクトページで**
   - 「Custom domains」タブを開く
   - 「Set up a custom domain」をクリック
   - ドメイン名を入力（例: `momo1105.com`）

2. **DNS設定**
   - CloudflareでDNSレコードを追加:
     - Type: `CNAME`
     - Name: `@` または `www`
     - Target: `momo-technology.pages.dev`（プロジェクト名に応じて変更）
     - Proxy: ON（推奨）

3. **SSL/TLS設定**
   - Cloudflareが自動的にSSL証明書を発行します
   - 「SSL/TLS」タブで「Full」モードを確認

## 🔧 トラブルシューティング

### ビルドが失敗する場合

#### エラー: `npm ci` failed / package-lock.json out of sync

**原因**: `package-lock.json`と`package.json`が同期していない

**解決方法**:
1. ローカルで`package-lock.json`を再生成:
   ```bash
   rm package-lock.json
   npm install --legacy-peer-deps
   git add package-lock.json
   git commit -m "fix: Update package-lock.json"
   git push origin main
   ```

2. Cloudflare Pagesのビルドコマンドを確認:
   - Build commandが `npm install --legacy-peer-deps && npm run build` になっているか確認
   - `npm ci`ではなく`npm install`を使用する必要があります

#### エラー: `Build output directory not found`

**解決**: Build output directoryを `out` に設定

#### エラー: `npm install failed`

**解決**: Build commandに `--legacy-peer-deps` を追加

#### エラー: `Node version mismatch`

**解決**: `.nvmrc` ファイルでNode.js 18を指定済み

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
- **Build command**: `npm install --legacy-peer-deps && npm run build`

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

## ⚠️ 重要な注意事項

Cloudflare Pagesはデフォルトで`npm ci`を使用しますが、このプロジェクトでは`npm install --legacy-peer-deps`を使用する必要があります。

**必ず**Cloudflare Pagesの設定で、Build commandを以下に設定してください:
```
npm install --legacy-peer-deps && npm run build
```

これを設定しないと、`package-lock.json`の不一致エラーが発生します。
