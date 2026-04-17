import {
  User, Staff, Company, BankAccount, Transaction, Invoice, Task, TaxFiling,
  StaffPerformance, BillingCompany, TransactionAlert, RevenueAlert
} from '@/types';

// ==================== USERS ====================

export const mockUsers: User[] = [
  {
    id: 'user-admin-1',
    email: 'admin@accounting.com',
    name: 'สมศักดิ์ ผู้บริหาร',
    role: 'ADMIN',
    phone: '081-234-5678',
    isActive: true,
    mfaEnabled: true,
    lastLogin: new Date('2024-03-20T08:30:00'),
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'user-staff-1',
    email: 'somchai@accounting.com',
    name: 'สมชาย ใจดี',
    role: 'STAFF',
    phone: '082-345-6789',
    isActive: true,
    mfaEnabled: true,
    lastLogin: new Date('2024-03-20T09:00:00'),
    createdAt: new Date('2023-02-01'),
  },
  {
    id: 'user-staff-2',
    email: 'somying@accounting.com',
    name: 'สมหญิง รักงาน',
    role: 'STAFF',
    phone: '083-456-7890',
    isActive: true,
    mfaEnabled: false,
    lastLogin: new Date('2024-03-20T08:45:00'),
    createdAt: new Date('2023-03-01'),
  },
  {
    id: 'user-client-1',
    email: 'client@abc-trading.com',
    name: 'วิชัย เจ้าของกิจการ',
    role: 'CLIENT',
    phone: '084-567-8901',
    isActive: true,
    mfaEnabled: false,
    lastLogin: new Date('2024-03-19T14:00:00'),
    createdAt: new Date('2023-06-01'),
  },
];

// ==================== STAFF ====================

export const mockStaff: Staff[] = [
  {
    id: 'staff-1',
    userId: 'user-staff-1',
    employeeCode: 'EMP001',
    department: 'บัญชี',
    position: 'นักบัญชีอาวุโส',
    maxClients: 20,
    user: mockUsers[1],
  },
  {
    id: 'staff-2',
    userId: 'user-staff-2',
    employeeCode: 'EMP002',
    department: 'บัญชี',
    position: 'นักบัญชี',
    maxClients: 15,
    user: mockUsers[2],
  },
];

// ==================== STAFF PERFORMANCE ====================

export const mockStaffPerformance: StaffPerformance[] = [
  {
    id: 'perf-1',
    staffId: 'staff-1',
    period: '2024-03',
    clientsHandled: 15,
    tasksCompleted: 45,
    tasksOnTimePercentage: 92,
    accuracyScore: 96,
    clientSatisfaction: 4.5,
    avgResponseTimeHours: 4.2,
  },
  {
    id: 'perf-2',
    staffId: 'staff-2',
    period: '2024-03',
    clientsHandled: 12,
    tasksCompleted: 38,
    tasksOnTimePercentage: 88,
    accuracyScore: 94,
    clientSatisfaction: 4.2,
    avgResponseTimeHours: 5.1,
  },
];

// ==================== BILLING COMPANIES ====================

export const mockBillingCompanies: BillingCompany[] = [
  {
    id: 'billing-1',
    name: 'สำนักงานบัญชี XYZ จำกัด',
    taxId: '0-1234-56789-01-2',
    address: '123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    phone: '02-123-4567',
    email: 'contact@xyz-accounting.com',
    isActive: true,
  },
  {
    id: 'billing-2',
    name: 'บจก. ที่ปรึกษาภาษี ABC',
    taxId: '0-9876-54321-09-8',
    address: '456 ถ.พระราม 4 แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    phone: '02-234-5678',
    email: 'contact@abc-tax.com',
    isActive: true,
  },
];

// ==================== COMPANIES (CLIENTS) ====================

