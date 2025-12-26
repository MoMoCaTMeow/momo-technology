/**
 * 画像を自動的に検出して読み込むユーティリティ
 * 大量の画像を扱う場合に便利
 */

export interface ImageInfo {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * imagesフォルダ内の画像を自動的に検出する関数
 * 実際の実装では、APIやファイルシステムから取得する必要があります
 * 
 * 注意: 静的サイトでは、画像のリストを事前に定義する必要があります
 * 動的に画像を検出するには、サーバーサイドのAPIが必要です
 */
export async function loadImagesFromFolder(): Promise<ImageInfo[]> {
  // この関数は、実際のプロジェクトではサーバーAPIから画像リストを取得します
  // 現在は、public/images/フォルダ内の画像を手動でリストアップする必要があります
  
  // 例: APIから取得する場合
  // const response = await fetch('/api/images');
  // return await response.json();
  
  return [];
}

/**
 * 画像の実際のサイズを取得
 */
export function getImageSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };
    img.src = src;
  });
}

/**
 * 複数の画像のサイズを並列で取得
 */
export async function getImageSizes(
  images: ImageInfo[]
): Promise<Array<ImageInfo & { width: number; height: number }>> {
  const promises = images.map(async (image) => {
    if (image.width && image.height) {
      return { ...image, width: image.width, height: image.height };
    }
    
    try {
      const size = await getImageSize(image.src);
      return { ...image, ...size };
    } catch (error) {
      console.error(`Failed to get size for ${image.src}:`, error);
      return { ...image, width: 1200, height: 1600 }; // デフォルト値
    }
  });

  return Promise.all(promises);
}

