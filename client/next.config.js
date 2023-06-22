/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.gravatar.com",
      "localhost",
      "ec2-3-35-3-52.ap-northeast-2.compute.amazonaws.com",
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
