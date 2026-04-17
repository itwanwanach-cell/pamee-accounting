'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { mockCompanies } from '@/lib/mock-data';
import {
  LayoutDashboard, Users, Calculator, MessageSquare,
  Settings, LogOut, ChevronLeft, ChevronRight,
  UserCircle, ChevronDown, Building2, User,
  CalendarDays, Upload,
} from 'lucide-react';

interface SidebarProps { isOpen: boolean; onToggle: () => void; }

const companyTypes: Record<string, 'niti' | 'natural'> = {
  'company-1': 'niti', 'company-2': 'niti', 'company-3': 'niti',
  'company-4': 'natural', 'company-5': 'natural',
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuthStore();

  const [clientOpen, setClientOpen]   = React.useState(true);
  const [nitiOpen, setNitiOpen]       = React.useState(true);
  const [naturalOpen, setNaturalOpen] = React.useState(false);

  const nitiList    = mockCompanies.filter(c => (companyTypes[c.id] ?? 'niti') === 'niti');
  const naturalList = mockCompanies.filter(c => companyTypes[c.id] === 'natural');

  const topNav = [
    { icon: LayoutDashboard, label: 'แดชบอร์ด',     href: '/dashboard' },
    { icon: MessageSquare,   label: 'รวมแชทลูกค้า', href: '/chat',  badge: 5  },
    { icon: CalendarDays,    label: 'ตารางงาน',      href: '/tasks', badge: 7  },
  ];

  const bottomNav = [
    { icon: Upload,       label: 'OCR สแกนบิล',    href: '/ocr' },
    { icon: Users,        label: 'จัดการพนักงาน',   href: '/staff'    },
    { icon: MessageSquare,label: 'แชทบอท',          href: '/chat'     },
    { icon: Settings,     label: 'ตั้งค่า',          href: '/settings' },
  ];

  return (
    <aside className={cn(
      'fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300 flex flex-col',
      isOpen ? 'w-64' : 'w-20'
    )}>

      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700 flex-shrink-0">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm">Pamee</div>
              <div className="text-xs text-slate-400">Accounting</div>
            </div>
          </div>
        )}
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* User */}
      {user && (
        <div className={cn('px-4 py-3 border-b border-slate-700 flex-shrink-0', !isOpen && 'px-2')}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <UserCircle className="w-5 h-5" />
            </div>
            {isOpen && (
              <div className="overflow-hidden">
                <p className="font-medium text-sm truncate">{user.name}</p>
                <p className="text-xs text-slate-400">
                  {user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : user.role === 'STAFF' ? 'พนักงาน' : 'ลูกค้า'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">

        {/* Top nav items */}
        {topNav.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                isActive ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                !isOpen && 'justify-center'
              )}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <span className="text-sm font-medium flex-1">{item.label}</span>
              )}
              {isOpen && item.badge && (
                <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* ─── บริษัทลูกค้า ─── */}
        {isOpen && (
          <>
            <div className="pt-3 pb-1 px-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">บริษัทลูกค้า</p>
            </div>

            {/* Header toggle */}
            <button
              onClick={() => setClientOpen(v => !v)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              <Building2 className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium flex-1 text-left">บริษัทลูกค้า</span>
              <span className="text-xs bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">
                {mockCompanies.length}
              </span>
              <ChevronDown className={cn('w-4 h-4 transition-transform', clientOpen && 'rotate-180')} />
            </button>

            {clientOpen && (
              <div className="pl-3 space-y-0.5">

                {/* นิติบุคคล */}
                <button
                  onClick={() => setNitiOpen(v => !v)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm"
                >
                  <div className="w-5 h-5 rounded bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-300">นต</div>
                  <span className="flex-1 text-left">นิติบุคคล</span>
                  <span className="text-xs text-slate-500">{nitiList.length}</span>
                  <ChevronDown className={cn('w-3 h-3 transition-transform', nitiOpen && 'rotate-180')} />
                </button>

                {nitiOpen && (
                  <div className="pl-4 space-y-0.5">
                    {nitiList.map(co => {
                      const isActive = pathname === `/clients/${co.id}`;
                      return (
                        <Link key={co.id} href={`/clients/${co.id}`}
                          className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all',
                            isActive
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          )}>
                          <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', isActive ? 'bg-white' : 'bg-emerald-500')} />
                          <span className="truncate">{co.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* บุคคลธรรมดา */}
                <button
                  onClick={() => setNaturalOpen(v => !v)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm"
                >
                  <div className="w-5 h-5 rounded bg-purple-900 flex items-center justify-center text-xs font-bold text-purple-300">บค</div>
                  <span className="flex-1 text-left">บุคคลธรรมดา</span>
                  <span className="text-xs text-slate-500">{naturalList.length}</span>
                  <ChevronDown className={cn('w-3 h-3 transition-transform', naturalOpen && 'rotate-180')} />
                </button>

                {naturalOpen && (
                  <div className="pl-4 space-y-0.5">
                    {naturalList.map(co => {
                      const isActive = pathname === `/clients/${co.id}`;
                      return (
                        <Link key={co.id} href={`/clients/${co.id}`}
                          className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all',
                            isActive
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          )}>
                          <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', isActive ? 'bg-white' : 'bg-purple-400')} />
                          <span className="truncate">{co.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Collapsed state — icon only */}
        {!isOpen && (
          <Link href="/clients"
            className={cn(
              'flex items-center justify-center px-3 py-2.5 rounded-lg transition-all',
              pathname.startsWith('/clients') ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-800'
            )}>
            <Building2 className="w-5 h-5" />
          </Link>
        )}

        {/* Separator */}
        <div className="pt-3 pb-1">
          {isOpen && <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ทั่วไป</p>}
        </div>

        {/* Bottom nav items */}
        {bottomNav.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                isActive ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                !isOpen && 'justify-center'
              )}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-slate-700 flex-shrink-0">
        <button onClick={logout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors',
            !isOpen && 'justify-center'
          )}>
          <LogOut className="w-5 h-5" />
          {isOpen && <span className="text-sm font-medium">ออกจากระบบ</span>}
        </button>
      </div>
    </aside>
  );
};

export { Sidebar };