export const mockCompanies: Company[] = [
  {
    id: 'company-1',
    name: 'บจก. ABC Trading',
    taxId: '0-1111-22222-33-4',
    address: '789 ถ.พระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310',
    phone: '02-345-6789',
    email: 'contact@abc-trading.com',
    businessType: 'ค้าปลีก-ค้าส่ง',
    serviceTier: 'PREMIUM',
    vatRegistered: true,
    isActive: true,
    clientUserId: 'user-client-1',
    assignedStaffId: 'staff-1',
  },
  {
    id: 'company-2',
    name: 'บจก. XYZ Corporation',
    taxId: '0-2222-33333-44-5',
    address: '321 ถ.รัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400',
    phone: '02-456-7890',
    email: 'contact@xyz-corp.com',
    businessType: 'บริการ',
    serviceTier: 'STANDARD',
    vatRegistered: true,
    isActive: true,
    clientUserId: 'user-client-1',
    assignedStaffId: 'staff-1',
  },
  {
    id: 'company-3',
    name: 'หจก. DEF Service',
    taxId: '0-3333-44444-55-6',
    address: '654 ถ.ลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900',
    phone: '02-567-8901',
    email: 'contact@def-service.com',
    businessType: 'ซ่อมบำรุง',
    serviceTier: 'BASIC',
    vatRegistered: false,
    isActive: true,
    clientUserId: 'user-client-1',
    assignedStaffId: 'staff-2',
  },
];

// ==================== BANK ACCOUNTS ====================

export const mockBankAccounts: BankAccount[] = [
  {
    id: 'bank-1',
    companyId: 'company-1',
    bankName: 'กสิกรไทย',
    bankCode: 'KBANK',
    accountNumber: 'XXX-X-XX456-7',
    accountName: 'บจก. ABC Trading',
    accountType: 'CURRENT',
    isPrimary: true,
    isActive: true,
    transactionCount: 428,
  },
  {
    id: 'bank-2',
    companyId: 'company-1',
    bankName: 'ไทยพาณิชย์',
    bankCode: 'SCB',
    accountNumber: 'XXX-X-XX789-0',
    accountName: 'บจก. ABC Trading',
    accountType: 'SAVINGS',
    isPrimary: false,
    isActive: true,
    transactionCount: 348,
  },
  {
    id: 'bank-3',
    companyId: 'company-1',
    bankName: 'กรุงเทพ',
    bankCode: 'BBL',
    accountNumber: 'XXX-X-XX123-4',
    accountName: 'บจก. ABC Trading',
    accountType: 'CURRENT',
    isPrimary: false,
    isActive: true,
    transactionCount: 128,
  },
];

// ==================== TRANSACTIONS ====================

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    companyId: 'company-1',
    bankAccountId: 'bank-1',
    type: 'INCOME',
    category: 'sales',
    amount: 45000,
    vatAmount: 3150,
    netAmount: 41850,
    description: 'รับชำระค่าสินค้า - บจก.XYZ',
    vendorName: 'บจก. XYZ',
    transactionDate: new Date('2024-03-20'),
    documentType: 'TAX_INVOICE',
    status: 'APPROVED',
    createdAt: new Date('2024-03-20'),
  },
  {
    id: 'tx-2',
    companyId: 'company-1',
    bankAccountId: 'bank-1',
    type: 'EXPENSE',
    category: 'materials',
    amount: 8500,
    vatAmount: 595,
    netAmount: 7905,
    description: 'ซื้อวัตถุดิบ',
    vendorName: 'บจก. ซัพพลายเออร์ ABC',
    vendorTaxId: '0-1234-56789-01-2',
    transactionDate: new Date('2024-03-19'),
    documentType: 'TAX_INVOICE',
    status: 'APPROVED',
    ocrConfidence: 94,
    aiSuggestion: 'ค่าวัตถุดิบ',
    createdAt: new Date('2024-03-19'),
  },
  {
    id: 'tx-3',
    companyId: 'company-1',
    bankAccountId: 'bank-2',
    type: 'INCOME',
    category: 'service',
    amount: 12000,
    vatAmount: 840,
    netAmount: 11160,
    description: 'รับชำระค่าบริการ',
    transactionDate: new Date('2024-03-19'),
    documentType: 'RECEIPT',
    status: 'APPROVED',
    createdAt: new Date('2024-03-19'),
  },
  {
    id: 'tx-4',
    companyId: 'company-1',
    bankAccountId: 'bank-3',
    type: 'EXPENSE',
    category: 'utilities',
    amount: 3200,
    vatAmount: 224,
    netAmount: 2976,
    description: 'ค่าไฟฟ้า',
    vendorName: 'การไฟฟ้านครหลวง',
    transactionDate: new Date('2024-03-18'),
    documentType: 'RECEIPT',
    status: 'APPROVED',
    createdAt: new Date('2024-03-18'),
  },
  {
    id: 'tx-5',
    companyId: 'company-1',
    bankAccountId: 'bank-1',
    type: 'INCOME',
    category: 'sales',
    amount: 5500,
    vatAmount: 385,
    netAmount: 5115,
    description: 'รับเงินสดจากการขาย',
    transactionDate: new Date('2024-03-18'),
    documentType: 'CASH_BILL',
    status: 'PENDING',
    createdAt: new Date('2024-03-18'),
  },
];

