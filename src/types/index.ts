// ==================== USER TYPES ====================

export type Role = 'ADMIN' | 'STAFF' | 'CLIENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  mfaEnabled: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface Staff {
  id: string;
  userId: string;
  employeeCode: string;
  department?: string;
  position?: string;
  maxClients: number;
  user?: User;
  assignedCompanies?: Company[];
}

export interface StaffPerformance {
  id: string;
  staffId: string;
  period: string;
  clientsHandled: number;
  tasksCompleted: number;
  tasksOnTimePercentage: number;
  accuracyScore: number;
  clientSatisfaction: number;
  avgResponseTimeHours: number;
}

// ==================== COMPANY TYPES ====================

export type ServiceTier = 'BASIC' | 'STANDARD' | 'PREMIUM';

export interface Company {
  id: string;
  name: string;
  taxId?: string;
  address?: string;
  phone?: string;
  email?: string;
  businessType?: string;
  serviceTier: ServiceTier;
  vatRegistered: boolean;
  isActive: boolean;
  clientUserId: string;
  assignedStaffId?: string;
  assignedStaff?: Staff;
  bankAccounts?: BankAccount[];
  settings?: CompanySettings;
}

export interface CompanySettings {
  id: string;
  companyId: string;
  maxTransactionsPerAccount: number;
  vatThreshold: number;
  alertThresholdPercent: number;
}

export type AccountType = 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT';

export interface BankAccount {
  id: string;
  companyId: string;
  bankName: string;
  bankCode?: string;
  accountNumber: string; // Masked
  accountName: string;
  accountType: AccountType;
  isPrimary: boolean;
  isActive: boolean;
  transactionCount?: number; // Computed field
}

// ==================== TRANSACTION TYPES ====================

export type TransactionType = 'INCOME' | 'EXPENSE';
export type DocumentType = 'RECEIPT' | 'CASH_BILL' | 'TAX_INVOICE' | 'QUOTATION' | 'OTHER';
export type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';

export interface Transaction {
  id: string;
  companyId: string;
  bankAccountId?: string;
  type: TransactionType;
  category: string;
  subCategory?: string;
  amount: number;
  vatAmount: number;
  netAmount: number;
  description?: string;
  reference?: string;
  vendorName?: string;
  vendorTaxId?: string;
  transactionDate: Date;
  documentType: DocumentType;
  status: TransactionStatus;
  ocrConfidence?: number;
  aiSuggestion?: string;
  createdAt: Date;
  bankAccount?: BankAccount;
  uploadedFiles?: UploadedFile[];
}

export interface TransactionFormData {
  companyId: string;
  bankAccountId?: string;
  type: TransactionType;
  category: string;
  subCategory?: string;
  amount: number;
  vatAmount?: number;
  description?: string;
  vendorName?: string;
  vendorTaxId?: string;
  vendorAddress?: string;
  transactionDate: string;
  documentType: DocumentType;
}

// ==================== INVOICE TYPES ====================

export type InvoiceStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface BillingCompany {
  id: string;
  name: string;
  taxId: string;
  address: string;
  phone?: string;
  email?: string;
  logo?: string;
  isActive: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  billingCompanyId: string;
  createdById: string;
  approvedById?: string;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  includeTaxInvoice: boolean;
  taxInvoiceNumber?: string;
  notes?: string;
  paidAt?: Date;
  company?: Company;
  billingCompany?: BillingCompany;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

// ==================== TAX TYPES ====================

export type TaxType = 'VAT' | 'WHT' | 'CIT' | 'PIT';
export type TaxFilingStatus = 'PENDING' | 'IN_PROGRESS' | 'FILED' | 'PAID' | 'OVERDUE';

export interface TaxFiling {
  id: string;
  companyId: string;
  taxType: TaxType;
  period: string;
  dueDate: Date;
  filedDate?: Date;
  amount: number;
  status: TaxFilingStatus;
  reference?: string;
  notes?: string;
}

// ==================== TASK TYPES ====================

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Task {
  id: string;
  staffId: string;
  companyId?: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
}

// ==================== FILE TYPES ====================

export type FilePurpose = 'RECEIPT' | 'INVOICE' | 'CONTRACT' | 'TAX_DOCUMENT' | 'DOCUMENT' | 'OTHER';
export type FileStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface UploadedFile {
  id: string;
  userId: string;
  companyId?: string;
  transactionId?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  purpose: FilePurpose;
  ocrProcessed: boolean;
  ocrResult?: OCRResult;
  status: FileStatus;
  createdAt: Date;
}

export interface OCRResult {
  vendorName?: string;
  vendorTaxId?: string;
  vendorAddress?: string;
  date?: string;
  totalAmount?: number;
  vatAmount?: number;
  items?: Array<{
    description: string;
    amount: number;
  }>;
  confidence: number;
  suggestedCategory?: string;
}

// ==================== CHAT TYPES ====================

export type ChatRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface ChatMessage {
  id: string;
  userId: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  wasEscalated: boolean;
  escalatedToId?: string;
  escalatedAt?: Date;
  resolvedAt?: Date;
  createdAt: Date;
}

// ==================== NOTIFICATION TYPES ====================

export type NotificationType = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'TASK' | 'INVOICE' | 'TAX';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

// ==================== DASHBOARD TYPES ====================

export interface AdminDashboardStats {
  totalClients: number;
  totalStaff: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  staffPerformance: StaffPerformance[];
  upcomingTasks: Task[];
}

export interface StaffDashboardStats {
  assignedClients: number;
  tasksOnTime: number;
  clientSatisfaction: number;
  pendingTasks: number;
  clients: Company[];
  todayTasks: Task[];
}

export interface ClientDashboardStats {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  netProfit: number;
  pendingTax: number;
  pendingInvoices: Invoice[];
  taxFilings: TaxFiling[];
}

// ==================== ALERT TYPES ====================

export interface TransactionAlert {
  type: 'OVER_LIMIT' | 'NEAR_LIMIT' | 'OK';
  bankAccountId: string;
  bankName: string;
  currentCount: number;
  maxCount: number;
  percentage: number;
}

export interface RevenueAlert {
  type: 'OVER_THRESHOLD' | 'NEAR_THRESHOLD' | 'OK';
  currentRevenue: number;
  threshold: number;
  percentage: number;
}
