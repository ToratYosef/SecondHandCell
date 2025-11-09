/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  },
  redirects: async () => [
    {
      source: '/login.html',
      destination: '/login',
      permanent: false
    }
  ]
};

export default nextConfig;
