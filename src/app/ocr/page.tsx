'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Select, Input, Modal } from '@/components/ui';
import { useCompanyStore } from '@/store';
import { mockBankAccounts, mockCompanies } from '@/lib/mock-data';
import { formatCurrency, TRANSACTION_CATEGORIES } from '@/lib/utils';
import {
  Upload,
  FileText,
  Camera,
  Sparkles,
  Check,
  AlertCircle,
  Eye,
  Edit,
  Clock,
} from 'lucide-react';

interface UploadedBill {
  id: string;
  fileName: string;
  uploadedBy: 'staff' | 'client';
  uploadedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'needs_review';
  ocrResult?: {
    vendorName?: string;
    vendorTaxId?: string;
    date?: string;
    totalAmount?: number;
    vatAmount?: number;
    confidence: number;
    suggestedCategory?: string;
  };
}

const mockUploadedBills: UploadedBill[] = [
  {
    id: '1',
    fileName: 'receipt_march_001.jpg',
    uploadedBy: 'staff',
    uploadedAt: new Date('2024-03-20T10:30:00'),
    status: 'completed',
    ocrResult: {
      vendorName: 'บจก. ซัพพลายเออร์ ABC',
      vendorTaxId: '0-1234-56789-01-2',
      date: '2024-03-15',
      totalAmount: 8500,
      vatAmount: 595,
      confidence: 94,
      suggestedCategory: 'ค่าวัตถุดิบ',
    },
  },
  {
    id: '2',
    fileName: 'bill_unclear_001.jpg',
    uploadedBy: 'client',
    uploadedAt: new Date('2024-03-20T08:15:00'),
    status: 'needs_review',
    ocrResult: {
      vendorName: 'ร้านค้า...',
      totalAmount: 1500,
      confidence: 45,
    },
  },
  {
    id: '3',
    fileName: 'expense_march_15.pdf',
    uploadedBy: 'client',
    uploadedAt: new Date('2024-03-19T15:45:00'),
    status: 'pending',
  },
];

