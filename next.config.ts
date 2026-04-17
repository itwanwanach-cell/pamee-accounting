import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ปิด TypeScript errors ตอน build (สำหรับ prototype)
  typescript: {
    ignoreBuildErrors: true,
  },
  // ปิด ESLint errors ตอน build (สำหรับ prototype)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
