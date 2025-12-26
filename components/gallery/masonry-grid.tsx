'use client';

import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { type ImageData } from '@/lib/images';
import { ImageItem } from './image-item';
import { InfiniteScroll } from './infinite-scroll';

interface MasonryGridProps {
  images: ImageData[];
  onImageClick: (index: number) => void;
  itemsPerPage?: number;
}

interface ImageWithAspect extends ImageData {
  aspectRatio: number;
}

// バーチャルスクロール: 表示範囲内の画像のみ計算
function useVirtualScroll(
  images: ImageWithAspect[],
  isMobile: boolean,
  viewportHeight: number,
  displayedCount: number
) {
  return useMemo(() => {
    if (isMobile) {
      // モバイル: 表示されている画像のみ（バッファなし）
      return images.slice(0, displayedCount);
    }
    // PC: 表示されている画像のみ
    return images.slice(0, displayedCount);
  }, [images, isMobile, displayedCount, viewportHeight]);
}

export const MasonryGrid = memo(function MasonryGrid({ 
  images, 
  onImageClick, 
  itemsPerPage = 20 
}: MasonryGridProps) {
  const [columns, setColumns] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [imagesWithAspect, setImagesWithAspect] = useState<ImageWithAspect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // レスポンシブな列数の設定（最適化：デバウンス）
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const updateColumns = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        setIsMobile(width < 640);
        setViewportHeight(window.innerHeight);
        if (width < 640) {
          setColumns(2);
        } else if (width < 1024) {
          setColumns(2);
        } else {
          setColumns(3);
        }
      }, 100);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns, { passive: true });
    return () => {
      window.removeEventListener('resize', updateColumns);
      clearTimeout(timeoutId);
    };
  }, []);

  // 画像のアスペクト比を取得（最適化版：デフォルト値のみ使用）
  useEffect(() => {
    if (images.length === 0) return;

    // すべての画像をデフォルト値で即座に表示
    const defaultImages: ImageWithAspect[] = images.map((image) => ({
      ...image,
      aspectRatio: image.width && image.height 
        ? image.height / image.width 
        : 4 / 3,
    }));

    setImagesWithAspect(defaultImages);
    setIsLoading(false);
  }, [images]);

  // バーチャルスクロール: 表示範囲内の画像のみ
  const visibleImages = useVirtualScroll(
    imagesWithAspect,
    isMobile,
    viewportHeight,
    displayedCount
  );

  // Masonry Layoutアルゴリズム（モバイルは2列の交互レイアウト）
  const columnsData = useMemo(() => {
    if (visibleImages.length === 0) return [];

    if (isMobile) {
      const cols: ImageWithAspect[][] = [[], []];
      visibleImages.forEach((image, index) => {
        cols[index % 2].push(image);
      });
      return cols;
    }

    const cols: ImageWithAspect[][] = Array.from({ length: columns }, () => []);
    const heights = Array(columns).fill(0);

    visibleImages.forEach((image) => {
      const shortestColumn = heights.indexOf(Math.min(...heights));
      cols[shortestColumn].push(image);
      heights[shortestColumn] += image.aspectRatio;
    });

    return cols;
  }, [visibleImages, columns, isMobile]);

  // 無限スクロール用のコールバック（メモ化、最適化）
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || displayedCount >= imagesWithAspect.length) return;
    
    setIsLoadingMore(true);
    // requestIdleCallbackを使用（可能な場合）
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const newCount = Math.min(displayedCount + itemsPerPage, imagesWithAspect.length);
        setDisplayedCount(newCount);
        setIsLoadingMore(false);
      }, { timeout: 200 });
    } else {
      // フォールバック: requestAnimationFrame
      requestAnimationFrame(() => {
        setTimeout(() => {
          const newCount = Math.min(displayedCount + itemsPerPage, imagesWithAspect.length);
          setDisplayedCount(newCount);
          setIsLoadingMore(false);
        }, 50);
      });
    }
  }, [isLoadingMore, displayedCount, imagesWithAspect.length, itemsPerPage]);

  const hasMore = displayedCount < imagesWithAspect.length;

  if (isLoading && imagesWithAspect.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin" />
          </div>
          <p className="text-gray-600">画像を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className={`
          ${isMobile 
            ? 'grid grid-cols-2 gap-2 px-2' 
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-4 md:px-6 lg:px-8'
          } 
          max-w-7xl mx-auto
        `}
      >
        {columnsData.map((column, colIndex) => (
          <div 
            key={colIndex} 
            className={isMobile ? 'flex flex-col gap-2' : 'flex flex-col gap-4 md:gap-6 lg:gap-8'}
          >
            {column.map((image, imageIndex) => {
              const globalIndex = images.findIndex((img) => img.id === image.id);
              
              return (
                <ImageItem
                  key={image.id}
                  image={image}
                  index={globalIndex}
                  columns={columns}
                  isMobile={isMobile}
                  columnIndex={colIndex}
                  imageIndex={imageIndex}
                  onClick={() => onImageClick(globalIndex)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <InfiniteScroll
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loading={isLoadingMore}
        />
      )}
    </>
  );
});
