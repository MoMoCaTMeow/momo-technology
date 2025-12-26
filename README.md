# Image Gallery - Premium モダンな写真ギャラリーサイト

美しい写真を展示するための**プレミアムなモダンギャラリーWebサイト**です。2025年の最新デザイントレンドを完全に取り入れた、最高品質のギャラリー体験を提供します。

## ✨ 特徴

### 🎨 デザイン
- **ダークモード対応** - ユーザーが選択可能なダークモード（システム設定も自動検出）
- **ミニマルデザイン** - 余白を活かした洗練されたレイアウト
- **大胆なタイポグラフィ** - グラデーションテキストと視覚的なインパクト
- **グラスモーフィズム** - モダンなガラス効果のUI要素

### 🎬 アニメーション & インタラクション
- **スクロールアニメーション** - パララックス効果とフェードインアニメーション
- **3Dホバーエフェクト** - 画像にマウスオーバーで立体的なエフェクト
- **マイクロインタラクション** - 細やかなアニメーションでユーザー体験を向上
- **スムーズなトランジション** - すべてのアニメーションが滑らか

### 🖼️ ギャラリー機能
- **自動アスペクト比対応** - 各画像の実際のサイズを読み込んで、縦横比を自動取得
- **Masonry Grid Layout** - 画像の高さが異なっても美しく配置されるレイアウト
- **無限スクロール** - 大量の画像も快適に閲覧可能
- **検索・フィルター機能** - 画像を検索して絞り込み可能
- **高度なLightbox** - 画像を拡大表示、キーボード操作、スワイプ操作対応
- **レスポンシブデザイン** - モバイル、タブレット、デスクトップ完全対応

### ⚡ パフォーマンス
- **バッチ処理** - 大量の画像を効率的に読み込み
- **遅延読み込み** - 画像の遅延読み込みで初期読み込み速度を向上
- **段階的表示** - 読み込んだ画像から順に表示
- **最適化されたアニメーション** - GPUアクセラレーションを活用

## 🚀 セットアップ

```bash
# 依存関係のインストール
npm install --legacy-peer-deps

# 開発サーバーを起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバーを起動
npm start
```

開発サーバーは [http://localhost:3000](http://localhost:3000) で起動します。

## 🖼️ 画像の追加方法

### 方法1: 自動検出（推奨）

1. `public/images/` フォルダに画像を追加（JPEG、PNG、WebP対応）
2. 以下のコマンドを実行：

```bash
npm run generate-images
```

これで、`lib/images.ts` が自動的に更新され、追加した画像がギャラリーに表示されます。

### 方法2: 手動追加

`lib/images.ts` に直接画像情報を追加：

```typescript
{
  id: '7',
  src: '/images/新しい画像.jpg',
  alt: '画像の説明',
  // width/heightは省略可能（自動取得されます）
}
```

## 🎨 カスタマイズ

### テーマカラーの変更

`tailwind.config.ts` の `primary` カラーを変更：

```typescript
primary: {
  500: '#0EA5E9', // メインカラー
  600: '#0284C7', // ホバーカラー
  // ...
}
```

### 列数の変更

`components/gallery/masonry-grid.tsx` の `updateColumns` 関数で変更：

```typescript
if (window.innerWidth < 640) {
  setColumns(1);  // モバイル
} else if (window.innerWidth < 1024) {
  setColumns(2);  // タブレット
} else {
  setColumns(4);  // デスクトップ（3列から4列に変更など）
}
```

### アニメーション速度の調整

各コンポーネントの `transition` プロパティで調整可能です。

## 📁 プロジェクト構造

```
image-gallery/
├── app/
│   ├── layout.tsx      # ルートレイアウト
│   ├── page.tsx        # ホームページ
│   └── globals.css     # グローバルスタイル
├── components/
│   ├── ui/
│   │   └── theme-toggle.tsx  # テーマ切り替えボタン
│   └── gallery/
│       ├── hero-section.tsx   # ヒーローセクション
│       ├── filter-bar.tsx     # 検索・フィルターバー
│       ├── masonry-grid.tsx   # Masonry Gridコンポーネント
│       ├── image-item.tsx     # 個別画像コンポーネント（3D効果付き）
│       ├── infinite-scroll.tsx # 無限スクロール
│       └── lightbox.tsx       # Lightboxコンポーネント
├── lib/
│   ├── images.ts       # 画像データの定義（自動生成可能）
│   └── utils.ts        # ユーティリティ関数
├── scripts/
│   └── generate-image-list.js  # 画像リスト自動生成スクリプト
└── public/
    └── images/         # 画像ファイル
```

## 🌐 デプロイ

### Cloudflare Pages

1. GitHubにプッシュ
2. Cloudflare Pagesでリポジトリを接続
3. ビルド設定:
   - **Build command**: `npm install --legacy-peer-deps && npm run build`
   - **Build output directory**: `out`
   - **Node version**: `18`

## 🎯 実装された最新トレンド

- ✅ ダークモード（ユーザー選択可能）
- ✅ スクロールアニメーション（パララックス効果）
- ✅ 3Dホバーエフェクト
- ✅ グラスモーフィズム
- ✅ マイクロインタラクション
- ✅ 無限スクロール
- ✅ 検索・フィルター機能
- ✅ 高度なLightbox機能
- ✅ レスポンシブデザイン
- ✅ パフォーマンス最適化

## 📝 ライセンス

Copyright © 2025 Image Gallery. All rights reserved.