export default function OCRPage() {
  const { selectedCompany } = useCompanyStore();
  const [selectedBill, setSelectedBill] = React.useState<UploadedBill | null>(null);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    documentType: 'RECEIPT',
    transactionType: 'EXPENSE',
    vendorName: '',
    vendorTaxId: '',
    vendorAddress: '',
    buyerCompanyId: 'company-1',
    bankAccountId: '',
    category: '',
    transactionDate: new Date().toISOString().split('T')[0],
    amount: '',
    vatAmount: '',
    description: '',
  });

  // When selecting a bill with OCR result, populate form
  React.useEffect(() => {
    if (selectedBill?.ocrResult) {
      setFormData((prev) => ({
        ...prev,
        vendorName: selectedBill.ocrResult?.vendorName || '',
        vendorTaxId: selectedBill.ocrResult?.vendorTaxId || '',
        transactionDate: selectedBill.ocrResult?.date || prev.transactionDate,
        amount: selectedBill.ocrResult?.totalAmount?.toString() || '',
        vatAmount: selectedBill.ocrResult?.vatAmount?.toString() || '',
        category: selectedBill.ocrResult?.suggestedCategory || '',
      }));
      setShowCreateForm(true);
    }
  }, [selectedBill]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file upload
  };

  const getStatusBadge = (status: UploadedBill['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">OCR สำเร็จ</Badge>;
      case 'processing':
        return <Badge variant="info">กำลังประมวลผล</Badge>;
      case 'needs_review':
        return <Badge variant="warning">ข้อมูลไม่ชัด</Badge>;
      default:
        return <Badge variant="default">รอดำเนินการ</Badge>;
    }
  };

  const clientUploads = mockUploadedBills.filter((b) => b.uploadedBy === 'client');

  return (
    <DashboardLayout
      title="อัปโหลดบิล (OCR)"
      subtitle="อ่านบิลอัตโนมัติ และสร้างเอกสารใหม่"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Upload and Bill List */}
        <div className="space-y-6">
          {/* Upload Area */}
          <Card variant="bordered">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>อัปโหลดบิล</CardTitle>
              <div className="flex gap-2">
                <Badge variant="info" size="sm">จากพนักงาน</Badge>
                <Badge variant="success" size="sm">จากลูกค้า</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">ลากไฟล์มาวาง หรือคลิกเพื่ออัปโหลด</p>
                <p className="text-sm text-gray-400">JPG, PNG, PDF (สูงสุด 10MB)</p>
                <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" />
                <Button variant="primary" className="mt-4">
                  <Camera className="w-4 h-4 mr-2" />
                  เลือกไฟล์
                </Button>
              </div>

              {clientUploads.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    รอตรวจสอบจากลูกค้า: {clientUploads.length} รายการ
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* OCR Result */}
          {selectedBill?.ocrResult && (
            <Card variant="bordered">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedBill.status)}
                  <span className="text-sm text-gray-500">{selectedBill.fileName}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-500 mb-3">ข้อมูลที่อ่านได้:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">ร้านค้า:</span>
                    <span>{selectedBill.ocrResult.vendorName}</span>
                    {selectedBill.ocrResult.date && (
                      <>
                        <span className="text-gray-500">วันที่:</span>
                        <span>{selectedBill.ocrResult.date}</span>
                      </>
                    )}
                    <span className="text-gray-500">ยอดรวม:</span>
                    <span className="font-medium">{formatCurrency(selectedBill.ocrResult.totalAmount || 0)}</span>
                    {selectedBill.ocrResult.vatAmount && (
                      <>
                        <span className="text-gray-500">VAT:</span>
                        <span>{formatCurrency(selectedBill.ocrResult.vatAmount)}</span>
                      </>
                    )}
                  </div>
                </div>

                {selectedBill.ocrResult.suggestedCategory && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">AI แนะนำ</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      ประเภท: <span className="text-blue-600 font-medium">{selectedBill.ocrResult.suggestedCategory}</span>
                      {' '}(ความมั่นใจ {selectedBill.ocrResult.confidence}%)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pending Bills from Client */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>รายการรอตรวจสอบจากลูกค้า</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {mockUploadedBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedBill(bill)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{bill.fileName}</p>
                        <p className="text-xs text-gray-500">
                          อัปโหลดโดย: {bill.uploadedBy === 'client' ? 'ลูกค้า' : 'พนักงาน'} - {new Date(bill.uploadedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(bill.status)}
                      <Button variant="ghost" size="sm">
                        {bill.status === 'completed' ? 'ดำเนินการ' : 'ตรวจสอบ'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Create/Edit Form */}
        <div>
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>สร้างบิลใหม่ / แก้ไขข้อมูล</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Document Type & Transaction Type */}
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="ประเภทเอกสาร"
                    options={[
                      { value: 'CASH_BILL', label: 'บิลเงินสด' },
                      { value: 'RECEIPT', label: 'ใบเสร็จรับเงิน' },
                      { value: 'TAX_INVOICE', label: 'ใบกำกับภาษี' },
                    ]}
                    value={formData.documentType}
                    onChange={(v) => setFormData({ ...formData, documentType: v })}
                  />
                  <Select
                    label="ประเภทรายการ"
                    options={[
                      { value: 'INCOME', label: 'รายรับ' },
                      { value: 'EXPENSE', label: 'รายจ่าย' },
                    ]}
                    value={formData.transactionType}
                    onChange={(v) => setFormData({ ...formData, transactionType: v })}
                  />
                </div>

                {/* Vendor Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-600 mb-3">ผู้ขาย (Vendor)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="ชื่อบริษัท/ร้านค้า"
                      value={formData.vendorName}
                      onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    />
                    <Input
                      label="เลขประจำตัวผู้เสียภาษี"
                      value={formData.vendorTaxId}
                      onChange={(e) => setFormData({ ...formData, vendorTaxId: e.target.value })}
                    />
                  </div>
                  <Input
                    label="ที่อยู่"
                    className="mt-4"
                    value={formData.vendorAddress}
                    onChange={(e) => setFormData({ ...formData, vendorAddress: e.target.value })}
                  />
                </div>

                {/* Buyer Info */}
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-600 mb-3">ผู้ซื้อ (บริษัทลูกค้า)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="ชื่อบริษัท"
                      options={mockCompanies.map((c) => ({
                        value: c.id,
                        label: c.name,
                      }))}
                      value={formData.buyerCompanyId}
                      onChange={(v) => setFormData({ ...formData, buyerCompanyId: v })}
                    />
                    <Input
                      label="เลขประจำตัวผู้เสียภาษี"
                      value={mockCompanies.find((c) => c.id === formData.buyerCompanyId)?.taxId || ''}
                      disabled
                    />
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="วันที่ทำรายการ"
                    type="date"
                    value={formData.transactionDate}
                    onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                  />
                  <Select
                    label="บัญชีธนาคารที่ทำรายการ"
                    options={mockBankAccounts.map((acc) => ({
                      value: acc.id,
                      label: `${acc.bankName} ${acc.accountNumber}`,
                    }))}
                    value={formData.bankAccountId}
                    onChange={(v) => setFormData({ ...formData, bankAccountId: v })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="หมวดหมู่"
                    options={TRANSACTION_CATEGORIES[formData.transactionType as 'INCOME' | 'EXPENSE'] || []}
                    value={formData.category}
                    onChange={(v) => setFormData({ ...formData, category: v })}
                  />
                  <Input
                    label="ยอดรวม (บาท)"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>

                <Input
                  label="รายละเอียด/หมายเหตุ"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="รายละเอียดเพิ่มเติม..."
                />

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button variant="default" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    ดูตัวอย่างบิล
                  </Button>
                  <Button variant="primary" className="flex-1">
                    <Check className="w-4 h-4 mr-2" />
                    บันทึกรายการ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
