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

// モバイル用の超軽量コンポーネント（Framer Motion完全不使用）
function MobileImageItem({ 
  image, 
  columnIndex = 0,
  imageIndex = 0,
  onClick 
}: Omit<ImageItemProps, 'index' | 'columns'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // モバイル: 交互に斜めに回転
  const rotation = columnIndex === 0 
    ? (imageIndex % 2 === 0 ? -3 : 3) 
    : (imageIndex % 2 === 0 ? 3 : -3);

  // Intersection Observer（最適化版：より早くトリガー）
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // 画像の読み込みを開始
          const img = new window.Image();
          img.onload = () => setIsLoaded(true);
          img.src = image.src;
        }
      },
      { 
        threshold: 0,
        rootMargin: '100px' // 100px手前で読み込み開始
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [image.src]);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden cursor-pointer rounded-lg transition-opacity duration-200 ${
        isInView ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: `rotate(${rotation}deg)`,
        willChange: 'transform, opacity',
      }}
      onClick={onClick}
    >
      <div
        className="relative w-full overflow-hidden bg-gray-100 rounded-lg"
        style={{
          aspectRatio: `${1 / image.aspectRatio}`,
        }}
      >
        {isInView && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="(max-width: 640px) 50vw, 50vw"
            loading="lazy"
            decoding="async"
            quality={50} // モバイル: さらに低品質（50）
            priority={false}
          />
        )}
        {/* プレースホルダー */}
        {!isLoaded && isInView && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>
    </div>
  );
}

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
  return (
    prevProps.image.id === nextProps.image.id &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.columnIndex === nextProps.columnIndex &&
    prevProps.imageIndex === nextProps.imageIndex
  );
});
