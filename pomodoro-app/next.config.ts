import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // next-pwa is incompatible with Turbopack; PWA features disabled in this build
}

export default nextConfig
