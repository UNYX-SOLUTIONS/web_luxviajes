'use client';

import { STATS } from '@/constants';
import { StatCard } from '../common/StatCard';

export function StatsSection() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
