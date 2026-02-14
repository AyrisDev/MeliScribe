import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/aida-public/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/event",
        destination: "https://analytics.ayris.tech/api/event",
      },
    ];
  },
};

export default nextConfig;
