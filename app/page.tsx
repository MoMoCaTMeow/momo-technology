'use client';

import { useState, lazy, Suspense } from 'react';
import { MasonryGrid } from '@/components/gallery/masonry-grid';
import { HeroSection } from '@/components/gallery/hero-section';
import { FilterBar } from '@/components/gallery/filter-bar';
import { FluidBackground } from '@/components/gallery/fluid-background';
import { images } from '@/lib/images';

// Lightboxを動的インポート（遅延読み込み）
const Lightbox = lazy(() => import('@/components/gallery/lightbox').then(mod => ({ default: mod.Lightbox })));

export default function HomePage() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [filteredImages, setFilteredImages] = useState(images);
  const isLightboxOpen = lightboxIndex >= 0;

  const handleImageClick = (index: number) => {
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
        <div className="container mx-auto px-3 md:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
              Image Gallery
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Filter Bar */}
      <FilterBar images={images} onFilterChange={setFilteredImages} />

      {/* Gallery */}
      <section className="py-4 md:py-8 lg:py-12 relative z-10">
        <MasonryGrid
          images={filteredImages}
          onImageClick={handleImageClick}
          itemsPerPage={20}
        />
      </section>

      {/* Lightbox（動的インポート） */}
      {isLightboxOpen && (
        <Suspense fallback={null}>
          <Lightbox
            images={images}
            currentIndex={lightboxIndex}
            isOpen={isLightboxOpen}
            onClose={handleClose}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </Suspense>
      )}
    </main>
  );
}
