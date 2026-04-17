'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout';
import { StatCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Select } from '@/components/ui';
import { mockCompanies, mockClientStats } from '@/lib/mock-data';
import { formatCurrency, THAI_MONTHS_SHORT } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  PieChart,
  Calendar,
  Printer,
} from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = React.useState('income-expense');
  const [period, setPeriod] = React.useState('2024-03');
  const [companyFilter, setCompanyFilter] = React.useState('company-1');

  // Mock chart data
  const monthlyData = [
    { month: 'ม.ค.', income: 980000, expense: 320000 },
    { month: 'ก.พ.', income: 1050000, expense: 280000 },
    { month: 'มี.ค.', income: 1200000, expense: 352500 },
    { month: 'เม.ย.', income: 0, expense: 0 },
  ];

  const expenseCategories = [
    { category: 'ค่าวัตถุดิบ', amount: 150000, percentage: 42 },
    { category: 'เงินเดือน', amount: 120000, percentage: 34 },
    { category: 'ค่าสาธารณูปโภค', amount: 45000, percentage: 13 },
    { category: 'ค่าขนส่ง', amount: 25000, percentage: 7 },
    { category: 'อื่นๆ', amount: 12500, percentage: 4 },
  ];

  return (
    <DashboardLayout
      title="รายงานการเงิน"
      subtitle="ดูรายงานและวิเคราะห์ข้อมูลทางการเงิน"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="รายได้รวม Q1"
          value={formatCurrency(3230000)}
          icon={TrendingUp}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="ค่าใช้จ่ายรวม Q1"
          value={formatCurrency(952500)}
          icon={TrendingDown}
          variant="danger"
        />
        <StatCard
          title="กำไรสุทธิ Q1"
          value={formatCurrency(2277500)}
          icon={BarChart3}
          variant="info"
        />
        <StatCard
          title="อัตรากำไร"
          value="70.5%"
          icon={PieChart}
          variant="success"
        />
      </div>

      {/* Filters */}
      <Card variant="bordered" className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select
                label="ประเภทรายงาน"
                options={[
                  { value: 'income-expense', label: 'รายรับ-รายจ่าย' },
                  { value: 'balance-sheet', label: 'งบดุล' },
                  { value: 'profit-loss', label: 'งบกำไรขาดทุน' },
                  { value: 'cash-flow', label: 'กระแสเงินสด' },
                ]}
                value={reportType}
                onChange={setReportType}
              />
              <Select
                label="บริษัท"
                options={mockCompanies.map(c => ({ value: c.id, label: c.name }))}
                value={companyFilter}
                onChange={setCompanyFilter}
              />
              <Select
                label="งวด"
                options={[
                  { value: '2024-03', label: 'มีนาคม 2567' },
                  { value: '2024-02', label: 'กุมภาพันธ์ 2567' },
                  { value: '2024-01', label: 'มกราคม 2567' },
                  { value: '2024-Q1', label: 'ไตรมาส 1/2567' },
                ]}
                value={period}
                onChange={setPeriod}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="default" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                พิมพ์
              </Button>
              <Button variant="primary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                ส่งออก PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Income vs Expense Chart */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>รายรับ-รายจ่าย รายเดือน</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simple Bar Chart Visualization */}
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium w-12">{data.month}</span>
                      <div className="flex-1 mx-4">
                        <div className="flex gap-1 h-8">
                          <div
                            className="bg-green-500 rounded-l"
                            style={{ width: `${(data.income / 1500000) * 100}%` }}
                            title={`รายรับ: ${formatCurrency(data.income)}`}
                          />
                          <div
                            className="bg-red-400 rounded-r"
                            style={{ width: `${(data.expense / 1500000) * 100}%` }}
                            title={`รายจ่าย: ${formatCurrency(data.expense)}`}
                          />
                        </div>
                      </div>
                      <div className="text-right w-32">
                        <span className="text-green-600">{formatCurrency(data.income)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span className="text-sm text-gray-600">รายรับ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded" />
                  <span className="text-sm text-gray-600">รายจ่าย</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Table */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>สรุปผลประกอบการ - มีนาคม 2567</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-green-50">
                    <td className="px-6 py-4 font-medium text-green-800">รายได้รวม</td>
                    <td className="px-6 py-4 text-right font-semibold text-green-700">{formatCurrency(1200000)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-600 pl-10">- รายได้จากการขาย</td>
                    <td className="px-6 py-4 text-right">{formatCurrency(1050000)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-600 pl-10">- รายได้จากการบริการ</td>
                    <td className="px-6 py-4 text-right">{formatCurrency(150000)}</td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="px-6 py-4 font-medium text-red-800">ค่าใช้จ่ายรวม</td>
                    <td className="px-6 py-4 text-right font-semibold text-red-700">{formatCurrency(352500)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-600 pl-10">- ค่าวัตถุดิบ</td>
                    <td className="px-6 py-4 text-right">{formatCurrency(150000)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-600 pl-10">- เงินเดือน</td>
                    <td className="px-6 py-4 text-right">{formatCurrency(120000)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-600 pl-10">- ค่าสาธารณูปโภค</td>
                    <td className="px-6 py-4 text-right">{formatCurrency(45000)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-600 pl-10">- อื่นๆ</td>
                    <td className="px-6 py-4 text-right">{formatCurrency(37500)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-6 py-4 font-semibold text-blue-800">กำไรสุทธิ</td>
                    <td className="px-6 py-4 text-right font-bold text-blue-700 text-lg">{formatCurrency(847500)}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Expense Breakdown */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>สัดส่วนค่าใช้จ่าย</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseCategories.map((cat, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{cat.category}</span>
                      <span className="font-medium">{formatCurrency(cat.amount)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{cat.percentage}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Reports */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>รายงานด่วน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="default" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-3" />
                งบกำไรขาดทุน
              </Button>
              <Button variant="default" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-3" />
                งบดุล
              </Button>
              <Button variant="default" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-3" />
                งบกระแสเงินสด
              </Button>
              <Button variant="default" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-3" />
                รายงานภาษี VAT
              </Button>
              <Button variant="default" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-3" />
                สรุปหัก ณ ที่จ่าย
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
