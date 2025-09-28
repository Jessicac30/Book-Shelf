/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    position: 'bottom-right',
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig