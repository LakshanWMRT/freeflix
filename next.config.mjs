/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jellyfin.randikalakshan.site',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;