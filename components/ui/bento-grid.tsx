import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  span?: 1 | 2; // 1 column or 2 columns span
  rowSpan?: 1 | 2; // 1 row or 2 rows span
}

/**
 * Bento Grid Container Component
 * Responsive grid layout that switches to single column on mobile
 */
export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bento-gap',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Bento Card Component
 * Individual card within the Bento Grid with flexible sizing
 */
export function BentoCard({
  children,
  className,
  span = 1,
  rowSpan = 1,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-4xl p-6 md:p-8 transition-all duration-300 hover:scale-[1.02] border border-gray-100 shadow-sm hover:shadow-md',
        // Responsive column span
        span === 2 && 'md:col-span-2',
        // Responsive row span
        rowSpan === 2 && 'md:row-span-2',
        className
      )}
      style={{
        aspectRatio: rowSpan === 2 && span === 1 ? 'auto' : '16/10',
      }}
    >
      {children}
    </div>
  );
}

