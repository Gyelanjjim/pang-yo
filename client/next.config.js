/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.gravatar.com",
      "localhost",
      "ec2-52-78-56-64.ap-northeast-2.compute.amazonaws.com",
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
