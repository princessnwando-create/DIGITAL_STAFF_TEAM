/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  skipTrailingSlashRedirect: true,
  // Cloudflare Pages compatibility
  serverExternalPackages: ['sharp', 'pino', 'prisma'],
}

module.exports = nextConfig
