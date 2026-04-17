'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { mockUsers } from '@/lib/mock-data';

export default function Home() {
  const router = useRouter();
  const { setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Auto login with staff user for demo
    if (!isAuthenticated) {
      const staffUser = mockUsers.find((u) => u.role === 'STAFF');
      if (staffUser) {
        setUser(staffUser);
      }
    }
    router.push('/dashboard');
  }, [router, setUser, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">AcctPro</h1>
        <p className="text-gray-500 mb-4">ระบบบริหารสำนักงานบัญชี</p>
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>กำลังโหลด...</span>
        </div>
      </div>
    </div>
  );
}
