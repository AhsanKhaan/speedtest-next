import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
    runtime: 'edge', // enable edge runtime experimental features where available
  },
  reactStrictMode: true,
};

export default nextConfig;
