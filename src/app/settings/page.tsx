'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, Badge } from '@/components/ui';
import { useAuthStore } from '@/store';
import { mockCompanies, mockBillingCompanies } from '@/lib/mock-data';
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Database,
  Save,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState('profile');

  // Settings state
  const [transactionLimit, setTransactionLimit] = React.useState('400');
  const [vatThreshold, setVatThreshold] = React.useState('1800000');
  const [alertPercent, setAlertPercent] = React.useState('85');
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: true,
    taxReminder: true,
    invoiceReminder: true,
  });

  const tabs = [
    { id: 'profile', label: 'โปรไฟล์', icon: User },
    { id: 'company', label: 'บริษัทผู้ออกบิล', icon: Building2 },
    { id: 'alerts', label: 'เกณฑ์แจ้งเตือน', icon: AlertTriangle },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
    { id: 'security', label: 'ความปลอดภัย', icon: Shield },
  ];

  return (
    <DashboardLayout
      title="ตั้งค่า"
      subtitle="จัดการการตั้งค่าระบบ"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <Card variant="bordered">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>ข้อมูลโปรไฟล์</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                    {user?.name.charAt(0)}
                  </div>
                  <div>
                    <Button variant="default" size="sm">เปลี่ยนรูปภาพ</Button>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG ไม่เกิน 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="ชื่อ-นามสกุล" defaultValue={user?.name} />
                  <Input label="อีเมล" type="email" defaultValue={user?.email} />
                  <Input label="เบอร์โทรศัพท์" defaultValue={user?.phone || ''} />
                  <Select
                    label="ตำแหน่ง"
                    options={[
                      { value: 'senior', label: 'นักบัญชีอาวุโส' },
                      { value: 'accountant', label: 'นักบัญชี' },
                      { value: 'assistant', label: 'ผู้ช่วยนักบัญชี' },
                    ]}
                    value="senior"
                  />
                </div>

                <div className="flex justify-end">
                  <Button variant="primary">
                    <Save className="w-4 h-4 mr-2" />
                    บันทึกการเปลี่ยนแปลง
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing Companies */}
          {activeTab === 'company' && (
            <Card variant="bordered">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>บริษัทผู้ออกบิล</CardTitle>
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มบริษัท
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {mockBillingCompanies.map((company) => (
                    <div key={company.id} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{company.name}</p>
                          <p className="text-sm text-gray-500">เลขผู้เสียภาษี: {company.taxId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={company.isActive ? 'success' : 'default'}>
                          {company.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alert Thresholds */}
          {activeTab === 'alerts' && (
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>ตั้งค่าเกณฑ์แจ้งเตือน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">คำแนะนำ</p>
                      <p className="text-sm text-yellow-700">
                        ระบบจะแจ้งเตือนเมื่อข้อมูลใกล้ถึงเกณฑ์ที่กำหนด เพื่อให้คุณเตรียมการล่วงหน้า
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="จำนวนรายการสูงสุด/บัญชี/เดือน"
                      type="number"
                      value={transactionLimit}
                      onChange={(e) => setTransactionLimit(e.target.value)}
                      hint="แนะนำ: 400 รายการ (ตามเกณฑ์สรรพากร)"
                    />
                  </div>
                  <div>
                    <Input
                      label="เกณฑ์รายได้ VAT (บาท/ปี)"
                      type="number"
                      value={vatThreshold}
                      onChange={(e) => setVatThreshold(e.target.value)}
                      hint="เกณฑ์ตามกฎหมาย: 1,800,000 บาท"
                    />
                  </div>
                  <div>
                    <Input
                      label="แจ้งเตือนเมื่อถึง (%)"
                      type="number"
                      value={alertPercent}
                      onChange={(e) => setAlertPercent(e.target.value)}
                      hint="ระบบจะแจ้งเตือนเมื่อถึงเปอร์เซ็นต์นี้"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-sm text-gray-700 mb-2">ตัวอย่างการแจ้งเตือน:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• รายการธุรกรรม: เตือนเมื่อถึง {Math.round(parseInt(transactionLimit) * parseInt(alertPercent) / 100)} รายการ</li>
                    <li>• รายได้ VAT: เตือนเมื่อถึง ฿{(parseInt(vatThreshold) * parseInt(alertPercent) / 100).toLocaleString()}</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button variant="primary">
                    <Save className="w-4 h-4 mr-2" />
                    บันทึกการตั้งค่า
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>การแจ้งเตือน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'email', label: 'แจ้งเตือนทางอีเมล', desc: 'รับการแจ้งเตือนผ่านอีเมล' },
                  { key: 'push', label: 'Push Notification', desc: 'รับการแจ้งเตือนบนเบราว์เซอร์' },
                  { key: 'taxReminder', label: 'เตือนกำหนดยื่นภาษี', desc: 'แจ้งเตือนก่อนถึงกำหนดยื่น 3 วัน' },
                  { key: 'invoiceReminder', label: 'เตือนบิลค้างชำระ', desc: 'แจ้งเตือนเมื่อมีบิลเกินกำหนด' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <Button variant="primary">
                    <Save className="w-4 h-4 mr-2" />
                    บันทึกการตั้งค่า
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle>เปลี่ยนรหัสผ่าน</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input label="รหัสผ่านปัจจุบัน" type="password" />
                  <Input label="รหัสผ่านใหม่" type="password" />
                  <Input label="ยืนยันรหัสผ่านใหม่" type="password" />
                  <div className="flex justify-end">
                    <Button variant="primary">เปลี่ยนรหัสผ่าน</Button>
                  </div>
                </CardContent>
              </Card>

              <Card variant="bordered">
                <CardHeader>
                  <CardTitle>การยืนยันตัวตนสองขั้นตอน (2FA)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">เปิดใช้งาน 2FA</p>
                      <p className="text-sm text-gray-500">เพิ่มความปลอดภัยด้วยการยืนยันตัวตนสองขั้นตอน</p>
                    </div>
                    <Badge variant={user?.mfaEnabled ? 'success' : 'warning'}>
                      {user?.mfaEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </Badge>
                  </div>
                  <Button variant="default" className="mt-4">
                    {user?.mfaEnabled ? 'ปิดใช้งาน 2FA' : 'เปิดใช้งาน 2FA'}
                  </Button>
                </CardContent>
              </Card>

              <Card variant="bordered">
                <CardHeader>
                  <CardTitle>เซสชันที่ใช้งานอยู่</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Windows - Chrome</p>
                        <p className="text-sm text-gray-500">กรุงเทพฯ, ประเทศไทย • เซสชันปัจจุบัน</p>
                      </div>
                      <Badge variant="success">ใช้งานอยู่</Badge>
                    </div>
                  </div>
                  <Button variant="danger" className="mt-4">
                    ออกจากระบบทุกอุปกรณ์
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
