'use client';

import { useRef, useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
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

export const ImageItem = memo(function ImageItem({ 
  image, 
  index, 
  columns, 
  isMobile = false,
  columnIndex = 0,
  imageIndex = 0,
  onClick 
}: ImageItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // モバイル: 交互に斜めに回転
  const rotation = isMobile 
    ? (columnIndex === 0 ? (imageIndex % 2 === 0 ? -3 : 3) : (imageIndex % 2 === 0 ? 3 : -3))
    : 0;

  // Intersection Observer（最適化版：thresholdを緩和）
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.01 } // 0.1→0.01に変更（より早くトリガー）
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: isMobile ? 10 : 20, rotate: isMobile ? rotation : 0 }}
      animate={{ 
        opacity: isInView ? 1 : 0, 
        y: isInView ? 0 : (isMobile ? 10 : 20),
        rotate: isMobile ? rotation : 0,
      }}
      transition={{
        duration: 0.4, // 0.5→0.4に短縮
        delay: isMobile ? imageIndex * 0.03 : (index % columns) * 0.05, // 遅延を短縮
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`group relative overflow-hidden cursor-pointer ${
        isMobile ? 'rounded-lg' : 'rounded-xl'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* 3D Container */}
      <motion.div
        className={`relative w-full overflow-hidden bg-gray-100 ${
          isMobile ? 'rounded-lg' : 'rounded-xl'
        }`}
        style={{
          aspectRatio: `${1 / image.aspectRatio}`,
        }}
        animate={{
          rotateY: isMobile ? 0 : (isHovered ? 2 : 0),
          rotateX: isMobile ? 0 : (isHovered ? -2 : 0),
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }} // 0.3→0.2に短縮
      >
        {/* Image */}
        <motion.div
          animate={{
            scale: isHovered ? (isMobile ? 1.05 : 1.1) : 1,
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} // 0.6→0.4に短縮
          className="relative w-full h-full"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes={isMobile ? "(max-width: 640px) 50vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            loading="lazy"
            decoding="async" // 非同期デコードを追加
            quality={85} // 品質を少し下げてパフォーマンス向上
          />
        </motion.div>

        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }} // 0.3→0.2に短縮
        />

        {/* Shine Effect (デスクトップのみ) */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{
              x: isHovered ? '100%' : '-100%',
            }}
            transition={{
              duration: 0.6, // 0.8→0.6に短縮
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Content Overlay */}
        <motion.div
          className={`absolute inset-0 flex flex-col items-center justify-end ${
            isMobile ? 'p-2' : 'p-6'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20,
          }}
          transition={{ duration: 0.2 }} // 0.3→0.2に短縮
        >
          {!isMobile && (
            <>
              <div className="text-white text-sm font-medium mb-2 text-center">
                {image.alt}
              </div>
              
              {/* Zoom Icon */}
              <motion.div
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                  />
                </svg>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Glow Effect (デスクトップのみ) */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              boxShadow: isHovered
                ? '0 0 30px rgba(14, 165, 233, 0.4)'
                : '0 0 0px rgba(14, 165, 233, 0)',
            }}
            transition={{ duration: 0.2 }} // 0.3→0.2に短縮
          />
        )}
      </motion.div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // メモ化の比較関数（パフォーマンス向上）
  return (
    prevProps.image.id === nextProps.image.id &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.columnIndex === nextProps.columnIndex &&
    prevProps.imageIndex === nextProps.imageIndex
  );
});
