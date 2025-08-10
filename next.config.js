/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // Only set basePath and assetPrefix when building for GitHub Pages
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/guestme-tips' : '',
  basePath: process.env.GITHUB_PAGES === 'true' ? '/guestme-tips' : '',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
