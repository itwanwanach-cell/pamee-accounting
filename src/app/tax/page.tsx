'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout';
import { StatCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Select } from '@/components/ui';
import { mockTaxFilings, mockCompanies } from '@/lib/mock-data';
import { formatCurrency, formatDate, THAI_MONTHS } from '@/lib/utils';
import {
  Calculator,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Upload,
  Calendar,
  Building2,
  ArrowRight,
} from 'lucide-react';

export default function TaxPage() {
  const [companyFilter, setCompanyFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const filteredFilings = mockTaxFilings.filter((filing) => {
    if (companyFilter !== 'all' && filing.companyId !== companyFilter) return false;
    if (statusFilter !== 'all' && filing.status !== statusFilter) return false;
    return true;
  });

  const pendingCount = mockTaxFilings.filter(f => f.status === 'PENDING').length;
  const filedCount = mockTaxFilings.filter(f => f.status === 'FILED' || f.status === 'PAID').length;
  const overdueCount = mockTaxFilings.filter(f => f.status === 'OVERDUE').length;
  const totalTax = mockTaxFilings.reduce((sum, f) => sum + f.amount, 0);

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info' | 'default'; label: string }> = {
      PENDING: { variant: 'warning', label: 'รอดำเนินการ' },
      IN_PROGRESS: { variant: 'info', label: 'กำลังดำเนินการ' },
      FILED: { variant: 'success', label: 'ยื่นแล้ว' },
      PAID: { variant: 'success', label: 'ชำระแล้ว' },
      OVERDUE: { variant: 'danger', label: 'เกินกำหนด' },
    };
    const config = configs[status] || configs.PENDING;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTaxTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      VAT: 'ภ.พ.30 (VAT)',
      WHT: 'ภ.ง.ด.3/53 (หัก ณ ที่จ่าย)',
      CIT: 'ภ.ง.ด.50/51 (ภาษีนิติบุคคล)',
      PIT: 'ภ.ง.ด.1 (ภาษีเงินได้)',
    };
    return labels[type] || type;
  };

  const getPeriodLabel = (period: string) => {
    if (period.length === 4) return `ปี ${parseInt(period) + 543}`;
    const [year, month] = period.split('-');
    return `${THAI_MONTHS[parseInt(month) - 1]} ${parseInt(year) + 543}`;
  };

  return (
    <DashboardLayout
      title="ยื่นภาษี"
      subtitle="จัดการการยื่นภาษีของลูกค้า"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="รอดำเนินการ"
          value={pendingCount}
          subtitle="รายการ"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="ยื่นแล้ว"
          value={filedCount}
          subtitle="รายการ"
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="เกินกำหนด"
          value={overdueCount}
          subtitle="รายการ"
          icon={AlertTriangle}
          variant="danger"
        />
        <StatCard
          title="ภาษีรวม"
          value={formatCurrency(totalTax)}
          icon={Calculator}
          variant="info"
        />
      </div>

      {/* Filters */}
      <Card variant="bordered" className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select
                options={[
                  { value: 'all', label: 'ทุกบริษัท' },
                  ...mockCompanies.map(c => ({ value: c.id, label: c.name })),
                ]}
                value={companyFilter}
                onChange={setCompanyFilter}
              />
              <Select
                options={[
                  { value: 'all', label: 'ทุกสถานะ' },
                  { value: 'PENDING', label: 'รอดำเนินการ' },
                  { value: 'IN_PROGRESS', label: 'กำลังดำเนินการ' },
                  { value: 'FILED', label: 'ยื่นแล้ว' },
                  { value: 'PAID', label: 'ชำระแล้ว' },
                  { value: 'OVERDUE', label: 'เกินกำหนด' },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
            <Button variant="primary" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              ยื่นภาษีใหม่
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tax Filing List */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>รายการภาษี</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">บริษัท</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ประเภทภาษี</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">งวด</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">กำหนดยื่น</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">จำนวนเงิน</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFilings.map((filing) => {
                  const company = mockCompanies.find(c => c.id === filing.companyId);
                  const isOverdue = new Date(filing.dueDate) < new Date() && filing.status !== 'FILED' && filing.status !== 'PAID';
                  
                  return (
                    <tr key={filing.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <span className="font-medium text-gray-900">{company?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{getTaxTypeLabel(filing.taxType)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{getPeriodLabel(filing.period)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`} />
                          <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                            {formatDate(filing.dueDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-medium text-gray-900">{formatCurrency(filing.amount)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(isOverdue ? 'OVERDUE' : filing.status)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {filing.status === 'PENDING' || filing.status === 'IN_PROGRESS' ? (
                          <Button variant="primary" size="sm">
                            ยื่นภาษี
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            ดูรายละเอียด
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card variant="bordered" className="mt-6">
        <CardHeader>
          <CardTitle>กำหนดยื่นที่ใกล้จะถึง</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">ภ.พ.30 (VAT)</span>
              </div>
              <p className="text-sm text-yellow-700">กำหนดยื่น: 15 ของทุกเดือน</p>
              <p className="text-xs text-yellow-600 mt-1">เหลืออีก 5 วัน</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">ภ.ง.ด.3/53</span>
              </div>
              <p className="text-sm text-blue-700">กำหนดยื่น: 7 ของทุกเดือน</p>
              <p className="text-xs text-blue-600 mt-1">เหลืออีก 12 วัน</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">ภ.ง.ด.51</span>
              </div>
              <p className="text-sm text-green-700">กำหนดยื่น: 31 พฤษภาคม</p>
              <p className="text-xs text-green-600 mt-1">เหลืออีก 48 วัน</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
