'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { type ImageData } from '@/lib/images';

interface FilterBarProps {
  images: ImageData[];
  onFilterChange: (filteredImages: ImageData[]) => void;
}

export function FilterBar({ images, onFilterChange }: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      onFilterChange(images);
      return;
    }

    const filtered = images.filter((image) =>
      image.alt.toLowerCase().includes(query.toLowerCase())
    );
    onFilterChange(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onFilterChange(images);
  };

  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="container mx-auto px-3 md:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between gap-3 md:gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="画像を検索..."
                className="w-full pl-8 md:pl-10 pr-8 md:pr-10 py-2 md:py-2.5 text-sm md:text-base rounded-full bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={clearSearch}
                    className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-full h-full" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Image count */}
          <div className="text-xs md:text-sm text-gray-600 font-medium whitespace-nowrap">
            {images.length} 枚
          </div>
        </div>
      </div>
    </div>
  );
}
