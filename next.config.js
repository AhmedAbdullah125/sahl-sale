// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sahlsale.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.sahlsale.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
