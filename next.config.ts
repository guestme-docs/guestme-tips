import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/guestme-tips',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: '/guestme-tips/'
}

export default nextConfig

