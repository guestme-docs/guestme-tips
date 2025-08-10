/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // GitHub Pages configuration
  assetPrefix: '/guestme-tips',
  basePath: '/guestme-tips',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
