# Cloudflare Pages デプロイ設定ガイド

## 必要な設定

Cloudflare PagesでNext.jsアプリをデプロイする際の設定は以下の通りです：

### ビルド設定

1. **Build command** (ビルドコマンド):
   ```
   npm install --legacy-peer-deps && npm run build
   ```

2. **Build output directory** (ビルド出力ディレクトリ):
   ```
   .next
   ```

3. **Root directory** (ルートディレクトリ):
   ```
   / (空白のまま)
   ```

4. **Node.js version**:
   ```
   18
   ```
   （`.nvmrc`ファイルで指定済み）

### 環境変数

現在は特に必要なし（必要に応じて追加）

### 注意事項

- Next.js 15はApp Routerを使用しているため、静的エクスポートではなく通常のビルドを使用
- Cloudflare PagesはNext.jsのサーバーサイドレンダリング（SSR）をサポートしています
- ビルドが失敗する場合は、Cloudflare Pagesのダッシュボードでビルドログを確認してください

### デプロイの確認手順

1. Cloudflare Pagesダッシュボードにログイン
2. プロジェクトを選択
3. 「Deployments」タブで最新のデプロイを確認
4. ビルドログを確認してエラーがないかチェック
5. デプロイが成功したら、プレビューURLまたはカスタムドメインで確認