// ==================== INVOICES ====================

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2024-0042',
    companyId: 'company-1',
    billingCompanyId: 'billing-1',
    createdById: 'staff-1',
    issueDate: new Date('2024-03-20'),
    dueDate: new Date('2024-04-05'),
    subtotal: 13000,
    vatAmount: 910,
    totalAmount: 13910,
    status: 'PENDING_APPROVAL',
    includeTaxInvoice: true,
    items: [
      { id: 'item-1', invoiceId: 'inv-1', description: 'ค่าบริการทำบัญชี มี.ค. 2567', quantity: 1, unitPrice: 8000, amount: 8000 },
      { id: 'item-2', invoiceId: 'inv-1', description: 'ค่าที่ปรึกษาภาษี', quantity: 1, unitPrice: 5000, amount: 5000 },
    ],
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2024-0043',
    companyId: 'company-2',
    billingCompanyId: 'billing-1',
    createdById: 'staff-1',
    issueDate: new Date('2024-03-18'),
    dueDate: new Date('2024-04-02'),
    subtotal: 24000,
    vatAmount: 1680,
    totalAmount: 25680,
    status: 'PENDING_APPROVAL',
    includeTaxInvoice: true,
    items: [
      { id: 'item-3', invoiceId: 'inv-2', description: 'ค่าบริการทำบัญชี มี.ค. 2567', quantity: 1, unitPrice: 15000, amount: 15000 },
      { id: 'item-4', invoiceId: 'inv-2', description: 'ค่าจัดทำรายงานการเงิน', quantity: 1, unitPrice: 9000, amount: 9000 },
    ],
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2024-0041',
    companyId: 'company-1',
    billingCompanyId: 'billing-1',
    createdById: 'staff-1',
    approvedById: 'staff-1',
    issueDate: new Date('2024-02-20'),
    dueDate: new Date('2024-03-05'),
    subtotal: 8000,
    vatAmount: 560,
    totalAmount: 8560,
    status: 'PAID',
    includeTaxInvoice: true,
    taxInvoiceNumber: 'TAX-2024-0041',
    paidAt: new Date('2024-03-01'),
    items: [
      { id: 'item-5', invoiceId: 'inv-3', description: 'ค่าบริการทำบัญชี ก.พ. 2567', quantity: 1, unitPrice: 8000, amount: 8000 },
    ],
  },
];

