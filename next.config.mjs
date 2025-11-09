/** @type {import('next').NextConfig} */
const nextConfig = {
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
