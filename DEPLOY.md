# GitHub & Cloudflare Pages デプロイガイド

## ⚠️ 重要な設定（最新仕様）

### Cloudflare Pagesの設定

**最新のCloudflare Pagesの仕様**:
- **Build command**: 任意（Optional）
- **Deploy command**: 必須（Required）
- **Build output directory**: 設定項目なし（自動検出）
- **Build timeout**: 20分（無料プランは15分の可能性あり）

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

### ビルドがタイムアウトする場合

#### エラー: `Build took too long and was timed out`

**原因**: ビルド時間が20分（無料プランは15分）を超えている

**解決方法**:
1. **Next.jsのビルド設定を最適化**（実施済み）:
   - `next.config.ts`でビルド最適化を有効化
   - `swcMinify: true`でビルド時間を短縮
   - `optimizePackageImports`でパッケージの最適化

2. **画像ファイルの最適化**:
   - 画像は既に`unoptimized: true`で最適化を無効化
   - クライアントサイドでのみ画像サイズを取得（ビルド時には実行されない）

3. **ビルドログを確認**:
   - Cloudflare Pagesの「Deployments」タブでビルドログを確認
   - どの処理に時間がかかっているか特定

4. **Cloudflare Pagesのプランを確認**:
   - 無料プラン: 15分のタイムアウト
   - 有料プラン: 20分のタイムアウト
   - 必要に応じてプランをアップグレード

#### エラー: `npm ci` failed / package-lock.json out of sync

**原因**: Cloudflare Pagesが自動的に`npm ci`を実行しようとしているが、`package-lock.json`が不一致

**解決方法**:
1. **`package-lock.json`を削除**（実施済み）:
   - このプロジェクトでは`package-lock.json`を削除しています
   - Cloudflare Pagesが`npm install`を使用するようになります
   - デプロイコマンドに`npm install --legacy-peer-deps`を含めることで、依存関係が正しくインストールされます

2. **または、`package-lock.json`を再生成**:
   ```bash
   rm package-lock.json
   npm install --legacy-peer-deps
   git add package-lock.json
   git commit -m "fix: Update package-lock.json"
   git push origin main
   ```

#### エラー: `Build output directory not found`

**原因**: Cloudflare Pagesが`out`ディレクトリを自動検出できていない

**解決方法**:
- Next.jsの設定で`output: 'export'`が設定されているか確認
- `next.config.ts`を確認:
  ```typescript
  output: 'export',
  ```
- デプロイコマンドで`npm run build`が実行されているか確認

## 📝 現在の設定

- **Framework**: Next.js 15
- **Build output**: Static Export (`out/`) - 自動検出
- **Node version**: 18 (`.nvmrc`で指定)
- **画像数**: 747枚（自動検出）
- **Build command**: `npm install --legacy-peer-deps && npm run build`（任意）
- **Deploy command**: `npm install --legacy-peer-deps && npm run build`（必須）⚠️
- **package-lock.json**: 削除済み（`npm install`を使用）
- **Build optimization**: 有効（`swcMinify`, `optimizePackageImports`）

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
- **Build timeout**: 20分（無料プランは15分の可能性あり）

### ビルドタイムアウトについて

747枚の画像を処理する場合、ビルド時間が長くなる可能性があります。現在の設定で最適化を実施していますが、それでもタイムアウトする場合は：

1. Cloudflare Pagesのプランを確認（無料プランは15分のタイムアウト）
2. ビルドログを確認して、どの処理に時間がかかっているか特定
3. 必要に応じて画像数を減らすか、画像の最適化を検討

### package-lock.jsonについて

このプロジェクトでは`package-lock.json`を削除しています。これにより：
- Cloudflare Pagesが`npm ci`の代わりに`npm install`を使用します
- デプロイコマンドに`npm install --legacy-peer-deps`を含めることで、依存関係が正しくインストールされます
- `npm ci`による`package-lock.json`の不一致エラーを回避できます

Next.jsの静的エクスポート（`output: 'export'`）を使用している場合、`npm run build`を実行すると`out`ディレクトリに出力されます。Cloudflare Pagesはこのディレクトリを自動的に検出してデプロイします。

**デプロイコマンドには、依存関係のインストールとビルドの両方を含める必要があります。**
