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

// モバイル用の超軽量コンポーネント（極限まで最適化）
const MobileImageItem = memo(function MobileImageItem({ 
  image, 
  columnIndex = 0,
  imageIndex = 0,
  onClick 
}: Omit<ImageItemProps, 'index' | 'columns'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  // モバイル: 交互に斜めに回転（CSS変数で管理）
  const rotation = columnIndex === 0 
    ? (imageIndex % 2 === 0 ? -3 : 3) 
    : (imageIndex % 2 === 0 ? 3 : -3);

  // Intersection Observer（極限まで最適化）
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0,
        rootMargin: '200px' // 200px手前で読み込み開始
      }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden cursor-pointer rounded-lg"
      style={{
        transform: `rotate(${rotation}deg)`,
        aspectRatio: `${1 / image.aspectRatio}`,
        opacity: shouldLoad ? 1 : 0,
        transition: 'opacity 0.15s ease-out',
      }}
      onClick={onClick}
    >
      <div className="relative w-full h-full overflow-hidden bg-gray-100 rounded-lg">
        {shouldLoad && (
          <Image
            src={image.src}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 50vw"
            loading="lazy"
            decoding="async"
            quality={30} // モバイル: 極限まで低品質（30）
            priority={false}
            unoptimized={false}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
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
        className="relative overflow-hidden cursor-pointer rounded-xl opacity-0"
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
