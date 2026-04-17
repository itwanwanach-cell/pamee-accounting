'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useUIStore, useAuthStore } from '@/store';
import { X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const { toggleChat } = useUIStore();
  const { user } = useAuthStore();
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: user?.role === 'CLIENT' 
        ? 'สวัสดีครับ! ผมเป็นผู้ช่วย AI ของคุณ สามารถช่วยตอบคำถามเกี่ยวกับข้อมูลบัญชี รายรับรายจ่าย หรือสถานะภาษีของคุณได้ครับ มีอะไรให้ช่วยไหมครับ?'
        : 'สวัสดีครับ! ผมเป็นผู้ช่วย AI สำหรับพนักงาน สามารถช่วยตอบคำถามเกี่ยวกับขั้นตอนการทำงาน กฎระเบียบภาษี หรือวิธีใช้งานระบบได้ครับ',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = user?.role === 'CLIENT'
        ? [
            'ตรวจสอบให้แล้วครับ รายได้เดือนนี้ของคุณอยู่ที่ ฿1,200,000 และรายจ่ายอยู่ที่ ฿352,500 กำไรสุทธิประมาณ ฿847,500 ครับ',
            'สถานะภาษี VAT เดือนนี้ยังไม่ได้ยื่น กำหนดยื่นภายในวันที่ 15 ของเดือนถัดไปครับ',
            'คำถามนี้เกี่ยวข้องกับกลยุทธ์ทางภาษี ขอส่งต่อให้พนักงานผู้เชี่ยวชาญตอบนะครับ',
          ]
        : [
            'สำหรับการยื่น ภ.พ.30 ขั้นตอนคือ: 1) รวบรวมใบกำกับภาษี 2) คำนวณภาษีซื้อ-ขาย 3) กรอกแบบฟอร์ม 4) ยื่นผ่าน rd.go.th ครับ',
            'เกณฑ์รายได้ที่ต้องจดทะเบียน VAT คือ 1.8 ล้านบาทต่อปีครับ',
            'ขอแนะนำให้ติดต่อหัวหน้าทีมสำหรับคำถามเกี่ยวกับกฎหมายภาษีที่ซับซ้อนครับ',
          ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date(),
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
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300',
        isMinimized ? 'w-72 h-14' : 'w-96 h-[500px]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-emerald-600 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-white" />
          <span className="font-medium text-white">
            {user?.role === 'CLIENT' ? 'ผู้ช่วยลูกค้า' : 'ผู้ช่วยพนักงาน'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded hover:bg-emerald-700 transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white" />
            )}
          </button>
          <button
            onClick={toggleChat}
            className="p-1 rounded hover:bg-emerald-700 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 h-[380px] space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-emerald-600" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] px-4 py-2 rounded-2xl text-sm',
                    message.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="พิมพ์ข้อความ..."
                className="flex-1 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleSend}
                className="rounded-full px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { ChatWidget };
