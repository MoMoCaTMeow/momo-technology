import { Hero } from '@/components/sections/hero';
import { FeaturesBento } from '@/components/sections/features-bento';
import { Navigation } from '@/components/sections/navigation';
import { Footer } from '@/components/sections/footer';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-warm-50">
      <Navigation />
      <Hero />
      <FeaturesBento />
      <Footer />
    </main>
  );
}

