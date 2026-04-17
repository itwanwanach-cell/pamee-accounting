import { create } from 'zustand';
import { User, Company, Transaction, Invoice, Task, Notification } from '@/types';
import { mockUsers, mockCompanies, mockTransactions, mockInvoices, mockTasks } from '@/lib/mock-data';

// ==================== AUTH STORE ====================

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const user = mockUsers.find((u) => u.email === email);
    if (user) {
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    }
    set({ isLoading: false });
    return false;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
}));

// ==================== COMPANY STORE ====================

interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;
  isLoading: boolean;
  setCompanies: (companies: Company[]) => void;
  selectCompany: (company: Company | null) => void;
  addCompany: (company: Company) => void;
  updateCompany: (id: string, data: Partial<Company>) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: mockCompanies,
  selectedCompany: mockCompanies[0] || null,
  isLoading: false,
  setCompanies: (companies) => set({ companies }),
  selectCompany: (company) => set({ selectedCompany: company }),
  addCompany: (company) => set((state) => ({ companies: [...state.companies, company] })),
  updateCompany: (id, data) => set((state) => ({
    companies: state.companies.map((c) => (c.id === id ? { ...c, ...data } : c)),
  })),
}));

// ==================== TRANSACTION STORE ====================

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  filters: {
    type?: 'INCOME' | 'EXPENSE';
    bankAccountId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  setFilters: (filters: TransactionState['filters']) => void;
  getFilteredTransactions: () => Transaction[];
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: mockTransactions,
  isLoading: false,
  filters: {},
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) => set((state) => ({ 
    transactions: [transaction, ...state.transactions] 
  })),
  updateTransaction: (id, data) => set((state) => ({
    transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...data } : t)),
  })),
  setFilters: (filters) => set({ filters }),
  getFilteredTransactions: () => {
    const { transactions, filters } = get();
    return transactions.filter((t) => {
      if (filters.type && t.type !== filters.type) return false;
      if (filters.bankAccountId && t.bankAccountId !== filters.bankAccountId) return false;
      if (filters.status && t.status !== filters.status) return false;
      return true;
    });
  },
}));

// ==================== INVOICE STORE ====================

interface InvoiceState {
  invoices: Invoice[];
  isLoading: boolean;
  setInvoices: (invoices: Invoice[]) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  approveInvoice: (id: string, approvedById: string) => void;
  rejectInvoice: (id: string) => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: mockInvoices,
  isLoading: false,
  setInvoices: (invoices) => set({ invoices }),
  addInvoice: (invoice) => set((state) => ({ invoices: [invoice, ...state.invoices] })),
  updateInvoice: (id, data) => set((state) => ({
    invoices: state.invoices.map((i) => (i.id === id ? { ...i, ...data } : i)),
  })),
  approveInvoice: (id, approvedById) => set((state) => ({
    invoices: state.invoices.map((i) => 
      i.id === id ? { ...i, status: 'APPROVED' as const, approvedById } : i
    ),
  })),
  rejectInvoice: (id) => set((state) => ({
    invoices: state.invoices.map((i) => 
      i.id === id ? { ...i, status: 'CANCELLED' as const } : i
    ),
  })),
}));

// ==================== TASK STORE ====================

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  completeTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: mockTasks,
  isLoading: false,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, data) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
  })),
  completeTask: (id) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === id ? { ...t, status: 'COMPLETED' as const, completedAt: new Date() } : t
    ),
  })),
}));

// ==================== UI STORE ====================

interface UIState {
  sidebarOpen: boolean;
  chatOpen: boolean;
  notifications: Notification[];
  toggleSidebar: () => void;
  toggleChat: () => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  chatOpen: false,
  notifications: [],
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
  addNotification: (notification) => set((state) => ({ 
    notifications: [notification, ...state.notifications] 
  })),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => 
      n.id === id ? { ...n, isRead: true } : n
    ),
  })),
  clearNotifications: () => set({ notifications: [] }),
}));
