'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useInView } from 'framer-motion';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export function InfiniteScroll({ onLoadMore, hasMore, loading }: InfiniteScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: false, 
    margin: '300px', // 300px手前でトリガー（より早く）
    amount: 0.1,
  });

  // Intersection Observerによるトリガー
  useEffect(() => {
    if (isInView && hasMore && !loading) {
      onLoadMore();
    }
  }, [isInView, hasMore, loading, onLoadMore]);

  // スクロールイベントリスナーによるフォールバック（requestAnimationFrameで最適化）
  const handleScroll = useCallback(() => {
    if (!hasMore || loading || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // 要素が画面の下から400px以内に入ったら読み込む
    if (rect.top <= windowHeight + 400 && rect.bottom >= -400) {
      if (!loading) {
        onLoadMore();
      }
    }
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    let animationFrameId: number;
    let ticking = false;

    const throttledScroll = () => {
      if (!ticking) {
        animationFrameId = requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    throttledScroll(); // 初回チェック

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [handleScroll]);

  if (!hasMore) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>すべての画像を表示しました</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="h-40 flex items-center justify-center py-8">
      {loading && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      )}
    </div>
  );
}
