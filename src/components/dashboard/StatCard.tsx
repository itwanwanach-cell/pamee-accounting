'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}) => {
  const variants = {
    default: {
      bg: 'bg-white',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
    },
    success: {
      bg: 'bg-white',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    warning: {
      bg: 'bg-white',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    danger: {
      bg: 'bg-white',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    info: {
      bg: 'bg-white',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  };

  const style = variants[variant];

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md',
        style.bg,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500">จากเดือนก่อน</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn('p-3 rounded-lg', style.iconBg)}>
            <Icon className={cn('w-6 h-6', style.iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
};

export { StatCard };
