'use client';

import { useEffect, useRef } from 'react';
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
    margin: '200px',
    amount: 0.1,
  });

  useEffect(() => {
    if (isInView && hasMore && !loading) {
      onLoadMore();
    }
  }, [isInView, hasMore, loading, onLoadMore]);

  // スクロールイベントリスナー（最適化版：throttle追加）
  useEffect(() => {
    if (!hasMore || loading) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!ref.current) {
            ticking = false;
            return;
          }
          
          const rect = ref.current.getBoundingClientRect();
          const windowHeight = window.innerHeight || document.documentElement.clientHeight;
          
          if (rect.top <= windowHeight + 300 && rect.bottom >= -300) {
            if (!loading) {
              onLoadMore();
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, loading, onLoadMore]);

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
