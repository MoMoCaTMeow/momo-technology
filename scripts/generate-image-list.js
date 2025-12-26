/**
 * imagesフォルダ内の画像を自動的に検出して、lib/images.tsを生成するスクリプト
 * 
 * 使用方法:
 * node scripts/generate-image-list.js
 */

const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const webpDir = path.join(__dirname, '../public/webp');
const outputFile = path.join(__dirname, '../lib/images.ts');

function generateImageList() {
  try {
    // imagesフォルダ内のファイルを取得
    const files = fs.readdirSync(imagesDir);
    
    // 画像ファイルのみをフィルタリング
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });

    // 画像データを生成
    const imageData = imageFiles.map((file, index) => {
      const id = `img-${index + 1}`;
      const name = path.basename(file, path.extname(file));
      const webpPath = path.join(webpDir, `${file}.webp`);
      const hasWebp = fs.existsSync(webpPath);
      return {
        id,
        // 可能なら軽量WebPを優先（未生成なら元画像に knowing fallback）
        src: hasWebp ? `/webp/${file}.webp` : `/images/${file}`,
        alt: name.replace(/[-_]/g, ' '),
      };
    });

    // TypeScriptファイルを生成
    const content = `// 画像データの定義（自動生成）
// このファイルは scripts/generate-image-list.js によって自動生成されます
// 手動で編集する場合は、再生成時に上書きされることに注意してください

export interface ImageData {
  id: string;
  src: string;
  alt: string;
  width?: number;  // オプショナル（実際のサイズを自動取得）
  height?: number; // オプショナル（実際のサイズを自動取得）
}

/**
 * 画像の実際のサイズを取得する関数
 */
export async function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = src;
  });
}

// 画像のメタデータ
export const images: ImageData[] = ${JSON.stringify(imageData, null, 2).replace(/"([^"]+)":/g, '$1:')};
`;

    fs.writeFileSync(outputFile, content, 'utf-8');
    console.log(`✅ ${imageFiles.length}枚の画像を検出しました`);
    console.log(`✅ ${outputFile} を生成しました`);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

generateImageList();