// ==================== TASKS ====================

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    staffId: 'staff-1',
    companyId: 'company-1',
    title: 'ยื่นภาษี ภ.พ.30 บจก. ABC Trading',
    description: 'ยื่นภาษีมูลค่าเพิ่มประจำเดือน มี.ค. 2567',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    dueDate: new Date('2024-03-20T14:00:00'),
    createdAt: new Date('2024-03-15'),
  },
  {
    id: 'task-2',
    staffId: 'staff-1',
    companyId: 'company-2',
    title: 'ปิดงบ บจก. XYZ Corporation',
    description: 'ปิดงบประจำไตรมาส 1/2567',
    priority: 'HIGH',
    status: 'TODO',
    dueDate: new Date('2024-03-21'),
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 'task-3',
    staffId: 'staff-1',
    companyId: 'company-3',
    title: 'ติดตามบิลค้างชำระ หจก. DEF Service',
    description: 'โทรติดตามการชำระเงินค่าบริการ',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: new Date('2024-03-20'),
    createdAt: new Date('2024-03-18'),
  },
  {
    id: 'task-4',
    staffId: 'staff-1',
    title: 'ตรวจสอบเอกสาร 3 ราย',
    description: 'ตรวจสอบเอกสารที่ลูกค้าอัปโหลดมา',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: new Date('2024-03-20'),
    createdAt: new Date('2024-03-19'),
  },
  {
    id: 'task-5',
    staffId: 'staff-1',
    companyId: 'company-1',
    title: 'บันทึกรายรับ บจก. ABC Trading',
    description: 'บันทึกรายรับจากใบเสร็จที่ได้รับ',
    priority: 'LOW',
    status: 'COMPLETED',
    dueDate: new Date('2024-03-19'),
    completedAt: new Date('2024-03-19T10:30:00'),
    createdAt: new Date('2024-03-18'),
  },
];

// ==================== TAX FILINGS ====================

export const mockTaxFilings: TaxFiling[] = [
  {
    id: 'tax-1',
    companyId: 'company-1',
    taxType: 'VAT',
    period: '2024-03',
    dueDate: new Date('2024-04-15'),
    amount: 23500,
    status: 'PENDING',
  },
  {
    id: 'tax-2',
    companyId: 'company-1',
    taxType: 'VAT',
    period: '2024-02',
    dueDate: new Date('2024-03-15'),
    filedDate: new Date('2024-03-15'),
    amount: 21000,
    status: 'FILED',
    reference: 'VAT-2024-02-001',
  },
  {
    id: 'tax-3',
    companyId: 'company-1',
    taxType: 'CIT',
    period: '2024',
    dueDate: new Date('2024-05-31'),
    amount: 0,
    status: 'PENDING',
    notes: 'รอปิดงบประจำปี',
  },
];

// ==================== ALERTS ====================

export const mockTransactionAlerts: TransactionAlert[] = [
  {
    type: 'OVER_LIMIT',
    bankAccountId: 'bank-1',
    bankName: 'กสิกรไทย',
    currentCount: 428,
    maxCount: 400,
    percentage: 107,
  },
  {
    type: 'NEAR_LIMIT',
    bankAccountId: 'bank-2',
    bankName: 'ไทยพาณิชย์',
    currentCount: 348,
    maxCount: 400,
    percentage: 87,
  },
  {
    type: 'OK',
    bankAccountId: 'bank-3',
    bankName: 'กรุงเทพ',
    currentCount: 128,
    maxCount: 400,
    percentage: 32,
  },
];

export const mockRevenueAlert: RevenueAlert = {
  type: 'NEAR_THRESHOLD',
  currentRevenue: 1680000,
  threshold: 1800000,
  percentage: 93,
};

// ==================== DASHBOARD STATS ====================

export const mockAdminStats = {
  totalClients: 156,
  totalStaff: 12,
  monthlyRevenue: 1200000,
  pendingInvoices: 8,
};

export const mockStaffStats = {
  assignedClients: 15,
  tasksOnTime: 92,
  clientSatisfaction: 4.5,
  pendingTasks: 3,
};

export const mockClientStats = {
  currentBalance: 847500,
  monthlyIncome: 1200000,
  monthlyExpense: 352500,
  netProfit: 847500,
  pendingTax: 23500,
};
