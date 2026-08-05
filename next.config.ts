import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly pin the workspace root so Next.js Turbopack does not mis-detect
  // the stray lockfile in the user's home directory (C:\Users\samib).
  turbopack: {
    root: __dirname,
  },
  images: {
    qualities: [75, 90, 95],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
