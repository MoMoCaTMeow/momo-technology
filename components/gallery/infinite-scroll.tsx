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
  const isInView = useInView(ref, { once: false, margin: '100px' });

  useEffect(() => {
    if (isInView && hasMore && !loading) {
      onLoadMore();
    }
  }, [isInView, hasMore, loading, onLoadMore]);

  if (!hasMore) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>すべての画像を表示しました</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="h-32 flex items-center justify-center">
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
