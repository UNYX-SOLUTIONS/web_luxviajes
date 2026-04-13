'use client';

import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return <div className={cn('mb-4 border-b border-gray-100 pb-4', className)}>{children}</div>;
}

interface CardBodyProps {
  className?: string;
  children: ReactNode;
}

export function CardBody({ className, children }: CardBodyProps) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

interface CardFooterProps {
  className?: string;
  children: ReactNode;
}

export function CardFooter({ className, children }: CardFooterProps) {
  return <div className={cn('border-t border-gray-100 pt-4', className)}>{children}</div>;
}
