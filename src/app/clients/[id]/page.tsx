'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout';
import { StatCard, TransactionLimitCard, RevenueAlertCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import {
  mockCompanies, mockBankAccounts, mockTransactions,
  mockTransactionAlerts, mockRevenueAlert, mockStaff,
} from '@/lib/mock-data';
import { formatCurrency, formatDate, maskAccountNumber, getBankColor } from '@/lib/utils';
import {
  Building2, ArrowLeft, Phone, Mail, MapPin, Edit,
  TrendingUp, TrendingDown, Wallet, Plus, FileText,
  Receipt, Calculator, FolderOpen, BarChart2, AlertCircle,
} from 'lucide-react';

// ─── ข้อมูล Prototype เพิ่มเติม ────────────────────────────────────
const companyExtras: Record<string, {
  type: 'niti' | 'natural';
  owner: string;
  services: string[];   // บริการที่มี
  satisfaction: 'very_happy' | 'happy' | 'neutral' | 'unhappy';
  package: string;
}> = {
  'company-1': { type:'niti',    owner:'คุณสมชาย ใจดี',      services:['ทำบัญชี','ยื่นภาษี'],              satisfaction:'happy',      package:'Premium' },
  'company-2': { type:'niti',    owner:'คุณสมหญิง วงศ์',     services:['เปิดบริษัท'],                      satisfaction:'neutral',    package:'Standard' },
  'company-3': { type:'niti',    owner:'คุณวิชัย เก่ง',       services:['ทำบัญชี','ยื่นภาษี'],              satisfaction:'very_happy', package:'Premium' },
  'company-4': { type:'natural', owner:'นายสมชาย วงศ์ใหญ่',  services:['ยื่นภาษี'],                        satisfaction:'happy',      package:'Basic' },
  'company-5': { type:'natural', owner:'นางสาวรวีวรรณ ดีมาก', services:['ทำบัญชี'],                         satisfaction:'very_happy', package:'Standard' },
};

const satMap = {
  very_happy: { emoji:'😄', label:'พึงพอใจมาก', color:'text-emerald-600' },
  happy:      { emoji:'😊', label:'พึงพอใจ',     color:'text-emerald-500' },
  neutral:    { emoji:'😐', label:'เฉยๆ',        color:'text-amber-500' },
  unhappy:    { emoji:'😞', label:'ไม่พอใจ',     color:'text-red-500' },
};

const ALL_SERVICES = ['เปิดบริษัท', 'ยื่นภาษี', 'ทำบัญชี'] as const;
type ServiceKey = typeof ALL_SERVICES[number];

const svcTabMap: Record<ServiceKey, string> = {
  'เปิดบริษัท': 'register',
  'ยื่นภาษี':   'tax',
  'ทำบัญชี':   'accounting',
};

type TabKey = 'overview' | 'register' | 'tax' | 'accounting' | 'docs' | 'report';

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key:'overview',    label:'ภาพรวม',         icon:Building2   },
  { key:'register',    label:'เปิดบริษัท',      icon:FileText    },
  { key:'tax',         label:'ยื่นภาษี',        icon:Calculator  },
  { key:'accounting',  label:'รายรับ-รายจ่าย',  icon:Receipt     },
  { key:'docs',        label:'กล่องเอกสาร',     icon:FolderOpen  },
  { key:'report',      label:'รายงาน',          icon:BarChart2   },
];

