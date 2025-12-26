# MOMO Technology - Modern Website

モダンなWebサイト構築プロジェクト（React 19 / Next.js 15 / TypeScript / Tailwind CSS）

## 🚀 技術スタック

- **Frontend**: React 19 (Next.js 15+ App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS 4.0
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Infrastructure**: Vercel / Cloudflare Pages

## 📦 セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーを起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバーを起動
npm start
```

開発サーバーは [http://localhost:3000](http://localhost:3000) で起動します。

## 📁 プロジェクト構造

```
momo-technology/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   └── globals.css        # グローバルスタイル
├── components/
│   ├── ui/                # プリミティブUIコンポーネント
│   ├── sections/          # セクションコンポーネント
│   └── blocks/            # 汎用パーツ
├── lib/                   # ユーティリティ関数
└── public/                # 静的ファイル
```

## 🎨 デザインシステム

### カラーパレット
- **Primary**: Blue (#007AFF)
- **Navy**: Deep Navy (#050505)
- **Glass Morphism**: 透過・ぼかし効果

### タイポグラフィ
- **日本語**: Noto Sans JP
- **英数**: Geist Sans / Inter
- **流動的なフォントサイズ**: Fluid Typography

### レイアウト
- **Bento Grid**: セクションごとに異なるサイズのカードレイアウト
- **レスポンシブ**: モバイルファースト設計

## 🌐 デプロイ

### Cloudflare Pages
1. GitHubリポジトリにプッシュ
2. Cloudflare Pagesでリポジトリを接続
3. ビルド設定:
   - Build command: `npm run build`
   - Output directory: `.next`
   - Node version: 18+

### Vercel
```bash
vercel
```

## 📝 ライセンス

Copyright © 2025 MOMO Technology Inc. All rights reserved.

