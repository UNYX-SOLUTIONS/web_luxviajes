"use client";

import { STATS } from "@/constants";
import { StatCard } from "../common/StatCard";

interface StatCardData {
  label: string;
  value: string;
}

interface StatsSectionProps {
  stats?: StatCardData[] | null;
}

export function StatsSection({ stats = STATS }: StatsSectionProps) {
  return (
    <section className="flex -mt-16 justify-center">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
