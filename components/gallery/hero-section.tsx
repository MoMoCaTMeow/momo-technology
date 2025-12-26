'use client';

export function HeroSection() {
  return (
    <section className="relative min-h-[30vh] md:min-h-[40vh] flex items-center justify-center overflow-hidden">
      {/* Scroll indicator */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-gray-500">
          Scroll
        </span>
      </div>
    </section>
  );
}
