'use client';

import { useRef, useEffect, useState, memo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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

// モバイル用の軽量コンポーネント（Framer Motion不使用）
function MobileImageItem({ 
  image, 
  columnIndex = 0,
  imageIndex = 0,
  onClick 
}: Omit<ImageItemProps, 'index' | 'columns'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // モバイル: 交互に斜めに回転
  const rotation = columnIndex === 0 
    ? (imageIndex % 2 === 0 ? -3 : 3) 
    : (imageIndex % 2 === 0 ? 3 : -3);

  // Intersection Observer（最適化版）
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { 
        threshold: 0.01,
        rootMargin: '50px' // 50px手前で読み込み開始
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden cursor-pointer rounded-lg transition-opacity duration-300 ${
        isInView ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      onClick={onClick}
    >
      <div
        className="relative w-full overflow-hidden bg-gray-100 rounded-lg"
        style={{
          aspectRatio: `${1 / image.aspectRatio}`,
        }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-300 group-active:scale-105"
          sizes="(max-width: 640px) 50vw, 50vw"
          loading="lazy"
          decoding="async"
          quality={60} // モバイル: さらに低品質（60）
          priority={false}
        />
      </div>
    </div>
  );
}

// PC用のコンポーネント（Framer Motion使用）
function DesktopImageItem({ 
  image, 
  index, 
  columns, 
  onClick 
}: Omit<ImageItemProps, 'isMobile' | 'columnIndex' | 'imageIndex'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // スクロールアニメーション
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.95]);

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  // Intersection Observer
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      style={{
        y: smoothY,
        opacity: smoothOpacity,
        scale: smoothScale,
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: isInView ? 1 : 0, 
        y: isInView ? 0 : 50,
      }}
      transition={{
        duration: 0.4,
        delay: (index % columns) * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative overflow-hidden cursor-pointer rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        className="relative w-full overflow-hidden bg-gray-100 rounded-xl"
        style={{
          aspectRatio: `${1 / image.aspectRatio}`,
        }}
        animate={{
          rotateY: isHovered ? 2 : 0,
          rotateX: isHovered ? -2 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <motion.div
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full h-full"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            decoding="async"
            quality={85}
            priority={false}
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />

        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{
            x: isHovered ? '100%' : '-100%',
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-end p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-white text-sm font-medium mb-2 text-center">
            {image.alt}
          </div>
          
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
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            boxShadow: isHovered
              ? '0 0 30px rgba(14, 165, 233, 0.4)'
              : '0 0 0px rgba(14, 165, 233, 0)',
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </motion.div>
  );
}

// メインコンポーネント
export const ImageItem = memo(function ImageItem(props: ImageItemProps) {
  if (props.isMobile) {
    return <MobileImageItem {...props} />;
  }
  return <DesktopImageItem {...props} />;
}, (prevProps, nextProps) => {
  return (
    prevProps.image.id === nextProps.image.id &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.columnIndex === nextProps.columnIndex &&
    prevProps.imageIndex === nextProps.imageIndex
  );
});
