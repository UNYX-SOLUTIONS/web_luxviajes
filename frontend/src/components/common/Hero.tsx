'use client';

import Link from 'next/link';
import { Button } from './Button';
import { cn } from '@/utils/cn';

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export function Hero({
  title,
  subtitle,
  backgroundImage,
  ctaText = 'Explorar',
  ctaHref = '#',
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        'relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-center overflow-hidden',
        className
      )}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">{title}</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">{subtitle}</p>
        <Link href={ctaHref}>
          <Button size="lg" variant="primary">
            {ctaText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
