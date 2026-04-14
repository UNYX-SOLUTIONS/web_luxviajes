'use client';

import Image from 'next/image';
import { Destination } from '@/types';
import { Card } from '../common/Card';
import { formatPrice } from '@/utils/formatting';

interface DestinationCardProps {
  destination: Destination;
  className?: string;
}

export function DestinationCard({ destination, className }: DestinationCardProps) {
  return (
    <Card className={className}>
      {/* Image */}
      <div className="relative h-48 w-full mb-4 overflow-hidden rounded-lg">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{destination.name}</h3>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">⭐</span>
          <span className="text-sm font-medium">{destination.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-500">({destination.reviews})</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{destination.description}</p>

      {/* Duration and Price */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{destination.duration}</span> días
        </div>
        <div className="text-lg font-bold text-purple-600">{formatPrice(destination.price)}</div>
      </div>
    </Card>
  );
}
