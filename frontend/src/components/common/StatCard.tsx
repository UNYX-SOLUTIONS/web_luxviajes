"use client";

import { StatCard as StatCardType } from "@/types";
import { cn } from "@/utils/cn";

interface StatCardComponentProps {
  stat: StatCardType;
  className?: string;
}

export function StatCard({ stat, className }: StatCardComponentProps) {
  return (
    <div className={cn("text-center", className)}>
      <div className="mb-1 md:mb-2 text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
      <div className="text-xs md:text-sm font-medium text-gray-600">{stat.label}</div>
    </div>
  );
}
