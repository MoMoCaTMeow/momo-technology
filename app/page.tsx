'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MasonryGrid } from '@/components/gallery/masonry-grid';
import { Lightbox } from '@/components/gallery/lightbox';
import { HeroSection } from '@/components/gallery/hero-section';
import { FilterBar } from '@/components/gallery/filter-bar';
import { FluidBackground } from '@/components/gallery/fluid-background';
import { images } from '@/lib/images';

export default function HomePage() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [filteredImages, setFilteredImages] = useState(images);
  const isLightboxOpen = lightboxIndex >= 0;

  const handleImageClick = (index: number) => {
    // Filtered images内でのインデックスを元のimages配列のインデックスに変換
    const clickedImage = filteredImages[index];
    const originalIndex = images.findIndex((img) => img.id === clickedImage.id);
    setLightboxIndex(originalIndex);
  };

  const handleClose = () => {
    setLightboxIndex(-1);
  };

  const handleNext = () => {
    setLightboxIndex((prev) => {
      const nextIndex = (prev + 1) % images.length;
      return nextIndex;
    });
  };

  const handlePrevious = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <main className="min-h-screen bg-[#FEFCFB] relative">
      {/* Fluid Background */}
      <FluidBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight"
            >
              Image Gallery
            </motion.h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Filter Bar */}
      <FilterBar images={images} onFilterChange={setFilteredImages} />

      {/* Gallery */}
      <section className="py-8 md:py-12 lg:py-16 relative z-10">
        <MasonryGrid
          images={filteredImages}
          onImageClick={handleImageClick}
          itemsPerPage={20}
        />
      </section>

      {/* Lightbox */}
      <Lightbox
        images={images}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={handleClose}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </main>
  );
}
