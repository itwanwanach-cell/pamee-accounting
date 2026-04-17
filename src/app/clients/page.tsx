'use client';

import * as React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout';
import { StatCard } from '@/components/dashboard';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { mockCompanies, mockStaff } from '@/lib/mock-data';
import {
  Building2,
  Users,
  Plus,
  Search,
  Star,
  TrendingUp,
  User,
} from 'lucide-react';

// ข้อมูลเสริมสำหรับ prototype
const companyExtras: Record<string, {
  type: 'niti' | 'natural';
  owner: string;
  services: string[];
  satisfaction: 'very_happy' | 'happy' | 'neutral' | 'unhappy';
  updatedAt: string;
}> = {
  'company-1': { type: 'niti',    owner: 'คุณสมชาย ใจดี',      services: ['ทำบัญชี', 'ยื่นภาษี'],              satisfaction: 'happy',      updatedAt: 'วันนี้' },
  'company-2': { type: 'niti',    owner: 'คุณสมหญิง วงศ์',     services: ['เปิดบริษัท'],                        satisfaction: 'neutral',    updatedAt: '3 วันก่อน' },
  'company-3': { type: 'niti',    owner: 'คุณวิชัย เก่ง',       services: ['ทำบัญชี', 'ยื่นภาษี'],              satisfaction: 'very_happy', updatedAt: '3 วันก่อน' },
  'company-4': { type: 'natural', owner: 'นายสมชาย วงศ์ใหญ่',   services: ['ยื่นภาษี'],                         satisfaction: 'happy',      updatedAt: '2 วันก่อน' },
  'company-5': { type: 'natural', owner: 'นางสาวรวีวรรณ ดีมาก', services: ['ทำบัญชี'],                          satisfaction: 'very_happy', updatedAt: 'วันนี้' },
};

const satMap = {
  very_happy: { emoji: '😄', label: 'พึงพอใจมาก' },
  happy:      { emoji: '😊', label: 'พึงพอใจ' },
  neutral:    { emoji: '😐', label: 'เฉยๆ' },
  unhappy:    { emoji: '😞', label: 'ไม่พอใจ' },
};

const svcColors: Record<string, string> = {
  'ทำบัญชี':   'bg-emerald-50 text-emerald-700',
  'ยื่นภาษี':  'bg-blue-50 text-blue-700',
  'เปิดบริษัท': 'bg-purple-50 text-purple-700',
};

// ── Company Card ────────────────────────────────────────────────
function CompanyCard({ company }: { company: typeof mockCompanies[0] }) {
  const extra = companyExtras[company.id];
  const sat = extra ? satMap[extra.satisfaction] : satMap.neutral;
  const initials = company.name
    .replace(/บริษัท |ห้างหุ้นส่วน |นาย|นางสาว|นาง/g, '')
    .replace(/ จำกัด$/, '')
    .slice(0, 2);

  const pkgCls: Record<string, string> = {
    PREMIUM:  'bg-emerald-50 text-emerald-700',
    STANDARD: 'bg-amber-50  text-amber-700',
    BASIC:    'bg-gray-100  text-gray-500',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 h-full hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 font-semibold text-sm mb-2">
        {initials}
      </div>

      {/* Name */}
      <div className="text-sm font-medium text-gray-900 leading-tight mb-0.5 line-clamp-2">
        {company.name}
      </div>
      <div className="text-xs text-gray-400 mb-2">
        {extra?.owner ?? company.businessType}
      </div>

      {/* Package */}
      <span className={`inline-flex text-xs px-2 py-0.5 rounded font-medium mb-2 ${pkgCls[company.serviceTier] ?? pkgCls.BASIC}`}>
        {company.serviceTier === 'PREMIUM' ? 'Premium' : company.serviceTier === 'STANDARD' ? 'Standard' : 'Basic'}
      </span>

      {/* Services */}
      {extra && (
        <div className="flex flex-wrap gap-1 mb-3">
          {extra.services.map((s) => (
            <span key={s} className={`text-xs px-1.5 py-0.5 rounded ${svcColors[s] ?? 'bg-gray-100 text-gray-500'}`}>
              {s}
            </span>
          ))}
        </div>
      )}
      {!extra && company.vatRegistered && (
        <div className="mb-3">
          <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">VAT</span>
        </div>
      )}

      {/* Footer: satisfaction + updated */}
      <div className="flex items-end justify-between mt-auto">
        <div className="text-center">
          <div className="text-xl leading-none">{sat.emoji}</div>
          <div className="text-xs text-gray-400 mt-0.5">{sat.label}</div>
        </div>
        <div className="text-xs text-gray-400 text-right">
          อัปเดต<br />
          {extra?.updatedAt ?? 'ล่าสุด'}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function ClientsPage() {
  const [tab, setTab] = React.useState<'niti' | 'natural'>('niti');
  const [search, setSearch] = React.useState('');

  // แบ่งตาม type จาก companyExtras (fallback → niti)
  const nitiList    = mockCompanies.filter((c) => (companyExtras[c.id]?.type ?? 'niti') === 'niti');
  const naturalList = mockCompanies.filter((c) => companyExtras[c.id]?.type === 'natural');
  const activeList  = tab === 'niti' ? nitiList : naturalList;

  const filtered = activeList.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="บริษัทลูกค้า"
      subtitle="เลือกบริษัทเพื่อดูรายละเอียดและจัดการบริการ"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="ลูกค้าทั้งหมด"  value={mockCompanies.length}           subtitle="บริษัท" icon={Building2}  variant="info" />
        <StatCard title="นิติบุคคล"       value={nitiList.length}               subtitle="บริษัท" icon={Building2}  variant="success" />
        <StatCard title="บุคคลธรรมดา"    value={naturalList.length}            subtitle="ราย"    icon={User}      variant="warning" />
        <StatCard title="พนักงานดูแล"    value={mockStaff.length}              subtitle="คน"     icon={Users}     variant="default" />
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {([
            ['niti',    'นิติบุคคล',    nitiList.length,    'bg-emerald-100 text-emerald-700'],
            ['natural', 'บุคคลธรรมดา', naturalList.length, 'bg-purple-100  text-purple-700'],
          ] as const).map(([key, label, count, activeBadge]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {key === 'niti' ? <Building2 size={14} /> : <User size={14} />}
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? activeBadge : 'bg-gray-200 text-gray-500'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาบริษัท..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52"
            />
          </div>
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            เพิ่มลูกค้าใหม่
          </Button>
        </div>
      </div>

      {/* Company Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-2">🔍</div>
          <div className="text-sm">ไม่พบบริษัทที่ค้นหา</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((company) => (
            <Link key={company.id} href={`/clients/${company.id}`}>
              <CompanyCard company={company} />
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
