'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { useAuthStore } from '@/store';
import {
  Bot,
  User,
  Send,
  Sparkles,
  HelpCircle,
  FileText,
  Calculator,
  Building2,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const quickQuestions = [
  { icon: Calculator, text: 'คำนวณภาษี VAT เดือนนี้', category: 'tax' },
  { icon: FileText, text: 'สรุปรายรับ-รายจ่ายเดือนนี้', category: 'finance' },
  { icon: Building2, text: 'สถานะลูกค้าที่ดูแล', category: 'client' },
  { icon: HelpCircle, text: 'วิธียื่น ภ.พ.30', category: 'help' },
];

export default function ChatPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'สวัสดีครับ! ผม AcctBot ผู้ช่วย AI ของคุณ พร้อมช่วยตอบคำถามเกี่ยวกับงานบัญชี ภาษี และการใช้งานระบบครับ มีอะไรให้ช่วยไหมครับ?',
      timestamp: new Date(),
      suggestions: ['สรุปงานวันนี้', 'ตรวจสอบสถานะภาษี', 'คำนวณ VAT'],
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): { content: string; suggestions?: string[] } => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('vat') || msg.includes('ภาษีมูลค่าเพิ่ม') || msg.includes('ภ.พ.30')) {
      return {
        content: `สำหรับการยื่น ภ.พ.30 (VAT) มีขั้นตอนดังนี้ครับ:\n\n1. รวบรวมใบกำกับภาษีซื้อและขายทั้งหมดในเดือน\n2. คำนวณภาษีขาย - ภาษีซื้อ\n3. หากภาษีขาย > ภาษีซื้อ → ต้องชำระส่วนต่าง\n4. หากภาษีซื้อ > ภาษีขาย → ขอคืนหรือยกไปเดือนถัดไป\n5. ยื่นแบบผ่าน rd.go.th ภายในวันที่ 15 ของเดือนถัดไป\n\nจากข้อมูลลูกค้าที่คุณดูแล เดือนนี้มีภาษีขาย ฿84,000 และภาษีซื้อ ฿42,000 ต้องชำระ ฿42,000 ครับ`,
        suggestions: ['ดูรายละเอียดใบกำกับภาษี', 'สร้างรายงาน VAT', 'กำหนดยื่นเดือนนี้'],
      };
    }
    
    if (msg.includes('รายรับ') || msg.includes('รายจ่าย') || msg.includes('สรุป')) {
      return {
        content: `สรุปรายรับ-รายจ่าย เดือนมีนาคม 2567:\n\n📈 รายรับรวม: ฿1,200,000\n   - จากการขาย: ฿1,050,000\n   - จากการบริการ: ฿150,000\n\n📉 รายจ่ายรวม: ฿352,500\n   - ค่าวัตถุดิบ: ฿150,000\n   - เงินเดือน: ฿120,000\n   - สาธารณูปโภค: ฿45,000\n   - อื่นๆ: ฿37,500\n\n💰 กำไรสุทธิ: ฿847,500 (อัตรากำไร 70.6%)`,
        suggestions: ['ดูรายงานเต็ม', 'เปรียบเทียบกับเดือนก่อน', 'ส่งออก PDF'],
      };
    }
    
    if (msg.includes('ลูกค้า') || msg.includes('บริษัท')) {
      return {
        content: `สถานะลูกค้าที่คุณดูแล:\n\n👥 ทั้งหมด 15 บริษัท\n✅ Active: 15 บริษัท\n\n📋 งานที่ต้องทำวันนี้:\n• ยื่นภาษี ภ.พ.30 - บจก. ABC Trading (ด่วน)\n• ปิดงบ Q1 - บจก. XYZ Corporation\n• ตรวจสอบบิล 3 ราย\n\n⚠️ แจ้งเตือน:\n• บจก. ABC Trading - รายการธนาคารเกิน 400 รายการ\n• หจก. DEF Service - รายได้ใกล้เกณฑ์ VAT`,
        suggestions: ['ดูรายชื่อลูกค้า', 'งานค้างทำ', 'แจ้งเตือนทั้งหมด'],
      };
    }
    
    if (msg.includes('งาน') || msg.includes('task') || msg.includes('วันนี้')) {
      return {
        content: `งานของคุณวันนี้:\n\n🔴 เร่งด่วน (1):\n• ยื่นภาษี ภ.พ.30 บจก. ABC Trading - กำหนด 14:00\n\n🟡 สำคัญ (2):\n• ปิดงบ บจก. XYZ Corporation - กำหนดพรุ่งนี้\n• ติดตามบิลค้าง หจก. DEF Service\n\n🟢 ปกติ (1):\n• ตรวจสอบเอกสาร 3 ราย\n\n✅ เสร็จแล้ววันนี้ (1):\n• บันทึกรายรับ บจก. ABC Trading`,
        suggestions: ['เริ่มงานแรก', 'ดูงานทั้งหมด', 'เลื่อนงาน'],
      };
    }

    return {
      content: 'ขอบคุณสำหรับคำถามครับ ผมพร้อมช่วยเหลือเรื่องงานบัญชี ภาษี และการใช้งานระบบ คุณสามารถถามเกี่ยวกับ:\n\n• การคำนวณและยื่นภาษี\n• สรุปรายรับ-รายจ่าย\n• สถานะลูกค้าและงานที่ต้องทำ\n• วิธีใช้งานฟีเจอร์ต่างๆ ในระบบ\n\nมีอะไรให้ช่วยเพิ่มเติมไหมครับ?',
      suggestions: ['คำนวณ VAT', 'สรุปการเงิน', 'ดูงานวันนี้'],
    };
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardLayout
      title="AI Assistant"
      subtitle="ผู้ช่วยอัจฉริยะสำหรับงานบัญชี"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card variant="bordered" className="h-full flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>AcctBot</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-500">Online</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-emerald-600" />
                    </div>
                  )}
                  <div className={`max-w-[70%] ${message.role === 'user' ? 'order-1' : ''}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }`}
                    >
                      <p className="whitespace-pre-line text-sm">{message.content}</p>
                    </div>
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSend(suggestion)}
                            className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="พิมพ์ข้อความ..."
                  className="flex-1 px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <Button variant="primary" onClick={() => handleSend()} className="px-6">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Questions */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-base">คำถามด่วน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(q.text)}
                  className="w-full flex items-center gap-3 p-3 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <q.icon className="w-4 h-4 text-emerald-600" />
                  <span>{q.text}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <CardTitle className="text-base">ความสามารถ AI</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  ตอบคำถามเกี่ยวกับภาษี
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  สรุปข้อมูลทางการเงิน
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  แนะนำขั้นตอนการทำงาน
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  ช่วยค้นหาข้อมูลลูกค้า
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  เร็วๆ นี้: วิเคราะห์เอกสาร
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
