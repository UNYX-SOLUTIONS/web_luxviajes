"use client";

import { STATS } from "@/constants";
import { StatCard } from "../common/StatCard";

interface StatCardData {
  label: string;
  value: string;
}

interface StatsSectionProps {
  stats?: readonly StatCardData[] | null;
}

export function StatsSection({ stats = STATS }: StatsSectionProps) {
  const displayStats = stats ?? STATS;
  
  return (
    <section className="flex -mt-8 sm:-mt-12 md:-mt-16 justify-center px-4 sm:px-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg max-w-4xl mx-auto py-4 sm:py-6 md:py-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {displayStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