// ─── Component ──────────────────────────────────────────────────────
export default function ClientDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = params.id as string;

  const [activeTab, setActiveTab] = React.useState<TabKey>('overview');

  const company  = mockCompanies.find(c => c.id === id);
  const banks    = mockBankAccounts.filter(b => b.companyId === id);
  const txs      = mockTransactions.filter(t => t.companyId === id);
  const staff    = company ? mockStaff.find(s => s.id === company.assignedStaffId) : null;
  const extra    = companyExtras[id];
  const sat      = extra ? satMap[extra.satisfaction] : satMap.neutral;

  if (!company) {
    return (
      <DashboardLayout title="ไม่พบข้อมูล">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">ไม่พบข้อมูลลูกค้า</p>
          <Button variant="primary" onClick={() => router.push('/clients')}>
            กลับไปหน้ารายชื่อลูกค้า
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const income  = txs.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);

  const hasService = (svc: ServiceKey) => extra?.services.includes(svc) ?? false;

  return (
    <DashboardLayout title={company.name} subtitle={extra?.type === 'natural' ? 'บุคคลธรรมดา' : 'นิติบุคคล'}>

      {/* ─── Header ─── */}
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/clients')}>
          <ArrowLeft className="w-4 h-4 mr-1" />กลับ
        </Button>

        {/* Company avatar + info */}
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
            {company.name.replace(/บริษัท |บจก\. |หจก\. |ห้างหุ้นส่วน |นาย|นางสาว|นาง/g,'').slice(0,2)}
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 text-base">{company.name}</h1>
            <p className="text-sm text-gray-500">{extra?.owner ?? company.businessType}</p>
          </div>
          {/* satisfaction */}
          <div className="ml-2 flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
            <span className="text-lg">{sat.emoji}</span>
            <span className={`text-xs font-medium ${sat.color}`}>{sat.label}</span>
          </div>
          {/* package badge */}
          <Badge variant={company.serviceTier === 'PREMIUM' ? 'success' : company.serviceTier === 'STANDARD' ? 'info' : 'warning'}>
            {extra?.package ?? company.serviceTier}
          </Badge>
        </div>

        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4 mr-1" />แก้ไข
        </Button>
      </div>

      {/* ─── Sub-menu tabs ─── */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(t => {
          const Icon = t.icon;
          const svcKey = Object.entries(svcTabMap).find(([,v]) => v === t.key)?.[0] as ServiceKey | undefined;
          const notHave = svcKey && !hasService(svcKey);

          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === t.key
                  ? 'border-emerald-500 text-emerald-600'
                  : notHave
                  ? 'border-transparent text-blue-400 hover:text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
              {notHave && (
                <span className="text-xs bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full border border-blue-200 ml-1">
                  ไม่มีบริการ
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Tab: ภาพรวม ─── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard title="รายรับเดือนนี้"  value={formatCurrency(income)}            icon={TrendingUp}   variant="success" />
              <StatCard title="รายจ่ายเดือนนี้" value={formatCurrency(expense)}           icon={TrendingDown} variant="danger"  />
              <StatCard title="กำไรสุทธิ"       value={formatCurrency(income - expense)}  icon={Wallet}       variant="info"    />
            </div>

            {/* บริการที่ใช้ */}
            <Card variant="bordered">
              <CardHeader><CardTitle>บริการที่ซื้อ</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {ALL_SERVICES.map(svc => {
                    const has = hasService(svc);
                    return (
                      <button
                        key={svc}
                        onClick={() => has && setActiveTab(svcTabMap[svc] as TabKey)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          has
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-blue-50 border-blue-200 text-blue-400 cursor-default'
                        }`}
                      >
                        {has ? '✓' : '—'} {svc}
                        {!has && <span className="text-xs opacity-70">(ยังไม่ซื้อ)</span>}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* ข้อมูลบริษัท */}
            <Card variant="bordered">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>ข้อมูลบริษัท</CardTitle>
                <Button variant="ghost" size="sm"><Edit className="w-4 h-4 mr-1" />แก้ไข</Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div><p className="text-sm text-gray-500">ชื่อบริษัท</p><p className="font-medium text-gray-900">{company.name}</p></div>
                  <div><p className="text-sm text-gray-500">ประเภท</p>
                    <p className="font-medium text-gray-900">
                      {extra?.type === 'natural' ? 'บุคคลธรรมดา' : 'นิติบุคคล'}
                    </p>
                  </div>
                  <div><p className="text-sm text-gray-500">เลขผู้เสียภาษี</p><p className="font-medium text-gray-900">{company.taxId || '-'}</p></div>
                  <div><p className="text-sm text-gray-500">ประเภทธุรกิจ</p><p className="font-medium text-gray-900">{company.businessType || '-'}</p></div>
                  {company.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div><p className="text-sm text-gray-500">โทรศัพท์</p><p className="font-medium">{company.phone}</p></div>
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div><p className="text-sm text-gray-500">อีเมล</p><p className="font-medium">{company.email}</p></div>
                    </div>
                  )}
                  {company.address && (
                    <div className="col-span-2 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div><p className="text-sm text-gray-500">ที่อยู่</p><p className="font-medium">{company.address}</p></div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">จดทะเบียน VAT</p>
                    <Badge variant={company.vatRegistered ? 'success' : 'default'}>
                      {company.vatRegistered ? 'จดทะเบียนแล้ว' : 'ยังไม่จด'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* บัญชีธนาคาร */}
            <Card variant="bordered">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>บัญชีธนาคาร</CardTitle>
                <Button variant="ghost" size="sm"><Plus className="w-4 h-4 mr-1" />เพิ่ม</Button>
              </CardHeader>
              <CardContent className="p-0">
                {banks.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-400 text-sm">ยังไม่มีบัญชีธนาคาร</div>
                ) : banks.map(acc => (
                  <div key={acc.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: getBankColor(acc.bankCode || '') }}>
                        {acc.bankName.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{acc.bankName}</p>
                        <p className="text-sm text-gray-500">{maskAccountNumber(acc.accountNumber)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{acc.transactionCount || 0} รายการ</p>
                      {acc.isPrimary && <Badge variant="info" size="sm">บัญชีหลัก</Badge>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* รายการล่าสุด */}
            <Card variant="bordered">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>รายการธุรกรรมล่าสุด</CardTitle>
                <Button variant="link" size="sm" onClick={() => setActiveTab('accounting')}>ดูทั้งหมด</Button>
              </CardHeader>
              <CardContent className="p-0">
                {txs.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-400 text-sm">ยังไม่มีรายการ</div>
                ) : txs.slice(0, 5).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tx.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {tx.type === 'INCOME'
                          ? <TrendingUp className="w-4 h-4 text-green-600" />
                          : <TrendingDown className="w-4 h-4 text-red-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{tx.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(tx.transactionDate)}</p>
                      </div>
                    </div>
                    <p className={`font-semibold text-sm ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right: staff + alerts */}
          <div className="space-y-5">
            {staff && (
              <Card variant="bordered">
                <CardHeader><CardTitle>พนักงานผู้ดูแล</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {staff.user?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{staff.user?.name}</p>
                      <p className="text-sm text-gray-500">{staff.position}</p>
                      <p className="text-xs text-gray-400">{staff.user?.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <TransactionLimitCard alerts={mockTransactionAlerts} />
            <RevenueAlertCard alert={mockRevenueAlert} />
          </div>
        </div>
      )}

      {/* ─── Tab: เปิดบริษัท ─── */}
      {activeTab === 'register' && (
        hasService('เปิดบริษัท') ? (
          <Card variant="bordered">
            <CardHeader><CardTitle>บริการเปิดบริษัท</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { step:1, label:'รับเรื่องและเอกสาร',     done:true  },
                  { step:2, label:'จองชื่อบริษัท (DBD)',    done:true  },
                  { step:3, label:'จดทะเบียนบริษัท',        done:false },
                  { step:4, label:'จดทะเบียน VAT',          done:false },
                  { step:5, label:'ส่งมอบเอกสาร',           done:false },
                ].map(s => (
                  <div key={s.step} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${s.done ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {s.done ? '✓' : s.step}
                    </div>
                    <span className={`text-sm ${s.done ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{s.label}</span>
                    {s.done && <span className="ml-auto text-xs text-emerald-600 font-medium">เสร็จแล้ว</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : <NoService service="เปิดบริษัท" />
      )}

      {/* ─── Tab: ยื่นภาษี ─── */}
      {activeTab === 'tax' && (
        hasService('ยื่นภาษี') ? (
          <Card variant="bordered">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>การยื่นภาษี</CardTitle>
              <Button variant="primary" size="sm"><Plus className="w-4 h-4 mr-1" />เพิ่มรายการ</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { type:'ภ.พ.30 (VAT)',    period:'เมษายน 2569', due:'15 พ.ค. 2569', status:'รอดำเนินการ', amount:12500 },
                  { type:'ภ.ง.ด.1 (WHT)',   period:'มีนาคม 2569', due:'7 เม.ย. 2569',  status:'ยื่นแล้ว',    amount:8200  },
                  { type:'ภ.ง.ด.50 (CIT)',  period:'ปี 2568',      due:'31 พ.ค. 2569', status:'รอดำเนินการ', amount:45000 },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{t.type}</p>
                      <p className="text-xs text-gray-500">งวด: {t.period} · ครบกำหนด: {t.due}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-gray-900">{formatCurrency(t.amount)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.status === 'ยื่นแล้ว' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : <NoService service="ยื่นภาษี" />
      )}

      {/* ─── Tab: รายรับ-รายจ่าย ─── */}
      {activeTab === 'accounting' && (
        hasService('ทำบัญชี') ? (
          <Card variant="bordered">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>รายรับ-รายจ่าย</CardTitle>
              <Button variant="primary" size="sm"><Plus className="w-4 h-4 mr-1" />เพิ่มรายการ</Button>
            </CardHeader>
            <CardContent className="p-0">
              {txs.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">ยังไม่มีรายการ</div>
              ) : txs.map(tx => (
                <div key={tx.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tx.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {tx.type === 'INCOME' ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(tx.transactionDate)}</p>
                    </div>
                  </div>
                  <p className={`font-semibold text-sm ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : <NoService service="ทำบัญชี" />
      )}

      {/* ─── Tab: กล่องเอกสาร ─── */}
      {activeTab === 'docs' && (
        <Card variant="bordered">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>กล่องเอกสาร</CardTitle>
            <Button variant="primary" size="sm"><Plus className="w-4 h-4 mr-1" />อัปโหลด</Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['ใบกำกับภาษี', 'ใบเสร็จ', 'งบการเงิน', 'เอกสารราชการ'].map(cat => (
                <div key={cat} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center cursor-pointer hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                  <FolderOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">{cat}</p>
                  <p className="text-xs text-gray-400 mt-1">0 ไฟล์</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Tab: รายงาน ─── */}
      {activeTab === 'report' && (
        <Card variant="bordered">
          <CardHeader><CardTitle>รายงานการเงิน</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['งบกำไรขาดทุน', 'งบดุล', 'งบกระแสเงินสด', 'รายงาน VAT', 'สรุปหัก ณ ที่จ่าย', 'รายรับ-รายจ่ายรายเดือน'].map(r => (
                <button key={r} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                  <BarChart2 className="w-6 h-6 text-emerald-500 mb-2" />
                  <p className="text-sm font-medium text-gray-700">{r}</p>
                  <p className="text-xs text-emerald-600 mt-1">ดูรายงาน →</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}

// ─── No-service state ────────────────────────────────────────────
function NoService({ service }: { service: string }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-10 text-center">
      <AlertCircle className="w-10 h-10 text-blue-400 mx-auto mb-3" />
      <p className="text-base font-semibold text-blue-800 mb-1">ไม่มีบริการนี้</p>
      <p className="text-sm text-blue-600 mb-4">บริษัทนี้ยังไม่ได้ซื้อบริการ "{service}"</p>
      <button className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
        แนะนำบริการให้ลูกค้า
      </button>
    </div>
  );
}
