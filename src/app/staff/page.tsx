'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout';
import { StatCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Input, Select, Modal } from '@/components/ui';
import { mockStaff, mockStaffPerformance, mockCompanies } from '@/lib/mock-data';
import {
  Users,
  UserPlus,
  Search,
  Star,
  CheckCircle,
  Clock,
  TrendingUp,
  Mail,
  Phone,
  Building2,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react';

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showAddModal, setShowAddModal] = React.useState(false);

  const filteredStaff = mockStaff.filter((staff) => {
    if (searchQuery && !staff.user?.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getPerformance = (staffId: string) => {
    return mockStaffPerformance.find(p => p.staffId === staffId);
  };

  const getAssignedClients = (staffId: string) => {
    return mockCompanies.filter(c => c.assignedStaffId === staffId);
  };

  return (
    <DashboardLayout
      title="จัดการพนักงาน"
      subtitle="ดูแลทีมงานและประเมินผลงาน"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="พนักงานทั้งหมด"
          value={mockStaff.length}
          subtitle="คน"
          icon={Users}
          variant="info"
        />
        <StatCard
          title="เฉลี่ยงานตรงเวลา"
          value="90%"
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="ความพึงพอใจลูกค้า"
          value="4.35"
          subtitle="/ 5.0"
          icon={Star}
          variant="warning"
        />
        <StatCard
          title="ลูกค้าต่อพนักงาน"
          value={Math.round(mockCompanies.length / mockStaff.length)}
          subtitle="เฉลี่ย"
          icon={Building2}
          variant="default"
        />
      </div>

      {/* Filters */}
      <Card variant="bordered" className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาพนักงาน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              เพิ่มพนักงาน
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStaff.map((staff) => {
          const performance = getPerformance(staff.id);
          const clients = getAssignedClients(staff.id);
          
          return (
            <Card key={staff.id} variant="bordered">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                      {staff.user?.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{staff.user?.name}</h3>
                      <p className="text-sm text-gray-500">{staff.position}</p>
                      <p className="text-xs text-gray-400">รหัส: {staff.employeeCode}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{staff.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{staff.user?.phone}</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                {performance && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-3">ผลงานเดือนนี้</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-emerald-600">{performance.tasksOnTimePercentage}%</p>
                        <p className="text-xs text-gray-500">งานตรงเวลา</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-blue-600">{performance.clientSatisfaction}</p>
                        <p className="text-xs text-gray-500">ความพึงพอใจ</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-purple-600">{performance.tasksCompleted}</p>
                        <p className="text-xs text-gray-500">งานเสร็จ</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Assigned Clients */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">ลูกค้าที่ดูแล ({clients.length}/{staff.maxClients})</p>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${(clients.length / staff.maxClients) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {clients.slice(0, 3).map((client) => (
                      <Badge key={client.id} variant="outline" size="sm">
                        {client.name.substring(0, 15)}...
                      </Badge>
                    ))}
                    {clients.length > 3 && (
                      <Badge variant="default" size="sm">
                        +{clients.length - 3} อื่นๆ
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="default" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    แก้ไข
                  </Button>
                  <Button variant="default" size="sm" className="flex-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    ดูผลงาน
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="เพิ่มพนักงานใหม่"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="ชื่อ-นามสกุล" placeholder="กรอกชื่อพนักงาน" />
            <Input label="รหัสพนักงาน" placeholder="เช่น EMP003" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="อีเมล" type="email" placeholder="email@company.com" />
            <Input label="เบอร์โทรศัพท์" placeholder="08X-XXX-XXXX" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="แผนก"
              options={[
                { value: 'accounting', label: 'บัญชี' },
                { value: 'tax', label: 'ภาษี' },
                { value: 'audit', label: 'ตรวจสอบ' },
              ]}
              placeholder="เลือกแผนก"
            />
            <Select
              label="ตำแหน่ง"
              options={[
                { value: 'senior', label: 'นักบัญชีอาวุโส' },
                { value: 'accountant', label: 'นักบัญชี' },
                { value: 'assistant', label: 'ผู้ช่วยนักบัญชี' },
              ]}
              placeholder="เลือกตำแหน่ง"
            />
          </div>
          <Input label="จำนวนลูกค้าสูงสุด" type="number" defaultValue="20" />
          
          <div className="flex gap-3 pt-4">
            <Button variant="default" className="flex-1" onClick={() => setShowAddModal(false)}>
              ยกเลิก
            </Button>
            <Button variant="primary" className="flex-1">
              <UserPlus className="w-4 h-4 mr-2" />
              เพิ่มพนักงาน
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
