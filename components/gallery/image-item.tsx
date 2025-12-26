'use client';

import { useRef, useEffect, useState, memo } from 'react';
import Image from 'next/image';
import { type ImageData } from '@/lib/images';

interface ImageItemProps {
  image: ImageData & { aspectRatio: number };
  index: number;
  columns: number;
  isMobile?: boolean;
  columnIndex?: number;
  imageIndex?: number;
  onClick: () => void;
}

// モバイル用の超軽量コンポーネント（Framer Motion完全不使用、最小限の処理）
const MobileImageItem = memo(function MobileImageItem({ 
  image, 
  columnIndex = 0,
  imageIndex = 0,
  onClick 
}: Omit<ImageItemProps, 'index' | 'columns'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // モバイル: 交互に斜めに回転（CSS変数で管理）
  const rotation = columnIndex === 0 
    ? (imageIndex % 2 === 0 ? -3 : 3) 
    : (imageIndex % 2 === 0 ? 3 : -3);

  // Intersection Observer（最適化版：より早くトリガー、シンプルに）
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect(); // 一度トリガーしたら切断
        }
      },
      { 
        threshold: 0,
        rootMargin: '150px' // 150px手前で読み込み開始（より早く）
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  // 画像の読み込み完了を検知
  useEffect(() => {
    if (!shouldLoad) return;
    
    const img = new window.Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(true); // エラーでも表示
    img.src = image.src;
  }, [shouldLoad, image.src]);

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden cursor-pointer rounded-lg"
      style={{
        transform: `rotate(${rotation}deg)`,
        aspectRatio: `${1 / image.aspectRatio}`,
        opacity: shouldLoad ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
      }}
      onClick={onClick}
    >
      <div className="relative w-full h-full overflow-hidden bg-gray-100 rounded-lg">
        {shouldLoad && (
          <>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className={`object-cover ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transition: 'opacity 0.3s ease-out',
              }}
              sizes="(max-width: 640px) 50vw, 50vw"
              loading="lazy"
              decoding="async"
              quality={40} // モバイル: さらに低品質（40）
              priority={false}
              unoptimized={false}
            />
            {/* プレースホルダー（シンプル） */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-gray-200" />
            )}
          </>
        )}
      </div>
    </div>
  );
});

import { lazy, Suspense } from 'react';

// PC用のコンポーネント（Framer Motion使用、別ファイルで動的インポート）
const DesktopImageItem = lazy(() => 
  import('./desktop-image-item').then(mod => ({ default: mod.DesktopImageItem }))
);

// メインコンポーネント
export const ImageItem = memo(function ImageItem(props: ImageItemProps) {
  if (props.isMobile) {
    return <MobileImageItem {...props} />;
  }
  return (
    <Suspense fallback={
      <div
        className="group relative overflow-hidden cursor-pointer rounded-xl opacity-0"
        style={{
          aspectRatio: `${1 / props.image.aspectRatio}`,
        }}
      >
        <div className="absolute inset-0 bg-gray-100 rounded-xl" />
      </div>
    }>
      <DesktopImageItem
        image={props.image}
        index={props.index}
        columns={props.columns}
        onClick={props.onClick}
      />
    </Suspense>
  );
}, (prevProps, nextProps) => {
  // より厳密なメモ化比較
  if (prevProps.image.id !== nextProps.image.id) return false;
  if (prevProps.isMobile !== nextProps.isMobile) return false;
  if (prevProps.columnIndex !== nextProps.columnIndex) return false;
  if (prevProps.imageIndex !== nextProps.imageIndex) return false;
  return true;
});
