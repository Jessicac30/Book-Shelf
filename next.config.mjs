/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'books.google.com',
      },
      {
        protocol: 'http',
        hostname: 'books.google.com',
      },
    ],
  },
  // Otimizações para Vercel
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/adapter-libsql'],
  },
}

export default nextConfig
