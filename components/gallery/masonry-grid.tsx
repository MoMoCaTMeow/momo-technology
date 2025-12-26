'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  loaded: boolean;
}

export function MasonryGrid({ images, onImageClick, itemsPerPage = 20 }: MasonryGridProps) {
  const [columns, setColumns] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [imagesWithAspect, setImagesWithAspect] = useState<ImageWithAspect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(0);

  // レスポンシブな列数の設定
  useEffect(() => {
    const updateColumns = () => {
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
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
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
      loaded: true,
    }));

    setImagesWithAspect(defaultImages);
    setIsLoading(false);
  }, [images]);

  // バーチャルスクロール: 表示範囲内の画像のみ計算
  const visibleRange = useMemo(() => {
    if (isMobile) {
      // モバイル: ビューポートの上下2画面分を表示
      const buffer = viewportHeight * 2;
      return { start: 0, end: displayedCount };
    }
    return { start: 0, end: displayedCount };
  }, [isMobile, displayedCount, viewportHeight]);

  // Masonry Layoutアルゴリズム（モバイルは2列の交互レイアウト）
  const columnsData = useMemo(() => {
    const displayedImages = imagesWithAspect.slice(visibleRange.start, visibleRange.end);
    if (displayedImages.length === 0) return [];

    if (isMobile) {
      const cols: ImageWithAspect[][] = [[], []];
      displayedImages.forEach((image, index) => {
        cols[index % 2].push(image);
      });
      return cols;
    }

    const cols: ImageWithAspect[][] = Array.from({ length: columns }, () => []);
    const heights = Array(columns).fill(0);

    displayedImages.forEach((image) => {
      const shortestColumn = heights.indexOf(Math.min(...heights));
      cols[shortestColumn].push(image);
      heights[shortestColumn] += image.aspectRatio;
    });

    return cols;
  }, [imagesWithAspect, columns, visibleRange, isMobile]);

  // 無限スクロール用のコールバック（メモ化）
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || displayedCount >= imagesWithAspect.length) return;
    
    setIsLoadingMore(true);
    // リクエストアニメーションフレームで遅延（パフォーマンス向上）
    requestAnimationFrame(() => {
      setTimeout(() => {
        const newCount = Math.min(displayedCount + itemsPerPage, imagesWithAspect.length);
        setDisplayedCount(newCount);
        setIsLoadingMore(false);
      }, 100); // 遅延を短縮
    });
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
}
