'use client';

import * as React from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { Badge } from '../ui/Badge';
import { AlertTriangle } from 'lucide-react';
import { RevenueAlert } from '@/types';

interface RevenueAlertCardProps {
  alert: RevenueAlert;
  className?: string;
}

const RevenueAlertCard: React.FC<RevenueAlertCardProps> = ({
  alert,
  className,
}) => {
  const getAlertBadge = (type: RevenueAlert['type']) => {
    switch (type) {
      case 'OVER_THRESHOLD':
        return <Badge variant="danger">เกินเกณฑ์!</Badge>;
      case 'NEAR_THRESHOLD':
        return <Badge variant="warning">ใกล้เกณฑ์</Badge>;
      default:
        return <Badge variant="success">ปกติ</Badge>;
    }
  };

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        เกณฑ์รายได้สะสม (ภาษี)
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        เตือนเมื่อรายได้ใกล้เกณฑ์เสียภาษี
      </p>

      {(alert.type === 'NEAR_THRESHOLD' || alert.type === 'OVER_THRESHOLD') && (
        <div className={cn(
          'p-4 rounded-lg mb-4 flex items-start gap-3',
          alert.type === 'OVER_THRESHOLD' ? 'bg-red-50' : 'bg-yellow-50'
        )}>
          <AlertTriangle className={cn(
            'w-5 h-5 mt-0.5',
            alert.type === 'OVER_THRESHOLD' ? 'text-red-500' : 'text-yellow-500'
          )} />
          <div>
            <p className={cn(
              'font-medium',
              alert.type === 'OVER_THRESHOLD' ? 'text-red-700' : 'text-yellow-700'
            )}>
              {alert.type === 'OVER_THRESHOLD' ? 'รายได้เกินเกณฑ์ VAT แล้ว!' : 'รายได้ใกล้เกณฑ์ VAT!'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              รายได้สะสมปีนี้ {formatCurrency(alert.currentRevenue)} / เกณฑ์ {formatCurrency(alert.threshold)} ({alert.percentage}%)
            </p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">รายได้สะสมปี 2567</span>
          <span className="text-sm font-medium">{formatCurrency(alert.currentRevenue)}</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(alert.percentage, 100)}%`,
              background: `linear-gradient(90deg, #10B981 0%, #F59E0B 70%, #EF4444 90%)`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>0</span>
          <span className="text-yellow-600">฿1.8M (VAT)</span>
          <span className="text-red-600">฿3M</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="font-medium text-sm text-gray-900 mb-3">เกณฑ์ที่ตั้งไว้:</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">เกณฑ์ VAT</span>
            <span>{formatCurrency(1800000)}/ปี</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">รายการสูงสุด/บัญชี</span>
            <span>400 รายการ/เดือน</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">เตือนล่วงหน้าเมื่อถึง</span>
            <span>85%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RevenueAlertCard };
