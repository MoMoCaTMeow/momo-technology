'use client';

import { motion } from 'framer-motion';
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';
import {
  Users,
  Calendar,
  GraduationCap,
  Lightbulb,
  Network,
  Heart,
} from 'lucide-react';

type Feature = {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  description: string;
  tags: string[];
  span: 1 | 2;
  rowSpan: 1 | 2;
};

const features: Feature[] = [
  {
    icon: Users,
    title: '講演会',
    description: '著名なゲストスピーカーを招き、多様な分野の知見を学生に届けます。起業家、研究者、社会起業家など、様々なバックグラウンドを持つ方々から学びを得られます。',
    tags: ['講演会', '学習機会', 'キャリア'],
    span: 2,
    rowSpan: 1,
  },
  {
    icon: Calendar,
    title: 'イベント',
    description: '定期的なイベントを通じて、学生同士や学生と社会をつなぎます。',
    tags: ['イベント', 'ネットワーキング'],
    span: 1,
    rowSpan: 1,
  },
  {
    icon: GraduationCap,
    title: '学び',
    description: '「出会い・学び・実践」のサイクルを通じて、実践的な知識とスキルを身につけます。',
    tags: ['学習', '実践'],
    span: 1,
    rowSpan: 1,
  },
  {
    icon: Network,
    title: 'ネットワーキング',
    description: '学生と秋田社会をつなぎ、豊かな人脈と機会を創出します。地域の企業・団体との協力関係を築きます。',
    tags: ['ネットワーキング', '地域連携'],
    span: 1,
    rowSpan: 2,
  },
  {
    icon: Lightbulb,
    title: '実践',
    description: '学んだ知識を実際のプロジェクトや活動で実践し、経験を積み重ねます。',
    tags: ['実践', 'プロジェクト'],
    span: 1,
    rowSpan: 1,
  },
  {
    icon: Heart,
    title: '地域貢献',
    description: '秋田県の地域活性化に貢献し、地域と共に成長します。',
    tags: ['地域貢献', '社会貢献'],
    span: 1,
    rowSpan: 1,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function FeaturesBento() {
  return (
    <section id="activities" className="py-20 md:py-32 relative bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4">
            ACTIVITIES
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            出会い・学び・実践
            <br />
            のサイクルを創る
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            私たちは講演会やイベントを通じて、
            <br />
            学生と秋田社会をつなぎ、豊かな学びの場を提供します。
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <BentoGrid>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={item}
                  style={{
                    gridColumn: `span ${feature.span}`,
                    gridRow: `span ${feature.rowSpan}`,
                  }}
                  className="md:col-span-1"
                >
                  <BentoCard
                    span={feature.span}
                    rowSpan={feature.rowSpan}
                    className="h-full flex flex-col group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center mb-6 text-primary-600">
                      <Icon size={28} />
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 mb-6 flex-grow leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {feature.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-xs text-primary-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </BentoCard>
                </motion.div>
              );
            })}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}

