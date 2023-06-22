/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.gravatar.com",
      "localhost",
      "ec2-13-124-203-90.ap-northeast-2.compute.amazonaws.com",
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
