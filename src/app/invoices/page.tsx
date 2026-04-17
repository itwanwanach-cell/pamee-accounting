'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout';
import { StatCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Select, Modal } from '@/components/ui';
import { useInvoiceStore } from '@/store';
import { mockInvoices, mockBillingCompanies, mockCompanies } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Download,
  Send,
  Eye,
  Check,
  X,
  Building2,
  Lock,
} from 'lucide-react';

export default function InvoicesPage() {
  const { invoices, approveInvoice, rejectInvoice } = useInvoiceStore();
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedInvoice, setSelectedInvoice] = React.useState<typeof mockInvoices[0] | null>(null);
  const [showApproveModal, setShowApproveModal] = React.useState(false);

  // Stats
  const pendingApproval = invoices.filter((i) => i.status === 'PENDING_APPROVAL').length;
  const approved = invoices.filter((i) => i.status === 'APPROVED').length;
  const paid = invoices.filter((i) => i.status === 'PAID').length;
  const overdue = invoices.filter((i) => i.status === 'OVERDUE').length;

  // Filter
  const filteredInvoices = statusFilter === 'all' 
    ? invoices 
    : invoices.filter((i) => i.status === statusFilter);

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info' | 'default'; label: string }> = {
      DRAFT: { variant: 'default', label: 'แบบร่าง' },
      PENDING_APPROVAL: { variant: 'warning', label: 'รออนุมัติ' },
      APPROVED: { variant: 'success', label: 'อนุมัติแล้ว' },
      SENT: { variant: 'info', label: 'ส่งแล้ว' },
      PAID: { variant: 'success', label: 'ชำระแล้ว' },
      OVERDUE: { variant: 'danger', label: 'เกินกำหนด' },
      CANCELLED: { variant: 'default', label: 'ยกเลิก' },
    };
    const config = configs[status] || configs.DRAFT;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleApprove = (invoiceId: string) => {
    approveInvoice(invoiceId, 'staff-1');
    setShowApproveModal(false);
    setSelectedInvoice(null);
  };

  const handleReject = (invoiceId: string) => {
    rejectInvoice(invoiceId);
    setShowApproveModal(false);
    setSelectedInvoice(null);
  };

  return (
    <DashboardLayout
      title="ใบเรียกเก็บเงิน"
      subtitle="จัดการบิลและใบกำกับภาษี"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="รออนุมัติ"
          value={pendingApproval}
          subtitle="รายการ"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="อนุมัติแล้ว"
          value={approved}
          subtitle="รายการ"
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="ชำระแล้ว"
          value={paid}
          subtitle="รายการ"
          icon={FileText}
          variant="info"
        />
        <StatCard
          title="เกินกำหนด"
          value={overdue}
          subtitle="รายการ"
          icon={AlertCircle}
          variant="danger"
        />
      </div>

      {/* Filters and Actions */}
      <Card variant="bordered" className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select
                options={[
                  { value: 'all', label: 'ทุกสถานะ' },
                  { value: 'DRAFT', label: 'แบบร่าง' },
                  { value: 'PENDING_APPROVAL', label: 'รออนุมัติ' },
                  { value: 'APPROVED', label: 'อนุมัติแล้ว' },
                  { value: 'SENT', label: 'ส่งแล้ว' },
                  { value: 'PAID', label: 'ชำระแล้ว' },
                  { value: 'OVERDUE', label: 'เกินกำหนด' },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
              />
              <span className="text-sm text-gray-500">
                แสดง {filteredInvoices.length} รายการ
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="default" size="sm">
                <Download className="w-4 h-4 mr-2" />
                ส่งออก
              </Button>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                สร้างใบเรียกเก็บเงิน
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card variant="bordered">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">เลขที่</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ลูกค้า</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">บริษัทผู้ออกบิล</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่ออก</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">กำหนดชำระ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ยอดรวม</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">ใบกำกับภาษี</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.map((invoice) => {
                  const company = mockCompanies.find((c) => c.id === invoice.companyId);
                  const billingCompany = mockBillingCompanies.find((b) => b.id === invoice.billingCompanyId);
                  
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{company?.name}</p>
                        <p className="text-xs text-gray-500">{company?.businessType}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-emerald-100 rounded flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-sm text-gray-700">{billingCompany?.name.substring(0, 15)}...</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(invoice.issueDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-medium text-gray-900">{formatCurrency(invoice.totalAmount)}</span>
                        {invoice.vatAmount > 0 && (
                          <p className="text-xs text-gray-500">VAT: {formatCurrency(invoice.vatAmount)}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {invoice.includeTaxInvoice ? (
                          <div className="flex items-center justify-center gap-1 text-green-600">
                            <Check className="w-4 h-4" />
                            <Lock className="w-3 h-3" />
                          </div>
                        ) : (
                          <X className="w-4 h-4 text-gray-400 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {invoice.status === 'PENDING_APPROVAL' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setShowApproveModal(true);
                              }}
                            >
                              อนุมัติ
                            </Button>
                          )}
                          {invoice.status === 'APPROVED' && (
                            <Button variant="secondary" size="sm">
                              <Send className="w-4 h-4 mr-1" />
                              ส่ง
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Approval Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="อนุมัติใบเรียกเก็บเงิน"
        size="lg"
      >
        {selectedInvoice && (
          <div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">เลขที่บิล</p>
                  <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">ยอดรวม</p>
                  <p className="font-medium text-lg">{formatCurrency(selectedInvoice.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-500">ลูกค้า</p>
                  <p className="font-medium">
                    {mockCompanies.find((c) => c.id === selectedInvoice.companyId)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">บริษัทผู้ออกบิล</p>
                  <p className="font-medium">
                    {mockBillingCompanies.find((b) => b.id === selectedInvoice.billingCompanyId)?.name}
                  </p>
                </div>
              </div>
            </div>

            {selectedInvoice.includeTaxInvoice && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">ใบกำกับภาษีถูกล็อค</p>
                    <p className="text-sm text-yellow-700">
                      ใบกำกับภาษีนี้จะออกในนามของ &quot;{mockBillingCompanies.find((b) => b.id === selectedInvoice.billingCompanyId)?.name}&quot; 
                      และไม่สามารถเปลี่ยนบริษัทผู้ออกได้หลังจากอนุมัติ
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Approval Flow Status */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">ขั้นตอนการอนุมัติ</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600">สร้างบิล</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-yellow-600">รออนุมัติ</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Send className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-400">ส่งบิล</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-400">ชำระเงิน</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => handleReject(selectedInvoice.id)}
              >
                <X className="w-4 h-4 mr-2" />
                ปฏิเสธ
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => handleApprove(selectedInvoice.id)}
              >
                <Check className="w-4 h-4 mr-2" />
                อนุมัติบิล
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
