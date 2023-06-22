/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.gravatar.com", "localhost"],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
