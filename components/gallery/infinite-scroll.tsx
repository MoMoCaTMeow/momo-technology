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
  // マージンを大きくして、より早くトリガーされるようにする
  const isInView = useInView(ref, { 
    once: false, 
    margin: '200px', // 200px手前でトリガー
    amount: 0.1, // 10%が見えたらトリガー
  });

  useEffect(() => {
    if (isInView && hasMore && !loading) {
      console.log('Loading more images...', { isInView, hasMore, loading });
      onLoadMore();
    }
  }, [isInView, hasMore, loading, onLoadMore]);

  // スクロールイベントリスナーも追加（フォールバック）
  useEffect(() => {
    if (!hasMore || loading) return;

    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      // 要素が画面の下から300px以内に入ったら読み込む
      if (rect.top <= windowHeight + 300 && rect.bottom >= -300) {
        if (!loading) {
          console.log('Scroll trigger: Loading more images...');
          onLoadMore();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初回チェック

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
