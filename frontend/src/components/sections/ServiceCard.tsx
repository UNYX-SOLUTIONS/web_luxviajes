'use client';

import { Service } from '@/types';
import { Card } from '../common/Card';
import { cn } from '@/utils/cn';

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  return (
    <Card className={cn('text-center h-full', className)}>
      <div className="mb-3 md:mb-4 text-3xl md:text-4xl">{service.icon}</div>
      <h3 className="text-base md:text-lg font-semibold mb-2">{service.title}</h3>
      <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{service.description}</p>
    </Card>
  );
}
