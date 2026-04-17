'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout';
import { StatCard, TransactionLimitCard, RevenueAlertCard, TaskList } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { useAuthStore, useTaskStore, useCompanyStore } from '@/store';
import { 
  mockStaffStats, 
  mockTransactionAlerts, 
  mockRevenueAlert,
  mockCompanies,
} from '@/lib/mock-data';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { 
  Users, 
  CheckCircle2, 
  Star, 
  ListTodo,
  Building2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function StaffDashboardPage() {
  const { user } = useAuthStore();
  const { tasks, completeTask } = useTaskStore();
  const { companies, selectCompany } = useCompanyStore();

  // Filter tasks for this staff
  const myTasks = tasks.filter((t) => t.staffId === 'staff-1');
  const pendingTasks = myTasks.filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');

  return (
    <DashboardLayout 
      title={`สวัสดี, ${user?.name || 'พนักงาน'}`}
      subtitle="ภาพรวมงานของคุณวันนี้"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="ลูกค้าที่ดูแล"
          value={mockStaffStats.assignedClients}
          subtitle="ราย"
          icon={Users}
          variant="info"
        />
        <StatCard
          title="งานที่ทำตรงเวลา"
          value={`${mockStaffStats.tasksOnTime}%`}
          icon={CheckCircle2}
          variant="success"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="ความพึงพอใจลูกค้า"
          value={mockStaffStats.clientSatisfaction}
          subtitle="/ 5.0"
          icon={Star}
          variant="warning"
        />
        <StatCard
          title="งานค้างทำ"
          value={pendingTasks.length}
          subtitle="รายการ"
          icon={ListTodo}
          variant={pendingTasks.length > 5 ? 'danger' : 'default'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tasks and Clients */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task List */}
          <TaskList
            tasks={myTasks}
            onComplete={completeTask}
          />

          {/* Clients List */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>ลูกค้าที่ดูแล</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {mockCompanies.slice(0, 5).map((company) => (
                  <Link
                    key={company.id}
                    href={`/clients/${company.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{company.name}</p>
                        <p className="text-sm text-gray-500">{company.businessType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {formatCurrency(1200000)}
                        </p>
                        <p className="text-xs text-gray-500">รายได้เดือนนี้</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Alerts */}
        <div className="space-y-6">
          {/* Transaction Limits */}
          <TransactionLimitCard alerts={mockTransactionAlerts} />

          {/* Revenue Alert */}
          <RevenueAlertCard alert={mockRevenueAlert} />
        </div>
      </div>
    </DashboardLayout>
  );
}
