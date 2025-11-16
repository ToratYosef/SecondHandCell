/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration for next/image component
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        // Allow images from the specific repository structure
        pathname: '/ToratYosef/BuyBacking/refs/heads/main/**',
      },
    ],
  },
  
  // Custom headers can be useful, though not strictly required for a base setup
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
};

module.exports = nextConfig;