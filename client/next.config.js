/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.gravatar.com",
      "localhost",
      "ec2-15-164-212-140.ap-northeast-2.compute.amazonaws.com",
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
