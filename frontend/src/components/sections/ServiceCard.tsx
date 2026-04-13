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
    <Card className={cn('text-center', className)}>
      <div className="mb-4 text-4xl">{service.icon}</div>
      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
      <p className="text-gray-600 text-sm">{service.description}</p>
    </Card>
  );
}
