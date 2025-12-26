'use client';

import { useEffect, useRef, useCallback, memo } from 'react';
import { useInView } from 'framer-motion';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export const InfiniteScroll = memo(function InfiniteScroll({ 
  onLoadMore, 
  hasMore, 
  loading 
}: InfiniteScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: false, 
    margin: '500px', // 500px手前でトリガー（より早く）
    amount: 0.1,
  });

  // Intersection Observerによるトリガー
  useEffect(() => {
    if (isInView && hasMore && !loading) {
      onLoadMore();
    }
  }, [isInView, hasMore, loading, onLoadMore]);

  // スクロールイベントリスナーによるフォールバック（最適化版）
  const handleScroll = useCallback(() => {
    if (!hasMore || loading || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // 要素が画面の下から600px以内に入ったら読み込む
    if (rect.top <= windowHeight + 600 && rect.bottom >= -600) {
      if (!loading) {
        onLoadMore();
      }
    }
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let ticking = false;

    const throttledScroll = () => {
      if (!ticking) {
        timeoutId = setTimeout(() => {
          handleScroll();
          ticking = false;
        }, 100); // 100ms間隔で実行
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    throttledScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  if (!hasMore) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>すべての画像を表示しました</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="h-32 flex items-center justify-center py-6">
      {loading && (
        <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      )}
    </div>
  );
});
