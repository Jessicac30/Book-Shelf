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
  // Garantir que o Prisma seja incluído no build
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client', '@prisma/adapter-libsql', '@libsql/client')
    }
    return config
  },
}

export default nextConfig
