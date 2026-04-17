'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  className,
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const variants = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  // Auto-determine variant based on percentage
  const autoVariant = percentage > 100 ? 'danger' : percentage >= 85 ? 'warning' : 'success';
  const finalVariant = variant === 'default' ? autoVariant : variant;

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('transition-all duration-300 rounded-full', variants[finalVariant], sizes[size])}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{value.toLocaleString()}</span>
          <span>/ {max.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export { ProgressBar };
