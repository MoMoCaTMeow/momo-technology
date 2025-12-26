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
  const [imagesWithAspect, setImagesWithAspect] = useState<ImageWithAspect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // レスポンシブな列数の設定
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) {
        setColumns(1);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // 画像のアスペクト比を取得（最適化版：先にデフォルト値で表示）
  useEffect(() => {
    if (images.length === 0) return;

    // まず、すべての画像をデフォルト値で即座に表示
    const defaultImages: ImageWithAspect[] = images.map((image) => ({
      ...image,
      aspectRatio: image.width && image.height 
        ? image.height / image.width 
        : 4 / 3, // デフォルトアスペクト比
      loaded: false,
    }));

    setImagesWithAspect(defaultImages);
    setIsLoading(false);

    // その後、バックグラウンドで実際のサイズを取得して更新
    const updateImageDimensions = async () => {
      const batchSize = 30; // バッチサイズを大きくする
      
      for (let i = 0; i < images.length; i += batchSize) {
        const batch = images.slice(i, i + batchSize);
        
        await Promise.allSettled(
          batch.map(async (image, batchIndex) => {
            // 既にサイズが指定されている場合はスキップ
            if (image.width && image.height) {
              const globalIndex = i + batchIndex;
              const aspectRatio = image.height / image.width;
              setImagesWithAspect((prev) => {
                const updated = [...prev];
                if (updated[globalIndex]) {
                  updated[globalIndex] = {
                    ...updated[globalIndex],
                    aspectRatio,
                    loaded: true,
                  };
                }
                return updated;
              });
              return;
            }

            try {
              // 動的にインポートしてブラウザ環境でのみ実行
              const { getImageDimensions } = await import('@/lib/images');
              const dimensions = await getImageDimensions(image.src);
              const aspectRatio = dimensions.height / dimensions.width;
              const globalIndex = i + batchIndex;
              
              setImagesWithAspect((prev) => {
                const updated = [...prev];
                if (updated[globalIndex]) {
                  updated[globalIndex] = {
                    ...updated[globalIndex],
                    aspectRatio,
                    width: dimensions.width,
                    height: dimensions.height,
                    loaded: true,
                  };
                }
                return updated;
              });
            } catch (error) {
              // エラー時はデフォルト値のまま（既に設定済み）
              console.warn(`Failed to load dimensions for ${image.src}`);
            }
          })
        );

        // バッチ間で少し待機（ブラウザの負荷を軽減）
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    };

    // バックグラウンドで実行（非ブロッキング）
    updateImageDimensions();
  }, [images]);

  // Masonry Layoutアルゴリズム
  const columnsData = useMemo(() => {
    const displayedImages = imagesWithAspect.slice(0, displayedCount);
    if (displayedImages.length === 0) return [];

    const cols: ImageWithAspect[][] = Array.from({ length: columns }, () => []);
    const heights = Array(columns).fill(0);

    displayedImages.forEach((image) => {
      const shortestColumn = heights.indexOf(Math.min(...heights));
      cols[shortestColumn].push(image);
      heights[shortestColumn] += image.aspectRatio;
    });

    return cols;
  }, [imagesWithAspect, columns, displayedCount]);

  // 無限スクロール用のコールバック（メモ化）
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || displayedCount >= imagesWithAspect.length) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + itemsPerPage, imagesWithAspect.length));
      setIsLoadingMore(false);
    }, 300);
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {columnsData.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4 md:gap-6 lg:gap-8">
            {column.map((image) => {
              const globalIndex = images.findIndex((img) => img.id === image.id);
              
              return (
                <ImageItem
                  key={image.id}
                  image={image}
                  index={globalIndex}
                  columns={columns}
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
