# GitHub & Cloudflare Pages デプロイガイド

## ⚠️ 重要な設定（最新仕様）

### Cloudflare Pagesの設定

**最新のCloudflare Pagesの仕様**:
- **Build command**: 任意（Optional）
- **Deploy command**: 必須（Required）
- **Build output directory**: 設定項目なし（自動検出）

### 推奨設定

**Build command**（任意）:
```
npm install --legacy-peer-deps && npm run build
```

**Deploy command**（必須）:
```
npm install --legacy-peer-deps && npm run build
```

**Path**: `/`

**Non-production branch deploy command**: （空白）

---

## 📋 デプロイ手順

### 1. GitHubにプッシュ

```bash
# 現在の変更を確認
git status

# すべての変更をステージング
git add -A

# コミット
git commit -m "feat: Update gallery website"

# GitHubにプッシュ
git push origin main
```

### 2. Cloudflare Pagesで設定

1. **Cloudflare Dashboardにログイン**
   - https://dash.cloudflare.com にアクセス
   - アカウントにログイン

2. **プロジェクトの設定を開く**
   - 左サイドバーから「Workers & Pages」を選択
   - `momo-technology` プロジェクトを選択
   - 「Settings」タブを開く
   - 「Builds & deployments」セクションを開く

3. **ビルド設定を確認・更新**

   **Build command**（任意）:
   ```
   npm install --legacy-peer-deps && npm run build
   ```
   または空白のままでも可

   **Deploy command**（必須）:
   ```
   npm install --legacy-peer-deps && npm run build
   ```
   ⚠️ **このコマンドが必須です**

   **Path**: `/`

   **Non-production branch deploy command**: （空白）

   **Node version**: `18`（別のセクションで設定）

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

2. Cloudflare Pagesのデプロイコマンドを確認:
   - Deploy commandが `npm install --legacy-peer-deps && npm run build` になっているか確認

#### エラー: `Build output directory not found`

**原因**: Cloudflare Pagesが`out`ディレクトリを自動検出できていない

**解決方法**:
- Next.jsの設定で`output: 'export'`が設定されているか確認
- `next.config.ts`を確認:
  ```typescript
  output: 'export',
  ```
- デプロイコマンドで`npm run build`が実行されているか確認

#### エラー: `npm install failed`

**解決**: Deploy commandに `--legacy-peer-deps` を追加

## 📝 現在の設定

- **Framework**: Next.js 15
- **Build output**: Static Export (`out/`) - 自動検出
- **Node version**: 18 (`.nvmrc`で指定)
- **画像数**: 747枚（自動検出）
- **Build command**: `npm install --legacy-peer-deps && npm run build`（任意）
- **Deploy command**: `npm install --legacy-peer-deps && npm run build`（必須）⚠️

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

### Cloudflare Pagesの最新仕様

- **Build command**: 任意（設定しなくても可）
- **Deploy command**: 必須（必ず設定が必要）
- **Build output directory**: 設定項目なし（Cloudflare Pagesが自動的に`out`ディレクトリを検出）

Next.jsの静的エクスポート（`output: 'export'`）を使用している場合、`npm run build`を実行すると`out`ディレクトリに出力されます。Cloudflare Pagesはこのディレクトリを自動的に検出してデプロイします。

**デプロイコマンドには、依存関係のインストールとビルドの両方を含める必要があります。**
