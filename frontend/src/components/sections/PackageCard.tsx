'use client';

import { Package } from '@/types';
import { Card, CardHeader, CardBody, CardFooter } from '../common/Card';
import { Button } from '../common/Button';
import { formatPrice } from '@/utils/formatting';
import { cn } from '@/utils/cn';

interface PackageCardProps {
  package: Package;
  className?: string;
}

export function PackageCard({ package: pkg, className }: PackageCardProps) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-bold truncate">{pkg.title}</h3>
            <span className="text-xl md:text-2xl font-bold text-purple-600">{formatPrice(pkg.price)}</span>
          </div>
          {pkg.difficulty && (
            <span
              className={cn(
                'px-2 py-1 rounded text-xs font-semibold whitespace-nowrap',
                difficultyColors[pkg.difficulty]
              )}
            >
              {pkg.difficulty}
            </span>
          )}
        </div>
      </CardHeader>

      <CardBody className="grow">
        <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">{pkg.description}</p>
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-700 mb-2">Incluye:</p>
          <ul className="space-y-1">
            {pkg.includes.map((item, idx) => (
              <li key={idx} className="text-xs md:text-sm text-gray-600 flex items-center gap-2">
                <span className="text-purple-600 flex-shrink-0">✓</span>
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardBody>

      <CardFooter className="flex justify-between items-center gap-2">
        <span className="text-xs md:text-sm font-medium text-gray-600 flex-shrink-0">{pkg.duration} días</span>
        <Button variant="primary" size="sm">
          Más detalles
        </Button>
      </CardFooter>
    </Card>
  );
}
