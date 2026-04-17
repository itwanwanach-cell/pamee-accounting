'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout';
import { StatCard, TransactionLimitCard, RevenueAlertCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Select, Input } from '@/components/ui';
import { useTransactionStore, useCompanyStore } from '@/store';
import { mockTransactionAlerts, mockRevenueAlert, mockBankAccounts, mockTransactions } from '@/lib/mock-data';
import { formatCurrency, formatDate, getStatusColor, getBankColor } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calculator,
  Filter,
  Download,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function TransactionsPage() {
  const { selectedCompany } = useCompanyStore();
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [bankFilter, setBankFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Mock stats
  const stats = {
    income: 1200000,
    expense: 352500,
    netProfit: 847500,
    pendingTax: 84000,
  };

  // Filter transactions
  const filteredTransactions = mockTransactions.filter((tx) => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    if (bankFilter !== 'all' && tx.bankAccountId !== bankFilter) return false;
    if (searchQuery && !tx.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardLayout
      title="รายรับ-รายจ่าย"
      subtitle={selectedCompany ? `${selectedCompany.name} - เดือน มี.ค. 2567` : 'เดือน มี.ค. 2567'}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="รายรับเดือนนี้"
          value={formatCurrency(stats.income)}
          icon={TrendingUp}
          variant="success"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="รายจ่ายเดือนนี้"
          value={formatCurrency(stats.expense)}
          icon={TrendingDown}
          variant="danger"
          trend={{ value: 8, isPositive: false }}
        />
        <StatCard
          title="กำไรสุทธิ"
          value={formatCurrency(stats.netProfit)}
          subtitle="อัตรากำไร 70.6%"
          icon={Wallet}
          variant="info"
        />
        <StatCard
          title="ภาษีที่ต้องจ่าย"
          value={formatCurrency(stats.pendingTax)}
          subtitle="กำหนด 15 เม.ย."
          icon={Calculator}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Transaction List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card variant="bordered">
            <CardContent className="py-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ค้นหารายการ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <Select
                  options={[
                    { value: 'all', label: 'ทุกประเภท' },
                    { value: 'INCOME', label: 'รายรับ' },
                    { value: 'EXPENSE', label: 'รายจ่าย' },
                  ]}
                  value={typeFilter}
                  onChange={setTypeFilter}
                />
                <Select
                  options={[
                    { value: 'all', label: 'ทุกบัญชี' },
                    ...mockBankAccounts.map((acc) => ({
                      value: acc.id,
                      label: `${acc.bankName} ${acc.accountNumber}`,
                    })),
                  ]}
                  value={bankFilter}
                  onChange={setBankFilter}
                />
                <Button variant="default" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  ตัวกรองเพิ่มเติม
                </Button>
                <Button variant="default" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  ส่งออก
                </Button>
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มรายการ
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Table */}
          <Card variant="bordered">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>รายการล่าสุด</CardTitle>
              <span className="text-sm text-gray-500">
                แสดง {filteredTransactions.length} จาก 904 รายการ
              </span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">รายการ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">บัญชี</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">จำนวน</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">ประเภท</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTransactions.map((tx) => {
                      const bankAccount = mockBankAccounts.find((b) => b.id === tx.bankAccountId);
                      return (
                        <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatDate(tx.transactionDate)}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                            {tx.vendorName && (
                              <p className="text-xs text-gray-500">{tx.vendorName}</p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {bankAccount && (
                              <span
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white"
                                style={{ backgroundColor: getBankColor(bankAccount.bankCode || '') }}
                              >
                                {bankAccount.bankName.substring(0, 3)}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`text-sm font-medium flex items-center justify-end gap-1 ${
                              tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {tx.type === 'INCOME' ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge variant={tx.type === 'INCOME' ? 'success' : 'danger'} size="sm">
                              {tx.type === 'INCOME' ? 'รายรับ' : 'รายจ่าย'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge
                              variant={
                                tx.status === 'APPROVED' ? 'success' :
                                tx.status === 'PENDING' ? 'warning' :
                                tx.status === 'NEEDS_REVIEW' ? 'info' : 'danger'
                              }
                              size="sm"
                            >
                              {tx.status === 'APPROVED' ? 'อนุมัติแล้ว' :
                               tx.status === 'PENDING' ? 'รอตรวจสอบ' :
                               tx.status === 'NEEDS_REVIEW' ? 'ต้องตรวจสอบ' : 'ปฏิเสธ'}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Alerts */}
        <div className="space-y-6">
          <TransactionLimitCard alerts={mockTransactionAlerts} />
          <RevenueAlertCard alert={mockRevenueAlert} />
        </div>
      </div>
    </DashboardLayout>
  );
}
