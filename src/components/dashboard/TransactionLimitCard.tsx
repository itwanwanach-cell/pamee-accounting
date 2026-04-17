'use client';

import * as React from 'react';
import { cn, getBankColor, formatNumber } from '@/lib/utils';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { TransactionAlert } from '@/types';

interface TransactionLimitCardProps {
  alerts: TransactionAlert[];
  className?: string;
}

const TransactionLimitCard: React.FC<TransactionLimitCardProps> = ({
  alerts,
  className,
}) => {
  const getAlertBadge = (type: TransactionAlert['type']) => {
    switch (type) {
      case 'OVER_LIMIT':
        return <Badge variant="danger">เกินเกณฑ์!</Badge>;
      case 'NEAR_LIMIT':
        return <Badge variant="warning">ใกล้เกณฑ์</Badge>;
      default:
        return <Badge variant="success">ปกติ</Badge>;
    }
  };

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        จำนวนรายการต่อบัญชีธนาคาร
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        เกณฑ์: ไม่เกิน 400 รายการ/บัญชี/เดือน
      </p>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.bankAccountId}
            className="p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: getBankColor(alert.bankName === 'กสิกรไทย' ? 'KBANK' : alert.bankName === 'ไทยพาณิชย์' ? 'SCB' : 'BBL') }}
                >
                  {alert.bankName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{alert.bankName}</p>
                  <p className="text-xs text-gray-500">บัญชีหลัก</p>
                </div>
              </div>
              {getAlertBadge(alert.type)}
            </div>

            <ProgressBar
              value={alert.currentCount}
              max={alert.maxCount}
              size="md"
            />

            <div className="flex justify-between mt-2 text-sm">
              <span className={cn(
                'font-medium',
                alert.type === 'OVER_LIMIT' ? 'text-red-600' :
                alert.type === 'NEAR_LIMIT' ? 'text-yellow-600' : 'text-green-600'
              )}>
                {formatNumber(alert.currentCount)} รายการ
              </span>
              <span className="text-gray-500">/ {formatNumber(alert.maxCount)} รายการ</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { TransactionLimitCard };
