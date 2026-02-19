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
      //https://new.sahlsale.work
      {
        protocol: "https",
        hostname: "new.sahlsale.work",
        pathname: "/**",
      }
    ],
  },
};

module.exports = nextConfig;
