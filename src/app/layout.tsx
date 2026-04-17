import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AcctPro - ระบบบริหารสำนักงานบัญชี",
  description: "ระบบบริหารสำนักงานบัญชีครบวงจร จัดการลูกค้า รายรับรายจ่าย ภาษี และรายงานการเงิน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full">
      <body className="min-h-full bg-gray-50">{children}</body>
    </html>
  );
}
