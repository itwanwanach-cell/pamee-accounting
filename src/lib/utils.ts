import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'THB'): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('th-TH').format(num);
}

export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = new Date(date);
  if (format === 'short') {
    return d.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
  return d.toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  const lastFour = accountNumber.slice(-4);
  return `XXX-X-XXXX-${lastFour}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateVAT(amount: number, vatRate: number = 7): number {
  return Math.round(amount * (vatRate / 100));
}

export function calculatePercentage(current: number, max: number): number {
  if (max === 0) return 0;
  return Math.round((current / max) * 100);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Transaction Status
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    NEEDS_REVIEW: 'bg-orange-100 text-orange-800',
    // Invoice Status
    DRAFT: 'bg-gray-100 text-gray-800',
    PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
    SENT: 'bg-blue-100 text-blue-800',
    PAID: 'bg-green-100 text-green-800',
    OVERDUE: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
    // Task Status
    TODO: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    // Tax Status
    FILED: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
}

export function getBankColor(bankCode: string): string {
  const colors: Record<string, string> = {
    KBANK: '#1BA94C',
    SCB: '#4E2E87',
    BBL: '#1E4598',
    KTB: '#1A9BD7',
    TMB: '#EB5C19',
    BAY: '#FFD200',
  };
  return colors[bankCode] || '#6B7280';
}

export function getBankName(bankCode: string): string {
  const names: Record<string, string> = {
    KBANK: 'กสิกรไทย',
    SCB: 'ไทยพาณิชย์',
    BBL: 'กรุงเทพ',
    KTB: 'กรุงไทย',
    TMB: 'ทหารไทยธนชาต',
    BAY: 'กรุงศรีอยุธยา',
  };
  return names[bankCode] || bankCode;
}

export const TRANSACTION_CATEGORIES = {
  INCOME: [
    { value: 'sales', label: 'รายได้จากการขาย' },
    { value: 'service', label: 'รายได้จากการบริการ' },
    { value: 'interest', label: 'ดอกเบี้ยรับ' },
    { value: 'other_income', label: 'รายได้อื่น' },
  ],
  EXPENSE: [
    { value: 'materials', label: 'ค่าวัตถุดิบ' },
    { value: 'salary', label: 'เงินเดือน/ค่าจ้าง' },
    { value: 'rent', label: 'ค่าเช่า' },
    { value: 'utilities', label: 'ค่าสาธารณูปโภค' },
    { value: 'transport', label: 'ค่าขนส่ง' },
    { value: 'marketing', label: 'ค่าการตลาด' },
    { value: 'office', label: 'ค่าใช้จ่ายสำนักงาน' },
    { value: 'maintenance', label: 'ค่าซ่อมบำรุง' },
    { value: 'insurance', label: 'ค่าประกันภัย' },
    { value: 'other_expense', label: 'ค่าใช้จ่ายอื่น' },
  ],
};

export const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
  'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
  'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];
