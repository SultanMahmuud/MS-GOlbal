/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow all hostnames
      },
    ],
  },
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"]
};

export default nextConfig;
